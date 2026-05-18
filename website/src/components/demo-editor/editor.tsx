import 'prosekit/basic/style.css'
import 'prosekit/basic/typography.css'

import { useMemo } from 'preact/hooks'
import { createEditor, type NodeJSON } from 'prosekit/core'
import { ProseKit } from 'prosekit/preact'

import { defineExtension } from './extension'
import Toolbar from './toolbar'

export default function Editor() {
  const editor = useMemo(() => {
    return createEditor({ extension: defineExtension(), defaultContent })
  }, [])

  return (
    <ProseKit editor={editor}>
      <div className="flex h-full w-full min-h-36 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm ring-1 ring-black/5 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:ring-white/5">
        <Toolbar />
        <div className="relative flex-1 overflow-y-auto">
          <div
            ref={editor.mount}
            className="ProseMirror box-border min-h-full px-[max(2rem,calc(50%-20rem))] py-6 leading-relaxed outline-none [&_span[data-mention=tag]]:text-violet-500 [&_span[data-mention=user]]:text-blue-500"
          ></div>
        </div>
      </div>
    </ProseKit>
  )
}

const defaultContent: NodeJSON = {
  type: 'doc',
  content: [
    {
      type: 'list',
      attrs: { kind: 'bullet' },
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Bullet List' }] },
      ],
    },
    {
      type: 'list',
      attrs: { kind: 'ordered' },
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Ordered List' }],
        },
      ],
    },
    {
      type: 'list',
      attrs: { kind: 'task', checked: false },
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Task List ' }] },
      ],
    },
    {
      type: 'list',
      attrs: { kind: 'toggle', collapsed: true },
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Toggle List' }] },
        {
          type: 'list',
          attrs: {
            kind: 'bullet',
          },
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'Hidden' }] },
          ],
        },
      ],
    },
  ],
}
