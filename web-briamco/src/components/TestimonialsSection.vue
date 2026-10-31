<script setup lang="ts">
import { useCmsSection, useCmsField } from '../cms/content'
const content = useCmsSection('TestimonialsSection')

import { ref } from 'vue'
import AppIcon from './AppIcon.vue'

const testimonials = useCmsField('TestimonialsSection', 'testimonials', [
  {
    name: 'Sarah Mitchell',
    role: 'VP of Engineering, FinScale Systems',
    text: 'BRIAMCO re-architected our transaction processing engine into an event-driven microservices setup. Our system throughput tripled with zero downtime during migration, and p99 latency dropped from 850ms to 42ms.',
    rating: 5,
    initials: 'SM',
    color: '#2563eb',
  },
  {
    name: 'David Chen',
    role: 'CTO, Global Logistics Cloud',
    text: 'The engineering team at BRIAMCO brings exceptional architectural discipline and DevOps rigor. They established our multi-region Kubernetes clusters and automated CI/CD pipelines, slashing release cycles from weeks to hours.',
    rating: 5,
    initials: 'DC',
    color: '#1d4ed8',
  },
  {
    name: 'Amira Hassan',
    role: 'Head of Product & AI, HealthTech AI',
    text: 'Partnering with BRIAMCO was transformative for our AI roadmap. Their team engineered an enterprise RAG pipeline and fine-tuned private LLMs that meet stringent HIPAA and SOC2 compliance standards effortlessly.',
    rating: 5,
    initials: 'AH',
    color: '#0d1b2a',
  },
  {
    name: 'Robert Williams',
    role: 'Founder & CEO, Nexus SaaS Labs',
    text: 'As a rapidly scaling SaaS platform, we needed an engineering partner capable of designing fault-tolerant architectures from day one. BRIAMCO delivered our complete web platform ahead of schedule with flawless code quality.',
    rating: 5,
    initials: 'RW',
    color: '#1e3a5f',
  },
])

const current = ref(0)

function prev() {
  current.value = (current.value - 1 + testimonials.value.length) % testimonials.value.length
}

function next() {
  current.value = (current.value + 1) % testimonials.value.length
}
</script>

<template>
  <section id="testimonials" class="testimonials">
    <!-- Background image area -->
    <div class="testimonials__bg">
      <img :src="content.src1" :alt="content.alt2" />
      <div class="testimonials__bg-overlay"></div>
    </div>

    <div class="container testimonials__inner">
      <div class="testimonials__left">
        <span class="section-tag" style="color:#7eb3ff;">{{ content.text3 }}</span>
        <h2 class="section-title light">{{ content.text4 }}</h2>
        <p class="section-subtitle light" style="margin-bottom:36px;">
          {{ content.text5 }}
        </p>
        <div class="testimonials__nav">
          <button class="testimonials__nav-btn" @click="prev" aria-label="Previous testimonial">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="testimonials__nav-btn" @click="next" aria-label="Next testimonial">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 4l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
        <div class="testimonials__counter">
          <span>{{ String(current + 1).padStart(2, '0') }}</span>
          <span class="testimonials__counter-sep"></span>
          <span style="opacity:0.4">{{ String(testimonials.length).padStart(2, '0') }}</span>
        </div>
      </div>

      <div class="testimonials__right">
        <div
          v-for="(t, i) in testimonials"
          :key="t.name"
          class="testimonial-card"
          :class="{ active: current === i }"
        >
          <!-- Quote icon -->
          <svg class="testimonial-card__quote" width="48" height="36" viewBox="0 0 48 36" fill="none">
            <path d="M0 36V22.286C0 15.238 2.571 9.238 7.714 4.286 12.857 1.429 18 0 23.143 0l1.714 3.429C19.81 4.571 16.19 6.762 13.333 10.095c-2.857 3.238-4.286 6.667-4.286 10.19h8.572V36H0zm24 0V22.286C24 15.238 26.571 9.238 31.714 4.286 36.857 1.429 42 0 47.143 0l1.714 3.429c-5.047 1.142-8.667 3.333-11.524 6.666-2.857 3.238-4.286 6.667-4.286 10.19h8.572V36H24z" fill="currentColor"/>
          </svg>

          <p class="testimonial-card__text">{{ t.text }}</p>

          <div class="testimonial-card__stars">
            <AppIcon
              v-for="n in t.rating"
              :key="n"
              name="star-filled"
              :size="15"
            />
          </div>

          <div class="testimonial-card__author">
            <div class="testimonial-card__avatar" :style="{ background: t.color }">
              {{ t.initials }}
            </div>
            <div>
              <p class="testimonial-card__name">{{ t.name }}</p>
              <p class="testimonial-card__role">{{ t.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.testimonials {
  position: relative;
  padding: 100px 0;
  overflow: hidden;
}

.testimonials__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.testimonials__bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.testimonials__bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(13,27,42,0.97) 0%, rgba(30,58,95,0.92) 100%);
}

.testimonials__inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.testimonials__nav {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.testimonials__nav-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.25);
  background: transparent;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.testimonials__nav-btn:hover {
  background: var(--accent);
  border-color: var(--accent);
}

.testimonials__counter {
  display: flex;
  align-items: center;
  gap: 16px;
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: white;
}

.testimonials__counter-sep {
  flex: 1;
  height: 2px;
  background: rgba(255,255,255,0.25);
  max-width: 40px;
}

/* Cards */
.testimonials__right {
  position: relative;
  min-height: 360px;
}

.testimonial-card {
  display: none;
  background: white;
  border-radius: var(--radius-lg);
  padding: 44px 40px;
  box-shadow: var(--shadow-lg);
  animation: fadeSlideUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
}

.testimonial-card.active {
  display: block;
}

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.testimonial-card__quote {
  color: var(--accent);
  opacity: 0.2;
  margin-bottom: 20px;
}

.testimonial-card__text {
  font-size: 16px;
  line-height: 1.75;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.testimonial-card__stars {
  display: flex;
  align-items: center;
  gap: 3px;
  color: #f59e0b;
  margin-bottom: 24px;
}

.testimonial-card__author {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-top: 20px;
  border-top: 1px solid var(--gray-200);
}

.testimonial-card__avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.testimonial-card__name {
  font-size: 15px;
  font-weight: 700;
  color: var(--navy);
}

.testimonial-card__role {
  font-size: 12px;
  color: var(--text-secondary);
}

@media (max-width: 900px) {
  .testimonials__inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
</style>
