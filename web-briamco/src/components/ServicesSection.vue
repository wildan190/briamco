<script setup lang="ts">
import { useCmsSection, useCmsField } from '../cms/content'
const content = useCmsSection('ServicesSection')

import { ref, computed, watch } from 'vue'
import { services, servicePath, slugify } from '../cms/pages'
import AppIcon from './AppIcon.vue'

interface ServiceItem {
  icon: string
  title: string
  desc: string
  features: string[]
  img1: string
  img2: string
  photo1: string
  photo2: string
  slug?: string
}

const activeTab = ref(0)
const activeSlide = ref(0)

// Curated Unsplash tech photos — shared across service slots
const techPhotos = {
  cloud1: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=700&q=80',
  cloud2: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=700&q=80',
  devops1: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=80',
  devops2: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=700&q=80',
  security1: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=700&q=80',
  security2: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=700&q=80',
  software1: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=700&q=80',
  software2: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=700&q=80',
  mobile1: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=700&q=80',
  mobile2: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&w=700&q=80',
  db1: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=700&q=80',
  db2: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=700&q=80',
  api1: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=700&q=80',
  api2: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=700&q=80',
  ai1: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=700&q=80',
  ai2: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=700&q=80',
  data1: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80',
  data2: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=700&q=80',
  ml1: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
  ml2: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=700&q=80',
  gov1: 'https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&w=700&q=80',
  gov2: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=700&q=80',
}

const originalTabs = useCmsField('ServicesSection', 'tabs', [
  {
    category: 'Enterprise',
    name: 'Cloud & Infrastructure',
    count: '03',
    services: [
      {
        icon: 'settings',
        title: 'Cloud Architecture & Migration',
        desc: 'Scalable multi-cloud and hybrid infrastructure designed for high availability, fault tolerance, and disaster recovery across AWS, Microsoft Azure, and Google Cloud Platform.',
        features: ['Multi-Cloud AWS, Azure & GCP Architecture', 'Kubernetes & Container Orchestration', 'Automated Infrastructure as Code (Terraform)'],
        img1: 'Cloud architects designing distributed infrastructure roadmap',
        img2: 'DevOps team managing multi-region server cluster monitoring',
        photo1: techPhotos.cloud1,
        photo2: techPhotos.cloud2,
      },
      {
        icon: 'bar-chart',
        title: 'DevOps & Platform Engineering',
        desc: 'Accelerate developer velocity and release cycles with modern platform engineering, zero-downtime deployment pipelines, and observability frameworks.',
        features: ['Continuous Integration & Deployment (CI/CD)', 'GitOps & Zero-Downtime Rollouts', 'Observability, Tracing & APM Systems'],
        img1: 'Engineers configuring automated deployment pipelines',
        img2: 'Site reliability engineering team monitoring production telemetry',
        photo1: techPhotos.devops1,
        photo2: techPhotos.devops2,
      },
      {
        icon: 'target',
        title: 'Cybersecurity & Compliance',
        desc: 'Defend your digital assets with enterprise-grade zero-trust architectures, automated vulnerability scanning, penetration testing, and continuous compliance adherence.',
        features: ['Zero-Trust Network Access & IAM', 'SOC2, ISO 27001 & GDPR Compliance', '24/7 Security Operations & Incident Response'],
        img1: 'Cybersecurity analysts reviewing threat detection dashboard',
        img2: 'Security engineers conducting automated penetration tests',
        photo1: techPhotos.security1,
        photo2: techPhotos.security2,
      },
    ],
  },
  {
    category: 'Scaleups',
    name: 'Custom Software',
    count: '04',
    services: [
      {
        icon: 'code',
        title: 'Full-Cycle Web & SaaS Platforms',
        desc: 'Architecting high-performance, fault-tolerant web applications and SaaS platforms. Built with modern microservices, resilient APIs, and reactive frontend experiences.',
        features: ['Microservices & Event-Driven Architecture', 'High-Throughput REST & GraphQL APIs', 'Modern Reactive Web Applications (Vue, React)'],
        img1: 'Software engineering team collaborating on distributed systems',
        img2: 'Full-stack developers reviewing clean code and testing suites',
        photo1: techPhotos.software1,
        photo2: techPhotos.software2,
      },
      {
        icon: 'smartphone',
        title: 'Mobile & Cross-Platform Apps',
        desc: 'Native iOS/Android and high-speed cross-platform apps built with Flutter and React Native. Smooth 60fps performance, offline-first sync, and enterprise security.',
        features: ['Native & Cross-Platform Mobile Engineering', 'Offline-First Synchronization & Caching', 'Enterprise Mobile Security & MDM'],
        img1: 'Mobile developers testing interactive iOS and Android UI',
        img2: 'App engineers inspecting real-time mobile performance diagnostics',
        photo1: techPhotos.mobile1,
        photo2: techPhotos.mobile2,
      },
      {
        icon: 'database',
        title: 'Legacy Modernization & Refactoring',
        desc: 'Transform aging monolithic codebases into modular, cloud-native services with zero downtime and seamless data migration workflows.',
        features: ['Monolith to Microservices Deconstruction', 'Automated CI/CD Migration Pipelines', 'Database Schema Modernization & Zero-Downtime Cuts'],
        img1: 'System architects diagramming database modernization paths',
        img2: 'Senior engineers performing zero-downtime database cutover',
        photo1: techPhotos.db1,
        photo2: techPhotos.db2,
      },
      {
        icon: 'settings',
        title: 'API Integrations & Enterprise Middleware',
        desc: 'Unify disparate enterprise systems, CRMs, ERPs, and billing engines with robust webhook queues, enterprise service buses, and real-time event streaming.',
        features: ['High-Concurrency Message Brokers (Kafka, RabbitMQ)', 'Enterprise ERP & CRM Integration Connectors', 'Secure Webhook Gateways & Rate Limiting'],
        img1: 'Integration developers debugging webhook stream monitoring',
        img2: 'Cloud architects inspecting enterprise API gateway traffic',
        photo1: techPhotos.api1,
        photo2: techPhotos.api2,
      },
    ],
  },
  {
    category: 'Enterprise',
    name: 'AI & Data Intelligence',
    count: '04',
    services: [
      {
        icon: 'brain',
        title: 'Generative AI & LLM Engineering',
        desc: 'Implement enterprise-ready generative AI agents, retrieval-augmented generation (RAG) pipelines, and private fine-tuned LLMs with stringent guardrails.',
        features: ['Production RAG & Vector Database Search', 'Private LLM Fine-Tuning & Self-Hosting', 'Enterprise Guardrails, Privacy & Token Cost Optimization'],
        img1: 'AI researchers evaluating LLM prompt orchestration pipelines',
        img2: 'Machine learning engineers running vector search benchmarks',
        photo1: techPhotos.ai1,
        photo2: techPhotos.ai2,
      },
      {
        icon: 'bar-chart',
        title: 'Data Warehousing & Real-Time Pipelines',
        desc: 'Modern data stack implementations aggregating terabytes of distributed logs, user events, and transactional records into unified, query-ready warehouses.',
        features: ['Real-Time Stream Processing (Apache Flink, Kafka)', 'Snowflake, BigQuery & Databricks Modern Data Lakes', 'Automated dbt Modeling & Data Quality Validation'],
        img1: 'Data engineers configuring real-time ETL streaming pipelines',
        img2: 'Analytics team reviewing Snowflake warehouse query performance',
        photo1: techPhotos.data1,
        photo2: techPhotos.data2,
      },
      {
        icon: 'target',
        title: 'Predictive Analytics & ML Ops',
        desc: 'Deploy custom machine learning models into production with automated model training pipelines, drift detection, and reproducible artifact registries.',
        features: ['Customer Churn & Demand Forecasting Models', 'Automated CI/CD for Machine Learning (MLOps)', 'Real-Time Inference Serving & Drift Monitoring'],
        img1: 'Data scientists validating predictive model precision curves',
        img2: 'MLOps engineer deploying containerized model inference workers',
        photo1: techPhotos.ml1,
        photo2: techPhotos.ml2,
      },
      {
        icon: 'shield',
        title: 'Data Governance & Compliance',
        desc: 'Ensure end-to-end data lineage, automated PII anonymization, and regulatory data compliance across global sovereign boundaries.',
        features: ['Automated PII Redaction & Data Masking', 'Role-Based Data Access Controls & Auditing', 'GDPR, HIPAA & SOC2 Compliant Data Topologies'],
        img1: 'Data governance officers reviewing data lineage catalog',
        img2: 'Compliance team reviewing automated privacy audit logs',
        photo1: techPhotos.gov1,
        photo2: techPhotos.gov2,
      },
    ],
  },
])

const tabs = computed(() => {
  if (!services.value.length) return originalTabs.value
  const groups = [...new Set(services.value.map(service => service.group))]
  return groups.map((group, groupIndex) => {
    const tab = originalTabs.value.find(item => item.name === group) || originalTabs.value[groupIndex % originalTabs.value.length]!
    const published = services.value.filter(service => service.group === group)
    return { ...tab, name: group, count: String(published.length).padStart(2, '0'), services: published.map((service, index) => {
      const visual = tab.services[index] || tab.services[0]!
      return { ...visual, slug: service.slug, title: service.title, desc: service.description, features: service.features,
        photo1: service.imageUrl || visual.photo1, img1: service.imageAlt || visual.img1 }
    }) }
  })
})
const currentService = computed<ServiceItem>(() => tabs.value[activeTab.value]?.services[currentSlideIndex.value] || tabs.value[0]!.services[0]!)
const currentSlideIndex = ref(0)

watch(tabs, () => {
  if (activeTab.value >= tabs.value.length) activeTab.value = 0
  if (currentSlideIndex.value >= tabs.value[activeTab.value]!.services.length) currentSlideIndex.value = 0
})

function selectTab(i: number) {
  activeTab.value = i
  currentSlideIndex.value = 0
}

function prevSlide() {
  const services = tabs.value[activeTab.value]!.services
  currentSlideIndex.value = (currentSlideIndex.value - 1 + services.length) % services.length
}

function nextSlide() {
  const services = tabs.value[activeTab.value]!.services
  currentSlideIndex.value = (currentSlideIndex.value + 1) % services.length
}
</script>

<template>
  <section v-if="services.length" id="services" class="services">
    <div class="container">

      <!-- Header: 3-column -->
      <div class="services__header">
        <div class="services__header-left">
          <span class="section-tag">{{ content.text1 }}</span>
          <h2 class="section-title">{{ content.text2 }}<br />{{ content.text3 }}</h2>
        </div>
        <p class="services__header-desc">
          {{ content.text4 }}
        </p>
        <RouterLink to="/contact" class="services__header-btn">
          <span>{{ content.text5 }}</span>
          <div class="services__header-btn-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
        </RouterLink>
      </div>

      <!-- Tabs -->
      <div class="services__tabs">
        <button
          v-for="(tab, i) in tabs"
          :key="tab.name"
          class="services__tab"
          :class="{ active: activeTab === i }"
          @click="selectTab(i)"
        >
          <span class="services__tab-category">{{ tab.category }}</span>
          <div class="services__tab-bottom">
            <span class="services__tab-name">{{ tab.name }}</span>
            <span class="services__tab-count">{{ content.text6 }}{{ tab.count }}{{ content.text7 }}</span>
          </div>
        </button>
      </div>

      <!-- Panel -->
      <div class="services__panel">
        <div class="services__panel-left" :key="currentService.title">

          <!-- Icon -->
          <div class="services__panel-icon">
            <AppIcon :name="currentService.icon" :size="24" :stroke-width="1.8" />
          </div>

          <h3 class="services__panel-title">{{ currentService.title }}</h3>
          <p class="services__panel-desc">{{ currentService.desc }}</p>

          <!-- Features -->
          <ul class="services__features">
            <li v-for="f in currentService.features" :key="f" class="services__feature">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              {{ f }}
            </li>
          </ul>

          <!-- CTA + small image row -->
          <div class="services__panel-footer">
            <RouterLink :to="servicePath(currentService.slug || slugify(currentService.title))" class="services__detail-btn">
              <span>{{ content.text8 }}</span>
              <div class="services__detail-btn-icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
            </RouterLink>
            <div class="services__panel-img-sm">
              <img :src="currentService.photo1" :alt="currentService.img1" />
              <div class="services__panel-img-bg services__panel-img-bg--1"></div>
            </div>
          </div>
        </div>

        <!-- Right: large image + nav arrows -->
        <div class="services__panel-right">
          <div class="services__panel-img-lg" :key="currentService.img2">
            <img :src="currentService.photo2" :alt="currentService.img2" />
            <div class="services__panel-img-bg services__panel-img-bg--2"></div>
          </div>
          <div class="services__panel-nav">
            <button class="services__nav-btn" @click="prevSlide" aria-label="Previous service">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button class="services__nav-btn" @click="nextSlide" aria-label="Next service">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 4l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>

    </div>
  </section>
<section v-else class="services"><div class="container">No services published yet.</div></section>
</template>

<style scoped>
.services {
  padding: 100px 0;
  background: var(--white);
}

/* ===== HEADER ===== */
.services__header {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 48px;
  align-items: center;
  margin-bottom: 48px;
}

.services__header-left .section-tag {
  margin-bottom: 14px;
}

.services__header-desc {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.75;
}

.services__header-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: var(--navy);
  color: white;
  padding: 14px 24px;
  border-radius: 99px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;
  transition: var(--transition);
}

.services__header-btn:hover {
  background: var(--accent);
  transform: translateY(-2px);
}

.services__header-btn-icon {
  width: 32px;
  height: 32px;
  background: white;
  color: var(--navy);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: var(--transition);
}

.services__header-btn:hover .services__header-btn-icon {
  background: rgba(255,255,255,0.2);
  color: white;
}

/* ===== TABS ===== */
.services__tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-bottom: 1px solid var(--gray-200);
  margin-bottom: 52px;
}

.services__tab {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 0 20px 0;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
  text-align: left;
  transition: var(--transition);
  position: relative;
}

.services__tab + .services__tab {
  padding-left: 32px;
  border-left: 1px solid var(--gray-200);
}

.services__tab-category {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text-light);
  transition: color 0.2s;
}

.services__tab-bottom {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.services__tab-name {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--gray-400);
  transition: color 0.25s;
}

.services__tab-count {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-light);
  transition: color 0.25s;
}

.services__tab.active {
  border-bottom-color: var(--navy);
}

.services__tab.active .services__tab-category {
  color: var(--accent);
}

.services__tab.active .services__tab-name {
  color: var(--navy);
}

.services__tab.active .services__tab-count {
  color: var(--text-secondary);
}

.services__tab:hover:not(.active) .services__tab-name {
  color: var(--navy);
}

/* ===== PANEL ===== */
.services__panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: stretch;
  min-height: 480px;
}

/* Left */
.services__panel-left {
  display: flex;
  flex-direction: column;
  animation: fadeSlideUp 0.45s cubic-bezier(0.4,0,0.2,1) both;
}

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

.services__panel-icon {
  width: 56px;
  height: 56px;
  background: var(--navy);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 24px;
}

.services__panel-title {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 16px;
  line-height: 1.3;
}

.services__panel-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 28px;
}

.services__features {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 32px;
  flex-shrink: 0;
}

.services__feature {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--navy);
}

.services__feature svg {
  color: var(--accent);
  flex-shrink: 0;
}

/* Footer: CTA + small image */
.services__panel-footer {
  display: flex;
  align-items: stretch;
  gap: 20px;
  flex: 1;
  min-height: 140px;
}

.services__detail-btn {
  display: inline-flex;
  align-items: center;
  align-self: flex-end;
  gap: 12px;
  background: var(--navy);
  color: white;
  padding: 13px 22px;
  border-radius: 99px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: var(--transition);
  flex-shrink: 0;
  height: fit-content;
}

.services__detail-btn:hover {
  background: var(--accent);
  transform: translateY(-2px);
}

.services__detail-btn-icon {
  width: 28px;
  height: 28px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.services__panel-img-sm {
  position: relative;
  flex: 1;
  min-width: 0;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.services__panel-img-sm img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

/* Right */
.services__panel-right {
  position: relative;
  display: flex;
  flex-direction: column;
  animation: fadeSlideUp 0.5s 0.1s cubic-bezier(0.4,0,0.2,1) both;
}

.services__panel-img-lg {
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 320px;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.services__panel-img-lg img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}

.services__panel-img-bg {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.services__panel-img-bg--1 {
  background: linear-gradient(to bottom, rgba(13,27,42,0.10) 0%, rgba(13,27,42,0.45) 100%);
}

.services__panel-img-bg--2 {
  background: linear-gradient(to bottom, rgba(13,27,42,0.08) 0%, rgba(37,99,235,0.18) 100%);
}

/* Nav arrows */
.services__panel-nav {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 16px;
}

.services__nav-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1.5px solid var(--gray-200);
  background: white;
  color: var(--navy);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
}

.services__nav-btn:hover {
  background: var(--navy);
  color: white;
  border-color: var(--navy);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .services__header {
    grid-template-columns: 1fr 1fr;
  }
  .services__header-btn {
    grid-column: 1 / -1;
    justify-self: start;
  }
}

@media (max-width: 768px) {
  .services__header {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .services__tabs {
    grid-template-columns: 1fr;
    border-bottom: none;
    gap: 2px;
  }
  .services__tab {
    padding: 16px 0;
    border-bottom: 1px solid var(--gray-200);
    border-left: none !important;
    border-right: none;
  }
  .services__tab + .services__tab {
    padding-left: 0;
    border-left: none;
  }
  .services__tab.active {
    border-bottom-color: var(--navy);
    border-left: 4px solid var(--navy) !important;
    padding-left: 16px;
  }
  .services__panel {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .services__panel-footer {
    flex-wrap: wrap;
  }
  .services__panel-img-sm {
    width: 100%;
    height: 180px;
  }
}
</style>
