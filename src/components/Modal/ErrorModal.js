import React from "react";
import Modal from "./Modal";
import { useDatabase } from "../../context/DatabaseContext";

const ErrorModal = () => {
  const { errorModal, setErrorModal } = useDatabase();

  return (
    <Modal
      name="error-msg"
      changeDisplay={() => setErrorModal(null)}
      closeButton={true}
    >
      <h3>Ooops!</h3>
      <span>Something went wrong. Please try again later.</span>
      {errorModal && <p>Error message: {errorModal}</p>}
    </Modal>
  );
};

export default ErrorModal;
