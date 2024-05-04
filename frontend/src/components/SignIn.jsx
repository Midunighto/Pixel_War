import PropTypes from "prop-types";
import React, { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useStoredUser } from "../contexts/UserContext";
import { useModal } from "../contexts/ModalContext";

import { error, success } from "../services/toast";
import Button from "./Button";
import Loader from "./Loader";

import close from "../assets/close.svg";

export default function SignIn() {
  const { storedUser, setStoredUser } = useStoredUser();
  const { openModal, toggleModal } = useModal();

  const [isLoading, setIsLoading] = useState(false);

  const [user, setUser] = useState({
    pseudo: "",
    pwd: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user.pseudo || !user.pwd) {
      error("Merci de remplir tous les champs");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/login`,
        user,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setStoredUser(res.data.user);

        Cookies.set("tokenClient", JSON.stringify(res.data.user), {
          expires: 1,
          sameSite: "none",
          secure: true,
          path: "/",
        });
        toggleModal();
        success("Connexion réussie !");
      }
    } catch (err) {
      console.error(err);

      if (err.response) {
        if (err.response.status === 422) {
          error("Mot de passe incorrect");
        } else if (err.response.status === 401) {
          error("Nom d'utilisateur inexistant");
        }
      } else {
        error("Une erreur s'est produite");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (storedUser) {
    return <Navigate to="/" />;
  }
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="page" style={{ padding: 0 }}>
      {openModal && (
        <div className="modal">
          <div className="modal-content" style={{ top: 100 }}>
            <h1>Connexion</h1>
            <Button type="button" className="close" onClick={toggleModal}>
              <img src={close} alt="close button" width={20} />
            </Button>
            <form className="auth" method="POST">
              <div className="input-group">
                <label htmlFor="pseudo" id="pseudo">
                  Nom d'utilisateur
                </label>
                <input
                  name="pseudo"
                  type="text"
                  placeholder="Nom d'utilisateur"
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="pwd" id="pwd">
                  Mot de passe
                </label>
                <input
                  type="password"
                  name="pwd"
                  placeholder="Mot de passe"
                  onChange={handleChange}
                />
              </div>

              <Button
                type="submit"
                onClick={handleSubmit}
                className="blob-btn-light"
              >
                Se connecter
              </Button>
            </form>
            <Button type="button" className="link-button" onClick={toggleModal}>
              Créer un compte
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
