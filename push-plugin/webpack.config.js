const path = require("path");

module.exports = {
  entry: "./src/index.js", // Your entry point
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"), // Adjust this if needed
  },
  module: {
    rules: [
      // Add a rule to handle CSS files
      {
        test: /\.css$/, // This will match any .css file
        use: [
          "style-loader", // Injects styles into the DOM
          "css-loader", // Resolves CSS imports
        ],
      },
      // Add rules for JSX (if you're using Babel, for example)
      {
        test: /\.js$/, // Handle JS files (React JSX)
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".css"], // Ensure it resolves .css files
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
  },
};
