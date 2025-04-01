import React, { useState, useEffect } from "react";
import MultiSelect from "./components/MultiSelect.js";
import "./App.css";

const App = ({ content, uri, tags, pushConfig }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [tags2, setTags2] = useState([]);

  useEffect(() => {
    if (typeof content === "string") {
      try {
        setParsedData(JSON.parse(content));
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    } else {
      setParsedData(content);
    }
  }, [content]);

  console.log(parsedData);
  console.log(pushConfig);

  useEffect(() => {
    fetch(
      `${pushConfig["api-url"]}${pushConfig.clientId}/tags/${pushConfig.applId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${pushConfig.token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setTags2(data);
      });
  }, [pushConfig]);

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
        data={[
          {
            name: "default",
            tags: [
              { id: 2532, name: "Breaking news - DE" },
              { id: 2534, name: "Big Story - DE" },
              { id: 2542, name: "Sport - DE" },
              { id: 147, name: "Suggestions TV" },
              { id: 2544, name: "Breaking news - FR" },
            ],
          },
          {
            name: "browser",
            id: 110,
            tags: [
              { id: 112, name: "Sports" },
              { id: 113, name: "Empfehlungen der Redaktion" },
              { id: 124, name: "Big Story" },
              { id: 125, name: "Demnächst im Kino" },
              { id: 126, name: "TV-Tipp" },
              { id: 127, name: "Kolumne am Mittag" },
              { id: 128, name: "Monatshoroskop" },
              { id: 164, name: "Sprachpfleger" },
              { id: 165, name: "Bötschi fragt" },
              { id: 111, name: "Breaking News" },
            ],
            groups: [],
          },
          {
            name: "tag group 1",
            id: 2690,
            sourceId: "tag group sr 1",
            tags: [],
            groups: [
              {
                name: "tag group 2 updated 1",
                id: 2691,
                sourceId: "tag group sr 2  updated 1",
                tags: [],
                groups: [],
              },
              {
                name: "tag group 2 updated 1",
                id: 2692,
                sourceId: "tag group sr 2  updated 1",
                tags: [],
                groups: [],
              },
            ],
          },
        ]}
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
          padding: "8px 0",
          marginBottom: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          resize: "none",
          outline: "none",
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
          padding: "8px 0",
          height: "60px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          resize: "none",
          outline: "none",
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
