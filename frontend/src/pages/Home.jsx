import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useStoredUser } from "../contexts/UserContext";
import { useModal } from "../contexts/ModalContext";

import Button from "../components/Button";
import SignIn from "../components/SignIn";

import whitelogo from "../assets/logo-white.png";
import "../styles/home.scss";

export default function Home() {
  const { storedUser } = useStoredUser();
  const { openModal, toggleModal } = useModal();

  const navigate = useNavigate();

  return (
    <div className="page">
      <section className="about-container">
        <div className="about">
          <div className="about-wrapper">
            <h1>Créez, Explorez, et Détruisez</h1>
            <p>
              Cumulez les bonus, explorez et créez des univers en constante
              évolution et laissez votre empreinte pixel par pixel.
              Rejoignez-nous dès aujourd'hui et laissez votre imagination
              s'épanouir !
            </p>
          </div>
          <img src={whitelogo} alt="logo" width={276} height={201} />
        </div>
        <div className="buttons-wrapper">
          {!storedUser ? (
            <>
              <Button
                className="blob-btn-dark"
                type="button"
                onClick={() => navigate("/signup")}
              >
                S'inscrire
              </Button>
              <Button
                type="button"
                className="blob-btn-light"
                onClick={toggleModal}
              >
                Se connecter
              </Button>
            </>
          ) : (
            <>
              <Button
                className="blob-btn-dark"
                type="button"
                onClick={() => navigate("/my-grids")}
              >
                Voir mes grilles
              </Button>
              <Button
                type="button"
                className="blob-btn-light"
                onClick={() => navigate("/community-grids")}
              >
                Communauté
              </Button>
            </>
          )}
        </div>
      </section>
      <div className="align-right">
        <section className="rules-container">
          <div className="rules">
            <h1>Règles du jeu</h1>
            <p>
              Crée une nouvelle grille ou déssine sur une grille créée par un
              autre joueur. N’oublie pas que chaque grille a une durée de vie de
              3h maximum ! Tu peux placer 1 pixel toutes les 5 secondes
            </p>
          </div>
          <div className="rules bonus1">
            <h2>Bonus destruction</h2>
            <p>
              Gagne une grenade tous les 20 pixels placés et déruis pour
              détruire 1 pixel adverse !
            </p>
          </div>
          <div className="rules bonus2">
            <h2>Bonus création</h2>
            <p>
              Gagne un pinceau, qui double tes pixels, utilisable 5 fois toutes
              les 15 minutes !
            </p>
          </div>
        </section>
      </div>
      {openModal && <SignIn />}
    </div>
  );
}
