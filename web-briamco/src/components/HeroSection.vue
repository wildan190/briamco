<script setup lang="ts">
import { useCmsSection, useCmsField } from '../cms/content'
const content = useCmsSection('HeroSection')

const marqueeItems = useCmsField('HeroSection', 'marqueeItems', [
  'Enterprise Architecture. Resilient Systems.',
  'Scalable Cloud Platforms. Intelligent AI.',
  'Modernize Your Digital Infrastructure',
  'High-Performance Engineering Teams',
  'Powering Next-Gen Global Enterprises',
])

const stats = useCmsField('HeroSection', 'stats', [
  { value: '1,200+', label: 'Enterprise tech solutions and cloud architectures deployed globally.' },
  { value: '99.99%', label: 'Uptime reliability achieved across mission-critical client infrastructure.' },
  { value: '4.8x', label: 'Average acceleration in deployment speed and developer productivity.' },
  { value: '150+', label: 'Senior tech leads, cloud architects, and AI research engineers.' },
])
</script>

<template>
  <!-- Top contact bar -->
  <div class="topbar">
    <div class="container topbar__inner">
      <div class="topbar__left">
        <a :href="content.href1" class="topbar__item">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          {{ content.text2 }}
        </a>
        <span class="topbar__dot">•</span>
        <RouterLink to="/contact" class="topbar__item">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {{ content.text3 }}
        </RouterLink>
      </div>
      <div class="topbar__right">
        <span class="topbar__item">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {{ content.text4 }}
        </span>
      </div>
    </div>
  </div>

  <!-- Hero wrapper -->
  <section id="home" class="hero">
    <div class="container">

      <!-- Text 2-column layout -->
      <div class="hero__text-row">
        <!-- Left: label + headline -->
        <div class="hero__col-left">
          <p class="hero__label">{{ content.text5 }}</p>
          <h1 class="hero__headline">
            {{ content.text6 }}<br />{{ content.text7 }}
          </h1>
        </div>

        <!-- Vertical divider -->
        <div class="hero__divider" aria-hidden="true"></div>

        <!-- Right: description + CTA + social proof -->
        <div class="hero__col-right">
          <p class="hero__desc">
            {{ content.text8 }}
          </p>
          <div class="hero__cta-row">
            <RouterLink to="/contact" class="hero__cta-btn">
              <span>{{ content.text9 }}</span>
              <div class="hero__cta-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
            </RouterLink>
            <div class="hero__reviews">
              <div class="hero__avatars">
                <div class="hero__avatar" style="background:#2563eb;">{{ content.text10 }}</div>
                <div class="hero__avatar" style="background:#1e3a5f;">{{ content.text11 }}</div>
                <div class="hero__avatar" style="background:#0d1b2a;">{{ content.text12 }}</div>
                <div class="hero__avatar hero__avatar--plus">+</div>
              </div>
              <p class="hero__reviews-text">{{ content.text13 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Full-width image -->
      <div class="hero__image-wrap">
        <img
          :src="content.src14"
          :alt="content.alt15"
          class="hero__image"
        />
        <div class="hero__image-bg"></div>
      </div>

    </div>

    <!-- Marquee ticker -->
    <div class="hero__ticker">
      <div class="hero__ticker-track">
        <span
          v-for="(item, i) in [...marqueeItems, ...marqueeItems]"
          :key="i"
          class="hero__ticker-item"
        >
          {{ item }}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9h12M11 5l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </div>
    </div>

    <!-- Stats bar -->
    <div class="hero__stats">
      <div class="container">
        <div class="hero__stats-grid">
          <div
            v-for="stat in stats"
            :key="stat.value"
            class="hero__stat"
          >
            <span class="hero__stat-dot" aria-hidden="true"></span>
            <span class="hero__stat-value">{{ stat.value }}</span>
            <p class="hero__stat-label">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped>
/* ===== TOP BAR ===== */
.topbar {
  background: #0a1520;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  padding: 8px 0;
  position: relative;
  z-index: 1001;
}

.topbar__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topbar__left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.topbar__right {
  display: flex;
  align-items: center;
}

.topbar__item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(255,255,255,0.55);
  text-decoration: none;
  transition: color 0.2s;
  font-weight: 400;
}

.topbar__item:hover {
  color: rgba(255,255,255,0.9);
}

.topbar__dot {
  color: rgba(255,255,255,0.25);
  font-size: 10px;
}

/* ===== HERO ===== */
.hero {
  background: var(--navy);
  padding-top: 100px; /* offset for topbar (36px) + navbar (~64px) */
}

/* ===== TEXT ROW ===== */
.hero__text-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0;
  align-items: center;
  padding: 72px 0 56px;
  position: relative;
  z-index: 3;
}

.hero__col-left {
  padding-right: 56px;
}

.hero__label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.45);
  margin-bottom: 20px;
}

.hero__headline {
  font-family: var(--font-display);
  font-size: clamp(36px, 4.5vw, 56px);
  font-weight: 800;
  color: var(--white);
  line-height: 1.12;
  letter-spacing: -1.5px;
}

.hero__divider {
  width: 1px;
  height: 160px;
  background: rgba(255,255,255,0.12);
  flex-shrink: 0;
}

.hero__col-right {
  padding-left: 56px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.hero__desc {
  font-size: 15px;
  color: rgba(255,255,255,0.6);
  line-height: 1.75;
}

.hero__cta-row {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

/* CTA button — white pill */
.hero__cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  background: rgba(255,255,255,0.95);
  color: var(--navy);
  padding: 14px 20px 14px 28px;
  border-radius: 99px;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  transition: var(--transition);
  backdrop-filter: blur(8px);
}

.hero__cta-btn:hover {
  background: var(--white);
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.3);
}

.hero__cta-icon {
  width: 36px;
  height: 36px;
  background: var(--navy);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.25s;
}

.hero__cta-btn:hover .hero__cta-icon {
  background: var(--accent);
}

/* Reviews / social proof */
.hero__reviews {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hero__avatars {
  display: flex;
}

.hero__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--navy);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: white;
  margin-left: -8px;
  flex-shrink: 0;
}

.hero__avatars .hero__avatar:first-child {
  margin-left: 0;
}

.hero__avatar--plus {
  background: rgba(255,255,255,0.12);
  font-size: 13px;
}

.hero__reviews-text {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,0.5);
  white-space: nowrap;
}

/* ===== FULL-WIDTH IMAGE ===== */
.hero__image-wrap {
  position: relative;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 21/9;
  margin-bottom: 0;
}

.hero__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.hero__image-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    160deg,
    rgba(13,27,42,0.72) 0%,
    rgba(26,46,68,0.60) 40%,
    rgba(30,58,95,0.50) 70%,
    rgba(13,27,42,0.75) 100%
  );
  z-index: 2;
}

/* ===== MARQUEE TICKER ===== */
.hero__ticker {
  overflow: hidden;
  padding: 20px 0;
  border-top: 1px solid rgba(255,255,255,0.06);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  margin-top: 32px;
  white-space: nowrap;
}

.hero__ticker-track {
  display: inline-flex;
  gap: 0;
  animation: ticker 28s linear infinite;
}

@keyframes ticker {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.hero__ticker-track:hover {
  animation-play-state: paused;
}

.hero__ticker-item {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 500;
  color: rgba(255,255,255,0.6);
  padding: 0 48px;
  transition: color 0.2s;
}

.hero__ticker-item:hover {
  color: rgba(255,255,255,0.9);
}

.hero__ticker-item svg {
  flex-shrink: 0;
  color: rgba(255,255,255,0.3);
}

/* ===== STATS BAR ===== */
.hero__stats {
  background: #0a1520;
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 52px 0;
}

.hero__stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
}

.hero__stat {
  padding: 0 40px;
  border-right: 1px solid rgba(255,255,255,0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hero__stat:last-child {
  border-right: none;
}

.hero__stat:first-child {
  padding-left: 0;
}

.hero__stat-dot {
  display: block;
  width: 6px;
  height: 6px;
  background: var(--accent);
  border-radius: 50%;
}

.hero__stat-value {
  font-family: var(--font-display);
  font-size: clamp(36px, 4vw, 52px);
  font-weight: 800;
  color: var(--white);
  letter-spacing: -2px;
  line-height: 1;
}

.hero__stat-label {
  font-size: 13px;
  color: rgba(255,255,255,0.45);
  line-height: 1.6;
  max-width: 180px;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .hero__text-row {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 48px 0 40px;
  }

  .hero__col-left { padding-right: 0; }
  .hero__divider { display: none; }
  .hero__col-right { padding-left: 0; }

  .hero__image-wrap { aspect-ratio: 16/9; }
  .hero__stats-grid { grid-template-columns: repeat(2, 1fr); }

  .hero__stat {
    padding: 24px;
    border-right: none;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .hero__stat:nth-child(2),
  .hero__stat:nth-child(4) {
    border-right: none;
  }
}

@media (max-width: 600px) {
  .topbar { display: none; }
  .hero__cta-row { flex-direction: column; align-items: flex-start; }
  .hero__image-wrap { aspect-ratio: 4/3; border-radius: 10px; }
  .hero__stats-grid { grid-template-columns: 1fr 1fr; }
}
</style>
