import React, { useState, useRef, useEffect } from "react";
import ErrorNotification from "./Errors/ErrorNotification";
import Modal from "./Modal/Modal"
import Loader from "react-loader-spinner";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDatabase } from "../context/DatabaseContext";

const Authentication = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const { signUp, logIn, user, authMode, setAuthMode } = useAuth();
  const { getList, setIsListLoading } = useDatabase();
  const email = useRef();
  const passwordRef = useRef();
  const confirmPassRef = useRef();
  const history = useHistory();

  useEffect(() => {
    setError(null);
    email.current.focus();
  }, [authMode]);

  const arePasswordsMatching = () => {
    if (passwordRef.current.value === confirmPassRef.current.value || !confirmPassRef.current.value) {
      confirmPassRef.current.style.boxShadow = "";
    } else {
      confirmPassRef.current.style.boxShadow = "0 0 5px 3px red";
    }
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if(authMode === "login") {
      return
    }
    arePasswordsMatching()
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    arePasswordsMatching()
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (authMode === "signup" && password !== confirmPassword) {
      return setError("Passwords don't match!");
    }

    const getErrorMsg = (code) => {
      switch (code) {
        case "auth/wrong-password":
          setError("The password is invalid.")
          break;
        case "auth/invalid-email":
          setError("The email address is invalid.")
          break;
        case "auth/user-not-found":
          setError("There is no user with that email address.")
          break;
        case "auth/email-already-in-use":
          setError("This username is unavailable.")
          break;
        default:
          setError("An unknown error occurred.")
          break;
      }
    }

    setLoading(true);
    setError(null);
    setIsListLoading(false);

    if (authMode === "login") {
      logIn(email.current.value, password).then((res) => {
        setIsListLoading(true);
        getList(user);
        setLoading(false);
        setAuthMode("");
        history.push("/calendar");
      })
      .catch(error => {
        getErrorMsg(error.code)
        setLoading(false);
      })
    } else {
      signUp(email.current.value, password).then((res) => {
        setLoading(false);
        setAuthMode("");
        history.push("/calendar");
      })
      .catch(error => {
        getErrorMsg(error.code)
        setLoading(false);
      })
    }

    email.current = "";
    setPassword("");
    setConfirmPassword("")
  }

  return (
    <Modal name="form-container" changeDisplay={() => setAuthMode("")} closeButton={true} isLoading={isLoading}>
      <Loader
        type="ThreeDots"
        color="#f0a211"
        height={120}
        width={120}
        visible={isLoading}
      />
      {!isLoading && (
        <form onSubmit={handleSubmit.bind(this)}>
          <h2>
            {authMode === "login" ? "Log In to the website" : "Join today"}
          </h2>
          <div className="auth-mode-btns">
            <span
              className={authMode === "login" ? "active-auth-mode" : ""}
              onClick={() => setAuthMode("login")}
            >
              Log In
            </span>
            <span
              className={authMode === "signup" ? "active-auth-mode" : ""}
              onClick={() => setAuthMode("signup")}
            >
              Sign Up
            </span>
          </div>
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="E-mail"
            ref={email}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            minLength="6"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            ref={passwordRef}
          />
          {authMode === "signup" && (
            <>
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                name="password"
                required
                minLength="6"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                ref={confirmPassRef}
              />
            </>
          )}
          {error && <ErrorNotification content={error}/>}
          <button type="submit" className="sign-btn">
            {authMode === "login" ? "Log In" : "Sign Up"}
          </button>
        </form>
      )}
    </Modal>
  );
};

export default Authentication;
