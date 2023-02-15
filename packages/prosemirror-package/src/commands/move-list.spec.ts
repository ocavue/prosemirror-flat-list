import { describe, it } from 'vitest'
import { setupTestingEditor } from '../../test/setup-editor'

describe('moveList', () => {
  const t = setupTestingEditor()
  const markdown = t.markdown
  const commands = t.editor.commands
  const moveUp = () => commands.moveList('up')
  const moveDown = () => commands.moveList('down')

  it('can move up list nodes', () => {
    t.runCommand(
      moveUp,
      markdown`
        - A1
        - A2<start>
        - A3<end>
      `,
      markdown`
        - A2<start>
        - A3<end>
        - A1
      `,
    )
  })

  it('can move up and dedent list nodes to parent list', () => {
    t.runCommand(
      moveUp,
      markdown`
        - A1
        - A2
          - B1<start>
          - B2<end>
          - B3
      `,
      markdown`
        - A1
        - B1<start>
        - B2<end>
        - A2
          - B3
      `,
    )
  })

  it('can move down list nodes', () => {
    t.runCommand(
      moveDown,
      markdown`
        - A1<start>
        - A2<end>
        - A3
      `,
      markdown`
        - A3
        - A1<start>
        - A2<end>
      `,
    )
  })

  it('can move down and dedent list nodes to parent list', () => {
    t.runCommand(
      moveDown,
      markdown`
        - A1
        - A2
          - B1<start>
          - B2<end>
        - A3
      `,
      markdown`
        - A1
        - A2
        - A3
        - B1<start>
        - B2<end>
      `,
    )
  })
})
