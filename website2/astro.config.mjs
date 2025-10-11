// @ts-check
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightThemeNova from 'starlight-theme-nova'

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  integrations: [starlight({
    title: 'prosemirror-flat-list',
    plugins: [
      starlightThemeNova({
        nav: [
          { label: 'docs', href: '/introduction' },
        ],
      }),
    ],
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
  }), svelte()],
})