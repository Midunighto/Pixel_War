import { createContext, useState, useContext, useMemo } from "react";
import PropTypes from "prop-types";

const ModalContext = createContext();
export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }) {
  const [openModal, setOpenModal] = useState(false);

  const value = useMemo(
    () => ({
      openModal,
      toggleModal: () => setOpenModal(!openModal),
    }),
    [openModal]
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

ModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
