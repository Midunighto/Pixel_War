import axios from "axios";
import { useParams } from "react-router-dom";
import { React, useState, useEffect, useRef } from "react";
import { useStoredUser } from "../contexts/UserContext";

import Button from "../components/Button";
import Canvas from "../components/Canvas";
import ColorSlider from "../components/ColorSlider";
import Tools from "../components/Tools";

import { useColor } from "react-color-palette";
import "react-color-palette/css";

import "../styles/grids.scss";

import bombBonusImg from "../assets/bomb.webp";
import penBonusImg from "../assets/big-pen.webp";
import PixelInfo from "../components/PixelInfo";

export default function Grid() {
  const { storedUser } = useStoredUser();
  const [gridData, setGridData] = useState(null);
  const [gridName, setGridName] = useState("");
  const [grid, setGrid] = useState([]);
  const [pixelInfos, setPixelInfos] = useState({
    pseudo: null,
    createdAt: null,
  });
  const [showPixelInfos, setShowPixelInfos] = useState(false);

  const { id } = useParams();
  const canvasRef = useRef(null);
  /* state pour récupérer les coordonnées du click */
  const [clickX, setClickX] = useState(0);
  const [clickY, setClickY] = useState(0);
  /* CHRONO STATE */
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  /* DESSIN STATE */
  const [pen, setPen] = useState(false);
  const [eraser, setEraser] = useState(false);
  const [color, setColor] = useColor("#ffffff");
  const [lastPixelTime, setLastPixelTime] = useState(Date.now());
  /* BONUS  */
  const [userPixelCount, setUserPixelCount] = useState(0);
  const [bombBonus, setBombBonus] = useState([{}, {}, {}]);
  const [activeBomb, setActiveBomb] = useState(
    Array.from({ length: bombBonus.length }, () => false)
  );

  const [penBonus, setPenBonus] = useState([{}, {}, {}, {}, {}]);
  const [activePenBonus, setActivePenBonus] = useState(
    Array.from({ length: penBonus.length }, () => false)
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/grids/${id}`
        );
        setGridData(response.data);
        setGridName(response.data.name);
        setStartTime(new Date(response.data.creation_time));

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
  const handleBombBonusClick = (index) => {
    const newActiveBomb = Array.from({ length: bombBonus.length }, () => false);
    newActiveBomb[index] = true;
    setActiveBomb(newActiveBomb);
  };
  const handlePenBonusClick = (index) => {
    const newActivePenBonus = Array.from(
      { length: penBonus.length },
      () => false
    );
    newActivePenBonus[index] = true;
    setActivePenBonus(newActivePenBonus);
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
        user_pseudo: storedUser.pseudo,
        grid_id: id,
        color: color.hex,
        x_coordinate: x,
        y_coordinate: y,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/grids/${id}/pixels`,
        pixelData,
        { withCredentials: true }
      );
      setLastPixelTime(now);
      setUserPixelCount((prevCount) => {
        const newCount = prevCount + 1;
        if (newCount === 20) {
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
          user_pseudo: pixelData.user_pseudo,
          created_at: new Date().toISOString(),
          x_coordinate: x,
          y_coordinate: y,
        },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleErasePixel = async (x, y) => {
    try {
      const pixelX = x;
      const pixelY = y;

      /* Vérifier si un pixel existe à ces coordonnées dans la grille */
      const selectedPixel = grid.find(
        (pixel) =>
          pixel.x_coordinate === pixelX && pixel.y_coordinate === pixelY
      );
      console.log("pixel", selectedPixel);
      if (
        selectedPixel &&
        selectedPixel.id !== undefined &&
        storedUser.pseudo === selectedPixel.user_pseudo
      ) {
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
    const x = Math.floor((event.clientX - rect.left) / pixelSize);
    const y = Math.floor((event.clientY - rect.top) / pixelSize);
    setClickX(x);
    setClickY(y);

    if (pen) {
      handleAddPixel(x, y);
    } else if (eraser) {
      handleErasePixel(x, y);
    } else {
      const pixel = grid.find(
        (p) => p.x_coordinate === x && p.y_coordinate === y
      );
      if (pixel) {
        if (
          pixelInfos.pseudo === pixel.user_pseudo &&
          pixelInfos.createdAt === pixel.created_at
        ) {
          setPixelInfos({ pseudo: null, createdAt: null });
          setShowPixelInfos(false);
        } else {
          setPixelInfos({
            pseudo: pixel.user_pseudo,
            createdAt: pixel.created_at,
          });
          setShowPixelInfos(true);
        }
      }
    }
  };

  const handlePen = () => {
    setPen(!pen);
    setEraser(false);
  };

  const handleEraser = () => {
    setEraser(!eraser);
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
              <Canvas
                canvasRef={canvasRef}
                nbPixels={nbPixels}
                pixelSize={pixelSize}
                handleCanvasClick={handleCanvasClick}
              />
              {showPixelInfos && (
                <PixelInfo
                  pixelInfos={pixelInfos}
                  clickX={clickX}
                  clickY={clickY}
                  pixelSize={pixelSize}
                />
              )}
            </div>
            <div className="bonus">
              <div className="bombs-container">
                {bombBonus.map((bonus, index) => (
                  <Button
                    key={index}
                    className={`bomb-bonus ${
                      activeBomb[index] ? "active" : ""
                    }`}
                    type="button"
                    onClick={() => handleBombBonusClick(index)}
                  >
                    <img
                      src={bombBonusImg}
                      alt="bombe"
                      width={30}
                      height={30}
                    />
                    <p>1</p>
                  </Button>
                ))}
              </div>
              <div className="pens-container">
                {penBonus.map((bonus, index) => (
                  <Button
                    key={index}
                    className={`pen-bonus ${
                      activePenBonus[index] ? "active" : ""
                    }`}
                    type="button"
                    onClick={() => handlePenBonusClick(index)}
                  >
                    <img
                      src={penBonusImg}
                      alt="rouleau de peinture"
                      width={30}
                      height={30}
                    />
                    <p>5</p>
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="paint">
            <Tools
              pen={pen}
              eraser={eraser}
              handlePen={handlePen}
              handleEraser={handleEraser}
            />
            <ColorSlider color={color} handleColorChange={handleColorChange} />
          </div>
        </div>
      </section>
    </div>
  );
}
