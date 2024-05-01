import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./contexts/UserContext";
import { ModalProvider } from "./contexts/ModalContext";

import App from "./App";
import Home from "./pages/Home";
import Error from "./pages/Error";

import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./pages/SignUp";
import Account from "./pages/Account";
import Grid from "./pages/Grid";
import CommunityGrids from "./pages/CommunityGrids";
import MyGrids from "./pages/MyGrids";
import Admin from "./pages/Admin";
import Terms from "./pages/Terms";

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/grid/:id",
        element: <Grid />,
      },
      {
        path: "/community-grids",
        element: <CommunityGrids />,
      },
      {
        path: "/terms",
        element: <Terms />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/account",
            element: <Account />,
          },
          {
            path: "/my-grids",
            element: <MyGrids />,
          },
          {
            path: "/29119510",
            element: <Admin />,
          },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <UserProvider>
    <ModalProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </ModalProvider>
  </UserProvider>
);
