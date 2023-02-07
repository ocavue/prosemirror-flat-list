import {
  DOMOutputSpec,
  DOMSerializer,
  Fragment,
  Node as ProsemirrorNode,
  Schema,
} from 'prosemirror-model'
import { listToDOM } from '../schema/to-dom'

export class ListDOMSerializer extends DOMSerializer {
  static nodesFromSchema(schema: Schema): {
    [node: string]: (node: ProsemirrorNode) => DOMOutputSpec
  } {
    const nodes = DOMSerializer.nodesFromSchema(schema)
    return { ...nodes, list: (node) => listToDOM(node, true) }
  }

  serializeFragment(
    fragment: Fragment,
    options?: { document?: Document },
    target?: HTMLElement | DocumentFragment,
  ): HTMLElement | DocumentFragment {
    const dom = super.serializeFragment(fragment, options, target)
    return joinListElements(dom)
  }
}

/**
 * Merge adjacent <ul> elements or adjacent <ol> elements into a single list element.
 *
 * @internal
 */
export function joinListElements<T extends Element | DocumentFragment>(
  parent: T,
): T {
  for (let i = 0; i < parent.childNodes.length; i++) {
    const child = parent.children.item(i)
    if (!child) continue

    if (child.tagName === 'UL' || child.tagName === 'OL') {
      let next: Element | null = null

      while (
        ((next = child.nextElementSibling), next?.tagName === child.tagName)
      ) {
        child.append(...Array.from(next.children))
        next.remove()
      }
    }
    joinListElements(child)
  }
  return parent
}
