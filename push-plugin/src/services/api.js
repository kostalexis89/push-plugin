export const fetchTags = async (config) => {
  const response = await fetch(`${config["api-url"]}${config.clientId}/tags`, {
    method: "GET",
    headers: { Authorization: `Bearer ${config.token}` },
  });
  return response.json();
};

export const sendPush = async (payload) => {
  const response = await fetch("https://example.com/push", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response.ok;
};
