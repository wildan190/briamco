<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { locale, t } from './i18n'
import { previewToken, exitPreview } from './cms/preview'
const inPreview = Boolean(previewToken())
import { loadContent } from './cms/content'
import { loadServices } from './cms/pages'
import NavBar from './components/NavBar.vue'
import FooterSection from './components/FooterSection.vue'
const route = useRoute()
watch(locale, () => { document.title = `${t(String(route.meta.title || 'Home'))} | BRIAMCO`; document.documentElement.lang = locale.value; Promise.allSettled([loadContent(), loadServices()]) }, { immediate: true })
</script>
<template>
  <div id="app-root"><div v-if="inPreview" class="cms-preview-bar">CMS Preview · Saved draft content <button @click="exitPreview">Exit preview</button></div><NavBar /><main><RouterView :key="locale" /></main><FooterSection /></div>
</template>
<style>
@import './assets/main.css';
@import './assets/advisory.css';
#app-root { min-height: 100vh; display: flex; flex-direction: column; }
main { flex: 1; }
.cms-preview-bar { position: fixed; bottom: 12px; right: 12px; z-index: 10000; background: #0c233d; color: white; padding: 10px 14px; border-radius: 6px; font-size: 13px; box-shadow: 0 2px 12px #0003; }
.cms-preview-bar button { margin-left: 12px; background: transparent; color: inherit; border: 1px solid #ffffff80; border-radius: 4px; padding: 4px 8px; cursor: pointer; }
</style>
