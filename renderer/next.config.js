const path = require("path");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const withTM = require("next-transpile-modules")(["monaco-editor"]);

module.exports = withTM({
  webpack: (config, { isServer }) => {
    const rule = config.module.rules
      .find((rule) => rule.oneOf)
      .oneOf.find(
        (r) => r.issuer && r.issuer.include && r.issuer.include.includes("_app")
      );
    if (rule) {
      rule.issuer.include = [
        rule.issuer.include,
        /[\\/]node_modules[\\/]monaco-editor[\\/]/,
      ];
    }

    if (!isServer) {
      config.target = "electron-renderer";
    }
    config.node.__dirname = true;
    config.plugins.push(
      new MonacoWebpackPlugin({
        languages: ["javascript"],
        filename: "static/[name].worker.js",
      })
    );

    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  reactStrictMode: false,
});
