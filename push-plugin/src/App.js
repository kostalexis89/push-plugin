import React, { useState, useEffect } from "react";
import MultiSelect from "./components/MultiSelect.js";
import "./App.css";

const App = ({ data }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    setTitle(data?.content["storyline-title"] || "");
    setMessage(data?.content["storyline-leadtext"] || "");
  }, [data]);

  console.log(title);

  useEffect(() => {
    console.log("Fetching tags...");
    fetch(
      `${data?.pushConfig["api-url"]}${data?.pushConfig.clientId}/tags/${data?.pushConfig.applId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${data?.pushConfig.token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setTags(data);
      });
  }, [data?.pushConfig]);

  const sendPush = () => {
    if (selectedTags.size === 0) {
      alert("Select at least one tag.");
      return;
    }

    const payload = {
      title,
      message,
      tags: Array.from(selectedTags),
    };

    console.log("Sending payload:", payload);

    fetch("https://example.com/push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => (res.ok ? alert("Push sent!") : alert("Failed!")))
      .catch((err) => alert(err.message));
  };

  return (
    <div>
      <MultiSelect
        data={tags}
        setSelectedItems={setSelectedTags}
        selectedItems={selectedTags}
      />

      <label
        htmlFor="pushTitle"
        style={{ fontWeight: "bold", fontSize: "14px" }}
      >
        Push Title
      </label>
      <input
        id="pushTitle"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          padding: "8px", // Changed from "8px 0" to "8px"
          marginBottom: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          resize: "none",
          outline: "none",
          boxSizing: "border-box", // Add this to match MultiSelect
        }}
        onFocus={(e) => (e.target.style.borderColor = "#555")}
        onBlur={(e) => (e.target.style.borderColor = "#ccc")}
      />

      <label
        htmlFor="pushMessage"
        style={{ fontWeight: "bold", fontSize: "14px" }}
      >
        Push Message
      </label>
      <textarea
        id="pushMessage"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{
          width: "100%",
          padding: "8px", // Changed from "8px 0" to "8px"
          height: "60px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          resize: "none",
          outline: "none",
          boxSizing: "border-box", // Add this to match MultiSelect
        }}
        onFocus={(e) => (e.target.style.borderColor = "#555")}
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
          onClick={sendPush}
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

export default App;
