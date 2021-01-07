import React, { useRef, useState } from "react";
import Modal from "./Modal/Modal";
import ErrorNotification from "./Errors/ErrorNotification";
import { useAuth } from "../context/AuthContext";
import Loader from "react-loader-spinner";

const ReAuth = ({ accountAction, setAccountAction, newEmail, newPassword }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reAuthError, setReAuthError] = useState(false);
  const {
    reAuthenticate,
    changePassword,
    changeEmail,
    deleteAccount,
    logOut
  } = useAuth();
  const passwordRef = useRef();

  const handleReAuth = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setReAuthError(null);

    reAuthenticate(passwordRef.current.value)
      .then(() => {
        console.log("success");
        switch (accountAction) {
          case "delete":
            deleteAccount()
              .then(() => {
                console.log("success");
                logOut();
              })
              .catch((error) => {
                setIsLoading(false);
                setReAuthError(error.message);
                console.log(error);
              });
            break;
          case "changePassword":
            changePassword(newPassword)
              .then(() => {
                setIsLoading(false);
                setIsSuccess(true);
                console.log("success");
              })
              .catch((error) => {
                setIsLoading(false);
                setReAuthError(error.message);
                console.log(error);
              });
            break;
          case "changeEmail":
            changeEmail(newEmail)
              .then(() => {
                setIsLoading(false);
                setIsSuccess(true);
                console.log("success");
              })
              .catch((error) => {
                setIsLoading(false);
                setReAuthError(error.message);
                console.log(error);
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
          <form onSubmit={handleReAuth}>
            <h2>Confirm your password</h2>
            {accountAction === "delete" && (
              <span>You're about to remove your account!</span>
            )}
            <p>In order to proceed, please enter your current password.</p>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength="6"
              placeholder="Password"
              ref={passwordRef}
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
