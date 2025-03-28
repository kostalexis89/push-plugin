import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./App.css";

const dummyTags = [
  "Breaking News",
  "Sports",
  "Technology",
  "Entertainment",
  "Health",
  "Science",
  "Politics",
  "Finance",
  "Travel",
  "Food",
  "Gaming",
  "Weather",
  "Education",
  "Movies",
  "Music",
];

class PushPlugin extends HTMLElement {
  constructor() {
    super();
    this.rendered = false;
    this.attachShadow({ mode: "open" }); // Use Shadow DOM
  }

  connectedCallback() {
    if (this.rendered) return;

    // Create a mount point inside Shadow DOM
    const mountPoint = document.createElement("div");
    this.shadowRoot.appendChild(mountPoint);

    // Inject styles inside Shadow DOM
    const style = document.createElement("style");
    style.textContent = `
     .input-with-placeholder::placeholder {
  padding: 8px!important;
}
    `;
    this.shadowRoot.appendChild(style);

    // Get props from attributes
    const content = this.getAttribute("content") || "";
    const uri = this.getAttribute("uri") || "";
    const pushConfig = JSON.parse(this.getAttribute("pushConfig") || "{}");

    ReactDOM.render(
      <App
        content={content}
        uri={uri}
        tags={dummyTags}
        pushConfig={pushConfig}
      />,
      mountPoint
    );

    this.rendered = true;
  }
}

customElements.define("push-plugin-web-component", PushPlugin);
