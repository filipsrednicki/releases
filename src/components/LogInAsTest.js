import React, { useState } from "react";
import ErrorNotification from "./Errors/ErrorNotification";
import Loader from "react-loader-spinner";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDatabase } from "../context/DatabaseContext";
import Modal from "./Modal/Modal";

const LogInAsTest = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logIn, user } = useAuth();
  const { getList, setIsListLoading } = useDatabase();
  const history = useHistory();

  const logInTest = () => {
    setLoading(true);
    logIn("test@test.com", "test123")
      .then(() => {
        setIsListLoading(true);
        getList(user);
        setLoading(false);
        history.push("/calendar");
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <>
      <div className="btn-test-login" onClick={logInTest}>
        Log In with Test Account
      </div>
      {(isLoading || error) && (
        <Modal
          name="login-test"
          isLoading={isLoading}
          closeButton={true}
          changeDisplay={() => setError(null)}
        >
          <Loader
            type="ThreeDots"
            color="#f0a211"
            height={120}
            width={120}
            visible={isLoading}
          />
          {error && <ErrorNotification errMsg={error} />}
        </Modal>
      )}
    </>
  );
};

export default LogInAsTest;
