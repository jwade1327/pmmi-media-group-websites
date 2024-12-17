const { get } = require('@mindful-web/object-path');
const htmlSitemap = require('@mindful-web/marko-web-html-sitemap/routes');
const renderBlock = require('@mindful-web/marko-web-theme-monorail/routes/render-block');
const search = require('@mindful-web/marko-web-theme-monorail/routes/search');
const taxonomy = require('@mindful-web/marko-web-theme-monorail/routes/taxonomy');
const omedaNewsletters = require('@mindful-web/marko-web-omeda/routes/omeda-newsletters');
const magazine = require('@mindful-web/marko-web-theme-monorail-magazine/routes');
const mindfulPreview = require('@mindful-web/marko-web-theme-monorail/routes/ad-preview');
const getAdvertisingPostAsNativeStory = require('@mindful-web/mindful/marko-web/middleware/get-advertising-post-as-native-story');

const advertisingPostTemplate = require('../templates/content/advertising-post');
const feed = require('./feed');
const digitalEditionRedirects = require('./digital-edition-redirects');
const content = require('./content');
const scheduledContent = require('./scheduled-content');
const dynamicPage = require('./dynamic-page');

const printContent = require('./print-content');
const publicFiles = require('./public-files');
const redirects = require('./redirects');
const staticPage = require('./static-page');
const taxonomyCategory = require('./taxonomy-category');
const publication = require('../templates/magazine/publication');
const publicationFragment = require('../graphql/fragments/magazine-publication-page');

module.exports = (app, siteConfig) => {
  // Mindful Preview Link
  const namespace = get(siteConfig, 'mindful.namespace');
  if (namespace) {
    mindfulPreview(app, namespace);
    // Mindful/NativeX (Story rendering)
    getAdvertisingPostAsNativeStory(app, {
      route: '/sponsored/:section/:slug/:id',
      tenant: 'pmmi',
      template: advertisingPostTemplate,
    });
  }

  // Taxonomy category pages
  taxonomyCategory(app);

  // Feed
  feed(app);

  scheduledContent(app);

  // Magazine Routes
  magazine(app, { publication }, { publicationFragment });

  // Omeda newsletter signup
  omedaNewsletters(app);

  // Shared Print Content
  printContent(app);

  // Shared Public Files (e.g. ads.txt)
  publicFiles(app);

  // Redirects
  redirects(app);

  // Remote component/block loader
  renderBlock(app);

  // Taxonomy pages (for handling redirects from old WP sites)
  taxonomy(app);

  // Search routes
  search(app, siteConfig);

  // Static pages
  staticPage(app);

  // HTML Sitemap
  htmlSitemap(app);

  // dynamic pages /page/${alias}
  dynamicPage(app);

  content(app);

  // Programatic redirect for legacy digitial edition urls
  // old: "http://www.automationworld.com/sites/default/files/digital_edition/december2014/AW_December_2014_Optimized/index.html",
  // new: "https://digitaleditions.automationworld.com/december2014/AW_December_2014_Optimized/index.html",
  digitalEditionRedirects(app);
};
