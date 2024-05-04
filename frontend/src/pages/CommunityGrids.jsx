import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import Canvas from "../components/Canvas";
import Loader from "../components/Loader";
import Searchbar from "../components/Searchbar";
import { useNavigate } from "react-router-dom";
import { error } from "../services/toast";

import { useStoredUser } from "../contexts/UserContext";

import bucket from "../assets/paint-bucket.svg";
import blackbucket from "../assets/paint-bucket-black.svg";

import "../styles/community-grids.scss";

export default function CommunityGrids() {
  const { storedUser } = useStoredUser();
  const [grids, setGrids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [search, setSearch] = useState(false);

  /* TRI DES GRILLES */
  const sortedGrids = [...grids].sort(
    (a, b) => new Date(b.creation_time) - new Date(a.creation_time)
  );
  const canvasRefs = sortedGrids.reduce((refs, grid) => {
    refs[grid.id] = React.createRef();
    return refs;
  }, {});
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
    sortedGrids.forEach((grid) => {
      const canvas = canvasRefs[grid.id].current;
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

  const filteredGrids = sortedGrids.filter(
    (element) =>
      element.name &&
      element.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  return (
    <div className="page">
      <section className="grids-container">
        <div className="header">
          <div className="header-wrapper">
            <h1>Grilles de la communauté</h1>
            <p>
              Retrouve ici les grilles créées par les autres joueurs de la
              communauté Pixel War
            </p>
            <div className="row">
              {storedUser && (
                <Button
                  type="button"
                  className="blob-btn-dark"
                  onClick={handleCreateGrid}
                >
                  Créer une grille
                </Button>
              )}

              <Searchbar
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                placeholder="Rechercher une grille par nom"
                onClick={() => setSearch(!search)}
              />
            </div>
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
            {filteredGrids
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
                    canvasRef={canvasRefs[grid.id]}
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
                    <span>Créée par {grid.user_pseudo}</span>
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
  );
}
