const robots = require('./lib/robots');
const sitemap = require('./lib/sitemap');
const pugjs = require('pug');
const fs = require('fs');
const open = require('open');
module.exports = async (site) => {
  // @Todo validate site link
  const robotsData = await robots.parse(site);

  // console.log(JSON.stringify(robotsData));
  const sitemapsValidationData = [];
  for (const sitemapData of robotsData.sitemaps) {
    const validationData = await sitemap.parse(sitemapData.value);
    if (validationData) {
      sitemapsValidationData.push(validationData);
    }
  };

  console.log(JSON.stringify(sitemapsValidationData));

  const content = pugjs.renderFile('./lib/template/report.pug', {
    robots: robotsData,
    sitemaps: sitemapsValidationData,
  });
  fs.writeFile(
    "./reports/index.html", content, function(err) {
    if(err) {
        return console.log(err);
    }
    open('./reports/index.html', { app: 'google chrome' })
    console.log("The file was saved!");
    process.exit();
  });
};
