import { describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import router from '../router'
import { getPage, insightPath } from '../cms/pages'
import InsightDetail from '../views/InsightDetail.vue'
import ServiceDetail from '../views/ServiceDetail.vue'
import { setLanguage } from '../i18n'
import RichTextContent from '../components/RichTextContent.vue'

describe('Page routes and content', () => {
  it('resolves individual service, blog and news slugs', () => {
    const routes = createRouter({ history: createMemoryHistory(), routes: router.options.routes })
    expect(routes.resolve('/services/corporate-strategy').name).toBe('service-detail')
    expect(routes.resolve('/insight/blog/leadership').name).toBe('insight-detail')
    expect(routes.resolve('/insight/news/company-update').params.type).toBe('news')
    expect(routes.resolve('/insight/invalid/article').name).toBe('not-found')
    expect(insightPath({ slug: 'company-update', type: 'news' })).toBe('/insight/news/company-update')
  })
  it('distinguishes missing pages from API errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }))
    await expect(getPage('website-insights/missing')).rejects.toMatchObject({ status: 404 })
    vi.unstubAllGlobals()
  })
  it('renders article Markdown while removing unsafe markup', () => {
    const wrapper = mount(RichTextContent, { props: { content: '# Title\n\nA full article.\n\n<script>alert(1)</script><a href="javascript:alert(1)">unsafe</a>' } })
    expect(wrapper.find('h1').text()).toBe('Title')
    expect(wrapper.find('script').exists()).toBe(false)
    expect(wrapper.find('a').attributes('href')).toBeUndefined()
  })
})


describe('Service detail offerings', () => {
  it('opens offering content from Learn More and returns to Overview', async () => {
    setLanguage('en')
    const routes = createRouter({ history: createMemoryHistory(), routes: router.options.routes })
    await routes.push('/services/people-advisory')
    await routes.isReady()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok:true,json:async()=>({data:{
      slug:'people-advisory',title:'People Advisory',group:'Advisory',description:'Support for leaders.',content:'Overview body.',features:[],imageUrl:'',imageAlt:'',overviewTitle:'A deeper perspective',overviewLead:'Objective advice.',
      offerings:[{title:'People Strategy',description:'Align people and business.',bullets:['Culture','Succession'],content:'## Our approach\n\nOffering detail.'}]
    }})}))
    const wrapper=mount(ServiceDetail,{props:{slug:'people-advisory'},global:{plugins:[routes]}})
    await flushPromises()
    expect(wrapper.find('#service-tab-0').attributes('aria-selected')).toBe('true')
    expect(wrapper.find('.sd-offerings').text()).toContain('Succession')
    await wrapper.find('.sd-offerings button').trigger('click')
    await flushPromises()
    expect(routes.currentRoute.value.query.offering).toBe('1')
    expect(wrapper.find('#service-panel').text()).toContain('Offering detail.')
    expect(wrapper.find('#service-tab-1').attributes('aria-selected')).toBe('true')
    await wrapper.find('#service-tab-1').trigger('keydown',{key:'Home'})
    await flushPromises()
    expect(wrapper.find('#service-tab-0').attributes('aria-selected')).toBe('true')
    expect(wrapper.find('#service-panel').text()).toContain('Overview body.')
    wrapper.unmount();vi.unstubAllGlobals()
  })
})


describe('Insight article layout', () => {
  it('renders CMS article details and filters latest articles without repeating the current article', async () => {
    setLanguage('en')
    const routes=createRouter({history:createMemoryHistory(),routes:router.options.routes})
    await routes.push('/insight/blog/leadership');await routes.isReady()
    const article={id:1,slug:'leadership',type:'blog',title:'Leadership perspective',excerpt:'An introduction.',author:'BRIAMCO Editorial',badge:'Strategy',date:'2026-10-31',day:'31',month:'Oct',img:'https://example.com/hero.jpg',alt:'Business',content:'## Clear priorities\n\nArticle content.'}
    vi.stubGlobal('fetch',vi.fn().mockImplementation((url:string)=>Promise.resolve({ok:true,json:async()=>({data:new URL(url).pathname.endsWith('/leadership')?article:[article,{...article,id:2,slug:'resilience',title:'Resilience perspective'}]})})))
    const wrapper=mount(InsightDetail,{props:{slug:'leadership',type:'blog'},global:{plugins:[routes]}})
    await flushPromises()
    expect(wrapper.find('.in-hero h1').text()).toBe('Leadership perspective')
    expect(wrapper.find('.in-hero time').text()).toContain('October 31, 2026')
    expect(wrapper.find('.in-main').text()).toContain('Article content.')
    expect(wrapper.find('.in-latest a[href="/insight/blog/leadership"]').exists()).toBe(false)
    expect(wrapper.find('.in-latest a[href="/insight/blog/resilience"]').exists()).toBe(true)
    await wrapper.find('input[type="search"]').setValue('not found')
    expect(wrapper.find('.in-latest').text()).toContain('No matching articles.')
    await wrapper.find('input[type="search"]').setValue('resilience')
    expect(wrapper.find('.in-latest a').exists()).toBe(true)
    expect(wrapper.find('a[aria-label="Share by email"]').attributes('href')).toContain('mailto:?subject=Leadership')
    wrapper.unmount();vi.unstubAllGlobals()
  })
})
