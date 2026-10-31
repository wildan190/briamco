<script setup lang="ts">
import { businessPartners, useCmsSection } from '../cms/content'
const content = useCmsSection('TrustedBySection')
</script>
<template>
  <section id="clients" class="trusted-section">
    <div class="container">
      <div class="trusted__header">
        <span class="trusted__line" aria-hidden="true"></span>
        <p class="trusted__title">{{ content.text1 }} <strong>{{ content.text2 }}</strong> {{ content.text3 }}</p>
        <span class="trusted__line" aria-hidden="true"></span>
      </div>
      <div class="trusted__logos">
        <component :is="partner.website ? 'a' : 'div'" v-for="partner in businessPartners" :key="partner.id" class="trusted__logo-item" :title="partner.name" :href="partner.website || undefined" :target="partner.website ? '_blank' : undefined" :rel="partner.website ? 'noopener noreferrer' : undefined">
          <img v-if="partner.imageUrl" :src="partner.imageUrl" :alt="partner.logoAlt || partner.name" class="trusted__partner-logo" loading="lazy" />
          <span v-else class="trusted__partner-name">{{ partner.name }}</span>
        </component>
      </div>
    </div>
  </section>
</template>
<style scoped>
/* ===== TRUSTED BY SECTION ===== */
.trusted-section {
  background: #ffffff;
  padding: 64px 0 76px;
  position: relative;
  border-top: 1px solid #f1f5f9;
}

/* Header line */
.trusted__header {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-bottom: 52px;
  width: 100%;
}

.trusted__line {
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.trusted__title {
  font-size: 13.5px;
  color: #64748b;
  white-space: nowrap;
  letter-spacing: 0.2px;
  text-align: center;
}

.trusted__title strong {
  color: #0f172a;
  font-weight: 700;
}

/* Logos Row */
.trusted__logos {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 36px;
  width: 100%;
}

.trusted__logo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  flex-shrink: 0;
}

.trusted__logo-item:hover {
  transform: translateY(-2px);
}

.trusted__svg {
  display: block;
  transition: all 0.25s ease;
}

/* Muted grey logos */
.trusted__svg--muted {
  color: #94a3b8;
  opacity: 0.85;
}

.trusted__logo-item:hover .trusted__svg--muted {
  color: #64748b;
  opacity: 1;
}

/* High contrast dark logo (Alohu) */
.trusted__svg--dark {
  color: #0e1b2a;
  opacity: 1;
}

.trusted__logo-item:hover .trusted__svg--dark {
  color: #1d4ed8;
}

.trusted__partner-logo { display: block; width: auto; max-width: 155px; height: 42px; object-fit: contain; filter: grayscale(1); opacity: .85; transition: opacity .25s ease; }
.trusted__logo-item:hover .trusted__partner-logo { opacity: 1; }
.trusted__partner-name { color: #64748b; font-weight: 700; font-size: 18px; }
.trusted__logo-item:focus-visible { outline: 2px solid #64748b; outline-offset: 6px; border-radius: 4px; }
/* ===== RESPONSIVE ===== */
@media (max-width: 1080px) {
  .trusted__logos {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 36px 24px;
    justify-items: center;
  }
}

@media (max-width: 640px) {
  .trusted-section {
    padding: 48px 0 56px;
  }

  .trusted__header {
    gap: 16px;
    margin-bottom: 36px;
  }

  .trusted__title {
    font-size: 12px;
    white-space: normal;
  }

  .trusted__logos {
    grid-template-columns: repeat(2, 1fr);
    gap: 28px 16px;
  }
}
</style>
