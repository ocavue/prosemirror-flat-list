import '@remirror/preset-core'
import 'jest-prosemirror'

import { BlockquoteExtension } from '@remirror/extension-blockquote'
import { renderEditor, TaggedProsemirrorNode } from 'jest-remirror'
import { expect } from 'vitest'
import { ListAttributes } from '../src/types'
import { ListExtension } from './extension'
import { markdownToTaggedDoc } from './markdown'
import { Command } from 'prosemirror-state'

export function setupTestingEditor() {
  const extensions = [new ListExtension(), new BlockquoteExtension()]
  const editor = renderEditor(extensions, {})
  const {
    view,
    add,
    nodes: { doc, p, blockquote },
    attributeNodes: { list },
    manager,
    schema,
  } = editor

  const markdown = (
    strings: TemplateStringsArray,
    ...values: any[]
  ): TaggedProsemirrorNode => {
    const markdown = String.raw({ raw: strings }, ...values)
    return markdownToTaggedDoc(editor, markdown)
  }

  const applyCommand = (
    command: Command,
    before: TaggedProsemirrorNode,
    after: TaggedProsemirrorNode | null,
  ) => {
    add(before)
    const result = command(view.state, view.dispatch, view)
    if (!after) {
      expect(result).toBe(false)
    } else {
      expect(editor.state).toEqualRemirrorState(after)
    }
  }

  const bulletList = list({ kind: 'bullet' })
  const orderedList = list({ kind: 'ordered' })
  const ordered99List = list({ kind: 'ordered', order: 99 })
  const checkedTaskList = list({ kind: 'task', checked: true })
  const uncheckedTaskList = list({ kind: 'task', checked: false })
  const collapsedToggleList = list({
    kind: 'toggle',
    collapsed: true,
  } satisfies ListAttributes)
  const expandedToggleList = list({
    kind: 'toggle',
    collapsed: false,
  } satisfies ListAttributes)

  return {
    manager,
    view,
    schema,
    add,
    markdown,
    applyCommand,
    editor,

    doc,
    p,
    blockquote,

    bulletList,
    orderedList,
    checkedTaskList,
    uncheckedTaskList,
    collapsedToggleList,
    expandedToggleList,
    ordered99List,
  }
}

export type TestingEditor = ReturnType<
  ReturnType<typeof setupTestingEditor>['add']
>
