import { describe, it } from 'vitest'
import { setupTestingEditor } from '../../test/setup-editor'

describe('indentList', () => {
  const t = setupTestingEditor()
  const markdown = t.markdown
  const commands = t.editor.commands

  it('can indent a list node', () => {
    t.runCommand(
      commands.indentList,
      markdown`
        - A1
        - A<cursor>2
      `,
      markdown`
        - A1
          - A<cursor>2
      `,
    )
  })

  it('can indent multiple list nodes', () => {
    t.runCommand(
      commands.indentList,
      markdown`
        - A1
        - A<start>2
        - A<end>3
      `,
      markdown`
        - A1
          - A<start>2
          - A<end>3
      `,
    )
  })

  it('can add ambitious indentations', () => {
    t.runCommand(
      commands.indentList,
      markdown`
        - A1
          - A<cursor>2
      `,
      markdown`
        - A1
          - - A<cursor>2
      `,
    )
  })

  it('can keep attributes', () => {
    t.runCommand(
      commands.indentList,
      markdown`
        - [ ] A1
        - [x] A<cursor>2
      `,
      markdown`
        - [ ] A1
          - [x] A<cursor>2
      `,
    )
  })

  it('can keep the indentation of sub list nodes', () => {
    t.runCommand(
      commands.indentList,
      markdown`
        - A1
        - A2
        - A3<cursor>
          - B1
          - B2
          - B3
      `,
      markdown`
        - A1
        - A2
          - A3<cursor>
          - B1
          - B2
          - B3
      `,
    )
  })

  it('can keep the indentation of sub list nodes when moving multiple list', () => {
    t.runCommand(
      commands.indentList,
      markdown`
        - A1
        - <start>A2
        - A3<end>
          - B1
          - B2
          - B3
      `,
      markdown`
        - A1
          - <start>A2
          - A3<end>
          - B1
          - B2
          - B3
      `,
    )
  })

  it('can keep the indentation of siblings around the indented item', () => {
    t.runCommand(
      commands.indentList,
      markdown`
        - A1

        - A2<cursor>

          A2
      `,
      markdown`
        - A1

          - A2<cursor>

            A2
      `,
    )

    t.runCommand(
      commands.indentList,
      markdown`
        - A1

        - A2<cursor>

          A2

          - B1
      `,
      markdown`
        - A1

          - A2<cursor>

            A2

          - B1
      `,
    )

    t.runCommand(
      commands.indentList,
      markdown`
        - A1

        - A2

          A2<cursor>

          A2

          - B1
      `,
      markdown`
        - A1

        - A2

          - A2<cursor>

        - A2

          - B1
      `,
    )

    t.runCommand(
      commands.indentList,
      markdown`
        - A1

          A1

        - <cursor>A2
      `,
      markdown`
        - A1

          A1

          - <cursor>A2
      `,
    )
  })
})
