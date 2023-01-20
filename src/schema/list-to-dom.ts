import { ApplySchemaAttributes, DOMOutputSpec } from '@remirror/core'
import { ProsemirrorNode } from '@remirror/pm'
import { ListAttributes } from '../item-types'

export function listToDOM(
  node: ProsemirrorNode,
  nativeList: boolean,
  extra?: ApplySchemaAttributes
): DOMOutputSpec {
  const attrs = node.attrs as ListAttributes

  let marker: DOMOutputSpec | null = null

  switch (attrs.type) {
    case 'task':
      // Use a `label` element here so that the area around the checkbox is also checkable.
      marker = [
        'label',
        { class: `item-mark item-mark-task` },
        [
          'input',
          {
            type: 'checkbox',
            checked: attrs.checked ? '' : undefined,
          },
        ],
      ]
      break
    case 'toggle':
      marker = ['span']
      break
  }

  const domAttrs = {
    class: 'flat-list',
    'data-list': '',
    'data-list-type': attrs.type || 'bullet',
    'data-list-order':
      attrs.type === 'ordered' && attrs.order != null
        ? String(attrs.order)
        : undefined,
    'data-list-checked':
      attrs.type === 'task' && attrs.checked ? '' : undefined,
    'data-list-collapsed':
      attrs.type === 'toggle' && attrs.collapsed ? '' : undefined,
    ...extra?.dom(node),
  }

  const contentContainer: DOMOutputSpec = [
    'div',
    { class: 'item-content-container' },
    0,
  ]

  if (marker) {
    const markerContainer: DOMOutputSpec = [
      'div',
      {
        class: 'item-mark-container',
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
