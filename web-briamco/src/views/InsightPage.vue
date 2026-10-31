<script setup lang="ts">
import { t } from '../i18n'

import { computed, ref, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import PageHero from '../components/PageHero.vue'
import BlogSection from '../components/BlogSection.vue'
import { getPage, type Insight, type InsightType } from '../cms/pages'
const props = defineProps<{ type?: InsightType }>()
const route = useRoute()
const posts = ref<Insight[]>([])
const loading = ref(true)
const error = ref('')
const totalPages = ref(1)
const page = computed(() => Math.max(1, Number.parseInt(String(route.query.page || '1'), 10) || 1))
const basePath = computed(() => props.type ? `/insight/${props.type}` : '/insight')
let request: AbortController | undefined
async function load() {
  request?.abort(); request = new AbortController(); const signal = request.signal
  loading.value = true; error.value = ''; posts.value = []
  try {
    const query = new URLSearchParams({ page: String(page.value) })
    if (props.type) query.set('type', props.type)
    const result = await getPage<{ data: Insight[]; meta: { pageCount: number } }>(`website-insights?${query}`, signal)
    posts.value = result.data; totalPages.value = result.meta.pageCount
  } catch (reason) { if (!signal.aborted) error.value = reason instanceof Error ? reason.message : t('Content unavailable.') }
  finally { if (!signal.aborted) loading.value = false }
}
watch([() => props.type, page], load, { immediate: true })
onUnmounted(() => request?.abort())
</script>
<template>
  <PageHero :title="type === 'blog' ? 'Blog' : type === 'news' ? t('News') : t('Insight')" :eyebrow="t('News & Insights')" :description="t('Perspectives on business, change and leadership, alongside updates from BRIAMCO.')" />
  <nav class="insight-filters container" aria-label="Insight categories">
    <RouterLink to="/insight" :class="{ active: !type }">{{ t('All Insights') }}</RouterLink>
    <RouterLink to="/insight/blog" :class="{ active: type === 'blog' }">Blog</RouterLink>
    <RouterLink to="/insight/news" :class="{ active: type === 'news' }">{{ t('News') }}</RouterLink>
  </nav>
  <div v-if="loading" class="container insight-status" role="status">{{ t('Loading insights…') }}</div>
  <div v-else-if="error" class="container insight-status" role="alert"><p>{{ error }}</p><button class="btn-primary" @click="load">{{ t('Try again') }}</button></div>
  <div v-else-if="!posts.length" class="container insight-status">{{ t('No articles published yet.') }}</div>
  <BlogSection v-else :posts="posts" />
  <nav v-if="!loading && !error && totalPages > 1" class="insight-filters container" aria-label="Pagination">
    <RouterLink v-if="page > 1" :to="{ path: basePath, query: { page: page - 1 } }">{{ t('Previous') }}</RouterLink>
    <span>{{ t('Page') }} {{ page }} {{ t('of') }} {{ totalPages }}</span>
    <RouterLink v-if="page < totalPages" :to="{ path: basePath, query: { page: page + 1 } }">{{ t('Next') }}</RouterLink>
  </nav>
</template>
<style scoped>
.insight-filters { display: flex; flex-wrap: wrap; gap: 12px; padding-top: 32px; padding-bottom: 32px; }
.insight-filters a { padding: 10px 24px; border: 1px solid var(--gray-200); border-radius: 99px; font-weight: 600; }
.insight-filters a.active, .insight-filters a:hover { background: var(--navy); color: var(--white); border-color: var(--navy); }
.insight-status { padding-top: 64px; padding-bottom: 100px; }
</style>
