import React from "react";

const PushMessageInput = ({ message, setMessage }) => {
  return (
    <div>
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
          fontFamily: "inherit",
          fontSize: "14px",
          lineHeight: "1.5",
          fontWeight: "200",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#09ab00")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />
    </div>
  );
};

export default PushMessageInput;
