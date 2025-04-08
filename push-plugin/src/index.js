import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./App.css";

const dummyData = {
  payload: {
    "storyline-title": "Initial Title",
    "storyline-leadtext": "Initial Lead text",
  },
  pushConfig: {
    "api-url": "https://webpush-demo.ethinking.de/push-admin-api/v3/",
    clientId: "test",
    applId: "2614",
    token: "Qcb9ZasLCTU0Oq9C6EnO2fNLDSAzXro2e",
  },
};

class PushPlugin extends HTMLElement {
  constructor() {
    super();
    this.rendered = false;
    this.mountPoint = null; // Add this to store the mount point
  }

  static get observedAttributes() {
    return ["data"]; // Observe the 'data' attribute
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "data" && oldValue !== newValue) {
      this.handleDataChange(JSON.parse(newValue)); // Handle the updated data
    }
  }

  handleDataChange(data) {
    console.log("Updated data received:", data);
    if (this.mountPoint) {
      // Re-render React app with new data
      ReactDOM.render(<App data={data} />, this.mountPoint);
    }
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

    // Store mount point reference
    this.mountPoint = document.createElement("div");
    this.appendChild(this.mountPoint);

    const data = JSON.parse(
      this.getAttribute("data") || JSON.stringify(dummyData)
    );
    ReactDOM.render(<App data={data} />, this.mountPoint);

    this.rendered = true;
  }
}

if (!customElements.get("push-plugin-web-component")) {
  customElements.define("push-plugin-web-component", PushPlugin);
}
