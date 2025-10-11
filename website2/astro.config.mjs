// @ts-check
import starlight from '@astrojs/starlight'
import starlightThemeNova from '@starlightjs/theme-nova'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'prosemirror-flat-list',
      plugins: [
        starlightThemeNova(
          { label: 'Quick start', href: '/guide/getting-started' },
          { label: 'External link', href: 'https://example.com' },
        ),
      ],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/withastro/starlight',
        },
      ],
      sidebar: [
        {
          label: 'Guides',
          items: [
            // Each item here is one entry in the navigation menu.
            { label: 'Example Guide', slug: 'guides/example' },
          ],
        },
        {
          label: 'Reference',
          autogenerate: { directory: 'reference' },
        },
      ],
    }),
  ],
})
