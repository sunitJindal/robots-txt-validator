#!/usr/bin/env node

const { argv } = require('yargs');

const validator = require('../dist');


(async () => {
  const site = argv._[0];
  if (!site) {
    throw new Error('domain is required');
  }
  await validator(site);
})();
