import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import Canvas from "../components/Canvas";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

import { useStoredUser } from "../contexts/UserContext";

import bucket from "../assets/paint-bucket.svg";
import blackbucket from "../assets/paint-bucket-black.svg";

import "../styles/community-grids.scss";
export default function CommunityGrids() {
  const { storedUser } = useStoredUser();
  const [grids, setGrids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  const canvasRefs = grids.map(() => React.createRef());

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const gridsResponseData = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/grids/`
        );

        const gridsWithPixelsPromises = gridsResponseData.data.map(
          async (grid) => {
            try {
              const pixelsResponse = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/grids/${
                  grid.id
                }/pixels/`
              );
              console.log("pixelsResponse", pixelsResponse.data);

              return { ...grid, pixels: pixelsResponse.data };
            } catch (err) {
              console.error(err);

              return { ...grid, pixels: [] };
            }
          }
        );

        const gridsWithPixels = await Promise.all(gridsWithPixelsPromises);
        console.log("gridsWithPixels", gridsWithPixels);

        setGrids(gridsWithPixels);
        setDataLoaded(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pixelSize = 5; // Taille de chaque pixel du canva
  const nbPixels = 40;
  useEffect(() => {
    grids.forEach((grid, index) => {
      const canvas = canvasRefs[index].current;
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

        // Dessiner les pixels du damier
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
  return (
    <div className="page">
      <section className="grids-container">
        <div className="header">
          <div className="header-wrapper">
            <h1>Grilles de la communauté</h1>
            <p>
              Retrouve ici les grilles créées par les autres joueurs de la
              communauté Pixel Wars !
            </p>
          </div>

          <img
            src={storedUser.theme === 1 ? bucket : blackbucket}
            alt="sceau de peinture"
            width={100}
          />
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grids-wrapper">
            {grids
              .sort(
                (a, b) => new Date(b.creation_time) - new Date(a.creation_time)
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
                    {(Date.now() - new Date(grid.creation_time).getTime()) /
                      3600000 >
                    3 ? (
                      <p>Fermée</p>
                    ) : (
                      <p>
                        {`Temps restant: ${Math.floor(
                          Math.max(
                            0,
                            3 -
                              (Date.now() -
                                new Date(grid.creation_time).getTime()) /
                                3600000
                          )
                        )}h${Math.round(
                          (Math.max(
                            0,
                            3 -
                              (Date.now() -
                                new Date(grid.creation_time).getTime()) /
                                3600000
                          ) %
                            1) *
                            60
                        )}`}
                      </p>
                    )}
                  </div>
                  <div className="grid-card-footer">
                    <span>Créée par {grid.user_pseudo}</span>
                    <Button
                      type="button"
                      className="blob-btn-light"
                      onClick={() => navigate(`/grid/${grid.id}`)}
                    >
                      {(Date.now() - new Date(grid.creation_time).getTime()) /
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
  );
}