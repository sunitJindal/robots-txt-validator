const debug = require('debug');

const error = debug('error');
const log = debug('log');

exports.error = error;
exports.log = log;

exports.createLogger = debug;
