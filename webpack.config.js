const path = require('path');

module.exports = {
  resolve: {
    alias: {
      'http-proxy-agent$': path.resolve(__dirname, 'node_modules/http-proxy-agent/dist/agent.js'),
    },
    fallback: {
      'net': false,
      'tls': false,
      'url': require.resolve('url/'),
    },
  },
};
