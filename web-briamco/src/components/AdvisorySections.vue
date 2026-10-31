<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ArrowRight } from '@lucide/vue'
import { useCmsSection } from '../cms/content'
import { services, getPage, insightPath, type Insight } from '../cms/pages'
import { locale } from '../i18n'
const props=defineProps<{section?:string}>()
const c=useCmsSection('AdvisoryPage')
const posts=ref<Insight[]>([])
const show=(s:string)=>!props.section||props.section===s
const linkLabel=computed(()=>locale.value==='id'?'Hubungi kami':'Contact us')
onMounted(async()=>{try{posts.value=(await getPage<{data:Insight[]}>('website-insights')).data.slice(0,2)}catch{}})
</script>
<template>
<section v-if="!section" class="ad-hero" :style="{backgroundImage:`linear-gradient(90deg,#061336df,#06133633),url(${c.heroImage})`}"><div class="ad-wrap"><h1>{{ c.hero }}</h1><p>{{ c.subtitle }}</p></div><div class="ad-hero-links ad-wrap"><RouterLink to="/about">{{ c.firmTitle }}</RouterLink><RouterLink to="/people">{{ c.peopleTitle }}</RouterLink><RouterLink to="/contact">{{ linkLabel }}</RouterLink></div></section>
<section v-if="!section" class="ad-insights"><div class="ad-wrap"><div class="ad-section-heading"><h2>{{ c.insightsTitle }}</h2><RouterLink to="/insight">{{ c.insightsCta }} <ArrowRight /></RouterLink></div><div class="ad-posts"><RouterLink v-for="p in posts" :key="p.slug" :to="insightPath(p)" class="ad-post"><img :src="p.img" :alt="p.alt" loading="lazy"><div><small>{{ p.badge }} · {{ p.author }}</small><h3>{{ p.title }}</h3><p>{{ p.excerpt }}</p><ArrowRight /></div></RouterLink></div></div></section>
<section v-if="show('people')" class="ad-people ad-wrap ad-space"><div><h2>{{ c.peopleTitle }}</h2><p>{{ c.peopleIntro }}</p><RouterLink class="ad-button outline" :to="section?'/contact':'/people'">{{ section?linkLabel:c.peopleCta }} <ArrowRight /></RouterLink></div><article v-for="person in c.people" :key="person.name"><img :src="person.image" :alt="person.name" loading="lazy"><h3>{{ person.name }}</h3><p>{{ person.role }}</p></article></section>
<section v-if="show('about')" class="ad-statement" :style="{backgroundImage:`linear-gradient(90deg,#061336,#06133655),url(${c.statementImage})`}"><div class="ad-wrap"><h2>{{ section?c.firmTitle:c.statement }}</h2><p v-if="section">{{ c.firmIntro }}</p></div></section>
<section v-if="show('services') || section==='solutions'" class="ad-services ad-wrap ad-space"><h2>{{ c.servicesTitle }}</h2><div class="ad-service-grid"><RouterLink v-for="s in services" :key="s.slug" :to="'/services/'+s.slug" class="ad-service"><h3>{{ s.title }} <ArrowRight :size="21" /></h3><p>{{ s.description }}</p></RouterLink><aside><p>{{ c.servicesIntro }}</p><RouterLink class="ad-button" to="/services">{{ c.servicesCta }} <ArrowRight /></RouterLink></aside></div></section>
<section v-if="show('careers')" class="ad-careers" :style="{backgroundImage:`linear-gradient(90deg,#09264fe8,#06133655),url(${c.careersImage})`}"><div class="ad-wrap"><h2>{{ c.careersTitle }}</h2><p>{{ c.careersIntro }}</p><RouterLink to="/contact" class="ad-button outline">{{ c.careersCta }} <ArrowRight /></RouterLink></div></section>
</template>
