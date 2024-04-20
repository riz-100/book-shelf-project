import React from "react";

const MessageBox = ({ message, handleHideMessage, className = "" }) => {
  return (
    <p className={className}>
      {message}{" "}
      <button className="hide-message-button" onClick={handleHideMessage}>
        X
      </button>
    </p>
  );
};

export default MessageBox;
