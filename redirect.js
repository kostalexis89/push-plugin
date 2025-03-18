fetch("./asset-manifest.json")
  .then((response) => response.json())
  .then((manifest) => {
    // Find the correct JS file
    const mainJsPath =
      manifest.files["main.js"] ||
      Object.values(manifest.files).find((file) => file.endsWith(".js"));

    if (mainJsPath) {
      const script = document.createElement("script");
      script.src = mainJsPath.startsWith("/") ? mainJsPath : `/${mainJsPath}`;
      script.defer = true;
      document.head.appendChild(script);
    } else {
      console.error("Main JS file not found in asset-manifest.json");
    }
  })
  .catch((error) => console.error("Error loading asset-manifest.json", error));
