const sectionsId = require('./sections.id.json');
const sectionsEn = require('./sections.json');
const translations = require('./translations.id.json');
const tr = text => translations[text] || text;
module.exports = {
  async prepare(strapi) {
    const locales = strapi.plugin('i18n').service('locales');
    for (const [code, name] of [['en', 'English (en)'], ['id', 'Indonesian (id)']]) {
      if (!await locales.findByCode(code)) await locales.create({ code, name });
    }
    // Existing content was English before localization was enabled.
    for (const table of ['website_sections', 'services', 'articles']) {
      await strapi.db.connection(table).whereNull('locale').update({ locale: 'en' });
    }
  },
  async seed(strapi) {
    const menu = strapi.documents('api::navigation-item.navigation-item');
    const nav = await strapi.documents('api::website-section.website-section').findFirst({locale:'en', filters:{slug:'NavBar'}});
    // One-time migration of the former anchor menu into real page links.
    const legacyRoutes = {'#home':'/','#about':'/about','#services':'/services','#solutions':'/solutions','#blog':'/insight','#contact':'/contact'};
    for (const old of await menu.findMany({limit:100})) {
      if (legacyRoutes[old.href]) {
        const href = legacyRoutes[old.href];
        const label = old.href === '#blog' ? 'Insight' : old.label;
        await menu.update({documentId:old.documentId,data:{key:href,href,label,labelId:tr(label),type:href==='/services'?'services':'link'},status:'published'});
      } else if (old.href === '#testimonials') {
        await menu.update({documentId:old.documentId,data:{visible:false},status:'published'});
      }
    }
    const links = nav?.content?.navLinks?.every(item=>item.href?.startsWith('/')) ? nav.content.navLinks : sectionsEn.NavBar.navLinks;
    const store = strapi.store({type:'core',name:'briamco'});
    const initialized = await store.get({key:'navigation-seeded'});
    for (const [order, item] of (initialized ? [] : links).entries()) {
      const key = item.href;
      if (!await menu.findFirst({filters:{key}})) await menu.create({data:{key,label:item.label,labelId:tr(item.label),href:item.href,type:item.type || (item.href === '/services' ? 'services' : 'link'),order,visible:true},status:'published'});
    }
    if (!initialized) await store.set({key:'navigation-seeded',value:true});
    for (const name of ['website-section', 'service', 'article']) {
      const uid = `api::${name}.${name}`;
      const documents = strapi.documents(uid);
      const rows = await documents.findMany({locale:'en', status:'published',limit:100});
      for (const row of rows) {
        const existing = await documents.findOne({documentId:row.documentId,locale:'id'});
        if (existing) {
          if (name === 'website-section' && row.slug === 'TrustedBySection' && existing.content?.text1 === 'Focused on') await documents.update({documentId:row.documentId,locale:'id',data:{content:{...existing.content,text1:'Berfokus pada',text2:'bisnis',text3:'prioritas & tim pimpinan'}},status:'published'});
          continue;
        }
        let data;
        if (name === 'website-section') {
          data = {title:row.title,slug:row.slug,content:sectionsId[row.slug] || row.content};
        } else if (name === 'service') {
          const translated = sectionsId.ServicesSection.tabs.flatMap(tab=>tab.services.map(item=>({...item,group:tab.name}))).find(item=>item.title===tr(row.title));
          const description = translated?.desc || row.description;
          const features = (row.features || []).map(tr);
          data = {title:tr(row.title),slug:row.slug,group:tr(row.group),description,features,imageUrl:row.imageUrl,imageAlt:tr(row.imageAlt),order:row.order,
            content:`## Memahami prioritas Anda\n\n${description}\n\n## Dari penilaian menuju pelaksanaan\n\nKami mulai dengan memahami konteks bisnis, kebutuhan pemangku kepentingan, dan hasil yang ingin Anda capai. Bersama-sama, kami menetapkan prioritas dan menyusun peta jalan praktis dengan tanggung jawab yang jelas.\n\n## Cakupan pendampingan\n\n${features.map(feature=>'- '+feature).join('\n')}\n\n## Diskusikan langkah berikutnya\n\nHubungi BRIAMCO untuk membahas lingkup, tujuan, dan bagaimana layanan ini dapat mendukung organisasi Anda.`};
        } else {
          const isNews = row.type === 'news';
          const description = isNews ? 'Jelajahi ruang editorial BRIAMCO untuk perspektif bisnis dan berita perusahaan.' : tr(row.description);
          data = {title:isNews?'Wawasan BRIAMCO: Strategi, Teknologi, dan Pelaksanaan':tr(row.title),slug:row.slug,description,type:row.type,category:tr(row.category),author:row.author,date:row.date,imageUrl:row.imageUrl,imageAlt:tr(row.imageAlt),
            content:isNews?'## Selamat datang di Wawasan BRIAMCO\n\nPusat Wawasan kami menyatukan Blog dan Berita. Artikel Blog membahas strategi, transformasi bisnis, teknologi, dan risiko. Berita menjadi ruang untuk informasi terbaru dari BRIAMCO.\n\nSetiap artikel memiliki halaman tersendiri dan dapat dikelola oleh tim editorial melalui CMS. Jelajahi perspektif terbaru atau hubungi kami untuk mendiskusikan prioritas bisnis Anda.':description+'\n\nTim pimpinan membutuhkan penilaian peluang yang jelas, prioritas praktis, dan rencana pelaksanaan yang terukur. BRIAMCO menghubungkan pemikiran strategis dengan pelaksanaan yang disiplin untuk membantu organisasi menghadapi perubahan.'};
        }
        await documents.update({documentId:row.documentId,locale:'id',data,status:'published'});
      }
    }
    strapi.log.info('English and Indonesian content and editable navigation ready.');
  },
};
