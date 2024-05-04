import axios from "axios";
import io from "socket.io-client";

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
import infoW from "../assets/info-white.svg";
import infoB from "../assets/info-black.svg";
import PixelInfo from "../components/PixelInfo";
import { success } from "../services/toast";
/* import { UWebSocket } from "../utils/Uwebsocket"; */

export default function Grid() {
  const { storedUser } = useStoredUser();
  const [gridData, setGridData] = useState(null);
  const [gridName, setGridName] = useState("");
  const [stop, setStop] = useState(false);
  const [grid, setGrid] = useState([]);
  const [pixelInfos, setPixelInfos] = useState({
    pseudo: null,
    createdAt: null,
  });
  const [showPixelInfos, setShowPixelInfos] = useState(false);
  /* infos bonus */
  const [isHovered, setIsHovered] = useState(false);

  /* web socket */
  const [message, setMessage] = useState("");
  const hasConnectedRef = useRef(false);
  const socketRef = useRef();

  /*  const sendMessage = () => {
    socketRef.current.emit("client-message", { message: messageRef.current });
  }; */

  // const socketRef = useRef();
  // useEffect(() => {
  //   if (!hasConnectedRef.current) {
  //     socketRef.current = io(`${import.meta.env.VITE_SOCKET_BACKEND_URL}`, {
  //       transports: ["websocket"],
  //     });

  //     socketRef.current.on("connect", () => {
  //       console.log("Connecté au serveur");
  //       socketRef.current.emit("setUsername", storedUser.pseudo);
  //     });

  //     socketRef.current.on("connect_error", (error) => {
  //       console.log("Erreur de connexion:", error);
  //     });

  //     socketRef.current.on("eventFromServer", (data) => {
  //       console.log("Données reçues du serveur:", data);
  //     });

  //     socketRef.current.on("userConnected", (data) => {
  //       console.log("userConnected event triggered, data:", data);
  //       if (data.pseudo !== storedUser.pseudo) {
  //         setMessage(`User ${data.pseudo} est entré dans la salle`);
  //       }
  //     });

  //     socketRef.current.on("userDisconnected", (data) => {
  //       console.log("userDisconnected event triggered, data:", data);
  //       if (data.pseudo !== storedUser.pseudo) {
  //         setMessage(`User ${data.pseudo} s'est déconnecté`);
  //       }
  //     });

  //     socketRef.current.on("disconnect", (reason) => {
  //       console.log("Déconnecté du serveur:", reason);
  //     });

  //     hasConnectedRef.current = true;

  //     return () => {
  //       socketRef.current.disconnect();
  //     };
  //   }
  // }, []);
  // useEffect(() => {
  //   if (storedUser.pseudo && socketRef.current.connected) {
  //     socketRef.current.emit("setUsername", storedUser.pseudo);
  //   }
  // }, [socketRef, storedUser.pseudo]);

  const { id } = useParams();
  const canvasRef = useRef(null);
  /* state pour récupérer les coordonnées du click */
  const [clickX, setClickX] = useState(0);
  const [clickY, setClickY] = useState(0);
  /* CHRONO STATE */
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [chronoMsg, setChronoMsg] = useState("");

  /* DESSIN STATE */
  const [pen, setPen] = useState(false);
  const [eraser, setEraser] = useState(false);
  const [color, setColor] = useColor("#ffffff");
  const [lastPixelTime, setLastPixelTime] = useState(Date.now());
  /* BONUS  */
  const [userPixelCount, setUserPixelCount] = useState(0);
  const [bombBonus, setBombBonus] = useState([]);
  const [activeBomb, setActiveBomb] = useState(
    Array.from({ length: bombBonus.length }, () => false)
  );

  const [penBonus, setPenBonus] = useState([]);
  const [activePenBonus, setActivePenBonus] = useState(
    Array.from({ length: penBonus.length }, () => false)
  );
  const [penBonusUses, setPenBonusUses] = useState(
    Array(penBonus.length).fill(5)
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
    if (!startTime) {
      let date = new Date();
      date.setHours(date.getHours() - 2);
      setStartTime(date.getTime());
    } else if (!stop) {
      const interval = setInterval(() => {
        let now = new Date();
        const elapsedTime = now.getTime() - startTime;
        let remainingTime = Math.max(0, 10800000 - elapsedTime);
        if (remainingTime <= 0) {
          setStop(true);
          setElapsedTime(0);
          setChronoMsg("Temps écoulé");
        } else {
          remainingTime += 2 * 60 * 60 * 1000; // Ajouter 2 heures à remainingTime
          setElapsedTime(remainingTime);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [startTime, stop]);

  /* BONUS Pinceau */
  useEffect(() => {
    const interval = setInterval(() => {
      setPenBonus((prevPenBonus) => {
        const newPenBonus = [...prevPenBonus, {}];
        setPenBonusUses((prevPenBonusUses) => [...prevPenBonusUses, 5]);
        return newPenBonus;
      });
    }, 600000); // 60000 ms = 1 min

    return () => clearInterval(interval);
  }, []);
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
  let pixelSize = 11; // Taille de chaque "pixel" du damier
  if (window.innerWidth <= 430) {
    pixelSize = 8;
  }
  const nbPixels = 40;
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");

      // Dessiner un damier
      const numX = nbPixels;
      const numY = nbPixels;

      for (let i = 0; i < numX; i++) {
        for (let j = 0; j < numY; j++) {
          ctx.fillStyle = (i + j) % 2 === 0 ? "#ffffff" : "#d3d3d3";
          ctx.fillRect(i * pixelSize, j * pixelSize, pixelSize, pixelSize);
        }
      }

      // Dessiner les pixels du damier
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

    const handleAddPixel = (newPixel) => {
      setGrid((prevGrid) => [...prevGrid, newPixel]);
    };
    /* 
    UWebSocket.sendMessage("add-pixel", handleAddPixel); */

    // Nettoyer l'abonnement lorsque le composant est démonté
  }, [grid]);
  /* GESTION DES GRILLES */
  const handleName = (event) => {
    setGridName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/grids/${id}`,
        { name: gridName },
        { withCredentials: true }
      );
      if (response.status !== 200) {
        error("Une erreur est survenue");
      } else {
        success("Nom de la grille modifié");
      }
    } catch (err) {
      console.error("Error updating grid:", err.response || err.message);
    }
  };
  /* GESTION BOUTONS */
  const handlePen = () => {
    setPen(!pen);
    setEraser(false);
    setActiveBomb(Array.from({ length: bombBonus.length }, () => false));
    setActivePenBonus(Array.from({ length: penBonus.length }, () => false));
  };

  const handleEraser = () => {
    setEraser(!eraser);
    setPen(false);
    setActiveBomb(Array.from({ length: bombBonus.length }, () => false));
    setActivePenBonus(Array.from({ length: penBonus.length }, () => false));
  };

  const handleBombBonusClick = (index) => {
    const newActiveBomb = Array.from({ length: bombBonus.length }, () => false);
    if (activeBomb[index] !== true) {
      newActiveBomb[index] = true;
    }
    setActiveBomb(newActiveBomb);
    setActivePenBonus(Array.from({ length: penBonus.length }, () => false));
    setEraser(false);
    setPen(false);
  };

  const handlePenBonusClick = (index) => {
    const newActivePenBonus = Array.from(
      { length: penBonus.length },
      () => false
    );
    if (activePenBonus[index] !== true) {
      newActivePenBonus[index] = true;
    }
    setActivePenBonus(newActivePenBonus);
    setActiveBomb(Array.from({ length: bombBonus.length }, () => false));
    setEraser(false);
    setPen(false);
  };
  /* INTÉRACTIVITÉ JEU */

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

      const newPixel = {
        id: response.data.insertId,
        color: color.hex,
        user_pseudo: pixelData.user_pseudo,
        created_at: new Date().toISOString(),
        x_coordinate: x,
        y_coordinate: y,
      };

      if (socketRef.current) {
        socketRef.current.emit("add-pixel", newPixel);
      }
      /*       UWebSocket.sendMessage("add-pixel", newPixel); */

      let secondPixelResponse;
      let activePenBonusIndex = activePenBonus.findIndex(
        (bonus) => bonus === true
      );
      let secondNewPixel = null;
      if (activePenBonusIndex !== -1) {
        const secondPixelData = { ...pixelData, x_coordinate: x + 1 };
        secondPixelResponse = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/grids/${id}/pixels`,
          secondPixelData,
          { withCredentials: true }
        );

        secondNewPixel = {
          id: secondPixelResponse.data.insertId,
          color: color.hex,
          user_pseudo: pixelData.user_pseudo,
          created_at: new Date().toISOString(),
          x_coordinate: x + 1,
          y_coordinate: y,
        };

        if (socketRef.current) {
          socketRef.current.emit("add-pixel", secondNewPixel);
        }
        /*  UWebSocket.sendMessage("add-pixel", secondNewPixel); */

        setPenBonusUses((prevUses) => {
          const newUses = [...prevUses];
          newUses[activePenBonusIndex] -= 1;

          // Si penBonusUses pour l'index actif est 0, supprimer l'objet correspondant de penBonus
          if (newUses[activePenBonusIndex] === 0) {
            setPenBonus((prevBonus) => {
              const newBonus = [...prevBonus];
              newBonus.splice(activePenBonusIndex, 1);
              return newBonus;
            });
            setActivePenBonus((prevActive) => {
              const newActive = [...prevActive];
              newActive[activePenBonusIndex] = false;
              return newActive;
            });
            // Réinitialiser penBonusUses à 5
            newUses[activePenBonusIndex] = 5;
          }
          return newUses;
        });
      }

      setLastPixelTime(now);
      setUserPixelCount((prevCount) => {
        const newCount = prevCount + 1;
        if (newCount === 19) {
          setBombBonus((prevBonuses) => [...prevBonuses, {}]);
          return 0;
        } else {
          return newCount;
        }
      });

      setGrid((prevGrid) => {
        // Créez une copie de la grille précédente
        const newGrid = [...prevGrid];

        // Ajoutez newPixel et secondNewPixel à la nouvelle grille
        newGrid.push(newPixel);
        if (secondPixelResponse) {
          newGrid.push(secondNewPixel);
        }

        // Renvoyez la nouvelle grille
        return newGrid;
      });
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
      /*       console.log("pixel", selectedPixel); */
      if (
        eraser &&
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

        if (socketRef.current) {
          socketRef.current.emit("remove-pixel", selectedPixel.id);
        }
        /*    UWebSocket.sendMessage("remove-pixel", selectedPixel.id); */
        const pixelResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/grids/${id}/pixels`
        );
        setGrid(pixelResponse.data);
      } else if (
        storedUser.pseudo !== selectedPixel.user_pseudo &&
        activeBomb.some((value) => value)
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
        if (socketRef.current) {
          socketRef.current.emit("remove-pixel", selectedPixel.id);
        }
        setBombBonus((prevBonus) => {
          const newBonus = [...prevBonus];
          newBonus.splice(newBonus.length - activeBomb, 1);
          setActiveBomb(Array.from({ length: bombBonus.length }, () => false));
          return newBonus;
        });
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

    if (stop === false) {
      if (pen || activePenBonus.some((value) => value)) {
        handleAddPixel(x, y);
      } else if (eraser || activeBomb.some((value) => value)) {
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
    }
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
  };

  return (
    <div className="page" id="area-page">
      <section className="grid-container">
        <div className="header">
          {storedUser.id === (gridData && gridData.user_id) ? (
            <form onSubmit={handleSubmit}>
              <h1>
                <input
                  type="text"
                  placeholder={gridName}
                  onChange={handleName}
                />
              </h1>
              <Button className="blob-btn-light" type="submit">
                OK
              </Button>
            </form>
          ) : (
            <h1 id="un-grid-name">{gridName}</h1>
          )}
        </div>
        {stop && (
          <div className="end-game">
            {" "}
            <p id="elapsed-time">Vous ne pouvez plus modifier cette grille </p>
          </div>
        )}
        <div className="grid-area-container">
          <div className="game-wrapper">
            <div className="chrono-container">
              <p>{stop ? chronoMsg : formatTime(elapsedTime)}</p>
            </div>
            <p className="message">{message}</p>
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
              <div
                className="bonus-infos"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <img
                  src={storedUser.theme === 2 ? infoB : infoW}
                  alt="infos"
                  width={30}
                />
                {isHovered && (
                  <div className="hovered">
                    <ul>
                      <li>Gagne 1 bombe tous les 20 pixels placés</li>
                      <li>Gagne 1 pinceau double toutes les 10 minutes</li>
                    </ul>
                    <p>
                      ⚠️ Si tu quittes cette page tu perdras tes bonus en cours
                      ⚠️
                    </p>
                  </div>
                )}
              </div>
              <div className="bombs-container">
                {bombBonus.map((bonus, index) => (
                  <Button
                    key={index}
                    className={`bomb-bonus ${
                      activeBomb[index] ? "active bomb-animation" : ""
                    }`}
                    type="button"
                    onClick={() => handleBombBonusClick(index)}
                  >
                    <img
                      src={bombBonusImg}
                      alt="bombe"
                      width={30}
                      height={30}
                      onAnimationEnd={() => setAnimateBomb(false)}
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
                    <p>{penBonusUses[index]}</p>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {storedUser && !stop && (
            <div className="paint">
              <Tools
                pen={pen}
                eraser={eraser}
                handlePen={handlePen}
                handleEraser={handleEraser}
              />
              <ColorSlider
                color={color}
                handleColorChange={handleColorChange}
              />
            </div>
          )}
        </div>
      </section>
      {/*   <button
        onClick={() => {
          console.log("send-message");
          UWebSocket.sendMessage("add-pixel", "newPixel");
        }}
        style={{ zIndex: 3 }}
      >
        Test
      </button> */}
    </div>
  );
}
