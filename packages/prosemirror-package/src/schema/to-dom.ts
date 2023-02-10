import { DOMOutputSpec, Node as ProsemirrorNode } from 'prosemirror-model'
import { ListAttributes } from '../types'

export function listToDOM(
  node: ProsemirrorNode,
  nativeList: boolean,
  markerToDOM: MarkerToDOM = defaultMarkerToDOM,
): DOMOutputSpec {
  const attrs = node.attrs as ListAttributes
  const markerHidden = node.firstChild?.type === node.type
  const marker: DOMOutputSpec | null = markerHidden ? null : markerToDOM(attrs)
  const markerType = markerHidden ? undefined : attrs.type || 'bullet'
  const domAttrs = {
    class: 'prosemirror-flat-list',
    'data-list-type': markerType,
    'data-list-order': attrs.order != null ? String(attrs.order) : undefined,
    'data-list-checked': attrs.checked ? '' : undefined,
    'data-list-collapsed': attrs.collapsed ? '' : undefined,
    'data-list-collapsable': node.childCount >= 2 ? '' : undefined,
  }

  const contentContainer: DOMOutputSpec = ['div', { class: 'list-content' }, 0]

  if (marker != null) {
    const markerContainer: DOMOutputSpec = [
      'div',
      {
        class: 'list-marker',
        // Set `contenteditable` to `false` so that the cursor won't be
        // moved into the mark container when clicking on it.
        contenteditable: 'false',
      },
      marker,
    ]

    return nativeList
      ? [
          attrs.type === 'ordered' ? 'ol' : 'ul',
          ['li', domAttrs, markerContainer, contentContainer],
        ]
      : ['div', domAttrs, markerContainer, contentContainer]
  } else {
    return nativeList
      ? [
          attrs.type === 'ordered' ? 'ol' : 'ul',
          ['li', domAttrs, contentContainer],
        ]
      : ['div', domAttrs, contentContainer]
  }
}

export type MarkerToDOM = (attrs: ListAttributes) => DOMOutputSpec | null

export const defaultMarkerToDOM: MarkerToDOM = (attrs) => {
  switch (attrs.type) {
    case 'task':
      // Use a `label` element here so that the area around the checkbox is also checkable.
      return [
        'label',
        [
          'input',
          { type: 'checkbox', checked: attrs.checked ? '' : undefined },
        ],
      ]
    case 'toggle':
      return ['span']
    default:
      return null
  }
}
