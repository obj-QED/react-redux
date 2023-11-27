const rewirePostcss = require('react-app-rewire-postcss');

module.exports = function override(config, env) {
  config = rewirePostcss(config, env);
  return config;
};
