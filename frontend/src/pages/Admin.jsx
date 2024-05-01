import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import Home from "./Home";
import { useParams } from "react-router-dom";

import { useStoredUser } from "../contexts/UserContext";
import { useModal } from "../contexts/ModalContext";
import { useNavigate } from "react-router-dom";
import Delete from "../components/Delete";

import { error, success } from "../services/toast";

export default function Admin() {
  const [grids, setGrids] = useState([]);
  const [users, setUsers] = useState([]);
  const { storedUser } = useStoredUser();
  const [openModal, setOpenModal] = useState(false);
  const [userModal, setUserModal] = useState(null);
  const [gridModal, setGridModal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponseData = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/`
        );
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

              return { ...grid, pixels: [] };
            }
          }
        );
        const gridsWithPixels = await Promise.all(gridsWithPixelsPromises);

        setUsers(usersResponseData.data);
        setGrids(gridsWithPixels);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${id}`,
        {
          withCredentials: true,
        }
      );
      success("Utilisateur supprimé avec succès");
      // Mettre à jour le render
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error(
        "Error during delete:",
        err.response ? err.response.data : err.message
      );
      error("Une erreur est survenue");
    }
  };

  const handleDeleteGrid = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/grids/${id}`,
        {
          withCredentials: true,
        }
      );
      success("Grille supprimée avec succès");
      setGrids(grids.filter((grid) => grid.id !== id));
    } catch (err) {
      console.error(
        "Error during delete:",
        err.response ? err.response.data : err.message
      );
      error("Une erreur est survenue");
    }
  };

  return (
    <div className="page">
      {storedUser.isAdmin === 1 ? (
        <section className="admin">
          <h1>Gestion des utilisateurs </h1>
          <table>
            <thead>
              <tr>
                <th>Pseudo</th>
                <th>Email</th>
                <th>Administrateur</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.pseudo}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin === 1 ? "Oui" : "Non"}</td>
                  <td>
                    <button
                      onClick={() => {
                        setOpenModal(true);
                        setUserModal(user.id);
                      }}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h1>Gestion des grids</h1>
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Auteur</th>
                <th>Date de création</th>
                <th>État</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {grids.map((grid) => (
                <tr key={grid.id}>
                  <td
                    onClick={() => navigate(`/grid/${grid.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    {grid.name}
                  </td>
                  <td>{grid.user_pseudo}</td>
                  <td>
                    {new Date(grid.creation_time).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }) +
                      " " +
                      new Date(grid.creation_time).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </td>
                  <td>
                    {(Date.now() - new Date(grid.creation_time).getTime()) /
                      3600000 >
                    3
                      ? "Fermée"
                      : "Ouverte"}
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setOpenModal(true);
                        setGridModal(grid.id);
                      }}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <Home />
      )}
      {openModal && userModal !== null && (
        <Delete
          openModal={openModal}
          setOpenModal={setOpenModal}
          handleDelete={() => handleDeleteUser(userModal)}
          confirmationMessage={"Supprimer cet utilisateur ?"}
          additionalState={setUserModal}
        />
      )}
      {openModal && gridModal !== null && (
        <Delete
          openModal={openModal}
          setOpenModal={setOpenModal}
          handleDelete={() => handleDeleteGrid(gridModal)}
          confirmationMessage={"Supprimer cette grille"}
          additionalState={setGridModal}
        />
      )}
    </div>
  );
}
