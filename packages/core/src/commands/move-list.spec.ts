import { describe, it } from 'vitest'

import { setupTestingEditor } from '../../test/setup-editor'

import { createMoveListCommand } from './move-list'

describe('moveList', () => {
  const t = setupTestingEditor()
  const markdown = t.markdown
  const moveUp = createMoveListCommand('up')
  const moveDown = createMoveListCommand('down')

  it('can move up list nodes', () => {
    t.applyCommand(
      moveUp,
      markdown`
        - A1
        - A2<a>
        - A3<b>
      `,
      markdown`
        - A2<a>
        - A3<b>
        - A1
      `,
    )
  })

  it('can move up and dedent list nodes to parent list', () => {
    t.applyCommand(
      moveUp,
      markdown`
        - A1
        - A2
          - B1<a>
          - B2<b>
          - B3
      `,
      markdown`
        - A1
        - B1<a>
        - B2<b>
        - A2
          - B3
      `,
    )
  })

  it('can move down list nodes', () => {
    t.applyCommand(
      moveDown,
      markdown`
        - A1<a>
        - A2<b>
        - A3
      `,
      markdown`
        - A3
        - A1<a>
        - A2<b>
      `,
    )
  })

  it('can move down and dedent list nodes to parent list', () => {
    t.applyCommand(
      moveDown,
      markdown`
        - A1
        - A2
          - B1<a>
          - B2<b>
        - A3
      `,
      markdown`
        - A1
        - A2
        - A3
        - B1<a>
        - B2<b>
      `,
    )
  })
})
