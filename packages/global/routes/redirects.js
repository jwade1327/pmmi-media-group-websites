const { asyncRoute } = require('@mindful-web/utils');
const { websiteSection: loader } = require('@mindful-web/web-common/page-loaders');

module.exports = (app) => {
  app.get('/:alias(contact-us|about-us|contact-our-staff)', (req, res) => {
    res.redirect(301, '/page/contact-us');
  });
  app.get('/:alias(feed)', (req, res) => {
    res.redirect(301, '/__rss/website-scheduled-content.xml?input=%7B"sectionAlias"%3A"home"%7D');
  });
  app.get('/rss', (_, res) => {
    res.redirect(301, '/__rss/all-published-content.xml');
  });
  app.get('/rss/:sectionAlias([a-z0-9-/]+)', asyncRoute(async (req, res) => {
    const { apollo, params } = req;
    const cleanedAlias = params.sectionAlias.replace(/\/+$/, '').replace(/^\/+/, '');
    const section = await loader(apollo, { alias: cleanedAlias });
    if (section) {
      params.sectionAlias = section.alias;
      res.redirect(301, `/__rss/website-scheduled-content.xml?input=${encodeURIComponent(JSON.stringify(params))}`);
    }
  }));
};
