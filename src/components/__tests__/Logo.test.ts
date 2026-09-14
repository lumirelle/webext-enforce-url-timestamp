import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Logo from '../Logo.vue'

describe('logo component', () => {
  it('renders the brand mark and links to the repo', () => {
    const wrapper = mount(Logo)

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('alt')).toBe('TimeSeal')

    expect(wrapper.find('a').attributes('href')).toContain('webext-enforce-url-timestamp')
  })
})
