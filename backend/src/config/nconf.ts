import nconf from 'nconf';
import path from 'path';

nconf
  .argv()
  .env()
  .file({
    file: path.join(
      __dirname,
      '../../',
      process.env.NODE_ENV === 'test' ? 'config.test.json' : 'config.json'
    ),
  })
  .defaults({
    NODE_ENV: 'development',
  });

export default nconf;
