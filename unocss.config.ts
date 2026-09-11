import { presetAttributify, presetIcons, presetWind3, transformerDirectives } from 'unocss'
import { defineConfig } from 'unocss/vite'

export default defineConfig({
  theme: {
    colors: {
      // Ocean Depths brand palette (see docs/brand.md)
      brand: {
        50: '#F1FAEE',
        100: '#DCEFEF',
        200: '#A8DADC',
        400: '#3AA6A6',
        600: '#2D8B8B',
        700: '#236F6F',
        900: '#1A2332',
      },
    },
  },
  presets: [
    presetWind3(),
    presetAttributify(),
    presetIcons(),
  ],
  transformers: [
    transformerDirectives(),
  ],
})
