const fetch = require('../utils/fetch');
const contentType = require('../constants/contentType');
const xmlSitemap = require('./xmlSitemap');

exports.parse = async (url) => {
  const resp = await fetch.get(url);
  if (resp.headers['content-type'] === contentType.XML) {
    const validatedData = await xmlSitemap.parse(resp.data);

    return { validatedData, url };
  }
  throw new Error('Unhandled content type for sitemap');
};
