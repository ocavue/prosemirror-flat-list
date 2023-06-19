import type { Transaction, EditorState } from 'prosemirror-state'
import { Fragment } from 'prosemirror-model'
import type { Node as ProsemirrorNode, NodeSpec } from 'prosemirror-model'
import type { ListAttributes, ListKind } from './types'

function isList(node: ProsemirrorNode): boolean {
  return [
    'orderedList',
    'bulletList',
    'taskList',
    'bullet_list',
    'ordered_list',
    'task_list',
  ].includes(node.type.name)
}

function isListItem(node: ProsemirrorNode): boolean {
  return ['list_item', 'listItem', 'taskListItem'].includes(node.type.name)
}

function getListKind(node: ProsemirrorNode): ListKind {
  switch (node.type.name) {
    case 'bulletList':
    case 'bullet_list':
      return 'bullet'
    case 'ordered_list':
    case 'orderedList':
      return 'ordered'
    case 'task_list':
    case 'taskList':
      return 'task'
    default:
      return 'bullet'
  }
}

/** @internal */
export function migrateNode(
  node: ProsemirrorNode,
  newNodeType: NodeSpec,
  kind: ListKind = 'bullet',
): Fragment | ProsemirrorNode {
  if (node.isText) {
    return node
  }

  let content = Fragment.empty

  if (isList(node)) {
    node.forEach((child) => {
      content = content.addToEnd(
        migrateNode(child, newNodeType, getListKind(node)) as ProsemirrorNode,
      )
    })
    return content
  }

  node.forEach((child) => {
    content = content.append(
      Fragment.from(migrateNode(child, newNodeType, kind)),
    )
  })

  if (isListItem(node)) {
    return newNodeType.create(
      {
        collapsed: Boolean(node.attrs?.closed),
        ...node.attrs,
        kind,
      } satisfies ListAttributes,
      content,
      node.marks,
    )
  }

  return node.copy(content)
}

/**
 * Migrate a ProseMirror document from the old list structure to the
 * new list structure. A Transaction is returned if the document would be updated,
 * otherwise `null` is returned.
 *
 * @public
 */
export function migrateDoc(
  state: EditorState,
  {
    newNode = 'list',
    tr = state.tr,
  }: {
    newNode?: NodeSpec | string
    tr?: Transaction
  } = {},
): Transaction | null {
  const { doc } = tr
  const nodeType: NodeSpec =
    typeof newNode === 'string' ? state.schema.nodes[newNode] : newNode

  // We don't want the mappings from any Steps that might exist in the Transaction
  // when this function is invoked since we start the migration the from the most recent Transaction doc.
  // So we will always slice the mapping from this point as we accumulate new Steps
  const mapFrom = tr.mapping.maps.length

  doc.descendants((node, pos) => {
    if (isList(node)) {
      const newContent = migrateNode(node, nodeType)
      const mapping = tr.mapping.slice(mapFrom)

      tr.replaceWith(
        mapping.map(pos),
        mapping.map(pos + node.nodeSize),
        newContent,
      )

      // Don't descend into list nodes since migrateNode() does that for us
      return false
    }
  })

  return tr.docChanged ? tr : null
}
