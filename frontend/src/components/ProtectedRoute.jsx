import axios from "axios";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { error } from "../services/toast";

function ProtectedRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/protected`, {
        withCredentials: true,
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
