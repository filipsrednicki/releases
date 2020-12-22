import React from "react";

const ErrorNotification = ({ errMsg, content }) => {

  return (
    <div className="alert">
      {content ? (
        <div className="error-msg">{content}</div>
      ) : (
        <div className="error-msg">
          <h3>Ooops!</h3>
          <span>Something went wrong. Please try again later.</span>
          {errMsg && <p>Error message: {errMsg}</p>}
        </div>
      )}
    </div>
  );
};

export default ErrorNotification;
