import type { ListAttributes, ProsemirrorNodeJSON } from './types'

function migrateNodes(nodes: ProsemirrorNodeJSON[]): ProsemirrorNodeJSON[] {
  const content: ProsemirrorNodeJSON[] = []

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

function migrateNode(
  node: ProsemirrorNodeJSON,
  attrs?: ListAttributes,
): ProsemirrorNodeJSON {
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

export function migrateDocJSON(
  docJSON: ProsemirrorNodeJSON,
): ProsemirrorNodeJSON {
  return migrateNode(docJSON)
}
