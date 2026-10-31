<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowRight, ChevronRight } from '@lucide/vue'
import { t, locale } from '../i18n'
import RichTextContent from '../components/RichTextContent.vue'
import { getPage, PageError, safeImage, services, type Service } from '../cms/pages'
const props = defineProps<{ slug: string }>()
const route=useRoute(), router=useRouter()
const service = ref<Service | null>(null)
const loading = ref(true), error = ref(''), missing = ref(false)
const id=computed(()=>locale.value==='id')
const offerings=computed(()=>service.value?.offerings || [])
const selected=computed(()=>{
  const value=Number(route.query.offering)
  return Number.isInteger(value) && value>0 && value<=offerings.value.length ? value-1 : -1
})
const current=computed(()=>offerings.value[selected.value])
const related=computed(()=>services.value.filter(s=>s.slug!==props.slug).slice(0,4))
function select(index:number, scroll=false){
  router.replace({query:{...route.query,offering:index<0?undefined:String(index+1)}}).then(()=>{
    if(scroll) document.getElementById('service-panel')?.scrollIntoView?.({behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})
  })
}
function tabKey(event:KeyboardEvent,index:number){
  let next=index
  if(event.key==='ArrowRight')next=index===offerings.value.length-1?-1:index+1
  else if(event.key==='ArrowLeft')next=index===-1?offerings.value.length-1:index-1
  else if(event.key==='Home')next=-1
  else if(event.key==='End')next=offerings.value.length-1
  else return
  event.preventDefault(); select(next)
  document.getElementById('service-tab-'+(next+1))?.focus()
}
let request: AbortController | undefined
async function load() {
  request?.abort(); request = new AbortController()
  const signal = request.signal
  service.value = null; loading.value = true; error.value = ''; missing.value = false
  try { const result=await getPage<{data:Service}>(`website-services/${encodeURIComponent(props.slug)}`,signal); if(!signal.aborted)service.value=result.data }
  catch (reason) {
    if (signal.aborted) return
    missing.value = reason instanceof PageError && reason.status === 404
    error.value = reason instanceof Error ? reason.message : t('Content unavailable.')
  } finally { if (!signal.aborted) loading.value = false }
}
watch([()=>props.slug,locale], load, { immediate: true })
watch(() => service.value?.title, title => { if (title) document.title = `${title} | BRIAMCO` })
onUnmounted(() => request?.abort())
</script>
<template>
  <div class="service-detail">
    <section class="sd-hero" :style="service && safeImage(service.imageUrl)?{backgroundImage:`linear-gradient(90deg,#071536ed,#07153670),url(${safeImage(service.imageUrl)})`}:{}">
      <div class="ad-wrap sd-intro"><p class="sd-eyebrow">{{ service?.group || (id?'Layanan Kami':'Our Services') }}</p><h1>{{ service?.title || (missing?t('Service not found'):t('Service')) }}</h1><p class="sd-description">{{ service?.description }}</p></div>
      <div v-if="service" class="ad-wrap sd-tabs" role="tablist" :aria-label="service.title">
        <button id="service-tab-0" role="tab" :aria-selected="selected===-1" :tabindex="selected===-1?0:-1" aria-controls="service-panel" @click="select(-1)" @keydown="tabKey($event,-1)">{{ id?'Ikhtisar':'Overview' }}</button>
        <button v-for="(offering,index) in offerings" :id="'service-tab-'+(index+1)" :key="index" role="tab" :aria-selected="selected===index" :tabindex="selected===index?0:-1" aria-controls="service-panel" @click="select(index)" @keydown="tabKey($event,index)">{{ offering.title }}</button>
      </div>
    </section>
    <section class="ad-wrap sd-body">
      <p v-if="loading" role="status">{{ t('Loading service…') }}</p>
      <div v-else-if="error" role="alert"><p>{{ error }}</p><button v-if="!missing" class="ad-button" @click="load">{{ t('Try again') }}</button><RouterLink v-else to="/services" class="ad-button">{{ t('All Services') }} <ArrowRight/></RouterLink></div>
      <div v-else-if="service" class="sd-columns">
        <div id="service-panel" role="tabpanel" :aria-labelledby="'service-tab-'+(selected+1)" tabindex="0">
          <template v-if="!current">
            <h2>{{ service.overviewTitle || (id?'Perspektif yang lebih mendalam':'A perspective beyond the obvious') }}</h2>
            <p class="sd-lead">{{ service.overviewLead || service.description }}</p>
            <RichTextContent :content="service.content" />
            <h2 v-if="offerings.length" class="sd-offerings-heading">{{ service.title }} — {{ id?'Lingkup Layanan':'Offerings' }}</h2>
            <div class="sd-offerings"><article v-for="(offering,index) in offerings" :key="index"><h3>{{ offering.title }}</h3><ul><li v-for="bullet in offering.bullets" :key="bullet">{{ bullet }}</li></ul><button @click="select(index,true)">{{ id?'Selengkapnya':'Learn More' }} <ArrowRight :size="18"/></button></article></div>
          </template>
          <template v-else><h2>{{ current.title }}</h2><p class="sd-lead">{{ current.description }}</p><RichTextContent :content="current.content"/><RouterLink to="/contact" class="ad-button">{{ id?'Diskusikan Kebutuhan Anda':'Discuss Your Priorities' }}<ArrowRight :size="19"/></RouterLink></template>
        </div>
        <aside class="sd-related"><h2>{{ id?'Layanan Terkait':'Related Practice Areas' }}</h2><RouterLink v-for="item in related" :key="item.slug" :to="'/services/'+item.slug"><ChevronRight :size="15"/>{{ item.title }}</RouterLink><RouterLink class="ad-button" to="/services">{{ id?'Seluruh Layanan':'All Practice Areas' }}<ArrowRight :size="18"/></RouterLink></aside>
      </div>
    </section>
  </div>
</template>
<style scoped>
.sd-hero{background-color:#071536;background-size:cover;background-position:center;color:white;padding-top:180px;min-height:570px;display:flex;flex-direction:column;justify-content:space-between}.sd-intro{margin:0 auto;padding:35px 0 90px}.sd-eyebrow{font-size:12px;text-transform:uppercase;letter-spacing:2px;margin-bottom:15px;color:#c3d4ee}.sd-hero h1{font-size:clamp(42px,5vw,78px);line-height:1.1;letter-spacing:-2px;font-weight:600;margin-bottom:30px}.sd-description{font-size:clamp(18px,1.6vw,24px);line-height:1.4;max-width:730px}.sd-tabs{display:flex;overflow-x:auto;margin:0 auto;scrollbar-width:thin;align-items:stretch}.sd-tabs button{background:none;border:0;color:white;padding:16px 18px;white-space:nowrap;cursor:pointer;font-size:14px;line-height:1.3}.sd-tabs button[aria-selected=true]{background:white;color:#0d80d8;font-weight:600}.sd-tabs button:hover{background:#ffffff22}.sd-tabs button[aria-selected=true]:hover{background:white}.sd-body{padding-top:85px;padding-bottom:100px}.sd-columns{display:grid;grid-template-columns:minmax(0,2.15fr) minmax(260px,1fr);gap:65px}.sd-body h2{font-size:clamp(30px,3vw,45px);line-height:1.2;letter-spacing:-1.2px;margin-bottom:40px}.sd-lead{font-family:Georgia,serif;font-size:clamp(24px,2.2vw,33px);line-height:1.25;font-weight:bold;background:linear-gradient(110deg,#0784d7,#6453ee);background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:25px}.sd-related{align-self:start;padding:30px;background:linear-gradient(120deg,#e5f1fc,#efedff);border-top:3px solid #0d80d8;border-radius:0 0 35px 0}.sd-related h2{font-size:24px;color:#0d80d8;letter-spacing:-.7px;margin-bottom:20px}.sd-related>a:not(.ad-button){display:flex;align-items:baseline;gap:6px;color:#0d80d8;font-size:15px;line-height:1.5;margin-bottom:12px}.sd-related svg{flex-shrink:0}.sd-related .ad-button{margin-top:22px;font-size:15px;padding:14px 17px;gap:15px}.sd-body .sd-offerings-heading{font-size:33px;color:#0d80d8;margin-top:75px;margin-bottom:45px}.sd-offerings{display:grid;grid-template-columns:1fr 1fr;gap:50px 40px}.sd-offerings article{border-top:2px solid #e1e4ea;padding-top:25px}.sd-offerings h3{font-size:23px;line-height:1.25;letter-spacing:-.6px;margin-bottom:12px}.sd-offerings ul{list-style:disc;padding-left:22px;font-size:15px;color:#566178;line-height:1.9}.sd-offerings button{display:flex;align-items:center;gap:12px;border:0;background:none;color:#0d80d8;font-size:17px;font-weight:600;padding:0;margin-top:20px;cursor:pointer}.sd-offerings button:hover{text-decoration:underline}#service-panel:focus-visible{outline:2px solid #0d80d8;outline-offset:12px}@media(max-width:900px){.sd-columns{gap:35px;grid-template-columns:minmax(0,1.7fr) minmax(230px,1fr)}.sd-related{padding:22px}.sd-related h2{font-size:21px}}@media(max-width:720px){.sd-hero{padding-top:135px;min-height:510px}.sd-intro{padding:30px 0 65px}.sd-hero h1{letter-spacing:-1px}.sd-tabs button{font-size:13px;padding:15px 13px}.sd-columns{grid-template-columns:1fr;gap:50px}.sd-body{padding-top:50px;padding-bottom:60px}.sd-body h2{margin-bottom:28px}.sd-offerings{grid-template-columns:1fr;gap:30px}.sd-body .sd-offerings-heading{font-size:28px;margin-top:45px}.sd-related{max-width:none}}
</style>
