const { get } = require('@mindful-web/object-path');

const cookieName = 'enlPrompted';
const newsletterState = ({ setCookie = true } = {}) => (req, res, next) => {
  const hasCookie = Boolean(get(req, `cookies.${cookieName}`));
  const utmMedium = get(req, 'query.utm_medium');
  const olyEncId = get(req, 'query.oly_enc_id');
  const disabled = get(req, 'query.newsletterDisabled');
  const fromEmail = utmMedium === 'email' || olyEncId || false;
  const initiallyExpanded = (setCookie === true) && !(hasCookie || fromEmail || disabled);

  // Expire in 14 days (2yr if already signed up)
  const days = fromEmail ? 365 * 2 : 14;
  const maxAge = days * 24 * 60 * 60 * 1000;

  if (initiallyExpanded) {
    res.cookie(cookieName, true, { maxAge });
  }

  res.locals.newsletterState = {
    hasCookie,
    fromEmail,
    disabled,
    initiallyExpanded,
    cookie: { name: cookieName, maxAge },
  };
  next();
};

const formatContentResponse = ({ res, content }) => {
  if (!res.locals.newsletterState) return;
  const {
    initiallyExpanded,
    hasCookie,
    fromEmail,
    disabled,
    cookie,
  } = res.locals.newsletterState;

  if (get(content, 'userRegistration.isCurrentlyRequired') === true) {
    res.locals.newsletterState.initiallyExpanded = false;
  } else if (!initiallyExpanded && !hasCookie && !disabled && !fromEmail) {
    res.cookie(cookie.name, true, { maxAge: cookie.maxAge });
    res.locals.newsletterState.initiallyExpanded = true;
  }
};

module.exports = {
  newsletterState,
  formatContentResponse,
};
