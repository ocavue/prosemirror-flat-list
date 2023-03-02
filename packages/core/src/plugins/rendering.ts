import { DOMSerializer, Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorState, Plugin, Transaction } from 'prosemirror-state'
import { type NodeViewConstructor } from 'prosemirror-view'
import { ListAttributes } from '../types'
import { isListNode } from '../utils/is-list-node'
import { setListAttributes } from '../utils/set-list-attributes'

/**
 * Handle the list node rendering.
 *
 * @public
 */
export function createListRenderingPlugin(): Plugin {
  const positions: number[] = []

  const checkNode = (node: ProsemirrorNode, getPos: () => number) => {
    if (isInvalidNode(node)) {
      console.log('PUSH:', getPos())
      positions.push(getPos())
    }
  }

  // This isn't a perfect solution, because we can't get
  const fixNode = (state: EditorState): Transaction | null => {
    let tr: Transaction | null = null

    if (positions.length) {
      console.log('positions:', positions)

      const maxSize = state.doc.content.size
      while (positions.length) {
        const pos = positions.pop()!
        if (0 <= pos && pos < maxSize) {
          const $pos = state.doc.resolve(pos)
          if (isInvalidNode($pos.node())) {
            if (!tr) {
              tr = state.tr
            }
            setListAttributes(tr, pos, { collapsed: false })
          }
        }
      }
    }

    return tr
  }

  /**
   * A simple node view that is used to render the list node. It ensures that the
   * list node get updated when its marker styling should changes.
   */
  const listNodeView: NodeViewConstructor = (node, _view, getPos) => {
    let prevNode = node
    const prevNested = node.firstChild?.type === node.type
    const prevSingleChild = node.childCount === 1

    const spec = node.type.spec.toDOM!(node)
    const { dom, contentDOM } = DOMSerializer.renderSpec(document, spec)
    checkNode(node, getPos)

    const update = (node: ProsemirrorNode): boolean => {
      checkNode(node, getPos)

      if (!node.sameMarkup(prevNode)) return false
      const nested = node.firstChild?.type === node.type
      const singleChild = node.childCount === 1
      if (prevNested !== nested || prevSingleChild !== singleChild) return false
      prevNode = node
      return true
    }

    return { dom, contentDOM, update }
  }

  return new Plugin({
    props: {
      nodeViews: { list: listNodeView },
    },

    appendTransaction: (_transactions, _oldState, newState) => {
      return fixNode(newState)
    },
  })
}

function isInvalidNode(node: ProsemirrorNode) {
  return (
    isListNode(node) &&
    node.childCount < 2 &&
    (node.attrs as ListAttributes).collapsed
  )
}
