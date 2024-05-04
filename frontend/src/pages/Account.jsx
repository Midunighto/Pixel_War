import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import { useStoredUser } from "../contexts/UserContext";

import { error, success } from "../services/toast";

import Home from "./Home";
import Button from "../components/Button";
import avatar from "../assets/painter.svg";
import avatarblack from "../assets/painter-black.svg";

import "../styles/account.scss";
import Delete from "../components/Delete";

export default function Account() {
  const navigate = useNavigate();
  const { storedUser, setStoredUser } = useStoredUser();
  const [openModal, setOpenModal] = useState(false);
  const [mail, setMail] = useState(false);
  const [pwd, setPwd] = useState(false);
  const mailRef = useRef();
  const pwdRef = useRef();

  const [lightTheme, setLightTheme] = useState(false);

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: "#fff",
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            "#fff"
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor:
            theme.palette.mode === "dark" ? "#dbd8e3" : "#aab4be",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: theme.palette.mode === "dark" ? "#5c5470" : "#5c5470",
      width: 32,
      height: 32,
      "&::before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: theme.palette.mode === "dark" ? "#5c5470" : "#aab4be",
      borderRadius: 20 / 2,
    },
  }));

  const handleMailSubmit = async (event) => {
    event.preventDefault();
    let newMail = mailRef.current.value;
    if (!newMail) {
      newMail = mailRef.current.placeholder;
    }
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${storedUser.id}/mail`,
        { mail: newMail }
      );
      success("Votre adresse e-mail a été modifiée avec succès");
      setMail(false);
      // Mettre à jour l'état storedUser avec la nouvelle adresse e-mail
      setStoredUser((prevUser) => ({
        ...prevUser,
        email: newMail,
      }));
    } catch (error) {
      error("Une erreur est survenue, merci de réessayer");
    }
  };

  const handlePwdSubmit = async (event) => {
    event.preventDefault();
    const newPwd = pwdRef.current.value;

    if (!newPwd.trim()) {
      error("Le champ du mot de passe ne peut pas être vide");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${
          storedUser.id
        }/password`,
        { pwd: newPwd }
      );
      success("Votre mot de passe a été modifié avec succès");
      setPwd(false);
    } catch (error) {
      error("Une erreur est survenue, merci de réessayer");
    }
  };
  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {
        withCredentials: true,
      });

      Cookies.remove("tokenClient");
      setStoredUser(null);
      navigate("/");
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const handleChange = () => {
    setLightTheme(!lightTheme);
    setStoredUser((prevUser) => ({
      ...prevUser,
      theme: lightTheme ? 1 : 2,
    }));
  };

  const handleUserTheme = async () => {
    const updateTheme = { theme: lightTheme ? 1 : 2 };
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${
          storedUser.id
        }/addtheme`,
        updateTheme,
        { withCredentials: true }
      );
    } catch (err) {
      error(err.response.data.error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${storedUser.id}`,
        {
          withCredentials: true,
        }
      );
      success("Votre compte a bien été supprimé");
      handleLogout();
    } catch (err) {
      console.error(
        "Error during delete:",
        err.response ? err.response.data : err.message
      );
      error("Une erreur est survenue");
    }
  };

  return (
    <>
      {storedUser ? (
        <div className="page">
          <section className="account ">
            <h1>Mon Compte</h1>
            <div className="account-wrapper">
              <img
                src={storedUser.theme === 1 ? avatar : avatarblack}
                alt="account logo"
                width={100}
              />
              <p>{storedUser.pseudo}</p>
              <div className="line" />
              <div className="group">
                <p>
                  <span>E-mail :</span>{" "}
                  {mail ? (
                    <form onSubmit={handleMailSubmit}>
                      <input
                        type="text"
                        ref={mailRef}
                        placeholder={storedUser.email}
                      />
                    </form>
                  ) : (
                    <em>{storedUser.email}</em>
                  )}
                </p>
                {mail ? (
                  <Button
                    className="blob-btn-light"
                    type="submit"
                    onClick={handleMailSubmit}
                  >
                    Confirmer
                  </Button>
                ) : (
                  <Button
                    className="blob-btn-light"
                    onClick={() => setMail(!mail)}
                  >
                    Modifier mon adresse e-mail
                  </Button>
                )}
              </div>
              <div className="line" />
              <div className="group">
                <p>
                  <span>Mot de passe : </span>
                  {pwd ? (
                    <form>
                      <input type="text" ref={pwdRef} placeholder="********" />
                    </form>
                  ) : (
                    <em>********</em>
                  )}
                </p>
                {pwd ? (
                  <Button
                    className="blob-btn-light"
                    type="submit"
                    onClick={handlePwdSubmit}
                  >
                    Confirmer
                  </Button>
                ) : (
                  <Button
                    className="blob-btn-light"
                    onClick={() => setPwd(!pwd)}
                  >
                    Modifier mon mot de passe
                  </Button>
                )}
              </div>
              <div className="line" />
              <div className="group">
                <p>Opter pour le thème {lightTheme ? "sombre" : "clair"}</p>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <MaterialUISwitch
                        sx={{ m: 1 }}
                        checked={storedUser.theme === 1}
                        onChange={(e) => {
                          handleChange(e);
                          handleUserTheme();
                        }}
                      />
                    }
                  />
                </FormGroup>
              </div>
            </div>

            {storedUser.isAdmin === 1 && (
              <Button
                type="button"
                className="blob-btn-dark"
                onClick={() => navigate("/29119510")}
              >
                Administrateur
              </Button>
            )}
            <div className="account-footer">
              <Button
                type="button"
                className="blob-btn-dark"
                onClick={handleLogout}
              >
                Se déconnecter
              </Button>

              <Button
                type="button"
                id="delete"
                onClick={() => {
                  setOpenModal(true);
                }}
              >
                supprimer mon compte
              </Button>
            </div>
          </section>
          {openModal && (
            <Delete
              openModal={openModal}
              setOpenModal={setOpenModal}
              handleDelete={handleDelete}
              confirmationMessage={
                "Êtes-vous sûr de vouloir supprimer votre compte ?"
              }
            />
          )}
        </div>
      ) : (
        <Home />
      )}
    </>
  );
}
