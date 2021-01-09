import React, { useState } from "react";
import Modal from "./Modal/Modal";
import ErrorNotification from "./Errors/ErrorNotification";
import { useAuth } from "../context/AuthContext";
import Loader from "react-loader-spinner";

const ReAuth = ({ accountAction, setAccountAction, newEmail, newPassword }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reAuthError, setReAuthError] = useState(false);
  const [password, setPassword] = useState("");
  const {
    reAuthenticate,
    changePassword,
    changeEmail,
    deleteAccount,
    logOut
  } = useAuth();

  const handleReAuth = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setReAuthError(null);

    reAuthenticate(password)
      .then(() => {
        switch (accountAction) {
          case "delete":
            deleteAccount()
              .then(() => {
                logOut();
              })
              .catch((error) => {
                setIsLoading(false);
                setReAuthError(error.message);
              });
            break;
          case "changePassword":
            changePassword(newPassword)
              .then(() => {
                setIsLoading(false);
                setIsSuccess(true);
              })
              .catch((error) => {
                setIsLoading(false);
                setReAuthError(error.message);
              });
            break;
          case "changeEmail":
            changeEmail(newEmail)
              .then(() => {
                setIsLoading(false);
                setIsSuccess(true);
              })
              .catch((error) => {
                setIsLoading(false);
                setReAuthError(error.message);
              });
            break;
          default:
            break;
        }
      })
      .catch((error) => {
        if (error.code === "auth/wrong-password") {
          setReAuthError("Password incorrect. Please try again.");
        } else {
          setReAuthError(error.message);
        }
        setIsLoading(false);
      });
  };

  const cleanup = () => {
    setAccountAction(null);
    setReAuthError(null);
  };

  return (
    <div>
      <Modal name="form-container" changeDisplay={cleanup} closeButton={true}>
        <Loader
          type="ThreeDots"
          color="#f0a211"
          height={120}
          width={120}
          visible={isLoading}
        />
        {!isLoading && !isSuccess && (
          <form onSubmit={handleReAuth} className="re-auth">
            <h2>Confirm your password</h2>
            {accountAction === "delete" && (
              <span className="delete-warning">You're about to remove your account!</span>
            )}
            <p>In order to proceed, please enter your <strong>current</strong> password.</p>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength="6"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {reAuthError && <ErrorNotification content={reAuthError} />}
            <button type="submit" className="sign-btn">
              Confirm
            </button>
          </form>
        )}

        {isSuccess && (
          <div>
            <i
              style={{ fontSize: "5em", color: "#f0a211" }}
              className="fas fa-check"
            ></i>
            <h2>
              {accountAction === "changeEmail"
                ? "Your e-mail has been successfully changed to " + newEmail
                : accountAction === "changePassword"
                ? "Password change successful!"
                : "Account Removed!"}
            </h2>
            <button type="button" onClick={cleanup} className="sign-btn">
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReAuth;
