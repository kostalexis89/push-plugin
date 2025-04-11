import React, { useState, useEffect } from "react";
import MultiSelect from "./components/MultiSelect.js";
import SendPush from "./components/SendPush.js";
import PushTitleInput from "./components/PushTitleInput";
import PushMessageInput from "./components/PushMessageInput";
import "./App.css";

const App = ({ data }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [tags, setTags] = useState([]);
  const [showTagValidation, setShowTagValidation] = useState(false);
  const [hasAttemptedToSubmit, setHasAttemptedToSubmit] = useState(false);

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
    setHasAttemptedToSubmit(true);
    if (selectedTags.length === 0) {
      setShowTagValidation(true);
      return;
    }
    setShowTagValidation(false);

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

  useEffect(() => {
    if (hasAttemptedToSubmit) {
      setShowTagValidation(selectedTags.length === 0);
    }
  }, [selectedTags, hasAttemptedToSubmit]);

  return (
    <div>
      <MultiSelect
        data={tags}
        setSelectedItems={setSelectedTags}
        selectedItems={selectedTags}
        showValidation={showTagValidation}
        onSelect={() => {
          if (hasAttemptedToSubmit && selectedTags.length === 0) {
            setShowTagValidation(true);
          } else {
            setShowTagValidation(false);
          }
        }}
      />
      <PushTitleInput title={title} setTitle={setTitle} />
      <PushMessageInput message={message} setMessage={setMessage} />
      <SendPush
        published={data.payload?.url !== null}
        selectedTags={selectedTags}
        onSend={handleSendPush}
      />
    </div>
  );
};

export default App;
