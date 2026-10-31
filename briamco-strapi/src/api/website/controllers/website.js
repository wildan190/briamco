function locale(ctx) { const value = ctx.query.locale || 'en'; if (!['en', 'id'].includes(value)) ctx.throw(400, 'Unsupported locale'); return value; }
const { contentStatus } = require('../../../utils/preview');
const attempts = new Map();
function imageUrl(ctx, media, fallback = '') {
  const url = media?.url || fallback;
  return url.startsWith('/') ? `${strapi.config.get('server.url') || ctx.origin}${url}` : url;
}
function articleCard(ctx, post) {
  const date = new Date(post.date || post.publishedAt);
  return {
    id: post.id, slug: post.slug, type: post.type || 'blog',
    badge: post.category || (post.type === 'news' ? 'News' : 'Blog'), author: post.author || 'BRIAMCO Editorial',
    title: post.title, excerpt: post.description || '', date: post.date || post.publishedAt,
    day: String(date.getUTCDate()).padStart(2, '0'), month: date.toLocaleString(locale(ctx) === 'id' ? 'id-ID' : 'en', { month: 'short', timeZone: 'UTC' }),
    img: imageUrl(ctx, post.cover, post.imageUrl), alt: post.imageAlt || post.title,
  };
}
function serviceCard(ctx, service) {
  return { slug: service.slug, title: service.title, group: service.group || 'Services',
    description: service.description || '', content: service.content || '',
    overviewTitle: service.overviewTitle || '', overviewLead: service.overviewLead || '',
    offerings: Array.isArray(service.offerings) ? service.offerings.filter(item => item && typeof item.title === 'string' && typeof item.description === 'string').map(item => ({title:item.title,description:item.description,bullets:Array.isArray(item.bullets)?item.bullets.filter(value=>typeof value === 'string'):[],content:typeof item.content === 'string'?item.content:''})) : [],
    features: Array.isArray(service.features) ? service.features.filter(item => typeof item === 'string') : [],
    imageUrl: imageUrl(ctx, service.image, service.imageUrl), imageAlt: service.imageAlt || service.title };
}
module.exports = {
  async content(ctx) {
    const rows = await strapi.documents('api::website-section.website-section').findMany({ status: contentStatus(ctx), locale: locale(ctx), limit: 100 });
    const data = Object.fromEntries(rows.map(row => [row.slug, row.content]));
    const articles = await strapi.documents('api::article.article').findMany({ status: contentStatus(ctx), locale: locale(ctx), sort: ['date:desc', 'createdAt:desc'], limit: 2, populate: ['cover'] });
    if (data.BlogSection) data.BlogSection = { ...data.BlogSection, articles: articles.map(post => articleCard(ctx, post)) };
    const items = await strapi.documents('api::navigation-item.navigation-item').findMany({status:contentStatus(ctx),sort:['order:asc','createdAt:asc'],limit:100});
    const validHref = href => typeof href === 'string' && /^\/(?!\/)/.test(href) && !/[\u0000-\u0020\\]/.test(href);
    if (data.NavBar) data.NavBar = {...data.NavBar, navLinks: items.filter(item=>item.visible && validHref(item.href)).map(item=>({label:locale(ctx)==='id' ? item.labelId || item.label : item.label, href:item.href, type:item.type || 'link'}))};
    const partners = await strapi.documents('api::business-partner.business-partner').findMany({status:contentStatus(ctx),filters:{visible:true},sort:['order:asc','name:asc'],populate:['logo'],limit:100});
    ctx.body = { data, partners: partners.map(partner=>({id:partner.documentId,name:partner.name,logoAlt:partner.logoAlt || partner.name,imageUrl:imageUrl(ctx,partner.logo,partner.imageUrl),website:/^https?:\/\//i.test(partner.website || '') ? partner.website : ''})) };
  },
  async services(ctx) {
    const services = await strapi.documents('api::service.service').findMany({ status: contentStatus(ctx), locale: locale(ctx), sort: ['order:asc', 'title:asc'], populate: ['image'], limit: 100 });
    ctx.body = { data: services.map(service => serviceCard(ctx, service)) };
  },
  async service(ctx) {
    const service = await strapi.documents('api::service.service').findFirst({ status: contentStatus(ctx), locale: locale(ctx), filters: { slug: ctx.params.slug }, populate: ['image'] });
    if (!service) return ctx.notFound('Service not found');
    ctx.body = { data: serviceCard(ctx, service) };
  },
  async insights(ctx) {
    const type = ctx.query.type;
    if (type && !['blog', 'news'].includes(type)) return ctx.badRequest('Invalid insight type');
    const page = Math.max(1, Math.min(10000, Number.parseInt(ctx.query.page, 10) || 1));
    const pageSize = 12;
    const filters = type ? { type } : {};
    const documents = strapi.documents('api::article.article');
    const [posts, total] = await Promise.all([
      documents.findMany({ status: contentStatus(ctx), locale: locale(ctx), filters, sort: ['date:desc', 'createdAt:desc'], populate: ['cover'], start: (page - 1) * pageSize, limit: pageSize }),
      documents.count({ status: contentStatus(ctx), locale: locale(ctx), filters }),
    ]);
    ctx.body = { data: posts.map(post => articleCard(ctx, post)), meta: { page, pageSize, total, pageCount: Math.ceil(total / pageSize) } };
  },
  async insight(ctx) {
    const type = ctx.query.type;
    if (type && !['blog', 'news'].includes(type)) return ctx.badRequest('Invalid insight type');
    const filters = { slug: ctx.params.slug, ...(type ? { type } : {}) };
    const post = await strapi.documents('api::article.article').findFirst({ status: contentStatus(ctx), locale: locale(ctx), filters, populate: ['cover'] });
    if (!post) return ctx.notFound('Insight not found');
    ctx.body = { data: { ...articleCard(ctx, post), content: post.content || '' } };
  },
  async people(ctx) {
    const rows=await strapi.documents('api::person.person').findMany({status:contentStatus(ctx),locale:locale(ctx),filters:{visible:true},sort:['order:asc','name:asc'],populate:['photo'],limit:500});
    ctx.body={data:rows.map(row=>({slug:row.slug,name:row.name,role:row.role||'',businessSegment:row.businessSegment||'',practiceAreas:Array.isArray(row.practiceAreas)?row.practiceAreas.filter(value=>typeof value==='string'):[],location:row.location||'',category:row.category||'team',bio:row.bio||'',imageUrl:imageUrl(ctx,row.photo,row.imageUrl)}))};
  },
  async careers(ctx) {
    const rows=await strapi.documents('api::career-position.career-position').findMany({locale:locale(ctx),status:contentStatus(ctx),filters:{visible:true},sort:['order:asc','title:asc'],limit:500});
    ctx.body={data:rows.map(row=>({slug:row.slug,title:row.title,department:row.department||'',location:row.location||'',employmentType:row.employmentType||'',description:row.description||'',applicationUrl:/^(https?:\/\/|mailto:)/i.test(row.applicationUrl||'')&&!/[\u0000-\u0020]/.test(row.applicationUrl)?row.applicationUrl:''}))};
  },
  async inquiry(ctx) {
    const now = Date.now();
    for (const [key, value] of attempts) if (value.until < now) attempts.delete(key);
    const ip = ctx.request.ip;
    const entry = attempts.get(ip) || { count: 0, until: now + 60000 };
    entry.count++; attempts.set(ip, entry);
    if (entry.count > 5) { ctx.status = 429; ctx.body = { error: 'Please try again later.' }; return; }
    const input = ctx.request.body?.data;
    if (!input || typeof input !== 'object') return ctx.badRequest('Invalid request');
    const data = {};
    for (const [key, max] of Object.entries({ name: 120, email: 254, subject: 200, message: 5000 })) {
      if (typeof input[key] !== 'string' || !input[key].trim() || input[key].length > max) return ctx.badRequest(`Invalid ${key}`);
      data[key] = input[key].trim();
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return ctx.badRequest('Invalid email');
    const saved = await strapi.documents('api::inquiry.inquiry').create({ data: { ...data, status: 'new' } });
    ctx.status = 201; ctx.body = { data: { received: true, reference: saved.documentId } };
  },
};
