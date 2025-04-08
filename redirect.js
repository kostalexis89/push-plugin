fetch("https://kostalexis89.github.io/push-plugin/asset-manifest.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load asset-manifest.json");
    }
    return response.json();
  })
  .then((manifest) => {
    const mainJsPath = manifest.files["main.js"];
    const runtimeMainJsPath = manifest.files["runtime-main.js"];
    const chunkJsPath = manifest.files["static/js/2.chunk.js"];

    if (mainJsPath) {
      const script = document.createElement("script");
      script.src = `https://kostalexis89.github.io/push-plugin${mainJsPath}`; // Fixing path
      script.defer = true;
      document.head.appendChild(script);
    } else {
      console.error("Main JS file not found in asset-manifest.json");
    }

    if (runtimeMainJsPath) {
      const script = document.createElement("script");
      script.src = `https://kostalexis89.github.io/push-plugin${runtimeMainJsPath}`; // Fixing path
      script.defer = true;
      document.head.appendChild(script);
    } else {
      console.error("Runtime main JS file not found in asset-manifest.json");
    }

    if (chunkJsPath) {
      const script = document.createElement("script");
      script.src = `https://kostalexis89.github.io/push-plugin${chunkJsPath}`; // Fixing path
      script.defer = true;
      document.head.appendChild(script);
    } else {
      console.error("Chunk JS file not found in asset-manifest.json");
    }
  })
  .catch((error) => console.error("Error loading asset-manifest.json", error));
