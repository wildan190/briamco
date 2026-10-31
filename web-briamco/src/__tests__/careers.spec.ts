import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import CareersPage from '../views/CareersPage.vue'
import { setLanguage } from '../i18n'

describe('Careers positions',()=>{
  it('combines keyword, department and location filters and resets an empty result',async()=>{
    setLanguage('en')
    vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({data:[
      {slug:'strategy-analyst',title:'Strategy Analyst',department:'Strategy',location:'Jakarta',employmentType:'Full time',description:'Job details',applicationUrl:''},
      {slug:'risk-consultant',title:'Risk Consultant',department:'Risk',location:'Bandung',employmentType:'Full time',description:'Job details',applicationUrl:''}
    ]})}))
    const router=createRouter({history:createMemoryHistory(),routes:[{path:'/careers',component:CareersPage},{path:'/careers/:slug',component:CareersPage,props:true}]})
    await router.push('/careers');await router.isReady()
    const wrapper=mount(CareersPage,{global:{plugins:[router]}})
    await flushPromises()
    expect(wrapper.findAll('.cr-jobs>a')).toHaveLength(2)
    await wrapper.find('input[type="search"]').setValue('analyst')
    expect(wrapper.findAll('.cr-jobs>a')).toHaveLength(1)
    const filters=wrapper.findAll('select')
    await filters[0]!.setValue('Strategy');await filters[1]!.setValue('Bandung')
    expect(wrapper.find('.cr-empty').exists()).toBe(true)
    expect(wrapper.findAll('.cr-jobs>a')).toHaveLength(0)
    await wrapper.find('.cr-empty button').trigger('click')
    expect(wrapper.findAll('.cr-jobs>a')).toHaveLength(2)
    expect(wrapper.find('.cr-jobs>a').attributes('href')).toBe('/careers/strategy-analyst')
    wrapper.unmount();vi.unstubAllGlobals()
  })
  it('shows the published job description and only a safe application link',async()=>{
    setLanguage('en')
    vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({data:[{slug:'analyst',title:'Analyst',department:'Advisory',location:'Jakarta',employmentType:'Full time',description:'## About this role\n\nSupport our team.',applicationUrl:'javascript:alert(1)'}]})}))
    const router=createRouter({history:createMemoryHistory(),routes:[{path:'/careers/:slug',component:CareersPage}]})
    await router.push('/careers/analyst');await router.isReady()
    const wrapper=mount(CareersPage,{props:{slug:'analyst'},global:{plugins:[router]}})
    await flushPromises()
    expect(wrapper.find('h1').text()).toBe('Analyst')
    expect(wrapper.find('.rich-content').text()).toContain('Support our team.')
    expect(wrapper.find('a[href^="javascript:"]').exists()).toBe(false)
    expect(wrapper.find('a[href="/contact"]').exists()).toBe(true)
    wrapper.unmount();vi.unstubAllGlobals()
  })
})
