
import { BlockquoteExtension } from '@remirror/extension-blockquote'
import { HardBreakExtension } from '@remirror/extension-hard-break'
import { HeadingExtension } from '@remirror/extension-heading'
import { LinkExtension } from '@remirror/extension-link'
import {
  EditorComponent,
  Remirror,
  ThemeProvider,
  useRemirror,
} from '@remirror/react'
import React from 'react'
import { ListExtension } from 'remirror-extension-flat-list'

const Editor: React.FC = () => {
  const { manager, state } = useRemirror({ extensions, content })

  return (
    <ThemeProvider>
      <Remirror manager={manager} initialContent={state} autoFocus={true}>
        <EditorComponent />
      </Remirror>
    </ThemeProvider>
  )
}

function extensions () {
  return [
  new ListExtension(),
  new HeadingExtension(),
  new LinkExtension(),
  new HardBreakExtension(),
  new BlockquoteExtension(),
]
}

const content = {
  type: 'doc',
  content: [
    {
      type: 'list',
      attrs: {
        kind: 'bullet',
        order: null,
        checked: false,
        collapsed: false,
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Bullet list',
            },
          ],
        },
      ],
    },
    {
      type: 'list',
      attrs: {
        kind: 'ordered',
        order: null,
        checked: false,
        collapsed: false,
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Ordered list',
            },
          ],
        },
      ],
    },
    {
      type: 'list',
      attrs: {
        kind: 'task',
        order: null,
        checked: true,
        collapsed: false,
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Task list',
            },
          ],
        },
      ],
    },
    {
      type: 'list',
      attrs: {
        kind: 'toggle',
        order: null,
        checked: false,
        collapsed: true,
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Toggle list',
            },
          ],
        },
        {
          type: 'list',
          attrs: {
            kind: 'bullet',
            order: null,
            checked: false,
            collapsed: false,
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'sub list',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export { Editor }
