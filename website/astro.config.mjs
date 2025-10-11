// @ts-check

import preact from '@astrojs/preact'
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import starlightThemeNova from 'starlight-theme-nova'

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'prosemirror-flat-list',
      plugins: [
        starlightThemeNova({
          nav: [{ label: 'docs', href: '/introduction' }],
        }),
      ],
      customCss: ['./src/styles/tailwindcss.css'],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/ocavue/prosemirror-flat-list',
        },
      ],
      sidebar: [
        { label: 'Introduction', slug: 'introduction' },
        { label: 'Guide', slug: 'guides' },
        { label: 'API Reference', slug: 'reference' },
      ],
    }),
    preact(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
