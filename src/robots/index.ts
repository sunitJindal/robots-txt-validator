import { get } from '../utils/fetch';
import parser from './parser';
import * as validator from './validator';

const RULE_GROUP_KEYS = {
  USER_AGENT: 'user-agent',
  ALLOW_RULE: 'allow',
  DISALLOW: 'disallow',
  SITEMAP: 'sitemap',
};

const getSitemaps = (tokenized: robots.TupleList): robots.Sitemap[] => {
  const sitemaps: robots.Sitemap[] = [];

  tokenized.forEach((t) => {
    if (t.key === RULE_GROUP_KEYS.SITEMAP) {
      sitemaps.push({ value: t.value });
    }
  });

  return sitemaps;
};

exports.parse = async (domain: string) => {
  const resp = await get(`${domain}/robots.txt`);
  // const resp = {
  //   data: `User-agent: *
  //   Allow: /

  //   Disallow: /search/
  //   Disallow: /blog/
  //   Disallow: /nykaa-professional

  //   Sitemap: http://www.nykaaman.com/media/sitemap/sitemap-index.xml

  //   Sitemap: https://www.nykaa.com/media/sitemap/image_sitemap/sitemap-image.xml`,
  // };
  const tokenized = parser(resp.data);
  const sitemaps = getSitemaps(tokenized);
  const validationData = {
    sitemap: await validator.sitemap(sitemaps, domain),
  };
  const data = {
    original: resp.data,
    tokenized,
    sitemaps,
    validationData,
  };

  return data;
};
