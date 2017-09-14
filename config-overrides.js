const rewireEslint = require('./rewires/eslint');
const rewireSc = require('react-app-rewire-styled-components');

module.exports = function override(config, env) {
  rewireEslint(config);
  rewireSc(config, env, {
    displayName: true
    //preprocess: true // this suppose to minify and precompile CSS, but it doesn't work for now
  });
  return config;
};
