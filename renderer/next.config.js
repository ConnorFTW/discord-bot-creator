const path = require("path");
const removeImports = require("next-remove-imports")();

module.exports = removeImports({
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
  experimental: { esmExternals: true },
});
