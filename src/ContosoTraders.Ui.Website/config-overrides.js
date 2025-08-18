const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve = config.resolve || {};
  config.resolve.fallback = {
    ...(config.resolve.fallback || {}),
    crypto: require.resolve('crypto-browserify'),
    os: require.resolve("os-browserify/browser"),
    path: require.resolve('path-browserify'),
    stream: require.resolve('stream-browserify')
  };
  return config;
};