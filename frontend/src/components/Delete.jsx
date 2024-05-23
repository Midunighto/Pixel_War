import React from "react";

import { success } from "../services/toast";

import Button from "./Button";

import "../styles/modals.scss";

export default function Delete({
  handleDelete,
  openModal,
  setOpenModal,
  additionalState,
  confirmationMessage,
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
