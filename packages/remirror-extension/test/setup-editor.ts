import { BlockquoteExtension } from '@remirror/extension-blockquote'
import '@remirror/preset-core'
import 'jest-prosemirror'
import { renderEditor, type TaggedProsemirrorNode } from 'jest-remirror'
import type { ListAttributes } from 'prosemirror-flat-list'
import { expect } from 'vitest'

import { ListExtension } from '../src/extension'

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

  const apply = (
    action: () => void,
    before: TaggedProsemirrorNode,
    after: TaggedProsemirrorNode,
  ) => {
    add(before)
    action()
    expect(editor.state).toEqualRemirrorState(after)
  }

  const bulletList = list({ type: 'bullet' })
  const orderedList = list({ type: 'ordered' })
  const checkedTaskList = list({ type: 'task', checked: true })
  const uncheckedTaskList = list({ type: 'task', checked: false })
  const collapsedToggleList = list({
    kind: 'toggle',
    collapsed: true,
  } satisfies ListAttributes)
  const expandedToggleList = list({
    kind: 'toggle',
    collapsed: true,
  } satisfies ListAttributes)

  return {
    manager,
    view,
    schema,
    add,
    apply,
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
  }
}

export type TestingEditor = ReturnType<
  ReturnType<typeof setupTestingEditor>['add']
>
