import partnerDefaults from './partners.defaults.json'
import { locale, t } from '../i18n'
import defaultsId from './defaults.id.json'
import { contentUrl } from './preview'
import { computed, reactive } from 'vue'
import defaults from './defaults.json'

type Section = keyof typeof defaults
const sections = reactive(structuredClone(locale.value === 'id' ? defaultsId : defaults) as typeof defaults)
let loadVersion = 0
let activeLocale = locale.value
export interface BusinessPartner { id: string; name: string; imageUrl: string; logoAlt: string; website: string }
const partnerState = reactive({items: partnerDefaults as BusinessPartner[]})
export const businessPartners = computed(() => partnerState.items)
export const cmsState = reactive({ loaded: false, error: '' })
export const cmsUrl = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')

// Accept only the existing content shape. Layout, scripts and styles stay in Vue.
function compatible(value: unknown, sample: unknown): boolean {
  if (Array.isArray(sample)) return Array.isArray(value) && value.length > 0 && value.every(item => compatible(item, sample[0]))
  if (sample !== null && typeof sample === 'object') return value !== null && typeof value === 'object' && Object.entries(sample).every(([key, child]) => compatible((value as Record<string, unknown>)[key], child))
  return typeof value === typeof sample
}
export function useCmsSection<K extends Section>(key: K) {
  return computed(() => sections[key])
}
export function useCmsField<T>(section: Section, field: string, fallback: T) {
  return computed(() => {
    const value = (sections[section] as Record<string, unknown>)[field]
    const sample = (defaults[section] as Record<string, unknown>)[field] ?? fallback
    return (compatible(value, sample) || (field === 'articles' && Array.isArray(value) && !value.length)) ? value as T : fallback
  })
}
function safeUrls(value: unknown, field = ''): boolean {
  if (typeof value === 'string' && /^(src\d*|href\d*|img|photo\d*|imageUrl)$/.test(field)) {
    return (value === '' || /^(https?:\/\/|\/(?!\/)|#|mailto:|tel:)/i.test(value.trim())) && !/[\u0000-\u001f]/.test(value)
  }
  if (Array.isArray(value)) return value.every(item => safeUrls(item))
  if (value && typeof value === 'object') return Object.entries(value).every(([key, child]) => safeUrls(child, key))
  return true
}
function ordered(value: unknown, sample: unknown): unknown {
  if (Array.isArray(sample) && Array.isArray(value)) return value.map(item => ordered(item, sample[0]))
  if (sample && typeof sample === 'object' && value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(sample).map(([key, child]) => [key, ordered((value as Record<string, unknown>)[key], child)]))
  }
  return value
}
export async function loadContent() {
  const version = ++loadVersion
  if (activeLocale !== locale.value) {
    Object.assign(sections, structuredClone(locale.value === 'id' ? defaultsId : defaults))
    activeLocale = locale.value
  }
  cmsState.loaded = false
  try {
    const response = await fetch(contentUrl(`${cmsUrl}/api/website-content`), { signal: AbortSignal.timeout(8000) })
    if (!response.ok) throw new Error(`CMS HTTP ${response.status}`)
    const { data, partners } = await response.json()
    if (version !== loadVersion) return
    if (Array.isArray(partners)) partnerState.items = partners.filter((partner:BusinessPartner) => typeof partner.id === 'string' && typeof partner.name === 'string').map((partner:BusinessPartner) => ({id:partner.id,name:partner.name,logoAlt:typeof partner.logoAlt === 'string' ? partner.logoAlt : partner.name,imageUrl:typeof partner.imageUrl === 'string' && /^(https?:\/\/|\/(?!\/))/i.test(partner.imageUrl) ? partner.imageUrl : '',website:typeof partner.website === 'string' && /^https?:\/\//i.test(partner.website) ? partner.website : ''}))
    for (const key of Object.keys(defaults) as Section[]) {
      const incoming = data?.[key]
      if (!incoming || typeof incoming !== 'object') continue
      const target = sections[key] as Record<string, unknown>
      if (key === 'NavBar' && Array.isArray(incoming.navLinks)) {
        target.navLinks = incoming.navLinks.filter((link: {label?:unknown;href?:unknown;type?:unknown}) => typeof link.label === 'string' && typeof link.href === 'string' && /^\/(?!\/)/.test(link.href) && !/[\u0000-\u0020\\]/.test(link.href)).map((link: {label:string;href:string;type?:string}) => ({label:link.label,href:link.href,type:link.type === 'services' ? 'services' : 'link'}))
      }
      for (const [field, sample] of Object.entries(defaults[key])) {
        if (key === 'NavBar' && field === 'navLinks') continue
        if ((compatible(incoming[field], sample) || (key === 'BlogSection' && field === 'articles' && Array.isArray(incoming[field]) && !incoming[field].length)) && safeUrls(incoming[field], field)) target[field] = ordered(incoming[field], sample)
      }
    }
    cmsState.loaded = true
    cmsState.error = ''
  } catch (error) {
    if (version !== loadVersion) return
    cmsState.error = error instanceof Error ? error.message : 'CMS unavailable'
    console.warn('Using bundled website content:', cmsState.error)
  }
}
export async function submitInquiry(data: { name: string; email: string; subject: string; message: string }) {
  const response = await fetch(`${cmsUrl}/api/website-inquiries`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }), signal: AbortSignal.timeout(15000),
  })
  const failure = () => new Error(t('Your request could not be saved. Please try again.'))
  if (response.status !== 201) throw failure()
  let result
  try { result = await response.json() } catch { throw failure() }
  if (result?.data?.received !== true || typeof result.data.reference !== 'string' || !result.data.reference) throw failure()
  return result.data.reference as string
}
