<script setup lang="ts">
import { useCmsSection, useCmsField } from '../cms/content'
const content = useCmsSection('TeamSection')

const team = useCmsField('TeamSection', 'team', [
  { name: 'Jonathan Lee', role: 'Chief Technology Officer', initials: 'JL', color: '#0d1b2a', img: 'Executive portrait of Jonathan Lee CTO', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80' },
  { name: 'Maria Santos', role: 'VP of Platform Engineering', initials: 'MS', color: '#1e3a5f', img: 'Professional portrait of Maria Santos VP Engineering', photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Alex Kim', role: 'Principal Cloud Architect', initials: 'AK', color: '#2563eb', img: 'Professional headshot of Alex Kim Cloud Architect', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
  { name: 'Priya Sharma', role: 'Head of AI & Machine Learning', initials: 'PS', color: '#1a2e44', img: 'Professional portrait of Priya Sharma AI Head', photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=600&q=80' },
])
</script>

<template>
  <section class="team">
    <div class="container">
      <div class="team__header">
        <div>
          <span class="section-tag">{{ content.text1 }}</span>
          <h2 class="section-title">{{ content.text2 }}</h2>
        </div>
        <p class="section-subtitle">
          {{ content.text3 }}
        </p>
      </div>

      <div class="team__grid">
        <div v-for="member in team" :key="member.name" class="team-card">
          <div class="team-card__img-wrap">
            <img :src="member.photo" :alt="member.img" class="team-card__img" />
            <div class="team-card__img-bg" :style="{ background: member.color }">
              <span class="team-card__initials">{{ member.initials }}</span>
            </div>
            <div class="team-card__overlay">
              <div class="team-card__socials">
                <a href="#" aria-label="LinkedIn" class="team-card__social">{{ content.text4 }}</a>
                <a href="#" aria-label="Email" class="team-card__social">{{ content.text5 }}</a>
              </div>
            </div>
          </div>
          <div class="team-card__info">
            <h4 class="team-card__name">{{ member.name }}</h4>
            <p class="team-card__role">{{ member.role }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.team {
  padding: 100px 0;
  background: var(--off-white);
}

.team__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
  margin-bottom: 56px;
}

.team__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
}

.team-card {
  background: var(--white);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.team-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.team-card__img-wrap {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
}

.team-card__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  z-index: 2;
}

.team-card__img-bg {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.team-card__initials {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 800;
  color: rgba(255,255,255,0.25);
  letter-spacing: -2px;
}

.team-card__overlay {
  position: absolute;
  inset: 0;
  background: rgba(37,99,235,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.35s;
  z-index: 3;
}

.team-card:hover .team-card__overlay {
  opacity: 1;
}

.team-card__socials {
  display: flex;
  gap: 12px;
}

.team-card__social {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid white;
  color: white;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s;
}

.team-card__social:hover {
  background: white;
  color: var(--accent);
}

.team-card__info {
  padding: 20px 22px 24px;
  border-top: 1px solid var(--gray-200);
}

.team-card__name {
  font-size: 15px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 4px;
}

.team-card__role {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

@media (max-width: 900px) {
  .team__grid { grid-template-columns: repeat(2, 1fr); }
  .team__header { flex-direction: column; }
}

@media (max-width: 480px) {
  .team__grid { grid-template-columns: 1fr 1fr; }
}
</style>
