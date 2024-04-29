import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useStoredUser } from "../contexts/UserContext";
import { useModal } from "../contexts/ModalContext";

import "../styles/nav.scss";
import Button from "./Button";
import logotxt from "../assets/text-logo-white.png";
import account from "../assets/profile.png";

export default function Navbar() {
  const navigate = useNavigate();
  const { storedUser } = useStoredUser();
  const { openModal, toggleModal } = useModal();

  const [navScrollClass, setNavScrollClass] = useState("");
  const [navHeight, setNavHeight] = useState("70px");
  const [navBg, setNavBg] = useState("#38304866");
  const location = useLocation();
  const isGridPage = /\/grid\/.*/.test(location.pathname);

  const listenScrollEvent = () => {
    if (window.scrollY > 100) {
      setNavScrollClass("scrolled");
    } else {
      setNavScrollClass("");
    }
    if (window.scrollY > 100) {
      setNavHeight("70px");
      setNavBg("transparent");
    } else {
      setNavHeight("5rem");
      setNavBg("#38304866");
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", listenScrollEvent);
    return () => {
      window.removeEventListener("scroll", listenScrollEvent);
    };
  }, []);

  return (
    <div
      className={`nav-bg ${navScrollClass} ${isGridPage ? "scrolled " : ""}`}
      style={{ height: navHeight, transition: "all 1s" }}
    >
      <nav
        style={{
          backgroundColor: isGridPage ? "transparent" : navBg,
          transition: "all 1s",
        }}
      >
        <ul className="nav-left">
          <li>
            <Link to="/">
              <img
                src={storedUser.theme === 2 ? null : logotxt}
                alt="Home"
                width={150}
              />
            </Link>
          </li>
          <li id="nav-grids">
            <Link to="/community-grids">Grilles de la communauté</Link>
          </li>
          <li>
            <Link to="/my-grids">{storedUser ? "Mes grilles" : null}</Link>
          </li>
        </ul>
        <div className="nav-right">
          <Button
            className="signin-btn"
            type="button"
            onClick={storedUser ? () => navigate("/account") : toggleModal}
          >
            {storedUser ? (
              <img
                src={storedUser.theme === 2 ? null : account}
                alt="account logo"
                width={20}
              />
            ) : (
              "Se connecter"
            )}
          </Button>
        </div>
      </nav>
    </div>
  );
}
