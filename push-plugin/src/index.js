import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./App.css";

const dummyData = {
  content: {
    "storyline-title": "Initial Title",
    "storyline-leadtext": "Initial Lead text",
  },
  pushConfig: {
    "api-url": "https://webpush-demo.ethinking.de/push-api/v3/",
    clientId: "test",
    applId: "2614",
    token: "Qcb9ZasLCTU0Oq9C6EnO2fNLDSAzXro2e",
  },
};

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

    const data = JSON.parse(
      this.getAttribute("data") || JSON.stringify(dummyData)
    );
    console.log(data);
    ReactDOM.render(<App data={data} />, mountPoint);

    this.rendered = true;
  }
}

customElements.define("push-plugin-web-component", PushPlugin);
