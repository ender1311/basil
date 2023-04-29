const path = require("path");

module.exports = {
  // Other configuration settings...
  module: {
    rules: [
      // Other rules...
      {
        test: /\.js$/,
        include: /node_modules\/parse5/,
        enforce: "pre",
        use: ["source-map-loader"],
        exclude: [/node_modules\/parse5\/dist\/tree-adapters\/default.js.map/],
      },
      // Other rules...
    ],
  },
  resolve: {
    alias: {
      "http-proxy-agent$": path.resolve(
        __dirname,
        "node_modules/http-proxy-agent/dist/agent.js"
      ),
    },
    fallback: {
      net: false,
      tls: false,
      url: require.resolve("url/"),
    },
  },
  // Other configuration settings...
};
