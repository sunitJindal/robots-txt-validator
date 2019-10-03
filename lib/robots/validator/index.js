// sitemapExists
const fetch = require('../../utils/fetch');

exports.sitemap = async (sitemaps = [], domain) => {
  const reports = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const s of sitemaps) {
    const report = { validDomain: true, ...s };
    if (s.value.indexOf(domain) !== 0) {
      report.validDomain = false;
    }
    try {
      // eslint-disable-next-line no-await-in-loop
      const fetchSitemap = await fetch.get(s.value);
      report.reachable = fetchSitemap.status;
    } catch (e) {
      report.reachable = e.response.status;
    }

    reports.push(report);
  }
  return reports;
};
