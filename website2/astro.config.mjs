// @ts-check
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightThemeNova from 'starlight-theme-nova'

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'prosemirror-flat-list',
      plugins: [
        starlightThemeNova({
          nav: [
            { label: 'Guide', href: '/guides' },
            { label: 'Reference', href: '/reference' },
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
        { label: 'Guide', slug: 'guides' },
        { label: 'Reference', slug: 'reference' },
      ],
    }),
  ],
})
