/* eslint-disable no-unused-expressions */
import $ from "jquery";
import "jquery.ripples";

import { Outlet } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

import { useStoredUser } from "./contexts/UserContext";
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import Footer from "./components/Footer";

import "./styles/root.scss";

function App() {
  const { storedUser, setStoredUser } = useStoredUser();

  const [isLoading, setIsLoading] = useState(true);
  const defaultTheme = 1;
  const theme = storedUser ? storedUser.theme : defaultTheme;

  useEffect(() => {
    const fetchUser = async () => {
      if (storedUser !== false) {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/protected`,
            {
              withCredentials: true,
            }
          );

          const { id, pseudo, theme, email, isAdmin } = res.data;
          const userData = { id, pseudo, theme, email, isAdmin };

          setStoredUser(userData);
        } catch (err) {
          setStoredUser(false);
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    theme === 2
      ? document.body.classList.add("light")
      : document.body.classList.remove("light");
  }, [theme]);

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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar key={theme} theme={theme} defaultTheme={defaultTheme} />
      <Outlet theme={theme} defaultTheme={defaultTheme} />
      <Footer />
    </>
  );
}

export default App;
