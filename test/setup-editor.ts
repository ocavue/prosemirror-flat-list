import { BlockquoteExtension } from '@remirror/extension-blockquote'
import { renderEditor, TaggedProsemirrorNode } from 'jest-remirror'
import { expect } from 'vitest'
import { ListExtension } from '../src/extension'
import { ListAttributes } from '../src/types'
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

  const runCommand = (
    commandFunction: () => void,
    before: TaggedProsemirrorNode,
    after: TaggedProsemirrorNode
  ) => {
    add(before)
    commandFunction()
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
    collapsed: true,
  } satisfies ListAttributes)

  return {
    manager,
    view,
    schema,
    add,
    markdown,
    runCommand,
    editor,
    comments: editor.commands,

    doc,
    p,
    hardBreak,
    blockquote,

    // TODO: remove list
    list: bulletList,
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
