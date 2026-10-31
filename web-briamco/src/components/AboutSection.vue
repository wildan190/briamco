<script setup lang="ts">
import { useCmsSection, useCmsField } from '../cms/content'
const content = useCmsSection('AboutSection')

const points = useCmsField('AboutSection', 'points', [
  { title: 'Enterprise Engineering Excellence', desc: 'We engineer resilient, scalable platforms from the ground up, adhering to strict architectural best practices, clean code, and zero-downtime deployments.' },
  { title: 'Cloud-Native & Data-Driven', desc: 'Our cloud architectures and observability pipelines provide complete transparency into system latency, uptime, and high-throughput workloads.' },
  { title: 'Battle-Tested Tech Expertise', desc: 'With 15+ years of distributed systems and multi-cloud engineering, we bring proven frameworks tailored to high-growth tech companies and enterprises.' },
])
</script>

<template>
  <section id="about" class="about">
    <div class="container">
      <div class="about__grid">
        <!-- Images mosaic -->
        <div class="about__visuals">
          <div class="about__img-main">
            <img :src="content.src1" :alt="content.alt2" class="about__img" />
            <div class="about__img-placeholder about__img-placeholder--1"></div>
          </div>
          <div class="about__img-secondary">
            <div class="about__img-sm-wrap">
              <img :src="content.src3" :alt="content.alt4" class="about__img" />
              <div class="about__img-placeholder about__img-placeholder--2"></div>
            </div>
            <div class="about__badge">
              <span class="about__badge-num">{{ content.text5 }}</span>
              <span class="about__badge-text">{{ content.text6 }}</span>
            </div>
          </div>
        </div>

        <!-- Text -->
        <div class="about__text">
          <span class="section-tag">{{ content.text7 }}</span>
          <h2 class="section-title">{{ content.text8 }}<br />{{ content.text9 }}</h2>
          <p class="section-subtitle" style="margin-bottom:32px;">
            {{ content.text10 }}
          </p>

          <div class="about__points">
            <div v-for="point in points" :key="point.title" class="about__point">
              <div class="about__point-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9l4.5 4.5L15 4.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <div>
                <h4 class="about__point-title">{{ point.title }}</h4>
                <p class="about__point-desc">{{ point.desc }}</p>
              </div>
            </div>
          </div>

          <RouterLink to="/contact" class="btn-primary" style="margin-top:12px;">{{ content.text11 }}</RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  padding: 100px 0;
  background: var(--white);
}

.about__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

/* Visuals */
.about__visuals {
  position: relative;
}

.about__img-main {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  aspect-ratio: 4/3;
}

.about__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: relative;
  z-index: 1;
}

.about__img-placeholder {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: 2;
  pointer-events: none;
}

.about__img-placeholder--1 {
  background: linear-gradient(to bottom right, rgba(13,27,42,0.18) 0%, rgba(37,99,235,0.08) 100%);
}

.about__img-placeholder--2 {
  background: linear-gradient(to bottom right, rgba(13,27,42,0.22) 0%, rgba(30,58,95,0.10) 100%);
}

.about__img-secondary {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  align-items: stretch;
}

.about__img-sm-wrap {
  flex: 1;
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  aspect-ratio: 16/9;
}

.about__badge {
  background: var(--accent);
  border-radius: var(--radius-md);
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 120px;
}

.about__badge-num {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 800;
  color: white;
  line-height: 1;
}

.about__badge-text {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Text */
.about__points {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 36px;
}

.about__point {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.about__point-icon {
  width: 36px;
  height: 36px;
  background: var(--accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.about__point-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 4px;
}

.about__point-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.65;
}

@media (max-width: 900px) {
  .about__grid {
    grid-template-columns: 1fr;
    gap: 48px;
  }
}
</style>
