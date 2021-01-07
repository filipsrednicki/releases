import React, { useRef, useState } from "react";

const Settings = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPassRef = useRef();

  const handleEmailChange = (e) => {
    e.preventDefault();
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
  };

  const arePasswordsMatching = () => {
    if (passwordRef.current.value === confirmPassRef.current.value || !confirmPassRef.current.value) {
      confirmPassRef.current.style.boxShadow = "";
    } else {
      confirmPassRef.current.style.boxShadow = "0 0 5px 3px red";
    }
  }

  const onPasswordInputChange = (e) => {
    setPassword(e.target.value);
    arePasswordsMatching()
  };

  const onConfirmPasswordInputChange = (e) => {
    setConfirmPassword(e.target.value);
    arePasswordsMatching()
  };

  return (
    <div className="settings">
      <form onSubmit={handleEmailChange}>
        <h2>Change your e-mail</h2>
        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="E-mail"
          ref={emailRef}
        />
        <button type="submit">Change e-mail</button>
      </form>

      <form onSubmit={handlePasswordChange}>
        <h2>Change your password</h2>
        <label htmlFor="password">New Password</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          minLength="6"
          placeholder="Password"
          value={password}
          onChange={onPasswordInputChange}
          ref={passwordRef}
        />
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          type="password"
          id="confirm-password"
          name="password"
          required
          minLength="6"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={onConfirmPasswordInputChange}
          ref={confirmPassRef}
        />
        <button type="submit">Change password</button>
      </form>
    </div>
  );
};

export default Settings;
