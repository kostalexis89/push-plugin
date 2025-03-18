// import React from "react";
// import ReactDOM from "react-dom";
// import App from "./App";

// // Create a custom web component class
// class PushPlugin extends HTMLElement {
//   constructor() {
//     super();
//     this.attachShadow({ mode: "open" }); // Shadow DOM for isolation
//   }

//   connectedCallback() {
//     // Create a div element where we will mount the React component
//     const mountPoint = document.createElement("div");
//     this.shadowRoot.appendChild(mountPoint);

//     // Get props from attributes (or default to empty values)
//     const content = this.getAttribute("content") || "";
//     const uri = this.getAttribute("uri") || "";
//     const tags = JSON.parse(this.getAttribute("tags") || "[]");

//     // Render the React component inside the div
//     ReactDOM.render(
//       <App content={content} uri={uri} tags={tags} />,
//       mountPoint
//     );
//   }
// }

// // Define the custom element (web component)
// customElements.define("push-plugin", PushPlugin);
import React from "react";
import ReactDOM from "react-dom/client";

class PushPlugin extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement("div");
    this.appendChild(mountPoint);
    const root = ReactDOM.createRoot(mountPoint);
    root.render(<h1>Hello from Push Plugin!</h1>);
  }
}

// Define the web component
customElements.define("push-plugin", PushPlugin);
