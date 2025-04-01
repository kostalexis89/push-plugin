import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./App.css";

class PushPlugin extends HTMLElement {
  constructor() {
    super();
    this.rendered = false;
  }

  async connectedCallback() {
    if (this.rendered) return;

    const BASE_URL = "https://kostalexis89.github.io/push-plugin";

    // Load CSS dynamically
    if (!document.querySelector("#push-plugin-styles")) {
      try {
        const manifestResponse = await fetch(`${BASE_URL}/asset-manifest.json`);
        const manifest = await manifestResponse.json();

        let cssFileName = manifest.files["main.css"];

        if (cssFileName.startsWith("/push-plugin/")) {
          cssFileName = cssFileName.replace("/push-plugin", ""); // Fix duplicated path
        }

        const link = document.createElement("link");
        link.id = "push-plugin-styles";
        link.rel = "stylesheet";
        link.href = `${BASE_URL}${cssFileName}`;
        document.head.appendChild(link);
      } catch (error) {
        console.error("Error loading asset-manifest.json:", error);
      }
    }

    // Create React mount point
    const mountPoint = document.createElement("div");
    this.appendChild(mountPoint);

    const content = this.getAttribute("content") || "";
    const uri = this.getAttribute("uri") || "";
    const pushConfig = JSON.parse(this.getAttribute("pushConfig") || "{}");

    ReactDOM.render(
      <App content={content} uri={uri} pushConfig={pushConfig} />,
      mountPoint
    );

    this.rendered = true;
  }
}

customElements.define("push-plugin-web-component", PushPlugin);
