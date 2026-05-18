import { defineUpdateHandler, type Editor } from '@prosekit/core'
import { useEffect, useState } from 'preact/hooks'

import Button from './button'
import type { EditorExtension } from './extension'

function getToolbarItems(editor: Editor<EditorExtension>) {
  return {
    bullet: {
      isActive: editor.nodes.list.isActive({ kind: 'bullet' }),
      canExec: editor.commands.toggleList.canExec({ kind: 'bullet' }),
      command: () => editor.commands.toggleList({ kind: 'bullet' }),
    },
    ordered: {
      isActive: editor.nodes.list.isActive({ kind: 'ordered' }),
      canExec: editor.commands.toggleList.canExec({ kind: 'ordered' }),
      command: () => editor.commands.toggleList({ kind: 'ordered' }),
    },
    task: {
      isActive: editor.nodes.list.isActive({ kind: 'task' }),
      canExec: editor.commands.toggleList.canExec({ kind: 'task' }),
      command: () => editor.commands.toggleList({ kind: 'task' }),
    },
    toggle: {
      isActive: editor.nodes.list.isActive({ kind: 'toggle' }),
      canExec: editor.commands.toggleList.canExec({ kind: 'toggle' }),
      command: () => editor.commands.toggleList({ kind: 'toggle' }),
    },
  }
}

export default function Toolbar({
  editor,
}: {
  editor: Editor<EditorExtension>
}) {
  const [items, setItems] = useState(() => getToolbarItems(editor))

  useEffect(() => {
    return editor.use(
      defineUpdateHandler(() => {
        const newItems = getToolbarItems(editor)
        setItems((oldItems) => {
          let changed = false
          for (const key of Object.keys(
            oldItems,
          ) as (keyof typeof oldItems)[]) {
            const oldItem = oldItems[key]
            const newItem = newItems[key]
            if (
              oldItem.isActive !== newItem.isActive ||
              oldItem.canExec !== newItem.canExec
            ) {
              changed = true
              break
            }
          }
          return changed ? newItems : oldItems
        })
      }),
    )
  }, [editor])

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50/50 px-2 py-1.5 dark:border-gray-800 dark:bg-gray-900/40">
      <Button
        pressed={items.bullet.isActive}
        disabled={!items.bullet.canExec}
        onClick={items.bullet.command}
        tooltip="Toggle bullet list"
      >
        Bullet
      </Button>

      <Button
        pressed={items.ordered.isActive}
        disabled={!items.ordered.canExec}
        onClick={items.ordered.command}
        tooltip="Toggle ordered list"
      >
        Ordered
      </Button>

      <Button
        pressed={items.task.isActive}
        disabled={!items.task.canExec}
        onClick={items.task.command}
        tooltip="Toggle task list"
      >
        Task
      </Button>

      <Button
        pressed={items.toggle.isActive}
        disabled={!items.toggle.canExec}
        onClick={items.toggle.command}
        tooltip="Toggle collapsible list"
      >
        Toggle
      </Button>
    </div>
  )
}
