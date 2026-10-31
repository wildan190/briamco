module.exports=async function(strapi){
 const store=strapi.store({type:'core',name:'briamco'});
 if(await store.get({key:'careers-page-v1'}))return;
 const docs=strapi.documents('api::website-section.website-section');
 let doc=await docs.findFirst({locale:'en',filters:{slug:'CareersPage'}});
 if(!doc)doc=await docs.create({locale:'en',status:'published',data:{slug:'CareersPage',title:'Careers — Page Content',content:require('./careers.en.json')}});
 await docs.update({documentId:doc.documentId,locale:'id',status:'published',data:{slug:'CareersPage',title:'Karier — Konten Halaman',content:require('./careers.id.json')}});
 await store.set({key:'careers-page-v1',value:true});
};
