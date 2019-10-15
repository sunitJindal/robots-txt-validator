const fetch = require('../utils/fetch');
const logger = require('../utils/logger');
const contentType = require('../constants/contentType');
const xmlSitemap = require('./xmlSitemap');

exports.parse = async (url) => {
  logger.log('fetching sitemap', url);
  const resp = await fetch.get(url);
  if ((resp.headers['content-type'] === contentType.XML)
    || (resp.headers['content-type'] === contentType.XML_APPLICATION)
    || (resp.headers['content-type'] === contentType.XML_APPLICATION_GZIP)) {
    const validatedData = await xmlSitemap.parse(resp.data);

    return { validatedData, url };
  }

  logger.error(`Unhandled content type[${resp.headers['content-type']}] for sitemap: ${url}`);
};
