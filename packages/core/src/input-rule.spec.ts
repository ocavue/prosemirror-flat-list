import { describe, expect, it } from 'vitest'
import { keyboard } from 'vitest-browser-commands/playwright'

import { expectStateToEqual } from '../test/markdown'
import { setupTestingEditor } from '../test/setup-editor'

import type { ListAttributes } from './types'

describe('input rules', () => {
  const t = setupTestingEditor()

  it('can turn a paragraph into a bullet list', async () => {
    t.add(t.doc(t.p('<a>')))
    await keyboard.type('- ')
    expectStateToEqual(t.editor.state, t.doc(t.bulletList(t.p('<a>'))))
  })

  it('can turn a paragraph into a task list', async () => {
    t.add(t.doc(t.p('<a>')))
    await keyboard.type('- [x] ')
    expectStateToEqual(t.editor.state, t.doc(t.checkedTaskList(t.p('<a>'))))
  })

  it('can turn a paragraph into an ordered list', async () => {
    t.add(t.doc(t.p('<a>')))
    await keyboard.type('1. ')
    expectStateToEqual(t.editor.state, t.doc(t.orderedList(t.p('<a>'))))
  })

  it('can turn a paragraph into an ordered list with a custom order counter', async () => {
    t.add(t.doc(t.p('<a>')))
    await keyboard.type('99. ')
    expectStateToEqual(t.editor.state, t.doc(t.ordered99List(t.p('<a>'))))
  })

  it('does not turn a paragraph into an ordered list when the number fills the input rule window', async () => {
    // Input rules only see the last 500 characters before the caret, so `^`
    // matches at the start of that window, not at the start of the paragraph.
    const text = 'a' + '1'.repeat(499) + '.'
    t.add(t.doc(t.p(`${text}<a>`)))
    await keyboard.type(' ')
    expectStateToEqual(t.editor.state, t.doc(t.p(`${text} <a>`)))
  })

  it('can change list type', async () => {
    t.add(t.doc(t.uncheckedTaskList(t.p('<a>'))))
    await keyboard.type('1. ')
    expectStateToEqual(t.editor.state, t.doc(t.orderedList(t.p('<a>'))))
  })

  it('can reset the attribute "collapsed" when changing list type', async () => {
    t.add(t.doc(t.collapsedToggleList(t.p('<a>'))))
    expect(
      (t.editor.state.doc.child(0).attrs as ListAttributes).collapsed,
    ).toBe(true)
    await keyboard.type('1. ')
    expectStateToEqual(t.editor.state, t.doc(t.orderedList(t.p('<a>'))))
    expect(
      (t.editor.state.doc.child(0).attrs as ListAttributes).collapsed,
    ).toBe(false)
  })

  it('can turn a paragraph into a sub-list', async () => {
    t.add(
      t.doc(
        t.bulletList(
          //
          t.p('A1'),
          t.p('<a>A1'),
          t.p('A1'),
        ),
      ),
    )
    await keyboard.type('- ')

    expectStateToEqual(
      t.editor.state,
      t.doc(
        t.bulletList(
          //
          t.p('A1'),
          t.bulletList(t.p('<a>A1')),
          t.p('A1'),
        ),
      ),
    )
  })

  it("can ignore the input rule if it's already that list type", async () => {
    t.add(
      t.doc(
        t.bulletList(
          //
          t.p('<a>A1'),
          t.p('A1'),
        ),
      ),
    )
    await keyboard.type('- ')

    expectStateToEqual(
      t.editor.state,
      t.doc(
        t.bulletList(
          //
          t.p('- A1'),
          t.p('A1'),
        ),
      ),
    )
  })
})
