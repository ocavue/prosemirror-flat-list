import type { Editor } from 'prosekit/core'
import { useEditorDerivedValue } from 'prosekit/preact'

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

export default function Toolbar() {
  const items = useEditorDerivedValue(getToolbarItems)

  return (
    <div className="z-2 box-border border-gray-200 dark:border-gray-800 border-solid border-l-0 border-r-0 border-t-0 border-b flex flex-wrap gap-1 p-2 items-center">
      <Button
        pressed={items.bullet.isActive}
        disabled={!items.bullet.canExec}
        onClick={items.bullet.command}
        tooltip="Bullet"
      >
        <div className="i-lucide-list size-5 block" />
      </Button>

      <Button
        pressed={items.ordered.isActive}
        disabled={!items.ordered.canExec}
        onClick={items.ordered.command}
        tooltip="Ordered"
      >
        <div className="i-lucide-list-ordered size-5 block" />
      </Button>

      <Button
        pressed={items.task.isActive}
        disabled={!items.task.canExec}
        onClick={items.task.command}
        tooltip="Task"
      >
        <div className="i-lucide-list-checks size-5 block" />
      </Button>

      <Button
        pressed={items.toggle.isActive}
        disabled={!items.toggle.canExec}
        onClick={items.toggle.command}
        tooltip="Toggle"
      >
        <div className="i-lucide-list-collapse size-5 block" />
      </Button>
    </div>
  )
}
