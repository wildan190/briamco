<script setup lang="ts">
import { useCmsSection, useCmsField } from '../cms/content'
const content = useCmsSection('CtaBanner')

import AppIcon from './AppIcon.vue'

const stats = useCmsField('CtaBanner', 'stats', [
  { value: '1,200+', label: 'Systems Deployed', icon: 'folder' },
  { value: '99.99%', label: 'Infrastructure Uptime', icon: 'star' },
  { value: '150+', label: 'Senior Engineers', icon: 'briefcase' },
  { value: '500+', label: 'Enterprise APIs', icon: 'building' },
])
</script>

<template>
  <section class="cta-banner">
    <!-- Decorative shapes -->
    <div class="cta-banner__shape cta-banner__shape--1"></div>
    <div class="cta-banner__shape cta-banner__shape--2"></div>

    <div class="container cta-banner__inner">
      <div class="cta-banner__text">
        <span class="section-tag" style="color:#7eb3ff;">{{ content.text1 }}</span>
        <h2 class="section-title light">
          {{ content.text2 }}<br />
          {{ content.text3 }}
        </h2>
        <p class="section-subtitle light">
          {{ content.text4 }}
        </p>
        <div class="cta-banner__actions">
          <RouterLink to="/contact" class="btn-primary">{{ content.text5 }}</RouterLink>
          <RouterLink to="/services" class="btn-outline">{{ content.text6 }}</RouterLink>
        </div>
      </div>

      <div class="cta-banner__stats">
        <div v-for="stat in stats" :key="stat.label" class="cta-stat">
          <div class="cta-stat__icon">
            <AppIcon :name="stat.icon" :size="22" :stroke-width="1.6" />
          </div>
          <span class="cta-stat__value">{{ stat.value }}</span>
          <span class="cta-stat__label">{{ stat.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-banner {
  background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%);
  padding: 96px 0;
  position: relative;
  overflow: hidden;
}

.cta-banner__shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.06;
}

.cta-banner__shape--1 {
  width: 500px;
  height: 500px;
  background: var(--accent);
  top: -200px;
  right: -100px;
}

.cta-banner__shape--2 {
  width: 300px;
  height: 300px;
  background: #fff;
  bottom: -150px;
  left: 10%;
}

.cta-banner__inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}

.cta-banner__actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 36px;
}

.cta-banner__stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.cta-stat {
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius-md);
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: var(--transition);
}

.cta-stat:hover {
  background: rgba(255,255,255,0.12);
  transform: translateY(-4px);
}

.cta-stat__icon {
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.1);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.85);
}

.cta-stat__value {
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 800;
  color: var(--white);
  letter-spacing: -0.5px;
}

.cta-stat__label {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,0.55);
  text-transform: uppercase;
  letter-spacing: 1px;
}

@media (max-width: 900px) {
  .cta-banner__inner {
    grid-template-columns: 1fr;
    gap: 48px;
  }
}

@media (max-width: 480px) {
  .cta-banner__stats { grid-template-columns: 1fr 1fr; }
}
</style>
