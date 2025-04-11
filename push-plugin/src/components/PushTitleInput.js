import React from "react";

const PushTitleInput = ({ title, setTitle }) => {
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
          fontFamily: "inherit",
          fontSize: "14px",
          lineHeight: "1.5",
          fontWeight: "200", // Normal font weight
        }}
        onFocus={(e) => (e.target.style.borderColor = "#09ab00")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />
    </div>
  );
};

export default PushTitleInput;
