import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useStoredUser } from "../contexts/UserContext";
import { useModal } from "../contexts/ModalContext";
import { Spin as Hamburger } from "hamburger-react";

import "../styles/nav.scss";

import Button from "./Button";
import logotxt from "../assets/text-logo-white.png";
import logotxtblack from "../assets/text-logo-black.webp";
import account from "../assets/profile.png";
import accountblack from "../assets/profile-black.svg";
import SignIn from "./SignIn";

export default function Navbar({ theme, defaultTheme }) {
  const navigate = useNavigate();
  const { storedUser } = useStoredUser();
  const { openModal, toggleModal } = useModal();

  const [navScrollClass, setNavScrollClass] = useState("");
  const [navHeight, setNavHeight] = useState("70px");
  const [navBg, setNavBg] = useState("#38304866");
  const [isOpen, setIsOpen] = useState(false);
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

  /* mobile */
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // Nettoyer l'écouteur d'événements lorsque le composant est démonté
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
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
          {windowWidth < 768 ? (
            <>
              <Link to="/">
                <img
                  src={theme === 2 ? logotxtblack : logotxt}
                  alt="Home"
                  width={150}
                />
              </Link>
              <Hamburger
                rounded
                toggled={isOpen}
                toggle={setIsOpen}
                className="menu"
                style={{ zIndex: 1000 }}
              />
              {isOpen && (
                <ul className="burger">
                  <li id="nav-grids">
                    <Link to="/community-grids">Grilles de la communauté</Link>
                  </li>
                  <li>
                    <Link to="/my-grids">
                      {storedUser ? "Mes grilles" : null}
                    </Link>
                  </li>
                  <li>
                    <Button
                      className="signin-btn"
                      type="button"
                      onClick={
                        storedUser ? () => navigate("/account") : toggleModal
                      }
                    >
                      {storedUser ? "Mon compte" : "Se connecter"}
                    </Button>
                  </li>
                </ul>
              )}
            </>
          ) : (
            <>
              <ul className="nav-left">
                <li>
                  <Link to="/">
                    <img
                      src={theme === 2 ? logotxtblack : logotxt}
                      alt="Home"
                      width={150}
                    />
                  </Link>
                </li>
                <li id="nav-grids">
                  <Link to="/community-grids">Grilles de la communauté</Link>
                </li>
                <li>
                  <Link to="/my-grids">
                    {storedUser ? "Mes grilles" : null}
                  </Link>
                </li>
              </ul>
              <div className="nav-right">
                <Button
                  className="signin-btn"
                  type="button"
                  onClick={
                    storedUser ? () => navigate("/account") : toggleModal
                  }
                >
                  {storedUser ? (
                    <img
                      src={theme === 2 ? accountblack : account}
                      alt="account logo"
                      width={20}
                    />
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </div>
            </>
          )}
        </nav>
      </div>
      {openModal && <SignIn />}
    </>
  );
}
