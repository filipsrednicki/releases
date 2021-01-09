import React, { useRef, useState } from "react";
import ReAuth from "./ReAuth"
import ErrorNotification from "./Errors/ErrorNotification";

const Settings = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountAction, setAccountAction] = useState(null);
  const [diffPasswords, setDiffPasswords] = useState(false)

  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPassRef = useRef();

  const handleEmailChange = (e) => {
    e.preventDefault();
    setAccountAction("changeEmail");
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if(password !== confirmPassword) {
      return setDiffPasswords(true)
    }
    setAccountAction("changePassword");
  };

  const arePasswordsMatching = () => {
    if (passwordRef.current.value === confirmPassRef.current.value || !confirmPassRef.current.value) {
      confirmPassRef.current.style.boxShadow = "";
      setDiffPasswords(false);
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
      <h1>Settings</h1>
      <form onSubmit={handleEmailChange}>
        <h2>Change your e-mail</h2>
        <div>
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
        </div>
      </form>

      <form onSubmit={handlePasswordChange}>
        <h2>Change your password</h2>
        <div>
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
          {diffPasswords && 
            <ErrorNotification content="Passwords do not match!" />
          }
          <button type="submit">Change password</button>
        </div>
      </form>

      <div className="del-account-container">
        <h2>Delete your account</h2>
        <div>
          <p>Deleting the account will result in losing all data tied to it.</p>
          <button onClick={() => setAccountAction("delete")}>Delete account</button>
        </div>
      </div>    

      {accountAction && (
          <ReAuth 
            accountAction={accountAction} 
            setAccountAction={setAccountAction} 
            newEmail={emailRef.current.value}
            newPassword={passwordRef.current.value}
          />
      )}
    </div>
  );
};

export default Settings;
