const Xml2js = require('xml2js');
const fetch = require('../../utils/fetch');
const logger = require('../../utils/logger');

const sitemapIndexLogger = logger.createLogger('sitemapIndex');
const urlsetLogger = logger.createLogger('urlset');

const parser = new Xml2js.Parser();

const sitemapType = {
  INDEX: 'sitemapindex',
  URLSET: 'urlset',
};

const fetchSitemap = async (url) => fetch.get(url);

const validateSitemapLink = async (url) => {
  try {
    logger.log(url);
    const resp = await fetch.head(url);

    return {
      url,
      contentType: resp.headers['content-type'],
      status: resp.status,
    };
  } catch (e) {
    logger.error(e.message);
    return {
      url,
      contentType: e.response.headers['content-type'],
      status: e.response.status,
    };
  }
};

const getDetailsFromUrlset = (data) => {
  urlsetLogger('parsing');
  // console.log(data);
  try {
    const parsedInfo = {
      linkCount: data.urlset.url.length,
    };

    return parsedInfo;
  } catch (e) {
    return {
      linkCount: 0,
    };
  }
};

const transformXmlToJson = async (xmlContent) => parser.parseStringPromise(xmlContent);

const parseSitemapIndex = async (data) => {
  const validatedInfo = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const sitemap of data.sitemap) {
    // eslint-disable-next-line no-await-in-loop
    const vi = await validateSitemapLink(sitemap.loc[0]);

    if (vi) {
      sitemapIndexLogger('fetching', vi.url);
      // eslint-disable-next-line no-await-in-loop
      const xmlChildSitemap = await fetchSitemap(vi.url);
      sitemapIndexLogger('fetched');

      sitemapIndexLogger('parsing');
      // eslint-disable-next-line no-await-in-loop
      const jsonChildSitemap = await transformXmlToJson(xmlChildSitemap.data);

      const parsedChildSitemap = getDetailsFromUrlset(jsonChildSitemap);
      vi.linkCount = parsedChildSitemap.linkCount;

      validatedInfo.push(vi);
    }
  }

  return validatedInfo;
};

const parseUrlset = async (data, url, type) => {
  const validatedInfo = [];
  const vi = {
    url,
    contentType: type,
    status: 200,
  };
  const parsedChildSitemap = getDetailsFromUrlset(data);
  vi.linkCount = parsedChildSitemap.linkCount;

  validatedInfo.push(vi);

  return validatedInfo;
};

const parse = async ({ xmlContent, url, type }) => {
  const transformedContent = await transformXmlToJson(xmlContent);

  // console.log(transformedContent);
  let sitemapLinks = [];

  if (transformedContent[sitemapType.INDEX]) {
    sitemapLinks = await parseSitemapIndex(transformedContent[sitemapType.INDEX]);
  } else if (transformedContent[sitemapType.URLSET]) {
    sitemapLinks = await parseUrlset(transformedContent, url, type);
  }

  return sitemapLinks;
};

exports.parse = parse;
