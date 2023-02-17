import '@remirror/preset-core'
import 'jest-prosemirror'

import { BlockquoteExtension } from '@remirror/extension-blockquote'
import { renderEditor, TaggedProsemirrorNode } from 'jest-remirror'
import { expect } from 'vitest'
import { ListAttributes } from '../src/types'
import { ListExtension } from './extension'
import { markdownToTaggedDoc } from './markdown'

export function setupTestingEditor() {
  const extensions = [new ListExtension(), new BlockquoteExtension()]
  const editor = renderEditor(extensions, {})
  const {
    view,
    add,
    nodes: { doc, p, hardBreak, blockquote },
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
    type: 'toggle',
    collapsed: true,
  } satisfies ListAttributes)
  const expandedToggleList = list({
    type: 'toggle',
    collapsed: false,
  } satisfies ListAttributes)

  return {
    manager,
    view,
    schema,
    add,
    markdown,
    apply,
    editor,

    doc,
    p,
    hardBreak,
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
