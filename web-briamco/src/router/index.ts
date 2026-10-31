import { t } from '../i18n'
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage, meta: { title: 'Home' } },
    ...(['about', 'services', 'solutions', 'contact'] as const).map(section => ({
      path: '/' + section, name: section, component: () => import('../views/SectionPage.vue'), props: { section }, meta: { title: section[0]!.toUpperCase() + section.slice(1) },
    })),
    { path: '/people', name: 'people', component: () => import('../views/PeoplePage.vue'), meta: { title: 'People' } },
    { path: '/people/:slug', name: 'person-detail', component: () => import('../views/PeoplePage.vue'), props: true, meta: { title: 'People' } },
    { path: '/careers', name: 'careers', component: () => import('../views/CareersPage.vue'), meta: { title: 'Careers' } },
    { path: '/careers/:slug', name: 'career-detail', component: () => import('../views/CareersPage.vue'), props: true, meta: { title: 'Careers' } },
    { path: '/services/:slug', name: 'service-detail', component: () => import('../views/ServiceDetail.vue'), props: true, meta: { title: 'Service' } },
    { path: '/insight', name: 'insight', component: () => import('../views/InsightPage.vue'), meta: { title: 'Insight' } },
    { path: '/insight/:type(blog|news)', name: 'insight-category', component: () => import('../views/InsightPage.vue'), props: true, meta: { title: 'Insight' } },
    { path: '/insight/:type(blog|news)/:slug', name: 'insight-detail', component: () => import('../views/InsightDetail.vue'), props: true, meta: { title: 'Insight' } },
    { path: '/blog', redirect: '/insight/blog' },
    { path: '/news', redirect: '/insight/news' },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFound.vue'), meta: { title: 'Page not found' } },
  ],
  scrollBehavior(_to, _from, savedPosition) { return savedPosition || { top: 0, left: 0, behavior: 'instant' } },
})
router.afterEach(to => { document.title = `${t(String(to.meta.title || 'Insight'))} | BRIAMCO` })
export default router
