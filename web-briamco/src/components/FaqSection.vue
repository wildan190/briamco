<script setup lang="ts">
import { useCmsSection, useCmsField } from '../cms/content'
const content = useCmsSection('FaqSection')

import { ref } from 'vue'

const faqs = useCmsField('FaqSection', 'faqs', [
  { q: 'What technologies and cloud stacks does BRIAMCO specialize in?', a: 'We specialize in modern cloud-native architectures across AWS, GCP, and Azure, utilizing Kubernetes, Docker, TypeScript, Vue, React, Go, Python, PostgreSQL, Snowflake, and enterprise AI/LLM orchestration frameworks.' },
  { q: 'How do you handle zero-downtime cloud migrations?', a: 'We leverage phased strangler fig migration patterns, automated schema replication, and dual-write strategies to modernize legacy monolithic systems without service disruption or data loss.' },
  { q: 'Do you collaborate with early-stage scaleups or only large enterprises?', a: 'We collaborate with both. For fast-growing scaleups, we provide agile product engineering and scalable foundations. For large enterprises, we deliver complex distributed systems, cloud migrations, and platform reliability engineering.' },
  { q: 'How do you ensure cybersecurity and regulatory compliance?', a: 'Security is embedded into every development phase (DevSecOps). We implement zero-trust access controls, continuous vulnerability scans, data masking, and strict compliance frameworks (SOC2, ISO 27001, GDPR, HIPAA).' },
  { q: 'Who retains intellectual property (IP) rights and source code?', a: 'You retain 100% full ownership of all proprietary code, infrastructure-as-code configurations, CI/CD pipelines, and architectural assets created during our engagement.' },
])

const openIndex = ref<number | null>(0)

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}
</script>

<template>
  <section class="faq">
    <div class="container faq__inner">
      <div class="faq__header">
        <span class="section-tag">{{ content.text1 }}</span>
        <h2 class="section-title">{{ content.text2 }}</h2>
        <p class="section-subtitle">
          {{ content.text3 }}
        </p>
      </div>

      <div class="faq__list">
        <div
          v-for="(item, i) in faqs"
          :key="i"
          class="faq__item"
          :class="{ open: openIndex === i }"
        >
          <button class="faq__question" @click="toggle(i)">
            <span>{{ item.q }}</span>
            <div class="faq__icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 7l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
          </button>
          <div class="faq__answer">
            <p>{{ item.a }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq {
  padding: 100px 0;
  background: var(--white);
}

.faq__inner {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 80px;
  align-items: flex-start;
}

.faq__header .section-subtitle {
  margin-top: 12px;
}

.faq__header a {
  margin-top: 24px;
  display: inline-block;
}

.faq__list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.faq__item {
  border-bottom: 1px solid var(--gray-200);
  overflow: hidden;
}

.faq__item:first-child {
  border-top: 1px solid var(--gray-200);
}

.faq__question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 20px 0;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 15px;
  font-weight: 600;
  color: var(--navy);
  transition: color 0.2s;
}

.faq__question:hover {
  color: var(--accent);
}

.faq__item.open .faq__question {
  color: var(--accent);
}

.faq__icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.35s;
}

.faq__item.open .faq__icon {
  transform: rotate(180deg);
  background: var(--accent);
  color: white;
}

.faq__answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1);
}

.faq__item.open .faq__answer {
  max-height: 200px;
}

.faq__answer p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.75;
  padding-bottom: 20px;
}

@media (max-width: 900px) {
  .faq__inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
</style>
