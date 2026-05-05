import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'

import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [vue(), mdx()],
  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    ssr: {
      noExternal: ['three'],
    },
  },
  output: 'static',
  site: 'https://nova.kexie.space',
})