import { AllSelection } from 'prosemirror-state'
import { describe, expect, it } from 'vitest'
import { keyboard } from 'vitest-browser-commands/playwright'

import { expectStateToEqual } from '../../test/markdown'
import { setupTestingEditor } from '../../test/setup-editor'

import { protectCollapsed } from './protect-collapsed'

describe('protectCollapsed', () => {
  const {
    add,
    doc,
    p,
    editor,
    view,
    dispatchCommand,
    collapsedToggleList,
    expandedToggleList,
  } = setupTestingEditor()

  const selectAll = () => {
    view.dispatch(view.state.tr.setSelection(new AllSelection(view.state.doc)))
  }

  it('can skip collapsed content', async () => {
    add(
      doc(
        collapsedToggleList(
          //
          p('1<a>23'),
          p('456'),
        ),
        collapsedToggleList(
          //
          p('123'),
          p('4<b>56'),
        ),
      ),
    )
    await keyboard.press('Enter')
    expectStateToEqual(
      editor.state,
      doc(
        expandedToggleList(
          //
          p('1<a>23'),
          p('456'),
        ),
        expandedToggleList(
          //
          p('123'),
          p('4<b>56'),
        ),
      ),
    )
  })

  it('does not protect an explicit select-all', () => {
    add(
      doc(
        p('above'),
        collapsedToggleList(
          //
          p('123'),
          p('456'),
        ),
        p('below'),
      ),
    )
    selectAll()
    expect(dispatchCommand(protectCollapsed)).toBe(false)
    expect(view.state.doc.child(1).attrs['collapsed']).toBe(true)
  })

  it('deletes collapsed content on Backspace after an explicit select-all', async () => {
    add(
      doc(
        p('above'),
        collapsedToggleList(
          //
          p('123'),
          p('456'),
        ),
        p('below'),
      ),
    )
    selectAll()
    await keyboard.press('Backspace')
    expectStateToEqual(editor.state, doc(p()))
  })
})
