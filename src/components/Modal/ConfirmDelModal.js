import React from "react";
import ErrorNotification from "../Errors/ErrorNotification";
import Modal from "./Modal"
import { useDatabase } from "../../context/DatabaseContext";
import Loader from "react-loader-spinner";

const ConfirmDelModal = () => {
  const {
    deleteEntry,
    setDeleteEntry,
    remove,
    delError,
    setDelError,
    isBtnLoading,
  } = useDatabase();

  const cleanup = () => {
    setDeleteEntry("");
    if (delError) {
      setDelError(false);
    }
  };

  return (
    <Modal name="confirmation-modal" changeDisplay={cleanup} isLoading={isBtnLoading}>
        {isBtnLoading ? (
            <Loader type="ThreeDots" color="#f0a211" height={60} width={70} />
          ) : (
          <div>
            Are you sure you want to remove<span className="del-name"> {deleteEntry.name || deleteEntry.title} </span>from your calendar?
            {delError && <ErrorNotification/>}
          </div>
          )}
        <button onClick={remove}>Yes</button>
        <button onClick={cleanup}>No</button>
    </Modal>
  );
};

export default ConfirmDelModal;
