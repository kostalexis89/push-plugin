fetch("./asset-manifest.json")
  .then((response) => response.json())
  .then((manifest) => {
    const script = document.createElement("script");
    script.src = manifest.files["main.js"];
    script.defer = true;
    document.head.appendChild(script);
  });
