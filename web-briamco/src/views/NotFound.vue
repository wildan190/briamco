<script setup lang="ts">
import { t } from '../i18n'
import PageHero from '../components/PageHero.vue'</script>
<template><PageHero :title="t('Page not found')" eyebrow="404" :description="t('The page you requested could not be found.')" /><div class="container" style="padding-top:48px;padding-bottom:80px"><RouterLink to="/" class="btn-primary">{{ t('Back to Home') }}</RouterLink></div></template>
