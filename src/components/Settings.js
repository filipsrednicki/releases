import React, { useRef } from "react";

const Settings = () => {
  const emailRef = useRef();

  const handleEmailChange = (e) => {
    e.preventDefault();
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
    </div>
  );
};

export default Settings;
