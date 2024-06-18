const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    https: require.resolve('https-browserify'),
  };
  return config;
};
