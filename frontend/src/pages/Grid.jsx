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
import bombBonusImg from "../assets/bomb.webp";
import penBonusImg from "../assets/big-pen.webp";

export default function Grid() {
  const { storedUser } = useStoredUser();
  const [gridData, setGridData] = useState(null);
  const [gridName, setGridName] = useState("");
  const [grid, setGrid] = useState([]);
  const { id } = useParams();
  const canvasRef = useRef(null);
  /* CHRONO STATE */
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  /* DESSIN STATE */
  const [pen, setPen] = useState(false);
  const [eraser, setEraser] = useState(false);
  const [color, setColor] = useColor("#ffffff");
  const [lastPixelTime, setLastPixelTime] = useState(Date.now());
  /* BONUS STATE */
  const [userPixelCount, setUserPixelCount] = useState(0);
  const [bombBonus, setBombBonus] = useState([{}, {}, {}]);
  const [useBombBonus, setUseBombBonus] = useState(false);

  const [penBonus, setPenBonus] = useState([{}, {}, {}, {}, {}]);
  const [usePenBonus, setUsePenBonus] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/grids/${id}`
        );
        setGridData(response.data);
        setGridName(response.data.name);
        setStartTime(new Date(response.data.created_at));

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
  /* CHRONO */
  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        setElapsedTime(new Date() - startTime);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [startTime]);

  function formatTime(timeInMilliseconds) {
    const seconds = Math.floor(timeInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const formattedSeconds = `0${seconds % 60}`.slice(-2);
    const formattedMinutes = `0${minutes % 60}`.slice(-2);
    const formattedHours = `0${hours}`.slice(-2);

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  /* CANVA */
  const pixelSize = 11; // Taille de chaque "pixel" du damier
  const nbPixels = 40;
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");

      // Dessiner un damier
      const numX = nbPixels; // Nombre de "pixels" en largeur
      const numY = nbPixels; // Nombre de "pixels" en hauteur

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
  const applyBomb = () => {
    setUseBombBonus(true);
  };
  const handleAddPixel = async (x, y) => {
    const now = Date.now();
    if (now - lastPixelTime < 5000) {
      // Moins de 5 secondes se sont écoulées depuis le dernier pixel placé
      return;
    }

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
      setUserPixelCount((prevCount) => {
        const newCount = prevCount + 1;
        if (newCount === 70) {
          setBombBonus((prevBonuses) => [...prevBonuses, {}]);
          return 0;
        } else {
          return newCount;
        }
      });

      setGrid((prevGrid) => [
        ...prevGrid,
        {
          id: response.data.insertId,
          color: color.hex,
          x_coordinate: Math.floor(x / pixelSize),
          y_coordinate: Math.floor(y / pixelSize),
        },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleErasePixel = async (x, y) => {
    try {
      const pixelX = Math.floor(x / pixelSize);
      const pixelY = Math.floor(y / pixelSize);

      /* Vérifier si un pixel existe à ces coordonnées dans la grille */
      const selectedPixel = grid.find(
        (pixel) =>
          pixel.x_coordinate === pixelX && pixel.y_coordinate === pixelY
      );
      console.log(selectedPixel);
      console.log(selectedPixel.id);
      if (selectedPixel && selectedPixel.id !== undefined) {
        /* on supprime le pixel de la grid front  */
        setGrid((prevGrid) =>
          prevGrid.filter((pixel) => pixel.id !== selectedPixel.id)
        );

        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/grids/${id}/pixels/${
            selectedPixel.id
          }`,
          { withCredentials: true }
        );
        const pixelResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/grids/${id}/pixels`
        );
        setGrid(pixelResponse.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (pen) {
      handleAddPixel(x, y);
    } else if (eraser) {
      handleErasePixel(x, y);
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
          <div className="chrono-container">
            <p>{formatTime(elapsedTime)}</p>
          </div>
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
          <div className="game-wrapper">
            <div className="canva-container">
              <canvas
                ref={canvasRef}
                width={nbPixels * pixelSize}
                height={nbPixels * pixelSize}
                className="canva"
                onClick={handleCanvasClick}
              />
            </div>
            <div className="bonus">
              <div className="bombs-container">
                {bombBonus.length > 0 &&
                  bombBonus.map((bonus, index) => (
                    <Button
                      key={index}
                      className="bomb-bonus"
                      type="button"
                      onClick={applyBomb}
                    >
                      <img src={bombBonusImg} alt="" width={30} height={30} />
                      <p>1</p>
                    </Button>
                  ))}
              </div>
              <div className="pens-container">
                <Button className="pen-bonus">
                  <img src={penBonusImg} alt="" width={30} height={30} />
                  <p>5</p>
                </Button>
              </div>
            </div>
          </div>
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
