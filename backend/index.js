// require("dotenv").config();
const nconf = require('nconf');
const path = require('path');

// process.env.ROOT_PATH = __dirname;
nconf
  .argv()
  .env()
  .file({ file: path.resolve(__dirname, './config.json') });

if (nconf.get('NODE_ENV') === 'production' || nconf.get('NODE_ENV') === 'staging')
  require('./dist/index.js');
else require('./src/index.ts');
