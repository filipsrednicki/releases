import React from "react";
import { createPortal } from "react-dom";
import useModal from "./useModal";

const Modal = ({ changeDisplay, name, closeButton, children }) => {
  useModal(changeDisplay);
  return createPortal(
    <div className="modal">
      <div className={name}>
        {closeButton && (
          <i className="fas fa-times close-btn" onClick={changeDisplay}></i>
        )}
        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;
