import React, { useState, useEffect } from "react";

const App = ({ content, uri, tags }) => {
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("Content:", content);
    console.log("URI:", uri);
    console.log("Tags from StiboX:", tags);
  }, [content, uri, tags]);

  const addTag = (event) => {
    const tag = event.target.value;
    if (tag && !selectedTags.has(tag)) {
      setSelectedTags(new Set([...selectedTags, tag]));
    }
  };

  const removeTag = (tag) => {
    const newTags = new Set(selectedTags);
    newTags.delete(tag);
    setSelectedTags(newTags);
  };

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
    <div style={{ padding: "10px", fontFamily: "Arial", width: "100%" }}>
      <h2>Push Plugin</h2>
      {content && (
        <pre style={{ background: "#f4f4f4", padding: "10px" }}>{content}</pre>
      )}
      {uri && (
        <p>
          <strong>Article URI:</strong> {uri}
        </p>
      )}

      <label>Find Tags</label>
      <select onChange={addTag} style={{ width: "100%", padding: "5px" }}>
        <option value="">Select a tag</option>
        {tags?.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      <div>
        {[...selectedTags].map((tag) => (
          <span
            key={tag}
            style={{
              margin: "5px",
              padding: "5px",
              background: "#ddd",
              borderRadius: "5px",
            }}
          >
            {tag} <button onClick={() => removeTag(tag)}>x</button>
          </span>
        ))}
      </div>

      <label>Push Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", padding: "5px" }}
      />

      <label>Push Message</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "100%", padding: "5px" }}
      />

      <button
        onClick={sendPush}
        style={{
          marginTop: "10px",
          padding: "8px 16px",
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Send Push
      </button>
    </div>
  );
};

export default App;
