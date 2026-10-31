<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
const props = defineProps<{ content: string }>()
const html = computed(() => DOMPurify.sanitize(marked.parse(props.content, { async: false }), { FORBID_TAGS: ['img', 'iframe', 'style', 'form'] }))
</script>
<template><div class="rich-content" v-html="html"></div></template>
<style scoped>
.rich-content { font-size: 16px; line-height: 1.85; color: var(--text-secondary); overflow-wrap: anywhere; }
.rich-content :deep(p), .rich-content :deep(ul), .rich-content :deep(ol), .rich-content :deep(blockquote) { margin-bottom: 24px; }
.rich-content :deep(h1), .rich-content :deep(h2), .rich-content :deep(h3), .rich-content :deep(h4) { font-family: var(--font-display); color: var(--navy); margin: 32px 0 16px; line-height: 1.3; }
.rich-content :deep(ul) { list-style: disc; padding-left: 24px; }
.rich-content :deep(ol) { padding-left: 24px; }
.rich-content :deep(a) { color: var(--accent); text-decoration: underline; }
.rich-content :deep(pre) { overflow: auto; background: var(--off-white); padding: 20px; border-radius: var(--radius-md); }
.rich-content :deep(blockquote) { border-left: 3px solid var(--accent); padding-left: 24px; }
</style>
