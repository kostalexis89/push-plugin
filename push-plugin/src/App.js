import React, { useState, useEffect, useCallback } from "react";
import MultiSelect from "./components/MultiSelect.js";
import SendPush from "./components/SendPush.js";
import PushTitleInput from "./components/PushTitleInput";
import PushMessageInput from "./components/PushMessageInput";
import "./App.css";
import { fetchTags, sendPush } from "./services/api.js";

const App = ({ data }) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [tags, setTags] = useState([]);
  const [showTagValidation, setShowTagValidation] = useState(false);
  const [hasAttemptedToSubmit, setHasAttemptedToSubmit] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTitle(data?.payload.title || "");
    setMessage(data?.payload.message || "");
  }, [data]);

  useEffect(() => {
    const loadTags = async () => {
      try {
        setIsLoading(true);
        const tagsData = await fetchTags(data?.pushConfig);
        setTags(tagsData);
      } catch (err) {
        setError("Failed to load tags");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (data?.pushConfig) {
      loadTags();
    }
  }, [data?.pushConfig]);

  const handleTagSelect = useCallback(() => {
    if (hasAttemptedToSubmit) {
      setShowTagValidation(selectedTags.length === 0);
    }
  }, [hasAttemptedToSubmit, selectedTags.length]);

  const handleSendPush = useCallback(async () => {
    try {
      setHasAttemptedToSubmit(true);
      if (selectedTags.length === 0) {
        setShowTagValidation(true);
        return;
      }
      setShowTagValidation(false);
      setIsLoading(true);

      const success = await sendPush({
        title,
        message,
        tags: Array.from(selectedTags),
      });

      if (success) {
        alert("Push sent successfully!");
      } else {
        throw new Error("Failed to send push");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [title, message, selectedTags]);

  useEffect(() => {
    if (hasAttemptedToSubmit) {
      setShowTagValidation(selectedTags.length === 0);
    }
  }, [selectedTags, hasAttemptedToSubmit]);

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      {isLoading ? (
        <div>Loading tags...</div>
      ) : (
        <>
          <MultiSelect
            data={tags}
            setSelectedItems={setSelectedTags}
            selectedItems={selectedTags}
            showValidation={showTagValidation}
            onSelect={handleTagSelect}
          />
          <PushTitleInput title={title} setTitle={setTitle} />
          <PushMessageInput message={message} setMessage={setMessage} />
          <SendPush
            published={data.payload?.url !== null}
            selectedTags={selectedTags}
            onSend={handleSendPush}
          />
        </>
      )}
    </div>
  );
};

export default App;
