const configureIdentityX = require('@pmmi-media-group/package-global/config/identity-x');

module.exports = configureIdentityX({
  booleanQuestionsLabel: 'Elige tus suscripciones: ',
  appId: process.env.IDENTITYX_APP_ID || '5e28a4c858e67b86c955ae4d',
});
