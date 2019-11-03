import { get } from '../utils/fetch';
import * as logger from '../utils/logger';
import * as contentType from '../constants/contentType';
import * as xmlSitemap from './xmlSitemap';

exports.parse = async (url: string) => {
  logger.log('fetching sitemap', url);
  const resp = await get(url);
  const trimmedContentType = resp.headers['content-type'].replace(' ', '');
  if ((trimmedContentType === contentType.XML)
    || (trimmedContentType === contentType.XML_UTF8)
    || (trimmedContentType === contentType.XML_APPLICATION)
    || (trimmedContentType === contentType.XML_APPLICATION_GZIP)) {
    const validatedData = await xmlSitemap.parse({ xmlContent: resp.data, url, type: resp.headers['content-type'] });

    return { validatedData, url };
  }
  logger.error(`Unhandled content type[${contentType}] for sitemap: ${url}`);

  return undefined;
};
