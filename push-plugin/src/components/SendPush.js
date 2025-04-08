import React from "react";

const SendPush = ({
  title,
  setTitle,
  message,
  setMessage,
  selectedTags,
  onSend,
}) => {
  return (
    <div>
      <label htmlFor="pushTitle">Push Title</label>
      <input
        id="pushTitle"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          resize: "none",
          outline: "none",
          boxSizing: "border-box",
          marginTop: "5px",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#09ab00")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />

      <label htmlFor="pushMessage">Push Message</label>
      <textarea
        id="pushMessage"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          height: "60px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          resize: "none",
          outline: "none",
          boxSizing: "border-box",
          marginTop: "5px",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#09ab00")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "10px",
        }}
      >
        <button
          onClick={onSend}
          style={{
            padding: "6px 24px",
            background: selectedTags.size > 0 ? "black" : "#ccc",
            color: "white",
            border: "none",
            cursor: selectedTags.size > 0 ? "pointer" : "not-allowed",
            fontSize: "14px",
          }}
          disabled={selectedTags.size === 0}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default SendPush;
