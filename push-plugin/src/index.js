import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

class PushPlugin extends HTMLElement {
  constructor() {
    super();
    this.rendered = false; // Flag to track if the component has been rendered
  }

  connectedCallback() {
    if (this.rendered) return; // Avoid re-rendering if already rendered

    // Create a div for mounting React
    const mountPoint = document.createElement("div");
    this.appendChild(mountPoint); // Append directly to the custom element (light DOM)

    // Get props from attributes
    const content = this.getAttribute("content") || "";
    const uri = this.getAttribute("uri") || "";
    const tags = JSON.parse(this.getAttribute("tags") || "[]");

    // Render the React component
    ReactDOM.render(
      <App content={content} uri={uri} tags={tags} />,
      mountPoint
    );

    this.rendered = true; // Set the flag to true once rendered
  }
}

// Define the web component
customElements.define("push-plugin-web-component", PushPlugin);
