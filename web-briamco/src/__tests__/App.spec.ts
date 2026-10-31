import { beforeEach, describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '../App.vue'
import appRouter from '../router'

import { setLanguage } from '../i18n'
beforeEach(() => setLanguage('en'))

describe('App page navigation', () => {
  it('loads the redesigned CMS hero and navigates to a separate People page', async () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) => Promise.resolve({ ok: true, json: async () => ({ data: /website-(services|insights)$/.test(new URL(url).pathname) ? [] : { AdvisoryPage: { hero: 'Updated by editor' } } }) })))
    const router = createRouter({ history: createMemoryHistory(), routes: appRouter.options.routes })
    await router.push('/')
    await router.isReady()
    const wrapper = mount(App, { global: { plugins: [router] } })
    await flushPromises()
    expect(wrapper.find('.ad-hero h1').text()).toContain('Updated by editor')
    expect(wrapper.find('.ad-nav').text()).not.toContain('Testimonials')
    expect(wrapper.find('[aria-controls="mega-insights"]').exists()).toBe(true)
    await wrapper.find('[aria-controls="mega-services"]').trigger('click')
    expect(wrapper.find('#mega-services').exists()).toBe(true)
    await wrapper.find('[aria-controls="mega-insights"]').trigger('click')
    expect(wrapper.find('#mega-services').exists()).toBe(false)
    expect(wrapper.find('#mega-insights a[href="/insight/blog"]').exists()).toBe(true)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flushPromises()
    expect(wrapper.find('.ad-mega').exists()).toBe(false)
    await wrapper.find('[aria-controls="mega-insights"]').trigger('click')
    await wrapper.find('.ad-menu-backdrop').trigger('click')
    expect(wrapper.find('.ad-mega').exists()).toBe(false)
    await wrapper.find('.ad-nav a[href="/people"]').trigger('click')
    await flushPromises()
    await vi.waitFor(() => expect(router.currentRoute.value.path).toBe('/people'))
    await flushPromises()
    expect(wrapper.find('.pp-hero h1').exists()).toBe(true)
    expect(wrapper.find('.pp-directory').exists()).toBe(true)
    expect(wrapper.find('.ad-hero').exists()).toBe(false)
    wrapper.unmount()
    vi.unstubAllGlobals()
  })
})
