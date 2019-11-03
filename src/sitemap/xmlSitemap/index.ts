const Xml2js = require('xml2js');
import * as fetch from '../../utils/fetch';
import * as logger from '../../utils/logger';

const sitemapIndexLogger = logger.createLogger('sitemapIndex');
const urlsetLogger = logger.createLogger('urlset');

const parser = new Xml2js.Parser();

const sitemapType = {
  INDEX: 'sitemapindex',
  URLSET: 'urlset',
};

const fetchSitemap = async (url: string) => fetch.get(url);

const validateSitemapLink = async (url: string) => {
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

const getDetailsFromUrlset = (urlset: sitemap.Urlset) => {
  urlsetLogger('parsing');
  // console.log(data);
  try {
    const parsedInfo = {
      linkCount: urlset.url.length,
    };

    return parsedInfo;
  } catch (e) {
    return {
      linkCount: 0,
    };
  }
};

const transformXmlToJson = async (xmlContent: string) => parser.parseStringPromise(xmlContent);

const parseSitemapIndex = async (data: sitemap.IndexList): Promise<sitemap.ValidatedInfo[]> => {
  const validatedInfo = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const sitemap of data) {
    // eslint-disable-next-line no-await-in-loop
    const vi: sitemap.ValidatedInfo = await validateSitemapLink(sitemap.loc[0]);

    if (vi) {
      sitemapIndexLogger('fetching', vi.url);
      // eslint-disable-next-line no-await-in-loop
      const xmlChildSitemap = await fetchSitemap(vi.url);
      sitemapIndexLogger('fetched');

      sitemapIndexLogger('parsing');
      // eslint-disable-next-line no-await-in-loop
      const jsonChildSitemap = await transformXmlToJson(xmlChildSitemap.data);

      const parsedChildSitemap = getDetailsFromUrlset(jsonChildSitemap.urlset);
      vi.linkCount = parsedChildSitemap.linkCount;

      validatedInfo.push(vi);
    }
  }

  return validatedInfo;
};

const parseUrlset = async (urlset: sitemap.Urlset, url: string, type: ContentType) : Promise<sitemap.ValidatedInfo[]> => {
  const validatedInfo = [];
  const parsedChildSitemap = getDetailsFromUrlset(urlset);

  const vi = {
    url,
    contentType: type,
    status: 200,
    linkCount: parsedChildSitemap.linkCount,
  };

  validatedInfo.push(vi);

  return validatedInfo;
};

const parse = async ({ xmlContent, url, type }: { xmlContent: string, url: string, type: ContentType }): Promise<sitemap.ValidatedInfo[]> => {
  const transformedContent = await transformXmlToJson(xmlContent);

  // console.log(transformedContent);
  let sitemapLinks: sitemap.ValidatedInfo[] = [];

  if (transformedContent[sitemapType.INDEX]) {
    sitemapLinks = await parseSitemapIndex(transformedContent[sitemapType.INDEX].sitemap);
  } else if (transformedContent[sitemapType.URLSET]) {
    sitemapLinks = await parseUrlset(transformedContent.urlset, url, type);
  }

  return sitemapLinks;
};

export { parse };
