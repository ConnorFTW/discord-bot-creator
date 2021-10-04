const path = require("path");
const withTM = require("next-transpile-modules")(["monaco-editor"]);

module.exports = withTM({
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = "electron-renderer";
    }
    config.node.__dirname = true;

    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  reactStrictMode: false,
});
