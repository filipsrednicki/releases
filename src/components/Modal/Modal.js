import React from "react";
import { createPortal } from "react-dom";
import useModal from "./useModal";

const Modal = ({ changeDisplay, name, closeButton, children, isLoading }) => {
  const hideModal = () => {
    if(!isLoading) {
      changeDisplay();
    }
  }
  useModal(hideModal);
  
  return createPortal(
    <div className="modal">
      <div className={name}>
        {closeButton && !isLoading && (
          <i className="fas fa-times close-btn" onClick={changeDisplay}></i>
        )}
        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;
