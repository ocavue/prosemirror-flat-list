import { defineUpdateHandler, type Editor } from '@prosekit/core'
import { useEffect, useState } from 'preact/hooks'

import Button from './button'
import type { EditorExtension } from './extension'

function getToolbarItems(editor: Editor<EditorExtension>) {
  return [
    {
      label: 'Bullet',
      tooltip: 'Toggle bullet list',
      isActive: editor.nodes.list.isActive({ kind: 'bullet' }),
      canExec: editor.commands.toggleList.canExec({ kind: 'bullet' }),
      command: () => editor.commands.toggleList({ kind: 'bullet' }),
    },
    {
      label: 'Ordered',
      tooltip: 'Toggle ordered list',
      isActive: editor.nodes.list.isActive({ kind: 'ordered' }),
      canExec: editor.commands.toggleList.canExec({ kind: 'ordered' }),
      command: () => editor.commands.toggleList({ kind: 'ordered' }),
    },
    {
      label: 'Task',
      tooltip: 'Toggle task list',
      isActive: editor.nodes.list.isActive({ kind: 'task' }),
      canExec: editor.commands.toggleList.canExec({ kind: 'task' }),
      command: () => editor.commands.toggleList({ kind: 'task' }),
    },
    {
      label: 'Toggle',
      tooltip: 'Toggle collapsible list',
      isActive: editor.nodes.list.isActive({ kind: 'toggle' }),
      canExec: editor.commands.toggleList.canExec({ kind: 'toggle' }),
      command: () => editor.commands.toggleList({ kind: 'toggle' }),
    },
  ]
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
          const changed = oldItems.some((oldItem, index) => {
            const newItem = newItems[index]
            return (
              oldItem.isActive !== newItem.isActive ||
              oldItem.canExec !== newItem.canExec
            )
          })
          return changed ? newItems : oldItems
        })
      }),
    )
  }, [editor])

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50/50 px-2 py-1.5 dark:border-gray-800 dark:bg-gray-900/40">
      {items.map((item) => (
        <Button
          key={item.label}
          pressed={item.isActive}
          disabled={!item.canExec}
          onClick={item.command}
          tooltip={item.tooltip}
        >
          {item.label}
        </Button>
      ))}
    </div>
  )
}
