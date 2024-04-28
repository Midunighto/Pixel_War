import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useModal } from "../contexts/ModalContext";
import { useStoredUser } from "../contexts/UserContext";

import { error, success } from "../services/toast";
import Button from "./Button";

export default function Delete({ handleDelete }) {
  const { openModal, toggleModal } = useModal();
  const { storedUser } = useStoredUser();

  return (
    <div>
      {openModal && (
        <div className="modal">
          <div className="modal-content modal-account">
            <h1>Voulez-vous vraiment supprimer votre compte ? </h1>
            <small>⚠️ Attention, cette action est irréversible</small>
            <div className="button-row">
              <Button
                className="blob-btn-dark"
                type="button"
                onClick={() => {
                  toggleModal();
                  handleDelete(storedUser.id);
                  success(`Votre compte a été supprimé avec succès`);
                }}
              >
                Oui
              </Button>
              <Button
                className="blob-btn-light"
                type="button"
                onClick={toggleModal}
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
