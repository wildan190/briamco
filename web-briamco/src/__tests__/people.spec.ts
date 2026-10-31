import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import PeoplePage from '../views/PeoplePage.vue'
import { setLanguage } from '../i18n'
const profiles=[{slug:'test-alpha',name:'Test Alpha',role:'Advisor',businessSegment:'Strategy',practiceAreas:['Communications'],location:'Jakarta',category:'advisor',bio:'## Biography\n\nProfile from CMS.',imageUrl:''},{slug:'test-beta',name:'Test Beta',role:'Director',businessSegment:'Risk',practiceAreas:['Resilience'],location:'Bandung',category:'executive',bio:'Profile',imageUrl:''}]
async function setup(path:string,slug?:string){
 setLanguage('en')
 vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({data:profiles})}))
 const router=createRouter({history:createMemoryHistory(),routes:[{path:'/people',component:PeoplePage},{path:'/people/:slug',component:PeoplePage,props:true}]})
 await router.push(path);await router.isReady()
 const wrapper=mount(PeoplePage,{props:{slug},global:{plugins:[router]}});await flushPromises()
 return {wrapper,router}
}
describe('People directory',()=>{
 it('switches categories and combines name and practice filters',async()=>{
  const {wrapper,router}=await setup('/people?view=directory')
  expect(wrapper.findAll('.pp-card')).toHaveLength(2)
  await wrapper.find('input[type="search"]').setValue('alpha')
  expect(wrapper.findAll('.pp-card')).toHaveLength(1)
  await wrapper.findAll('select')[1]!.setValue('Resilience')
  expect(wrapper.findAll('.pp-card')).toHaveLength(0)
  await wrapper.find('.pp-filters button[type="button"]').trigger('click')
  expect(wrapper.findAll('.pp-card')).toHaveLength(2)
  await wrapper.find('#people-tab-2').trigger('click');await flushPromises()
  expect(router.currentRoute.value.query.view).toBe('executive')
  expect(wrapper.findAll('.pp-card')).toHaveLength(1)
  expect(wrapper.find('.pp-card h3').text()).toBe('Test Beta')
  expect(wrapper.find('.pp-card').attributes('href')).toBe('/people/test-beta')
  wrapper.unmount();vi.unstubAllGlobals()
 })
 it('opens an individual biography from CMS',async()=>{
  const {wrapper}=await setup('/people/test-alpha','test-alpha')
  expect(wrapper.find('h1').text()).toBe('Test Alpha')
  expect(wrapper.find('.rich-content').text()).toContain('Profile from CMS.')
  expect(wrapper.find('.pp-placeholder').exists()).toBe(true)
  wrapper.unmount();vi.unstubAllGlobals()
 })
})
