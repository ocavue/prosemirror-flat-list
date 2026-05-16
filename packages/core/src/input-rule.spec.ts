import { describe, expect, it } from 'vitest'
import { keyboard } from 'vitest-browser-commands/playwright'

import { expectStateToEqual } from '../test/markdown'
import { setupTestingEditor } from '../test/setup-editor'

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

  it('can change list type', async () => {
    t.add(t.doc(t.uncheckedTaskList(t.p('<a>'))))
    await keyboard.type('1. ')
    expectStateToEqual(t.editor.state, t.doc(t.orderedList(t.p('<a>'))))
  })

  it('can reset the attribute "collapsed" when changing list type', async () => {
    t.add(t.doc(t.collapsedToggleList(t.p('<a>'))))
    const collapsedBefore: boolean = t.editor.state.doc.child(0).attrs.collapsed
    expect(collapsedBefore).toBe(true)
    await keyboard.type('1. ')
    expectStateToEqual(t.editor.state, t.doc(t.orderedList(t.p('<a>'))))
    const collapsedAfter: boolean = t.editor.state.doc.child(0).attrs.collapsed
    expect(collapsedAfter).toBe(false)
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
