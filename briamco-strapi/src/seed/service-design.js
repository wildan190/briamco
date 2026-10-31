module.exports=async function(strapi){
 const store=strapi.store({type:'core',name:'briamco'});
 if(await store.get({key:'service-detail-design-v1'}))return;
 const seed=require('./service-offerings.json');
 const images={
 'people-advisory':'photo-1521737711867-e3b97375f902',
 'management-consulting':'photo-1552664730-d307ca884978',
 'financial-advisory':'photo-1460925895917-afdab827c52f',
 'risk-advisory':'photo-1486406146926-c627a92ad1ab',
 'strategy-communications':'photo-1497366754035-f200968a6e72'
 };
 for(const locale of ['en','id']){
 const docs=await strapi.documents('api::service.service').findMany({locale,status:'published',limit:100});
 for(const doc of docs){
 const items=seed[doc.slug];if(!items)continue;
 const offerings=items.map(([en,id,bulletsEn,bulletsId])=>{
 const title=locale==='id'?id:en,bullets=locale==='id'?bulletsId:bulletsEn;
 const description=locale==='id'?`Kami membantu Anda menyusun prioritas ${id.toLowerCase()} sesuai konteks dan tujuan bisnis.`:`We help you shape ${en.toLowerCase()} around your business context and objectives.`;
 return {title,description,bullets,content:locale==='id'?`## Pendekatan kami\n\n${description}\n\nKami memulai dengan memahami situasi organisasi, meninjau bukti yang tersedia, dan menyepakati hasil yang ingin dicapai.\n\n## Ruang lingkup pendampingan\n\n${bullets.map(b=>'- '+b).join('\n')}\n\n## Langkah selanjutnya\n\nDiskusikan kebutuhan Anda dengan BRIAMCO untuk menentukan ruang lingkup dan rencana kerja yang sesuai.`:`## Our approach\n\n${description}\n\nWe begin by understanding your organization, reviewing the available evidence and agreeing the outcomes that matter.\n\n## Areas of support\n\n${bullets.map(b=>'- '+b).join('\n')}\n\n## Your next step\n\nDiscuss your priorities with BRIAMCO to agree a suitable scope and practical plan of work.`};
 });
 await strapi.documents('api::service.service').update({documentId:doc.documentId,locale,status:'published',data:{overviewTitle:locale==='id'?'Perspektif yang lebih mendalam':'A perspective beyond the obvious',overviewLead:locale==='id'?`Kami menyatukan keahlian dan perspektif objektif untuk membantu Anda menghubungkan ${doc.title.toLowerCase()} dengan tujuan bisnis dan kemajuan yang berkelanjutan.`:`We bring together specialist expertise and objective advice to connect ${doc.title.toLowerCase()} with your business priorities and lasting progress.`,offerings,imageUrl:`https://images.unsplash.com/${images[doc.slug]}?auto=format&fit=crop&w=2200&q=85`}});
 }
 }
 await store.set({key:'service-detail-design-v1',value:true});
};
