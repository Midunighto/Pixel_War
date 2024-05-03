import axios from "axios";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { error } from "../services/toast";

function ProtectedRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/protected`, {
        withCredentials: true, // Send the request with credentials
      })
      .then((response) => {
        const token = response.headers.authorization.split(" ")[1];

        Cookies.set("user", token);
      })
      .catch((err) => {
        navigate("/signin", { replace: true });
        error("Une erreur est survenue, merci de vous reconnecter");
        console.error(err);
      });
  }, []);

  return <Outlet />;
}

export default ProtectedRoute;
