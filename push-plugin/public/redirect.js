fetch("ttps://kostalexis89.github.io/push-plugin/asset-manifest.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((manifest) => {
    const mainJsPath =
      manifest.files["main.js"] ||
      Object.values(manifest.files).find((file) => file.endsWith(".js"));

    if (mainJsPath) {
      const script = document.createElement("script");
      script.src = `https://your-username.github.io/repo-name${mainJsPath}`;
      script.defer = true;
      document.head.appendChild(script);
    } else {
      console.error("Main JS file not found in asset-manifest.json");
    }
  })
  .catch((error) => console.error("Error loading asset-manifest.json", error));
