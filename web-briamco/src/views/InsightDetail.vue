<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'
import { ArrowLeft, ArrowRight, ChevronRight, Mail, Printer, Copy, Search } from '@lucide/vue'
import { t, locale } from '../i18n'
import RichTextContent from '../components/RichTextContent.vue'
import { getPage, PageError, safeImage, insightPath, type Insight, type InsightType } from '../cms/pages'
const props = defineProps<{ slug: string; type: InsightType }>()
const post = ref<Insight | null>(null)
const loading = ref(true), error = ref(''), missing = ref(false)
const latest=ref<Insight[]>([]), search=ref(''), copied=ref('')
const id=computed(()=>locale.value==='id')
const date=computed(()=>post.value?.date ? new Date(post.value.date).toLocaleDateString(id.value?'id-ID':'en-US',{month:'long',day:'numeric',year:'numeric'}) : '')
const related=computed(()=>latest.value.filter(p=>p.slug!==props.slug && (!search.value || `${p.title} ${p.excerpt}`.toLocaleLowerCase().includes(search.value.toLocaleLowerCase()))).slice(0,4))
const shareUrl=computed(()=>post.value?window.location.origin+insightPath(post.value):'')
const emailLink=computed(()=>`mailto:?subject=${encodeURIComponent(post.value?.title||'')}&body=${encodeURIComponent(shareUrl.value)}`)
async function copyLink(){try{await navigator.clipboard.writeText(shareUrl.value);copied.value=id.value?'Tautan disalin':'Link copied'}catch{copied.value=id.value?'Salin tautan dari address bar browser.':'Copy the link from your browser address bar.'}}
function print(){window.print()}
let request: AbortController | undefined
async function load() {
  request?.abort(); request = new AbortController(); const signal = request.signal
  loading.value = true; post.value = null; error.value = ''; missing.value = false; latest.value=[];search.value='';copied.value=''
  const recent=getPage<{data:Insight[]}>('website-insights',signal).then(result=>{if(!signal.aborted)latest.value=Array.isArray(result.data)?result.data:[]}).catch(()=>{})
  try {
    const result=await getPage<{data:Insight}>(`website-insights/${encodeURIComponent(props.slug)}?type=${props.type}`,signal)
    if(!signal.aborted)post.value=result.data
  } catch (reason) {
    if (signal.aborted) return
    missing.value = reason instanceof PageError && reason.status === 404
    error.value = reason instanceof Error ? reason.message : t('Content unavailable.')
  } finally { if (!signal.aborted) loading.value = false }
  await recent
}
watch([() => props.slug, () => props.type, locale], load, { immediate: true })
watch(() => post.value?.title, title => { if (title) document.title = `${title} | BRIAMCO` })
onUnmounted(() => request?.abort())
</script>
<template>
  <article class="insight-detail">
    <header class="in-hero" :style="post && safeImage(post.img)?{backgroundImage:`linear-gradient(110deg,#073254db,#10183bb0),url(${safeImage(post.img)})`}:{}">
      <div class="ad-wrap"><p class="in-category">{{ post?.badge || (type==='news'?(id?'Berita':'News'):'Insights') }}</p><h1>{{ post?.title || (missing?t('Article not found'):type==='news'?t('News'):'Insight') }}</h1><div v-if="post" class="in-hero-meta"><time v-if="date" :datetime="post.date">{{ date }}</time><ChevronRight v-if="date" :size="16"/><span>{{ id?'Oleh':'By' }} {{ post.author }}</span></div></div>
    </header>
    <div class="ad-wrap in-body">
      <p v-if="loading" role="status">{{ t('Loading article…') }}</p>
      <div v-else-if="error" role="alert"><p>{{ error }}</p><button v-if="!missing" class="ad-button" @click="load">{{ t('Try again') }}</button><RouterLink v-else to="/insight" class="ad-button">{{ id?'Semua Artikel':'All Articles' }}<ArrowRight/></RouterLink></div>
      <div v-else-if="post" class="in-columns">
        <div class="in-main">
          <div class="in-byline"><div class="in-byline-labels"><span>{{ id?'Artikel oleh':'Article by' }}</span><span>{{ id?'Bagikan artikel':'Share article' }}</span></div><div class="in-byline-details"><strong>{{ post.author }}</strong><div class="in-share"><a :href="'https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(shareUrl)" target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">in</a><a :href="'https://twitter.com/intent/tweet?url='+encodeURIComponent(shareUrl)+'&text='+encodeURIComponent(post.title)" target="_blank" rel="noopener noreferrer" aria-label="Share on X">𝕏</a><a :href="emailLink" :aria-label="id?'Bagikan lewat email':'Share by email'"><Mail :size="21"/></a><button @click="copyLink" :aria-label="id?'Salin tautan':'Copy link'"><Copy :size="19"/></button></div></div><p v-if="copied" class="in-copy-status" role="status">{{ copied }}</p></div>
          <div class="in-article-tools"><button @click="print" :aria-label="id?'Cetak artikel atau simpan sebagai PDF':'Print article or save as PDF'" :title="id?'Cetak / Simpan PDF':'Print / Save PDF'"><Printer :size="21"/></button></div>
          <p class="in-excerpt">{{ post.excerpt }}</p>
          <RichTextContent :content="post.content || post.excerpt" />
          <div class="in-bottom-actions"><RouterLink :to="'/insight/'+type" class="ad-button"><ArrowLeft :size="18"/>{{ type==='news'?(id?'Semua Berita':'All News'):(id?'Semua Artikel':'All Articles') }}</RouterLink><button class="in-print" @click="print" :aria-label="id?'Cetak artikel':'Print article'"><Printer :size="21"/></button></div>
          <div class="in-contact"><h2>{{ id?'Jelajahi wawasan kami atau diskusikan prioritas bisnis Anda':'Explore more perspectives or discuss your business priorities' }}</h2><div><RouterLink to="/insight" class="ad-button">{{ id?'Wawasan Lainnya':'More Insights' }}<ArrowRight :size="18"/></RouterLink><RouterLink to="/contact" class="in-contact-link">{{ id?'Hubungi kami':'Contact us' }}<Mail :size="19"/></RouterLink></div></div>
        </div>
        <aside class="in-sidebar"><div class="in-latest"><h2>{{ id?'Wawasan Terbaru':'Latest Insights' }}</h2><RouterLink v-for="item in related" :key="item.slug" :to="insightPath(item)"><ChevronRight :size="15"/><span>{{ item.title }}</span></RouterLink><p v-if="!related.length">{{ id?'Tidak ada artikel yang cocok.':'No matching articles.' }}</p></div><form class="in-search" role="search" @submit.prevent><label class="in-sr" for="latest-search">{{ id?'Cari wawasan terbaru':'Search latest insights' }}</label><input id="latest-search" v-model="search" type="search" :placeholder="id?'Cari wawasan terbaru':'Search latest insights'"/><Search :size="18" aria-hidden="true"/></form><div class="in-sidebar-cta"><h2>{{ id?'Perspektif untuk langkah Anda selanjutnya':'Perspective for your next move' }}</h2><p>{{ id?'Hubungkan gagasan dengan tindakan. Diskusikan tantangan bisnis Anda bersama BRIAMCO.':'Connect ideas with action. Discuss your business challenges with BRIAMCO.' }}</p><RouterLink to="/contact">{{ id?'Mulai percakapan':'Start a conversation' }}<ArrowRight :size="18"/></RouterLink></div></aside>
      </div>
    </div>
  </article>
</template>
<style scoped>
.in-hero{background-color:#071536;background-size:cover;background-position:center;padding:100px 0 105px;color:white}.in-hero h1{font-size:clamp(36px,4.6vw,76px);line-height:1.07;font-weight:600;letter-spacing:-2px;max-width:1300px}.in-category{font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#d4dff1;margin-bottom:22px}.in-hero-meta{display:flex;align-items:center;flex-wrap:wrap;gap:10px;font-size:13px;margin-top:35px}.in-hero-meta time{font-weight:600}.in-body{padding-top:80px;padding-bottom:85px}.in-columns{display:grid;grid-template-columns:minmax(0,2.15fr) minmax(260px,1fr);gap:65px}.in-byline{margin-bottom:60px}.in-byline-labels{display:flex;justify-content:space-between;border-bottom:1px solid #cbd0de;padding-bottom:10px;font-size:12px;color:#566178}.in-byline-details{display:flex;align-items:start;justify-content:space-between;gap:25px;padding-top:16px;font-size:14px}.in-share{display:flex;align-items:center;gap:20px;color:#566178}.in-share a:first-child{font-weight:700;font-size:17px;line-height:1}.in-share button{border:0;background:none;color:inherit;padding:0;cursor:pointer}.in-copy-status{font-size:13px;color:#0d80d8;margin-top:15px}.in-article-tools{float:right;margin:0 0 12px 20px}.in-article-tools button,.in-print{border:1px solid #0d80d8;padding:12px;background:white;color:#0d80d8;cursor:pointer;display:inline-flex}.in-excerpt{font-size:20px;line-height:1.6;color:#566178;margin-bottom:30px}.in-main :deep(.rich-content){font-size:16px;line-height:1.7}.in-main :deep(.rich-content h2){font-size:28px;letter-spacing:-.7px;line-height:1.25}.in-main :deep(.rich-content h2:first-child){margin-top:0}.in-latest{padding:30px;background:linear-gradient(120deg,#e5f1fc,#efedff);border-top:3px solid #0d80d8;border-radius:0 0 35px 0}.in-sidebar h2{font-size:23px;line-height:1.3;letter-spacing:-.6px;margin-bottom:20px;color:#0d80d8}.in-latest>a{display:flex;align-items:baseline;gap:7px;color:#0d80d8;font-size:15px;line-height:1.6;margin-bottom:12px}.in-latest>a svg{flex-shrink:0}.in-latest>a:hover span{text-decoration:underline}.in-latest p{font-size:14px;color:#566178}.in-search{position:relative;margin:40px 0 50px}.in-search input{border:1px solid #cbd0de;padding:13px 40px 13px 13px;width:100%;font:inherit;font-size:15px;border-radius:0}.in-search>svg{position:absolute;right:12px;top:15px;color:#566178;pointer-events:none}.in-sr{position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip:rect(0,0,0,0)}.in-sidebar-cta{padding:30px;background:linear-gradient(120deg,#244b80,#6350e5);border-radius:0 0 35px 0;color:white}.in-sidebar-cta h2{color:white}.in-sidebar-cta p{font-size:15px;line-height:1.6;margin-bottom:25px;color:#e3e9f5}.in-sidebar-cta>a{display:inline-flex;align-items:center;gap:12px;border:1px solid white;padding:12px 16px;font-size:15px;font-weight:600}.in-bottom-actions{display:flex;align-items:stretch;gap:5px;margin:50px 0 30px;clear:both}.in-bottom-actions .ad-button{font-size:16px;padding:13px 18px}.in-contact{background:linear-gradient(120deg,#e5f1fc,#efedff);border-top:3px solid #0d80d8;padding:40px 30px;text-align:center}.in-contact h2{color:#0d80d8;font-size:23px;line-height:1.3;margin-bottom:25px;letter-spacing:-.5px}.in-contact>div{display:flex;justify-content:center;flex-wrap:wrap;gap:16px}.in-contact .ad-button,.in-contact-link{font-size:16px;padding:12px 18px}.in-contact-link{display:inline-flex;align-items:center;gap:18px;color:#0d80d8;background:white;font-weight:600}@media(max-width:900px){.in-columns{gap:35px;grid-template-columns:minmax(0,1.7fr) minmax(230px,1fr)}.in-latest,.in-sidebar-cta{padding:22px}}@media(max-width:720px){.in-hero{padding:65px 0}.in-hero h1{letter-spacing:-1px}.in-body{padding-top:45px;padding-bottom:55px}.in-columns{grid-template-columns:1fr;gap:45px}.in-byline{margin-bottom:35px}.in-share{gap:14px}.in-excerpt{font-size:18px}.in-contact{padding:30px 20px}.in-hero-meta{font-size:12px}.in-byline-details{gap:15px}.in-search{margin:30px 0}.in-contact h2{font-size:21px}}@media print{.in-hero{padding:25px 0!important;background:white!important;color:#071536!important}.in-hero h1{font-size:32px}.in-category{color:#566178}.in-body{padding:20px 0}.in-columns{display:block}.in-sidebar,.in-share,.in-article-tools,.in-bottom-actions,.in-contact,.in-byline-labels,.in-copy-status{display:none!important}.in-byline{margin-bottom:25px}.ad-wrap{width:100%}.in-excerpt{font-size:16px}.in-main :deep(.rich-content){font-size:12pt}.insight-detail{break-inside:auto}:global(.ad-nav),:global(.ad-footer),:global(.cms-preview-bar),:global(.ad-menu-backdrop){display:none!important}}
</style>
