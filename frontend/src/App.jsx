/* eslint-disable no-unused-expressions */
import $ from "jquery";
import "jquery.ripples";

import Cookies from "js-cookie";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

import { useStoredUser } from "./contexts/UserContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import "./styles/root.scss";

function App() {
  const { storedUser, setStoredUser } = useStoredUser();

  useEffect(() => {
    if (storedUser === false) {
      return;
    }
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/protected`, {
        withCredentials: true,
      })
      .then((res) => {
        const { id, pseudo, theme, email, isAdmin } = res.data;
        const userData = { id, pseudo, theme, email, isAdmin };

        setStoredUser(userData);
        Cookies.set("user", JSON.stringify(userData), { expires: 1 });
      })
      .catch((err) => {
        setStoredUser(false);
        Cookies.remove("user");
        console.error(err);
      });
  }, []);

  useEffect(() => {
    storedUser.theme === 2
      ? document.body.classList.add("dark")
      : document.body.classList.remove("dark");
  }, [storedUser.theme]);

  useEffect(() => {
    $("body").ripples({
      resolution: 512,
      dropRadius: 20,
      perturbance: 0.02,
    });

    // Créer un effet de pluie continue
    const rainInterval = setInterval(() => {
      const $el = $("body");
      const x = Math.random() * $el.outerWidth();
      const y = Math.random() * $el.outerHeight();
      const dropRadius = 20;
      const strength = 0.04 + Math.random() * 0.04;

      $el.ripples("drop", x, y, dropRadius, strength);
    }, 1500);

    // Nettoyer l'intervalle lorsque le composant est démonté
    return () => {
      clearInterval(rainInterval);
      $("body").ripples("destroy");
    };
  }, []);

  useEffect(() => {
    storedUser.theme === 2
      ? document.body.classList.add("light")
      : document.body.classList.remove("light");
  }, [storedUser.theme]);

  return (
    <>
      <Navbar key={storedUser.theme} />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
