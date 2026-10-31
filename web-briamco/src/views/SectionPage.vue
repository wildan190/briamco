<script setup lang="ts">
import AdvisorySections from '../components/AdvisorySections.vue'
import ContactSection from '../components/ContactSection.vue'
defineProps<{section:string}>()
</script><template><div class="ad-inner-page"><ContactSection v-if="section==='contact'"/><AdvisorySections v-else :section="section"/></div></template>
