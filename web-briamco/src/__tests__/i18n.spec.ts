import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { detectLocale, locale, setLanguage, t } from '../i18n'
import { loadContent, useCmsSection } from '../cms/content'
import { contentUrl } from '../cms/preview'
beforeEach(() => {
  const storage = () => { const values = new Map<string,string>(); return {getItem:(key:string)=>values.get(key) ?? null,setItem:(key:string,value:string)=>values.set(key,value),removeItem:(key:string)=>values.delete(key),clear:()=>values.clear()} }
  vi.stubGlobal('localStorage', storage())
  vi.stubGlobal('sessionStorage', storage())
})
afterEach(() => { setLanguage('en'); window.localStorage.clear(); window.sessionStorage.clear(); vi.unstubAllGlobals() })
describe('Languages and editable navigation', () => {
  it('detects Indonesian region, uses Indonesian timezone, and falls back to English', () => {
    expect(detectLocale(['id-ID'], 'Europe/London')).toBe('id')
    expect(detectLocale(['en-ID'], 'Europe/London')).toBe('id')
    expect(detectLocale(['en-GB'], 'Asia/Jakarta')).toBe('id')
    expect(detectLocale(['en'], 'Asia/Makassar')).toBe('id')
    expect(detectLocale([], 'Europe/London')).toBe('en')
  })
  it('persists manual choice and requests the selected locale', () => {
    setLanguage('id')
    expect(window.localStorage.getItem('briamco-language')).toBe('id')
    expect(document.documentElement.lang).toBe('id')
    expect(t('All Services')).toBe('Semua Layanan')
    expect(new URL(contentUrl('http://localhost:1337/api/website-insights?type=news')).searchParams.get('locale')).toBe('id')
    expect(locale.value).toBe('id')
  })
  it('uses CMS menu labels, order and dropdown type, removes unsafe destinations, and supports an empty menu', async () => {
    const links = [{label:'Hubungi Tim',href:'/contact',type:'link'}, {label:'Keahlian',href:'/services',type:'services'}, {label:'Unsafe',href:'//other-site.test',type:'link'}]
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok:true,json:async()=>({data:{NavBar:{navLinks:links}}})}))
    await loadContent()
    expect(useCmsSection('NavBar').value.navLinks).toEqual(links.slice(0,2))
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok:true,json:async()=>({data:{NavBar:{navLinks:[]}}})}))
    await loadContent()
    expect(useCmsSection('NavBar').value.navLinks).toEqual([])
  })
})
