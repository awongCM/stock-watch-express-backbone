'use strict';

const yamlLoader = require('js-yaml'),
      fs = require('fs');

let config = {};

try {
  config = yamlLoader.safeLoad(fs.readFileSync('_config.yml', 'utf8'));
  
  const indentedJson = JSON.stringify(config, null, 4);
  console.log(indentedJson);

} catch (error) {
  console.log(error);
}

// end load server config settings
module.exports = config;