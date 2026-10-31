<script setup lang="ts">
import { t } from '../i18n'

defineProps<{ title: string; eyebrow?: string; description?: string }>()
</script>
<template>
  <header class="page-hero">
    <div class="container">
      <RouterLink to="/" class="page-hero__back">{{ t('Home') }}</RouterLink>
      <p v-if="eyebrow" class="section-tag">{{ eyebrow }}</p>
      <h1 class="section-title light">{{ title }}</h1>
      <p v-if="description" class="section-subtitle light">{{ description }}</p>
    </div>
  </header>
</template>
<style scoped>
.page-hero { background: var(--navy); padding: 150px 0 64px; }
.page-hero__back { display: block; font-size: 13px; color: var(--gray-400); margin-bottom: 24px; }
.page-hero .section-tag { color: #7eb3ff; }
.page-hero .section-title { max-width: 940px; }
.page-hero .section-subtitle { max-width: 760px; }
@media (max-width: 600px) { .page-hero { padding: 125px 0 48px; } }
</style>
