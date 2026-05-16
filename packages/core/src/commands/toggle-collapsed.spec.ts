import { describe, it } from 'vitest'

import { setupTestingEditor } from '../../test/setup-editor'

import { createToggleCollapsedCommand } from './toggle-collapsed'

describe('toggleCollapsed', () => {
  const t = setupTestingEditor()

  it('can toggle collapsed attribute', () => {
    t.applyCommand(
      createToggleCollapsedCommand(),
      t.doc(t.collapsedToggleList(t.p('A1<a>'), t.p('A1'))),
      t.doc(t.expandedToggleList(t.p('A1<a>'), t.p('A1'))),
    )

    t.applyCommand(
      createToggleCollapsedCommand(),
      t.doc(t.expandedToggleList(t.p('A1<a>'), t.p('A1'))),
      t.doc(t.collapsedToggleList(t.p('A1<a>'), t.p('A1'))),
    )
  })

  it('can set collapsed value', () => {
    t.applyCommand(
      createToggleCollapsedCommand({ collapsed: true }),
      t.doc(t.collapsedToggleList(t.p('A1<a>'), t.p('A1'))),
      t.doc(t.collapsedToggleList(t.p('A1<a>'), t.p('A1'))),
    )

    t.applyCommand(
      createToggleCollapsedCommand({ collapsed: true }),
      t.doc(t.expandedToggleList(t.p('A1<a>'), t.p('A1'))),
      t.doc(t.collapsedToggleList(t.p('A1<a>'), t.p('A1'))),
    )

    t.applyCommand(
      createToggleCollapsedCommand({ collapsed: false }),
      t.doc(t.collapsedToggleList(t.p('A1<a>'), t.p('A1'))),
      t.doc(t.expandedToggleList(t.p('A1<a>'), t.p('A1'))),
    )

    t.applyCommand(
      createToggleCollapsedCommand({ collapsed: false }),
      t.doc(t.expandedToggleList(t.p('A1<a>'), t.p('A1'))),
      t.doc(t.expandedToggleList(t.p('A1<a>'), t.p('A1'))),
    )
  })

  it('can skip non-collapsed node', () => {
    t.applyCommand(
      createToggleCollapsedCommand(),
      t.doc(t.expandedToggleList(t.p('A1<a>'))),
      t.doc(t.expandedToggleList(t.p('A1<a>'))),
    )

    t.applyCommand(
      createToggleCollapsedCommand(),
      t.doc(t.expandedToggleList(t.p('A1'), t.orderedList(t.p('B1<a>')))),
      t.doc(t.collapsedToggleList(t.p('A1<a>'), t.orderedList(t.p('B1')))),
    )
  })
})
