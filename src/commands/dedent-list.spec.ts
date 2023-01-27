import { describe, it } from 'vitest'
import { setupTestingEditor } from '../../test/setup-editor'

describe('dedentList', () => {
  const t = setupTestingEditor()
  const markdown = t.markdown
  const commands = t.editor.commands

  it('can dedent a list node to outer list', () => {
    t.runCommand(
      commands.dedentList,
      markdown`
        - A1
          - B<cursor>1
      `,
      markdown`
        - A1
        - B<cursor>1
      `,
    )

    t.runCommand(
      commands.dedentList,
      markdown`
        - - <cursor>B1
        - A1
      `,
      markdown`
        - B1
        - A1
      `,
    )
  })

  it('can unwrap a list node', () => {
    t.runCommand(
      commands.dedentList,
      markdown`
        - A1<cursor>
      `,
      markdown`
        A1<cursor>
      `,
    )

    t.runCommand(
      commands.dedentList,
      markdown`
        - A1<cursor>
        - A2
      `,
      markdown`
        A1<cursor>

        - A2
      `,
    )

    t.runCommand(
      commands.dedentList,
      markdown`
        - A1
        - A2<cursor>
      `,
      markdown`
        - A1

        A2
      `,
    )
  })

  it('can unwrap multiple list nodes', () => {
    t.runCommand(
      commands.dedentList,
      markdown`
        - A1<start>
        - A2<end>
      `,
      markdown`
        A1

        A2
      `,
    )

    t.runCommand(
      commands.dedentList,
      markdown`
        - A1<start>
        - A2<end>
        - A3
      `,
      markdown`
        A1

        A2

        - A3
      `,
    )

    t.runCommand(
      commands.dedentList,
      markdown`
        - A1
        - A2<start>
        - A3<end>
      `,
      markdown`
        - A1

        A2

        A3
      `,
    )

    t.runCommand(
      commands.dedentList,
      markdown`
        - A1
        - A2<start>
        - A3<end>
        - A4
      `,
      markdown`
        - A1

        A2

        A3

        - A4
      `,
    )
  })

  it('can keep siblings after the lifted items at the same position', () => {
    t.runCommand(
      commands.dedentList,
      markdown`
        - A1

          - B1

            B1

          - B2<start>

            B2

          - B3<end>

            B3

          - B4

            B4
      `,
      markdown`
        - A1

          - B1

            B1

        - B2<start>

          B2

        - B3<end>

          B3

          - B4

            B4
      `,
    )
  })

  it('do nothing when not inside a list', () => {
    t.runCommand(
      commands.dedentList,
      markdown`
        Hello<cursor>
      `,
      markdown`
        Hello<cursor>
      `,
    )
  })
})
