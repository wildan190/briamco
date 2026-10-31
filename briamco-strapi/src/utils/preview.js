const { createHmac, timingSafeEqual } = require('node:crypto');
const secret = () => strapi.config.get('admin.auth.secret');
const signature = payload => createHmac('sha256', secret()).update(payload).digest('base64url');
function createPreviewToken(status) {
  const payload = Buffer.from(JSON.stringify({ status, expires: Date.now() + 30 * 60 * 1000 })).toString('base64url');
  return `${payload}.${signature(payload)}`;
}
function contentStatus(ctx) {
  const token = ctx.query.preview;
  if (!token) return 'published';
  try {
    if (typeof token !== 'string' || token.length > 1000) throw new Error();
    const [payload, supplied, extra] = token.split('.');
    const expected = signature(payload);
    if (extra || !supplied || supplied.length !== expected.length || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) throw new Error();
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (data.expires < Date.now() || !['draft', 'published'].includes(data.status)) throw new Error();
    ctx.set('Cache-Control', 'private, no-store');
    return data.status;
  } catch { ctx.throw(401, 'Preview expired or invalid. Open Preview again from Strapi.'); }
}
module.exports = { createPreviewToken, contentStatus };
