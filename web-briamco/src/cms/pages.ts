import { t } from '../i18n'
import englishDefaults from './defaults.json'
import { contentUrl } from './preview'
import { computed, reactive } from 'vue'
import { cmsUrl, useCmsSection } from './content'

export type InsightType = 'blog' | 'news'
export interface Insight {
  id: number; slug: string; type: InsightType; title: string; excerpt: string
  author: string; badge: string; day: string; month: string; img: string; alt: string
  date?: string; content?: string
}
export interface ServiceOffering { title: string; description: string; bullets: string[]; content: string }
export interface Service {
  overviewTitle?: string; overviewLead?: string; offerings?: ServiceOffering[]
  slug: string; title: string; group: string; description: string; content: string
  features: string[]; imageUrl: string; imageAlt: string
}
export class PageError extends Error {
  constructor(public status: number, message: string) { super(message) }
}
export function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
export function insightPath(post: Pick<Insight, 'type' | 'slug'>) {
  return `/insight/${post.type}/${encodeURIComponent(post.slug)}`
}
export function servicePath(slug: string) { return `/services/${encodeURIComponent(slug)}` }
export function safeImage(url: string) {
  return /^(https?:\/\/|\/(?!\/))/i.test(url) ? url : ''
}
export async function getPage<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(contentUrl(`${cmsUrl}/api/${path}`), { signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(10000)]) : AbortSignal.timeout(10000) })
  if (!response.ok) throw new PageError(response.status, t(response.status === 404 ? 'This page could not be found.' : 'Content could not be loaded. Please try again.'))
  return response.json()
}
const serviceState = reactive({ items: [] as Service[], loaded: false })
const serviceSection = useCmsSection('ServicesSection')
export const services = computed<Service[]>(() => serviceState.loaded ? serviceState.items : serviceSection.value.tabs.flatMap( (tab, tabIndex) => tab.services.map((item, itemIndex) => ({
  slug: slugify(englishDefaults.ServicesSection.tabs[tabIndex]!.services[itemIndex]!.title), title: item.title, group: tab.name, description: item.desc,
  content: item.desc, features: item.features, imageUrl: item.photo1, imageAlt: item.img1,
}))))
let serviceVersion = 0
export async function loadServices() {
  const version = ++serviceVersion
  serviceState.loaded = false
  try {
    const response = await getPage<{ data: Service[] }>('website-services')
    if (!Array.isArray(response.data)) throw new Error('Invalid service response')
    if (version !== serviceVersion) return
    serviceState.items = response.data
    serviceState.loaded = true
  } catch (error) { console.warn('Service navigation unavailable:', error) }
}
