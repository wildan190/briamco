module.exports = async strapi => {
  const store = strapi.store({type:'core',name:'briamco'});
  if (await store.get({key:'partners-seeded'})) return;
  const documents = strapi.documents('api::business-partner.business-partner');
  for (const data of require('./partners.json')) {
    if (!await documents.findFirst({filters:{key:data.key}})) await documents.create({data,status:'published'});
  }
  await store.set({key:'partners-seeded',value:true});
};
