<script setup lang="ts">
import { useCmsSection, useCmsField } from '../cms/content'
const content = useCmsSection('SolutionsSection')

import { ref } from 'vue'

const solutions = useCmsField('SolutionsSection', 'solutions', [
  {
    label: 'Startups & Scaleups',
    title: 'Agile Product & Engineering Acceleration',
    desc: 'Rapidly architect, build, and iterate high-performance web and mobile platforms with automated testing, CI/CD, and cost-optimized cloud backends.',
    features: ['High-Velocity Product Engineering', 'Cloud-Native Container & Kubernetes Setup', 'Automated CI/CD & Quality Assurance', 'Elastic Cloud Architecture & Cost Optimization'],
    img: 'Startup engineering team pairing on new code releases',
    photo: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
  },
  {
    label: 'Enterprise Scale',
    title: 'Enterprise-Grade Digital & Cloud Modernization',
    desc: 'Comprehensive systems re-architecture, legacy monolith deconstruction, and multi-region cloud resilience engineered for high-concurrency enterprise workloads.',
    features: ['Zero-Downtime Cloud Migration & Multi-Cloud Strategy', 'Event-Driven Microservices Architecture', 'Enterprise Cybersecurity & SOC2 Hardening', 'AI Workflows & Private LLM Deployment'],
    img: 'Enterprise systems engineers monitoring distributed cloud metrics',
    photo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
  },
])

const currentTab = ref(0)
</script>

<template>
  <section id="solutions" class="solutions">
    <div class="container">
      <div class="solutions__header">
        <span class="section-tag">{{ content.text1 }}</span>
        <h2 class="section-title">{{ content.text2 }}</h2>
        <p class="section-subtitle">
          {{ content.text3 }}
        </p>
      </div>

      <!-- Tabs -->
      <div class="solutions__tabs">
        <button
          v-for="(sol, i) in solutions"
          :key="sol.label"
          class="solutions__tab"
          :class="{ active: currentTab === i }"
          @click="currentTab = i"
        >
          {{ sol.label }}
        </button>
      </div>

      <!-- Panel -->
      <div
        v-for="(sol, i) in solutions"
        :key="sol.label"
        class="solutions__panel"
        :class="{ active: currentTab === i }"
      >
        <div class="solutions__panel-grid">
          <div class="solutions__panel-img">
            <img :src="sol.photo" :alt="sol.img" class="solutions__img" />
            <div class="solutions__img-placeholder"></div>
          </div>
          <div class="solutions__panel-text">
            <span class="section-tag">{{ sol.label }}</span>
            <h3 class="solutions__panel-title">{{ sol.title }}</h3>
            <p class="solutions__panel-desc">{{ sol.desc }}</p>
            <ul class="solutions__features">
              <li v-for="f in sol.features" :key="f" class="solutions__feature">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="8" fill="#2563eb" fill-opacity="0.12"/><path d="M5 8l2.5 2.5L11 5.5" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                {{ f }}
              </li>
            </ul>
            <RouterLink to="/contact" class="btn-primary" style="margin-top:8px;">{{ content.text4 }}</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.solutions {
  padding: 100px 0;
  background: var(--gray-100);
}

.solutions__header {
  text-align: center;
  margin-bottom: 48px;
}

.solutions__header .section-subtitle {
  margin: 0 auto;
}

.solutions__tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
}

.solutions__tab {
  padding: 10px 32px;
  border-radius: 99px;
  border: 2px solid var(--gray-200);
  background: var(--white);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
}

.solutions__tab.active {
  background: var(--navy);
  border-color: var(--navy);
  color: var(--white);
}

.solutions__tab:hover:not(.active) {
  border-color: var(--navy);
  color: var(--navy);
}

.solutions__panel {
  display: none;
}

.solutions__panel.active {
  display: block;
  animation: fadeSlideUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
}

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.solutions__panel-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
  background: var(--white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.solutions__panel-img {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.solutions__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.solutions__img-placeholder {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(13,27,42,0.06) 0%, rgba(13,27,42,0.40) 100%);
  z-index: 2;
  pointer-events: none;
}

.solutions__panel-text {
  padding: 48px 48px 48px 0;
}

.solutions__panel-title {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 16px;
  line-height: 1.3;
}

.solutions__panel-desc {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 28px;
}

.solutions__features {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 32px;
}

.solutions__feature {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--navy);
}

@media (max-width: 900px) {
  .solutions__panel-grid {
    grid-template-columns: 1fr;
  }
  .solutions__panel-text {
    padding: 36px;
  }
}
</style>
