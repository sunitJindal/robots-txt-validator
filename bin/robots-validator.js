const { argv } = require('yargs');

const validator = require('../');


(async () => {
  const site = argv._[0];
  if (!site) {
    throw new Error('domain is required');
  }
  await validator(site);
})();
