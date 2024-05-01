/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { success, error } from "../services/toast";
import { useModal } from "../contexts/ModalContext";
import { useStoredUser } from "../contexts/UserContext";

import whitelogo from "../assets/logo-white.png";
import "../styles/auth.scss";
import "../styles/modals.scss";
import Button from "../components/Button";
import SignIn from "../components/SignIn";

export default function SignUp() {
  const navigate = useNavigate();
  const { openModal, toggleModal } = useModal();
  const { storedUser } = useStoredUser();

  const [user, setUser] = useState({
    pseudo: "",
    email: "",
    pwd: "",
  });
  const [password, setPassword] = useState({
    confirmPwd: "",
  });
  const [created, setCreated] = useState(false);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  const handleRealSubmit = async (e) => {
    e.preventDefault();

    if (!user.pseudo || !user.email || !user.pwd || !password.confirmPwd) {
      error("Merci de remplir tous les champs");
      return;
    }
    if (user.pwd !== password.confirmPwd) {
      error("Les mots de passe ne correspondent pas");
      return;
    }
    if (user.pwd.length < 8) {
      error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    if (!document.getElementById("use").checked) {
      error("Merci d'accepter les conditions d'utilisation");
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users`,
        user,
        {
          withCredentials: true,
        }
      );
      if (res.status === 201) {
        success("Compte créé avec succès");
        setCreated(true);
        toggleModal();
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 409) {
          error("L'email ou le pseudo existe déjà");
        }
        if (err.response.status === 400) {
          error("Merci de remplir tous les champs");
        }
      } else {
        console.error(err);
      }
    }
  };

  return (
    <div className="page">
      {storedUser ? (
        <Navigate to="/" />
      ) : (
        <section className="signup-container">
          <div className="wrapper">
            <h1>Créer un Compte</h1>

            <form
              className="auth"
              onSubmit={handleRealSubmit}
              method="post"
              action="/signin"
            >
              <div className="group-form">
                <div className="input-group">
                  <label htmlFor="pseudo" id="pseudo">
                    Nom d'utilisateur
                  </label>
                  <input
                    name="pseudo"
                    type="text"
                    placeholder="Pseudo"
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="email" id="email">
                    Adresse e-mail
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="email@mail.com"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="group-form">
                <div className="input-group">
                  <label htmlFor="pwd" id="pwd">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    name="pwd"
                    placeholder="8 caractères minimum"
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="confirmPwd" id="confirmPwd">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    name="confirmPwd"
                    placeholder="Confirmer le mot de passe"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="uses">
                <input type="checkbox" name="uses" id="use" />
                <label htmlFor="uses">
                  Accepter les <Link to="/terms">conditions d'utilisation</Link>
                </label>
              </div>
              <Button type="submit" className="blob-btn-dark">
                S'inscrire
              </Button>
              <Button
                type="button"
                className="link-button"
                onClick={toggleModal}
              >
                J'ai déjà un compte
              </Button>
            </form>
          </div>
          <img src={whitelogo} alt="logo" width={276} height={201} />
        </section>
      )}
      ;{openModal && <SignIn />}
    </div>
  );
}
