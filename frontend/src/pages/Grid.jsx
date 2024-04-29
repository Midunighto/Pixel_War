import axios from "axios";
import { useParams } from "react-router-dom";
import { React, useState, useEffect, useRef } from "react";
import { useStoredUser } from "../contexts/UserContext";

import Button from "../components/Button";
import { ColorPicker, Hue, Saturation, useColor } from "react-color-palette";
import "react-color-palette/css";

import "../styles/grids.scss";

import penImg from "../assets/paint.webp";
import eraserImg from "../assets/eraser.webp";

export default function Grid() {
  const { storedUser } = useStoredUser();
  const [gridData, setGridData] = useState(null);
  const [gridName, setGridName] = useState("");
  const [grid, setGrid] = useState([]);
  const { id } = useParams();
  const canvasRef = useRef(null);

  /* DESSIN STATE */
  const [pen, setPen] = useState(false);
  const [eraser, setEraser] = useState(false);
  const [color, setColor] = useColor("#ffffff");
  const [lastPixelTime, setLastPixelTime] = useState(Date.now());

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/grids/${id}`
        );
        setGridData(response.data);
        setGridName(response.data.name);

        const pixelResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/grids/${id}/pixels`
        );
        setGrid(pixelResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, [id]);

  const pixelSize = 11; // Taille de chaque "pixel" du damier
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");

      // Dessiner un damier
      const numX = 40; // Nombre de "pixels" en largeur
      const numY = 40; // Nombre de "pixels" en hauteur

      for (let i = 0; i < numX; i++) {
        for (let j = 0; j < numY; j++) {
          ctx.fillStyle = (i + j) % 2 === 0 ? "#ffffff" : "#d3d3d3";
          ctx.fillRect(i * pixelSize, j * pixelSize, pixelSize, pixelSize);
        }
      }

      // Dessiner les pixels
      if (grid.length > 0) {
        grid.forEach((pixel) => {
          ctx.fillStyle = pixel.color;
          ctx.fillRect(
            pixel.x_coordinate * pixelSize,
            pixel.y_coordinate * pixelSize,
            pixelSize,
            pixelSize
          );
        });
      }
    }
  }, [grid]);

  /* GESTION DES GRILLES */
  const handleName = (event) => {
    setGridName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/grids/${id}`,
        { name: gridName },
        { withCredentials: true }
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* INTÉRACTIVITÉ JEU */
  const handleCanvasClick = async (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const scale = 0.8; // 0.8 car transform: scale(8) en css
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (pen) {
      const now = Date.now();
      if (now - lastPixelTime < 5000) {
        // Moins de 5 secondes se sont écoulées depuis le dernier pixel placé
        return;
      }
      ctx.fillStyle = color.hex;
      ctx.fillRect(
        Math.floor(x / pixelSize) * pixelSize,
        Math.floor(y / pixelSize) * pixelSize,
        pixelSize,
        pixelSize
      );

      try {
        const pixelData = {
          user_id: storedUser.id,
          grid_id: id,
          color: color.hex,
          x_coordinate: Math.floor(x / pixelSize),
          y_coordinate: Math.floor(y / pixelSize),
        };

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/grids/${id}/pixels`,
          pixelData,
          { withCredentials: true }
        );
        setLastPixelTime(now);
      } catch (err) {
        console.error(err);
      }
    } else if (eraser) {
      try {
        const pixelX = Math.floor(x / pixelSize);
        const pixelY = Math.floor(y / pixelSize);

        /* Vérifier si un pixel existe à ces coordonnées dans la grille */
        const selectedPixel = grid.find(
          (pixel) =>
            pixel.x_coordinate === pixelX && pixel.y_coordinate === pixelY
        );

        if (selectedPixel) {
          await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/api/grids/${id}/pixels/${
              selectedPixel.id
            }`,
            { withCredentials: true }
          );
          /* on supprime le pixel de la grid front aussi */
          setGrid((prevGrid) =>
            prevGrid.filter(
              (pixel) =>
                pixel.x_coordinate !== pixelX || pixel.y_coordinate !== pixelY
            )
          );
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePen = () => {
    setPen(true);
    setEraser(false);
  };

  const handleEraser = () => {
    setEraser(true);
    setPen(false);
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
  };

  return (
    <div className="page area-page">
      <section className="grid-container">
        <div className="header">
          <form onSubmit={handleSubmit}>
            <h1>
              <input type="text" placeholder={gridName} onChange={handleName} />
            </h1>
            <Button className="blob-btn-light" type="submit">
              OK
            </Button>
          </form>
        </div>
        <div className="grid-area-container">
          <canvas
            ref={canvasRef}
            width={40 * pixelSize}
            height={40 * pixelSize}
            className="canva"
            onClick={handleCanvasClick}
          />
          <div className="paint">
            <div className="tools">
              <Button
                type="button"
                className={`tool ${pen ? "active" : ""}`}
                onClick={handlePen}
              >
                <img src={penImg} alt="pinceau" />
              </Button>
              <Button
                type="button"
                className={`tool ${eraser ? "active" : ""}`}
                onClick={handleEraser}
              >
                <img src={eraserImg} alt="gomme" />
              </Button>
            </div>
            <div className="custom-layout">
              <Saturation
                height={50}
                color={color}
                onChange={handleColorChange}
              />
              <Hue color={color} onChange={handleColorChange} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
