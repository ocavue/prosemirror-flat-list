import { describe, it } from 'vitest'
import { setupTestingEditor } from '../../test/setup-editor'

describe('toggleCollapsed', () => {
  const t = setupTestingEditor()
  const toggleCollapsed = t.editor.commands.toggleCollapsed

  it('can toggle collapsed attribute', () => {
    t.apply(
      toggleCollapsed,
      t.doc(t.collapsedToggleList(t.p('A1<cursor>'), t.p('A1'))),
      t.doc(t.expandedToggleList(t.p('A1<cursor>'), t.p('A1'))),
    )

    t.apply(
      toggleCollapsed,
      t.doc(t.expandedToggleList(t.p('A1<cursor>'), t.p('A1'))),
      t.doc(t.collapsedToggleList(t.p('A1<cursor>'), t.p('A1'))),
    )
  })

  it('can set collapsed value', () => {
    t.apply(
      () => toggleCollapsed({ collapsed: true }),
      t.doc(t.collapsedToggleList(t.p('A1<cursor>'), t.p('A1'))),
      t.doc(t.collapsedToggleList(t.p('A1<cursor>'), t.p('A1'))),
    )

    t.apply(
      () => toggleCollapsed({ collapsed: true }),
      t.doc(t.expandedToggleList(t.p('A1<cursor>'), t.p('A1'))),
      t.doc(t.collapsedToggleList(t.p('A1<cursor>'), t.p('A1'))),
    )

    t.apply(
      () => toggleCollapsed({ collapsed: false }),
      t.doc(t.collapsedToggleList(t.p('A1<cursor>'), t.p('A1'))),
      t.doc(t.expandedToggleList(t.p('A1<cursor>'), t.p('A1'))),
    )

    t.apply(
      () => toggleCollapsed({ collapsed: false }),
      t.doc(t.expandedToggleList(t.p('A1<cursor>'), t.p('A1'))),
      t.doc(t.expandedToggleList(t.p('A1<cursor>'), t.p('A1'))),
    )
  })

  it('can skip non-collapsed node', () => {
    t.apply(
      toggleCollapsed,
      t.doc(t.expandedToggleList(t.p('A1<cursor>'))),
      t.doc(t.expandedToggleList(t.p('A1<cursor>'))),
    )

    t.apply(
      toggleCollapsed,
      t.doc(t.expandedToggleList(t.p('A1'), t.orderedList(t.p('B1<cursor>')))),
      t.doc(t.collapsedToggleList(t.p('A1<cursor>'), t.orderedList(t.p('B1')))),
    )
  })
})
