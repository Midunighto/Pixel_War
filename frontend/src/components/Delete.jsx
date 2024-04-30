import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useModal } from "../contexts/ModalContext";
import { useStoredUser } from "../contexts/UserContext";

import { error, success } from "../services/toast";

import Button from "./Button";

import "../styles/modals.scss";

export default function Delete({
  handleDelete,
  openModal,
  setOpenModal,
  additionalState,
}) {
  const confirmDelete = async () => {
    await handleDelete();
    success(successMessage);
    setOpenModal(false);
  };

  return (
    <div className="page">
      {openModal && (
        <div className="modal">
          <div className="modal-content modal-account ">
            <h1>{confirmationMessage}</h1>
            <small>⚠️ Attention, cette action est irréversible</small>
            <div className="button-row">
              <Button
                className="blob-btn-dark"
                type="button"
                onClick={confirmDelete}
              >
                Oui
              </Button>
              <Button
                className="blob-btn-light"
                type="button"
                onClick={() => {
                  setOpenModal(false);
                  additionalState(null);
                }}
              >
                Non
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
