import { DOMOutputSpec, Node as ProsemirrorNode } from 'prosemirror-model'
import { ListAttributes } from '../types'

/** @public */
export interface ListToDOMProps {
  node: ProsemirrorNode
  nativeList?: boolean
  markerToDOM?: MarkerToDOM
}

/** @public */
export function listToDOM({
  node,
  nativeList = false,
  markerToDOM = defaultMarkerToDOM,
}: ListToDOMProps): DOMOutputSpec {
  const attrs = node.attrs as ListAttributes
  const markerHidden = node.firstChild?.type === node.type
  const marker: DOMOutputSpec[] | null =
    markerHidden || nativeList ? null : markerToDOM(attrs)
  const markerType = markerHidden ? undefined : attrs.type || 'bullet'
  const domAttrs = {
    class: 'prosemirror-flat-list',
    'data-list-type': markerType,
    'data-list-order': attrs.order != null ? String(attrs.order) : undefined,
    'data-list-checked': attrs.checked ? '' : undefined,
    'data-list-collapsed': attrs.collapsed ? '' : undefined,
    'data-list-collapsable': node.childCount >= 2 ? '' : undefined,

    style:
      attrs.order != null
        ? `counter-set: prosemirror-flat-list-counter ${attrs.order};`
        : undefined,
  }

  const contentContainer: DOMOutputSpec = ['div', { class: 'list-content' }, 0]

  if (marker) {
    const markerContainer: DOMOutputSpec = [
      'div',
      {
        class: 'list-marker list-marker-click-target',
        // Set `contenteditable` to `false` so that the cursor won't be
        // moved into the mark container when clicking on it.
        contenteditable: 'false',
      },
      ...marker,
    ]

    return ['div', domAttrs, markerContainer, contentContainer]
  } else if (!nativeList) {
    return ['div', domAttrs, contentContainer]
  } else {
    return [attrs.type === 'ordered' ? 'ol' : 'ul', ['li', domAttrs, 0]]
  }
}

/** @public */
export type MarkerToDOM = (attrs: ListAttributes) => DOMOutputSpec[] | null

/** @internal */
export const defaultMarkerToDOM: MarkerToDOM = (attrs) => {
  switch (attrs.type) {
    case 'task':
      // Use a `label` element here so that the area around the checkbox is also checkable.
      return [
        [
          'label',
          [
            'input',
            { type: 'checkbox', checked: attrs.checked ? '' : undefined },
          ],
        ],
      ]
    case 'toggle':
      return []
    default:
      return null
  }
}
