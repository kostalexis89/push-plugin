fetch("https://kostalexis89.github.io/push-plugin/asset-manifest.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load asset-manifest.json");
    }
    return response.json();
  })
  .then((manifest) => {
    const mainJsPath = manifest.files["main.js"];

    if (mainJsPath) {
      const script = document.createElement("script");
      script.src = `https://kostalexis89.github.io/push-plugin${mainJsPath}`; // Fixing path
      script.defer = true;
      document.head.appendChild(script);
    } else {
      console.error("Main JS file not found in asset-manifest.json");
    }
  })
  .catch((error) => console.error("Error loading asset-manifest.json", error));
