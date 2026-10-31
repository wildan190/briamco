<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowRight, ChevronDown, Globe, Menu, X } from '@lucide/vue'
import { useCmsSection } from '../cms/content'
import { services, getPage, insightPath, type Insight } from '../cms/pages'
import { locale, setLanguage } from '../i18n'
const c = useCmsSection('NavBar')
const route = useRoute()
const open = ref(false)
const active = ref<'services' | 'insights' | null>(null)
const header = ref<HTMLElement>()
const posts = ref<Insight[]>([])
const loading = ref(false)
const failed = ref(false)
const id = computed(() => locale.value === 'id')
function menuKind(n: {type?:string; href:string}) {
  if (n.type === 'services') return 'services'
  if (/^\/insight(?:\/blog)?\/?$/.test(n.href)) return 'insights'
  return null
}
function close() { active.value = null; open.value = false }
function toggle(kind: 'services' | 'insights') { active.value = active.value === kind ? null : kind }
function escape(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  if (active.value) header.value?.querySelector<HTMLButtonElement>(`[aria-controls="mega-${active.value}"]`)?.focus()
  close()
}
let request = 0
async function loadPosts() {
  const version = ++request
  loading.value = true; failed.value = false; posts.value = []
  try {
    const result = await getPage<{data:Insight[]}>('website-insights')
    if (version === request) posts.value = Array.isArray(result.data) ? result.data.slice(0,3) : []
  } catch { if (version === request) failed.value = true }
  finally { if (version === request) loading.value = false }
}
watch(() => route.fullPath, close)
watch(locale, () => { close(); loadPosts() })
onMounted(() => { document.addEventListener('keydown', escape); loadPosts() })
onBeforeUnmount(() => { request++; document.removeEventListener('keydown', escape) })
</script>
<template>
  <button v-if="active" class="ad-menu-backdrop" @click="close" :aria-label="id ? 'Tutup menu' : 'Close menu'" tabindex="-1" />
  <header ref="header" class="ad-nav" :class="{'on-light':route.path!=='/' && route.name!=='service-detail' && route.name!=='people' && route.name!=='person-detail', 'mega-open':active}" @mouseleave="active=null">
    <div class="ad-wrap ad-nav-inner">
      <RouterLink to="/" class="ad-brand" @click="close">BRIAMCO<span>ADVISORY</span></RouterLink>
      <button class="ad-mobile-toggle" @click="open=!open;active=null" aria-label="Toggle navigation" :aria-expanded="open"><X v-if="open"/><Menu v-else/></button>
      <nav :class="{opened:open}" aria-label="Main navigation">
        <div v-for="n in c.navLinks" :key="n.href" class="ad-nav-item" @pointerenter="($event.pointerType==='mouse') && (active=menuKind(n))">
          <button v-if="menuKind(n)" class="ad-menu-trigger" @click="toggle(menuKind(n)!)" :aria-expanded="active===menuKind(n)" :aria-controls="'mega-'+menuKind(n)">{{ n.label }}<ChevronDown :size="16" :class="{rotated:active===menuKind(n)}"/></button>
          <RouterLink v-else :to="n.href" @click="close">{{ n.label }}</RouterLink>
        </div>
        <button class="ad-language" @pointerenter="($event.pointerType==='mouse') && (active=null)" @click="setLanguage(locale==='en'?'id':'en')"><Globe :size="19"/> {{ locale.toUpperCase() }} <ChevronDown :size="14"/></button>
      </nav>
    </div>
    <section v-if="active" :id="'mega-'+active" class="ad-mega" :aria-label="active==='services' ? 'Services' : 'Insights'">
      <div class="ad-wrap">
        <div class="ad-mega-heading"><h2>{{ active==='services' ? (id?'Layanan Kami':'Our Services') : (id?'Wawasan Terbaru':'Latest Insights') }}</h2><RouterLink :to="active==='services'?'/services':'/insight'" @click="close">{{ active==='services'?(id?'Seluruh Layanan':'All Practice Areas'):(id?'Semua Artikel':'All Articles') }}<ArrowRight :size="20"/></RouterLink><button class="ad-mega-close" @click="close" :aria-label="id?'Tutup menu':'Close menu'"><X :size="22"/></button></div>
        <div v-if="active==='services'" class="ad-mega-services">
          <div class="ad-mega-segments"><p class="ad-mega-label">{{ id?'Bidang Bisnis':'Business Segments' }}</p><RouterLink v-for="s in services" :key="s.slug" :to="'/services/'+s.slug" @click="close">{{ s.title }}</RouterLink></div>
          <div class="ad-mega-practices"><p class="ad-mega-label">{{ id?'Keahlian untuk Prioritas Anda':'Expertise for Your Priorities' }}</p><div class="ad-mega-practice-grid"><RouterLink v-for="s in services" :key="s.slug" :to="'/services/'+s.slug" @click="close"><h3>{{ s.title }} <ArrowRight :size="18"/></h3><p>{{ s.description }}</p></RouterLink></div></div>
        </div>
        <div v-else class="ad-mega-insights">
          <p v-if="loading" role="status">{{ id?'Memuat artikel…':'Loading articles…' }}</p>
          <p v-else-if="failed || !posts.length">{{ id?'Jelajahi seluruh artikel di halaman Wawasan.':'Explore all articles on our Insights page.' }}</p>
          <RouterLink v-for="post in posts" :key="post.slug" :to="insightPath(post)" class="ad-mega-post" @click="close"><img :src="post.img" :alt="post.alt"/><span>{{ post.badge }}</span><h3>{{ post.title }}</h3><time v-if="post.date" :datetime="post.date">{{ new Date(post.date).toLocaleDateString(id?'id-ID':'en-US',{year:'numeric',month:'long',day:'numeric'}) }}</time></RouterLink>
          <aside><h3>{{ id?'Perspektif baru untuk bisnis Anda':'Fresh perspectives for your business' }}</h3><p>{{ id?'Jelajahi gagasan, analisis, dan kabar terbaru dari BRIAMCO.':'Explore ideas, analysis and the latest updates from BRIAMCO.' }}</p><RouterLink to="/insight/blog" @click="close">Blog <ArrowRight :size="20"/></RouterLink><RouterLink to="/insight/news" @click="close">{{ id?'Berita':'News' }} <ArrowRight :size="20"/></RouterLink></aside>
        </div>
      </div>
    </section>
  </header>
</template>
