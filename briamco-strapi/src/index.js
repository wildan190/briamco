module.exports = {
 register() {},
 async bootstrap({strapi}) {
 await require('./seed/locales').prepare(strapi);
 const store=strapi.store({type:'core',name:'briamco'});
 if(await store.get({key:'advisory-redesign-v1'})) { await require('./seed/service-design')(strapi); await require('./seed/careers')(strapi); await require('./seed/people')(strapi); return; }
 const fs=require('fs');
 const types=['website-section','service','article','navigation-item','business-partner'];
 const backup={};
 for(const type of types) backup[type]=await strapi.db.query(`api::${type}.${type}`).findMany({});
 fs.mkdirSync('.tmp',{recursive:true});
 fs.writeFileSync('.tmp/content-before-advisory-redesign.json',JSON.stringify(backup,null,2));
 for(const type of types){
 const uid=`api::${type}.${type}`;
 const docs=await strapi.documents(uid).findMany({locale:'*',limit:1000});
 for(const documentId of new Set(docs.map(d=>d.documentId))) await strapi.documents(uid).delete({documentId,locale:'*'});
 }
 const en=require('./seed/redesign.en.json'), id=require('./seed/redesign.id.json');
 for(const [slug,content] of Object.entries(en)){
 const doc=await strapi.documents('api::website-section.website-section').create({locale:'en',status:'published',data:{slug,title:slug==='AdvisoryPage'?'Advisory Website — Main Content':slug,content}});
 await strapi.documents('api::website-section.website-section').update({documentId:doc.documentId,locale:'id',status:'published',data:{slug,title:slug==='AdvisoryPage'?'Website Advisory — Konten Utama':slug,content:id[slug]}});
 }
 let order=0;
 for(const [title,titleId,slug,description,descriptionId] of require('./seed/redesign-services.json')){
 const data={title,slug,description,group:'Business Advisory',order:order++,imageUrl:en.AdvisoryPage.statementImage,imageAlt:title,features:['Understand priorities','Build the strategy','Support execution'],content:`## A clear perspective\n\n${description}\n\n## Working with you\n\nWe begin with your business context and the decisions ahead. Together we assess the challenge, establish priorities and agree a practical scope of work.\n\n## From insight to action\n\nOur approach connects leadership, stakeholders and delivery teams around a shared roadmap. Contact BRIAMCO to discuss your objectives.`};
 const doc=await strapi.documents('api::service.service').create({locale:'en',status:'published',data});
 await strapi.documents('api::service.service').update({documentId:doc.documentId,locale:'id',status:'published',data:{...data,title:titleId,description:descriptionId,group:'Pendampingan Bisnis',features:['Memahami prioritas','Menyusun strategi','Mendukung pelaksanaan'],content:`## Perspektif yang jelas\n\n${descriptionId}\n\n## Bekerja bersama Anda\n\nKami memahami konteks bisnis dan keputusan yang perlu diambil, menetapkan prioritas, serta menyepakati ruang lingkup kerja.\n\n## Dari wawasan menjadi tindakan\n\nKami menyatukan pemimpin, pemangku kepentingan, dan tim pelaksana dalam rencana bersama. Hubungi BRIAMCO untuk membahas tujuan Anda.`}});
 }
 order=0;
 for(const [label,labelId,href,type] of require('./seed/redesign-nav.json')) await strapi.documents('api::navigation-item.navigation-item').create({status:'published',data:{key:'advisory-'+order,label,labelId,href,type,order:order++,visible:true}});
 const articles=[
 ['Leadership in a Changing Business Landscape','Kepemimpinan dalam Lanskap Bisnis yang Berubah','leadership-changing-business-landscape','blog','Strategy','Strategi','How leadership teams can connect a longer-term ambition with the decisions that matter today.','Bagaimana pemimpin menyatukan ambisi jangka panjang dengan keputusan penting hari ini.'],
 ['Resilience Starts with Better Questions','Ketahanan Dimulai dari Pertanyaan yang Tepat','resilience-starts-with-better-questions','blog','Risk & Resilience','Risiko & Ketahanan','A practical perspective on understanding uncertainty across operations, technology and reputation.','Perspektif praktis untuk memahami ketidakpastian dalam operasi, teknologi, dan reputasi.'],
 ['Explore BRIAMCO’s Integrated Advisory Services','Jelajahi Layanan Advisory Terpadu BRIAMCO','integrated-advisory-services','news','BRIAMCO News','Berita BRIAMCO','Discover five connected areas of expertise, shaped around the priorities of business leaders.','Kenali lima bidang keahlian yang saling terhubung untuk menjawab prioritas pemimpin bisnis.']
 ];
 for(const [title,titleId,slug,type,category,categoryId,description,descriptionId] of articles){
 const data={title,slug,type,category,description,author:'BRIAMCO Editorial',date:'2026-10-31',imageUrl:en.AdvisoryPage.heroImage,imageAlt:title,content:`## ${title}\n\n${description}\n\nBusiness leaders face decisions that connect strategy, people and risk. A useful starting point is to separate the choices that need action today from assumptions that require further evidence.\n\n## Establish shared priorities\n\nBring leadership teams together around a small set of objectives. Make the trade-offs explicit and define how progress will be reviewed.\n\n## Connect decisions with delivery\n\nSet clear responsibilities, listen to stakeholder perspectives and adapt as new information emerges. Sustainable progress depends on a practical rhythm of assessment, action and review.\n\nContact BRIAMCO to discuss the priorities facing your organization.`};
 const doc=await strapi.documents('api::article.article').create({locale:'en',status:'published',data});
 await strapi.documents('api::article.article').update({documentId:doc.documentId,locale:'id',status:'published',data:{...data,title:titleId,category:categoryId,description:descriptionId,content:`## ${titleId}\n\n${descriptionId}\n\nPemimpin bisnis menghadapi keputusan yang menghubungkan strategi, sumber daya manusia, dan risiko. Pisahkan keputusan yang perlu diambil sekarang dari asumsi yang membutuhkan bukti tambahan.\n\n## Tetapkan prioritas bersama\n\nSatukan tim pimpinan pada beberapa tujuan utama. Jelaskan pilihan dan konsekuensinya, lalu tentukan cara mengevaluasi kemajuan.\n\n## Hubungkan keputusan dengan pelaksanaan\n\nTetapkan tanggung jawab yang jelas, dengarkan perspektif pemangku kepentingan, dan sesuaikan langkah ketika informasi baru muncul.\n\nHubungi BRIAMCO untuk membahas prioritas organisasi Anda.`}});
 }
 await store.set({key:'advisory-redesign-v1',value:true});
 await require('./seed/service-design')(strapi); await require('./seed/careers')(strapi); await require('./seed/people')(strapi);
 strapi.log.info('Advisory redesign migrated; inquiry data preserved; previous content backed up in .tmp.');
 }
};
