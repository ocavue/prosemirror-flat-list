import type { MarkAction, NodeAction, NodeChild } from '@prosekit/core'
import { createTestEditor } from '@prosekit/core/test'
import type { ProseMirrorNode } from '@prosekit/pm/model'
import type { Command } from '@prosekit/pm/state'
import { expect } from 'vitest'

import type { ListAttributes } from '../src/types'

import { defineListTestExtension } from './extension'
import { expectStateToEqual, markdownToTaggedDoc } from './markdown'

export function setupTestingEditor() {
  const extension = defineListTestExtension()
  const editor = createTestEditor({ extension })

  const div = document.body.appendChild(document.createElement('div'))
  div.style.minWidth = '200px'
  div.style.minHeight = '200px'
  editor.mount(div)
  editor.view.dom.focus()

  const n = editor.nodes
  const m = editor.marks

  const listWithAttrs = (attrs: ListAttributes) => {
    return (...children: NodeChild[]) => n.list(attrs, ...children)
  }

  const p = n.paragraph
  const doc = n.doc
  const blockquote = n.blockquote
  const horizontalRule = n.horizontalRule

  const bulletList = listWithAttrs({ kind: 'bullet' })
  const orderedList = listWithAttrs({ kind: 'ordered' })
  const ordered99List = (...children: NodeChild[]) =>
    n.list({ kind: 'ordered', order: 99 }, ...children)
  const checkedTaskList = listWithAttrs({ kind: 'task', checked: true })
  const uncheckedTaskList = listWithAttrs({ kind: 'task', checked: false })
  const collapsedToggleList = listWithAttrs({ kind: 'toggle', collapsed: true })
  const expandedToggleList = listWithAttrs({ kind: 'toggle', collapsed: false })

  const add = (taggedDoc: ProseMirrorNode) => {
    editor.set(taggedDoc)
    return editor
  }

  const dispatchCommand = (command: Command): boolean => {
    return command(
      editor.view.state,
      editor.view.dispatch.bind(editor.view),
      editor.view,
    )
  }

  const copy = (): { html: string; text: string } => {
    const view = editor.view
    const slice = view.state.selection.content()
    const { dom, text } = view.serializeForClipboard(slice)
    return { html: dom.innerHTML, text }
  }

  const pasteHTML = (html: string) => {
    const view = editor.view
    const dataTransfer = new DataTransfer()
    dataTransfer.setData('text/html', html)
    const event = new ClipboardEvent('paste', {
      clipboardData: dataTransfer,
      bubbles: true,
      cancelable: true,
    })
    view.dom.dispatchEvent(event)
  }

  const applyCommand = (
    command: Command,
    before: ProseMirrorNode,
    after: ProseMirrorNode | null,
  ) => {
    add(before)
    const result = dispatchCommand(command)
    if (!after) {
      expect(result).toBe(false)
    } else {
      expectStateToEqual(editor.state, after)
    }
  }

  const markdown = (
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): ProseMirrorNode => {
    const src = String.raw({ raw: strings }, ...values)
    // TODO: Drop @ts-expect-error once prosekit's NodeAction/MarkAction types
    // allow assignment to the generic record shape that markdownToTaggedDoc
    // expects (contravariant attrs typing).
    // @ts-expect-error contravariant attrs typing
    const nodes: Record<string, NodeAction> = n
    const marks: Record<string, MarkAction> = m
    return markdownToTaggedDoc(editor.schema, nodes, marks, src)
  }

  return {
    editor,
    view: editor.view,
    schema: editor.schema,
    add,
    markdown,
    dispatchCommand,
    applyCommand,
    copy,
    pasteHTML,

    n,
    m,

    doc,
    p,
    blockquote,
    horizontalRule,

    bulletList,
    orderedList,
    ordered99List,
    checkedTaskList,
    uncheckedTaskList,
    collapsedToggleList,
    expandedToggleList,
  }
}

export type TestingEditor = ReturnType<typeof setupTestingEditor>['editor']
