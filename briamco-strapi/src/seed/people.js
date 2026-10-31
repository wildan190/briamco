module.exports=async function(strapi){
 const store=strapi.store({type:'core',name:'briamco'});if(await store.get({key:'people-page-v1'}))return;
 const docs=strapi.documents('api::website-section.website-section');let doc=await docs.findFirst({locale:'en',filters:{slug:'PeoplePage'}});
 if(!doc)doc=await docs.create({locale:'en',status:'published',data:{slug:'PeoplePage',title:'People — Page Content',content:require('./people.en.json')}});
 await docs.update({documentId:doc.documentId,locale:'id',status:'published',data:{slug:'PeoplePage',title:'Tim — Konten Halaman',content:require('./people.id.json')}});
 await store.set({key:'people-page-v1',value:true});
};
