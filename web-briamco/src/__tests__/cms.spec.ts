import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cmsState, loadContent, submitInquiry, useCmsSection } from '../cms/content'

import { setLanguage } from '../i18n'
beforeEach(async () => { setLanguage('en'); vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok:true,json:async()=>({data:{}})})); await loadContent() })

afterEach(() => vi.unstubAllGlobals())
describe('CMS client', () => {
  it('rejects malformed lists and unsafe image URLs', async () => {
    const hero = useCmsSection('HeroSection')
    const stats = hero.value.stats
    const image = hero.value.src14
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: { HeroSection: { stats: [], src14: 'javascript:alert(1)' } } }) }))
    await loadContent()
    expect(hero.value.stats).toEqual(stats)
    expect(hero.value.src14).toBe(image)
  })
  it('retains content when CMS is unavailable', async () => {
    const hero = useCmsSection('HeroSection')
    const previous = hero.value.text6
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    await loadContent()
    expect(hero.value.text6).toBe(previous)
    expect(cmsState.error).toBe('offline')
  })
  it('requires a saved record reference before acknowledging success', async () => {
    const inquiry = {name:'Test',email:'test@example.com',subject:'Test',message:'Test'}
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({status:200,ok:true,json:async()=>({data:{received:true}})}))
    await expect(submitInquiry(inquiry)).rejects.toThrow('could not be saved')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({status:201,ok:true,json:async()=>({data:{received:true}})}))
    await expect(submitInquiry(inquiry)).rejects.toThrow('could not be saved')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({status:201,ok:true,json:async()=>({data:{received:true,reference:'saved-document'}})}))
    await expect(submitInquiry(inquiry)).resolves.toBe('saved-document')
  })
  it('reports failed inquiries instead of showing success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
    await expect(submitInquiry({ name: 'Test', email: 'test@example.com', subject: 'Test', message: 'Test' })).rejects.toThrow('could not be saved')
  })
})
