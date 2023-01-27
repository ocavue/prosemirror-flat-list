import { describe, expect, it } from 'vitest'

import { setupTestingEditor } from '../test/setup-editor'

describe('input rules', () => {
  const t = setupTestingEditor()

  it('can turn a paragraph into a bullet list', () => {
    const editor = t.add(t.doc(t.p('<cursor>')))
    editor.insertText('- ')
    expect(editor.state).toEqualRemirrorState(
      t.doc(t.bulletList(t.p('<cursor>'))),
    )
  })

  it('can turn a paragraph into a task list', () => {
    const editor = t.add(t.doc(t.p('<cursor>')))
    editor.insertText('- [x] ')
    expect(editor.state).toEqualRemirrorState(
      t.doc(t.checkedTaskList(t.p('<cursor>'))),
    )
  })

  it('can turn a paragraph into an ordered list', () => {
    const editor = t.add(t.doc(t.p('<cursor>')))
    editor.insertText('1. ')
    expect(editor.state).toEqualRemirrorState(
      t.doc(t.orderedList(t.p('<cursor>'))),
    )
  })

  it('can turn a task list into an ordered list', () => {
    const editor = t.add(t.doc(t.uncheckedTaskList(t.p('<cursor>'))))
    editor.insertText('1. ')
    expect(editor.state).toEqualRemirrorState(
      t.doc(t.orderedList(t.p('<cursor>'))),
    )
  })
})
