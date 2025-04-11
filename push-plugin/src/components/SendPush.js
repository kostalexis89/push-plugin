import React from "react";

const SendPush = ({ selectedTags, onSend, published }) => {
  const handleClick = (e) => {
    if (!published) {
      e.preventDefault();
      return;
    }
    onSend(e);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "10px",
      }}
    >
      <button
        onClick={handleClick}
        style={{
          padding: "6px 24px",
          background: published ? "#09ab00" : "#ccc",
          color: "white",
          border: "none",
          cursor: published ? "pointer" : "not-allowed",
          fontSize: "14px",
          borderRadius: "5px",
        }}
        disabled={!published}
      >
        Send
      </button>
    </div>
  );
};

export default SendPush;
