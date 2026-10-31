<!-- Reusable SVG icon component -->
<script setup lang="ts">
defineProps<{
  name: string
  size?: number
  strokeWidth?: number
}>()
</script>

<template>
  <!-- Services -->
  <svg v-if="name === 'users'" :width="size ?? 24" :height="size ?? 24" viewBox="0 0 24 24" fill="none" :stroke-width="strokeWidth ?? 1.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>

  <svg v-else-if="name === 'bar-chart'" :width="size ?? 24" :height="size ?? 24" viewBox="0 0 24 24" fill="none" :stroke-width="strokeWidth ?? 1.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>

  <svg v-else-if="name === 'graduation-cap'" :width="size ?? 24" :height="size ?? 24" viewBox="0 0 24 24" fill="none" :stroke-width="strokeWidth ?? 1.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>

  <svg v-else-if="name === 'settings'" :width="size ?? 24" :height="size ?? 24" viewBox="0 0 24 24" fill="none" :stroke-width="strokeWidth ?? 1.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>

  <svg v-else-if="name === 'dollar-sign'" :width="size ?? 24" :height="size ?? 24" viewBox="0 0 24 24" fill="none" :stroke-width="strokeWidth ?? 1.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>

  <svg v-else-if="name === 'target'" :width="size ?? 24" :height="size ?? 24" viewBox="0 0 24 24" fill="none" :stroke-width="strokeWidth ?? 1.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>

  <!-- Stats / CTA -->
  <svg v-else-if="name === 'folder'" :width="size ?? 24" :height="size ?? 24" viewBox="0 0 24 24" fill="none" :stroke-width="strokeWidth ?? 1.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>

  <svg v-else-if="name === 'star'" :width="size ?? 24" :height="size ?? 24" viewBox="0 0 24 24" fill="none" :stroke-width="strokeWidth ?? 1.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>

  <svg v-else-if="name === 'briefcase'" :width="size ?? 24" :height="size ?? 24" viewBox="0 0 24 24" fill="none" :stroke-width="strokeWidth ?? 1.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>

  <svg v-else-if="name === 'building'" :width="size ?? 24" :height="size ?? 24" viewBox="0 0 24 24" fill="none" :stroke-width="strokeWidth ?? 1.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9.01" y2="6"/><line x1="9" y1="10" x2="9.01" y2="10"/><line x1="9" y1="14" x2="9.01" y2="14"/><line x1="9" y1="18" x2="9.01" y2="18"/><line x1="15" y1="6" x2="15.01" y2="6"/><line x1="15" y1="10" x2="15.01" y2="10"/><line x1="15" y1="14" x2="15.01" y2="14"/><line x1="15" y1="18" x2="15.01" y2="18"/>
  </svg>

  <!-- Contact info icons -->
  <svg v-else-if="name === 'map-pin'" :width="size ?? 24" :height="size ?? 24" viewBox="0 0 24 24" fill="none" :stroke-width="strokeWidth ?? 1.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>

  <svg v-else-if="name === 'phone'" :width="size ?? 24" :height="size ?? 24" viewBox="0 0 24 24" fill="none" :stroke-width="strokeWidth ?? 1.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>

  <svg v-else-if="name === 'mail'" :width="size ?? 24" :height="size ?? 24" viewBox="0 0 24 24" fill="none" :stroke-width="strokeWidth ?? 1.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>

  <svg v-else-if="name === 'clock'" :width="size ?? 24" :height="size ?? 24" viewBox="0 0 24 24" fill="none" :stroke-width="strokeWidth ?? 1.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>

  <!-- Success check -->
  <svg v-else-if="name === 'check-circle'" :width="size ?? 24" :height="size ?? 24" viewBox="0 0 24 24" fill="none" :stroke-width="strokeWidth ?? 1.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>

  <!-- Testimonial star rating -->
  <svg v-else-if="name === 'star-filled'" :width="size ?? 16" :height="size ?? 16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>

  <!-- Arrow up right -->
  <svg v-else-if="name === 'arrow-up-right'" :width="size ?? 24" :height="size ?? 24" viewBox="0 0 24 24" fill="none" :stroke-width="strokeWidth ?? 2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
  </svg>

  <!-- Simple check -->
  <svg v-else-if="name === 'check'" :width="size ?? 16" :height="size ?? 16" viewBox="0 0 24 24" fill="none" :stroke-width="strokeWidth ?? 2.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>

  <!-- Globe icon for language switcher -->
  <svg v-else-if="name === 'globe'" :width="size ?? 16" :height="size ?? 16" viewBox="0 0 24 24" fill="none" :stroke-width="strokeWidth ?? 1.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
</template>
