import React, { useState, useEffect } from "react";
import MultiSelect from "./components/MultiSelect.js";
import SendPush from "./components/SendPush.js";
import "./App.css";

const App = ({ data }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    setTitle(data?.payload.title || "");
    setMessage(data?.payload.message || "");
  }, [data]);

  useEffect(() => {
    fetch(`${data?.pushConfig["api-url"]}${data?.pushConfig.clientId}/tags`, {
      method: "GET",
      headers: { Authorization: `Bearer ${data?.pushConfig.token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setTags(data);
      });
  }, [data?.pushConfig]);

  const handleSendPush = () => {
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
      <SendPush
        title={title}
        setTitle={setTitle}
        message={message}
        setMessage={setMessage}
        selectedTags={selectedTags}
        onSend={handleSendPush}
      />
    </div>
  );
};

export default App;
