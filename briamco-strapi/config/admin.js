const { createPreviewToken } = require('../src/utils/preview');
module.exports = ({ env }) => ({
  ...(env('PUBLIC_URL') ? { url: '/admin' } : {}),
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  preview: {
    enabled: true,
    config: {
      allowedOrigins: [env('CLIENT_URL', 'http://127.0.0.1:5173'), 'http://localhost:5173'],
      async handler(uid, { documentId, status = 'draft', locale }) {
        const supported = ['api::article.article', 'api::service.service', 'api::website-section.website-section', 'api::business-partner.business-partner', 'api::career-position.career-position', 'api::person.person'];
        if (!supported.includes(uid)) return null;
        const document = await strapi.documents(uid).findOne({ documentId, status, ...(locale ? { locale } : {}) });
        if (!document) return null;
        let pathname = '/';
        if(uid==='api::person.person') pathname=document.slug?`/people/${encodeURIComponent(document.slug)}`:'/people';
        if(uid==='api::career-position.career-position') pathname=document.slug?`/careers/${encodeURIComponent(document.slug)}`:'/careers';
        if (uid === 'api::article.article') pathname = document.slug ? `/insight/${document.type === 'news' ? 'news' : 'blog'}/${encodeURIComponent(document.slug)}` : '/insight';
        if (uid === 'api::service.service') pathname = document.slug ? `/services/${encodeURIComponent(document.slug)}` : '/services';
        if (uid === 'api::website-section.website-section') pathname = ({ PeoplePage: '/people', CareersPage: '/careers', AboutSection: '/about', ServicesSection: '/services', SolutionsSection: '/solutions', BlogSection: '/insight', ContactSection: '/contact' })[document.slug] || '/';
        const url = new URL(pathname, env('CLIENT_URL', 'http://127.0.0.1:5173'));
        url.searchParams.set('lang', locale === 'id' ? 'id' : 'en');
        url.searchParams.set('preview', createPreviewToken(status));
        return url.href;
      },
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
