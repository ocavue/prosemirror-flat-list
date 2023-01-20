import {
  ApplySchemaAttributes,
  DOMOutputSpec,
  NodeSpecOverride,
} from '@remirror/core'
import { ProsemirrorNode } from '@remirror/pm'
import { ParseRule } from '@remirror/pm/model'
import { ListAttributes, ListType } from './types'
import { parseInteger } from './utils/parse-integer'

export function listToDOM(
  node: ProsemirrorNode,
  nativeList: boolean,
  extra?: ApplySchemaAttributes
): DOMOutputSpec {
  const attrs = node.attrs as ListAttributes
  const markerHidden = node.firstChild?.type === node.type

  let marker: DOMOutputSpec | null = null

  if (!markerHidden) {
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
  }

  const listType = markerHidden ? undefined : attrs.type || 'bullet'
  const domAttrs = {
    class: 'flat-list',
    'data-list-type': listType,
    'data-list-order':
      listType === 'ordered' && attrs.order != null
        ? String(attrs.order)
        : undefined,
    'data-list-checked': listType === 'task' && attrs.checked ? '' : undefined,
    'data-list-collapsed':
      listType === 'toggle' && attrs.collapsed ? '' : undefined,
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

export function createParseDomRules(
  extra: ApplySchemaAttributes,
  override: NodeSpecOverride
): readonly ParseRule[] {
  return [
    {
      tag: 'div[data-list]',
      getAttrs: (element): ListAttributes => {
        if (typeof element === 'string') {
          return {}
        }

        return {
          type: (element.getAttribute('data-list-type') ||
            'bullet') as ListType,
          order: parseInteger(element.getAttribute('data-list-order')),
          checked: element.hasAttribute('data-list-checked'),
          collapsed: element.hasAttribute('data-list-collapsed'),
        }
      },
    },
    {
      tag: 'ul > li',
      getAttrs: (element) => {
        if (typeof element !== 'string') {
          const checkbox = element.firstChild as HTMLElement | null

          if (
            checkbox &&
            checkbox.nodeName === 'INPUT' &&
            checkbox.getAttribute('type') === 'checkbox'
          ) {
            return {
              type: 'task',
              checked: checkbox.hasAttribute('checked'),
              ...extra.parse(element),
            }
          }

          if (
            element.hasAttribute('data-task-list-item') ||
            element.getAttribute('data-list-type') === 'task'
          ) {
            return {
              type: 'task',
              checked: element.hasAttribute('data-checked'),
              ...extra.parse(element),
            }
          }

          if (
            element.hasAttribute('data-toggle-list-item') ||
            element.getAttribute('data-list-type') === 'toggle'
          ) {
            return {
              type: 'toggle',
              collapsed: element.hasAttribute('data-list-collapsed'),
              ...extra.parse(element),
            }
          }
        }

        return {
          type: 'bullet',
          ...extra.parse(element),
        }
      },
    },
    {
      tag: 'ol > li',
      getAttrs: (element) => {
        return {
          type: 'ordered',
          ...extra.parse(element),
        }
      },
    },
    ...(override.parseDOM ?? []),
  ]
}
