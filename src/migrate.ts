import type { RemirrorJSON } from '@remirror/core'
import type { ListAttributes } from './item-types'

function migrateNodes(nodes: RemirrorJSON[]): RemirrorJSON[] {
  const content: RemirrorJSON[] = []

  for (const node of nodes) {
    if (node.type === 'bullet_list' || node.type === 'bulletList') {
      for (const child of node.content ?? []) {
        content.push(migrateNode(child, { type: 'bullet' }))
      }
    } else if (node.type === 'ordered_list' || node.type === 'orderedList') {
      for (const child of node.content ?? []) {
        content.push(migrateNode(child, { type: 'ordered' }))
      }
    } else if (node.type === 'task_list' || node.type === 'taskList') {
      for (const child of node.content ?? []) {
        content.push(migrateNode(child, { type: 'task' }))
      }
    } else {
      content.push(node)
    }
  }

  return content
}

function migrateNode(node: RemirrorJSON, attrs?: ListAttributes): RemirrorJSON {
  if (
    node.type === 'list_item' ||
    node.type === 'listItem' ||
    node.type === 'taskListItem'
  ) {
    return {
      ...node,
      type: 'list',
      attrs: {
        ...node.attrs,
        type: 'bullet',
        ...attrs,
      },
      content: node.content ? migrateNodes(node.content) : undefined,
    }
  }

  return {
    ...node,
    content: node.content ? migrateNodes(node.content) : undefined,
  }
}

export function migrateDoc(docJSON: RemirrorJSON): RemirrorJSON {
  return migrateNode(docJSON)
}
