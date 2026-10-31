module.exports = { routes: [
  { method: 'GET', path: '/website-people', handler: 'website.people', config: { auth: false } },
  { method: 'GET', path: '/website-careers', handler: 'website.careers', config: { auth: false } },
  { method: 'GET', path: '/website-content', handler: 'website.content', config: { auth: false } },
  { method: 'GET', path: '/website-services', handler: 'website.services', config: { auth: false } },
  { method: 'GET', path: '/website-services/:slug', handler: 'website.service', config: { auth: false } },
  { method: 'GET', path: '/website-insights', handler: 'website.insights', config: { auth: false } },
  { method: 'GET', path: '/website-insights/:slug', handler: 'website.insight', config: { auth: false } },
  { method: 'POST', path: '/website-inquiries', handler: 'website.inquiry', config: { auth: false } },
] };
