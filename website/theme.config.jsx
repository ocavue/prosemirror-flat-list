// @ts-check

import React from 'react'

/**
 * @type {import('nextra-theme-docs').DocsThemeConfig}
 */
const config = {
  logo: <strong>ProseMirror Flat List</strong>,
  project: {
    link: 'https://github.com/ocavue/prosemirror-flat-list',
  },
  docsRepositoryBase:
    'https://github.com/ocavue/prosemirror-flat-list/blob/master/website/pages',
  footer: {
    text: (
      <span>
        © {new Date().getFullYear()}{' '}
        <a href="https://github.com/ocavue" target="_blank">
          Ocavue
        </a>
        .
      </span>
    ),
  },
  gitTimestamp: () => null,
}

export default config
