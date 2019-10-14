const pugjs = require('pug');
const fs = require('fs');
const open = require('open');
const path = require('path');

const logger = require('./lib/utils/logger');
const robots = require('./lib/robots');
const sitemap = require('./lib/sitemap');

const cwd = __dirname;

module.exports = async (site) => {
  // @Todo validate site link
  const robotsData = await robots.parse(site);
  logger.log(JSON.stringify(robotsData));
  const sitemapsValidationData = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const sitemapData of robotsData.sitemaps) {
    // eslint-disable-next-line no-await-in-loop
    const validationData = await sitemap.parse(sitemapData.value);
    if (validationData) {
      sitemapsValidationData.push(validationData);
    }
  }

  // console.log(JSON.stringify(sitemapsValidationData));

  const content = pugjs.renderFile(
    path.resolve(cwd, './lib/template/report.pug'),
    {
      robots: robotsData,
      sitemaps: sitemapsValidationData,
    },
  );
  const dir = './reports';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const reportPath = `./${dir}/index.html`;
  fs.writeFile(
    reportPath, content, (err) => {
      if (err) {
        return console.error(err);
      }
      open(reportPath, { app: 'google chrome' });
      logger.log(`The file was saved @ ${path.resolve(process.cwd(), dir)}`);
      process.exit();
    },
  );
};
