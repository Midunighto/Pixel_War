import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import Canvas from "../components/Canvas";
import Home from "./Home";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { error } from "../services/toast";

import { useStoredUser } from "../contexts/UserContext";
import "../styles/my-grids.scss";

export default function MyGrids() {
  const { storedUser, setStoredUser } = useStoredUser();
  const [loading, setLoading] = useState(true);

  const [grids, setGrids] = useState([]);

  const canvasRefs = grids.map(() => React.createRef());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const gridsResponseData = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/${storedUser.id}/grids`
        );

        const gridsWithPixelsPromises = gridsResponseData.data.map(
          async (grid) => {
            try {
              const pixelsResponse = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/grids/${
                  grid.id
                }/pixels/`
              );

              return { ...grid, pixels: pixelsResponse.data };
            } catch (err) {
              console.error(err);
              error(
                "Nous n'avous pas réussi à charger les données, essayez de rafraîchir la page"
              );

              return { ...grid, pixels: [] };
            }
          }
        );

        const gridsWithPixels = await Promise.all(gridsWithPixelsPromises);

        setGrids(gridsWithPixels);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pixelSize = 5;
  const nbPixels = 40;
  useEffect(() => {
    grids.forEach((grid, index) => {
      const canvas = canvasRefs[index].current;
      if (canvas) {
        const ctx = canvas.getContext("2d");

        // damier
        const numX = nbPixels;
        const numY = nbPixels;

        for (let i = 0; i < numX; i++) {
          for (let j = 0; j < numY; j++) {
            ctx.fillStyle = (i + j) % 2 === 0 ? "#ffffff" : "#d3d3d3";
            ctx.fillRect(i * pixelSize, j * pixelSize, pixelSize, pixelSize);
          }
        }

        // pixels du damier
        grid.pixels.forEach((pixel) => {
          ctx.fillStyle = pixel.color;
          ctx.fillRect(
            pixel.x_coordinate * pixelSize,
            pixel.y_coordinate * pixelSize,
            pixelSize,
            pixelSize
          );
        });
      }
    });
  }, [grids, canvasRefs, nbPixels, pixelSize]);

  const handleCreateGrid = async () => {
    try {
      const today = new Date();
      const dateString = `${today.getFullYear()}0${
        today.getMonth() + 1
      }0${today.getDate()}${today.getHours()}${today.getMinutes()}${today.getSeconds()}`;

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/grids`,
        {
          user_id: storedUser.id,
          name: `Area${dateString}`,
        }
      );

      navigate(`/grid/${response.data}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {storedUser ? (
        <div className="page">
          <section className="my-grids">
            <div className="header">
              <h1>Mes Grilles</h1>
              <p>Retrouve ici toutes les griles que tu as créées !</p>
            </div>
            <Button
              type="button"
              className="blob-btn-dark"
              onClick={handleCreateGrid}
            >
              Créer une grille
            </Button>
            {loading ? (
              <Loader />
            ) : (
              <div className="grids-wrapper">
                {grids
                  .sort(
                    (a, b) =>
                      new Date(b.creation_time) - new Date(a.creation_time)
                  )
                  .map((grid, index) => (
                    <div
                      key={grid.id}
                      className="grid-card"
                      onClick={() => navigate(`/grid/${grid.id}`)}
                    >
                      <h2>{grid.name}</h2>

                      <Canvas
                        canvasRef={canvasRefs[index]}
                        nbPixels={nbPixels}
                        pixelSize={pixelSize}
                        handleCanvasClick={() => navigate(`/grid/${grid.id}`)}
                      />
                      <div className="grid-foil">
                        {(Date.now() -
                          new Date(grid.creation_time).getTime() +
                          2 * 3600000) /
                          3600000 >
                        3 ? (
                          <p>Fermée</p>
                        ) : (
                          <p>
                            {`Temps restant: ${
                              Math.floor(
                                Math.max(
                                  0,
                                  3 -
                                    (Date.now() -
                                      new Date(grid.creation_time).getTime() +
                                      2 * 3600000) /
                                      3600000
                                )
                              ) +
                              Math.floor(
                                Math.round(
                                  (Math.max(
                                    0,
                                    3 -
                                      (Date.now() -
                                        new Date(grid.creation_time).getTime() +
                                        2 * 3600000) /
                                        3600000
                                  ) %
                                    1) *
                                    60
                                ) / 60
                              )
                            }h${
                              Math.round(
                                (Math.max(
                                  0,
                                  3 -
                                    (Date.now() -
                                      new Date(grid.creation_time).getTime() +
                                      2 * 3600000) /
                                      3600000
                                ) %
                                  1) *
                                  60
                              ) % 60
                            }`}
                          </p>
                        )}
                      </div>
                      <div className="grid-card-footer">
                        <Button
                          type="button"
                          className="blob-btn-light"
                          onClick={() => navigate(`/grid/${grid.id}`)}
                        >
                          {(Date.now() -
                            new Date(grid.creation_time).getTime() +
                            2 * 3600000) /
                            3600000 >
                          3
                            ? "Voir"
                            : "Rejoindre"}
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        </div>
      ) : (
        <Home />
      )}
    </>
  );
}
