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
          fontFamily: "inherit", // This ensures it inherits the font from its parent
          fontSize: "14px", // Match the input font size
          lineHeight: "1.5", // Add line height for better readability
          fontWeight: "200", // Normal font weight
        }}
        onFocus={(e) => (e.target.style.borderColor = "#09ab00")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />
    </div>
  );
};

export default PushMessageInput;
