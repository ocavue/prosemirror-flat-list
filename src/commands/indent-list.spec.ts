import { describe, it } from 'vitest'
import { setupTestingEditor } from '../../test/setup-editor'

describe('indentList', () => {
  const t = setupTestingEditor()
  const markdown = t.markdown
  const commands = t.editor.commands

  it('can indent a list node and append it to the previous list node', () => {
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

    t.runCommand(
      commands.indentList,
      markdown`
        - A1
        - ## A<cursor>2
      `,
      markdown`
        - A1
          - ## A<cursor>2
      `,
    )

    t.runCommand(
      commands.indentList,
      markdown`
        - A1
        - > ## A<cursor>2
      `,
      markdown`
        - A1
          - > ## A<cursor>2
      `,
    )
  })

  it('can indent multiple list nodes and append them to the previous list node', () => {
    t.runCommand(
      commands.indentList,
      markdown`
        - A1
        - A2<start>
        - A3<end>
      `,
      markdown`
        - A1
          - A2<start>
          - A3<end>
      `,
    )
  })

  it('can indent a paragraph and wrap it with a new list node', () => {
    t.runCommand(
      commands.indentList,
      markdown`
        - A1
        - A2a

          A2b<cursor>
      `,
      markdown`
        - A1

        - A2a

          - A2b<cursor>
      `,
    )

    t.runCommand(
      commands.indentList,
      markdown`
        - A1
        - A2a

          A2b<cursor>

          A2c
      `,
      markdown`
        - A1

        - A2a

          - A2b<cursor>

          A2c
      `,
    )
  })

  it('can indent a paragraph and append it to the previous sibling list node', () => {
    t.runCommand(
      commands.indentList,
      markdown`
        - A1
        - A2a

          - B1

          A2b<cursor>
      `,
      markdown`
        - A1

        - A2a

          - B1

            A2b<cursor>
      `,
    )

    t.runCommand(
      commands.indentList,
      markdown`
        - A1
        - A2a

          - B1

          A2b<cursor>

          - B2
      `,
      markdown`
        - A1

        - A2a

          - B1

            A2b<cursor>

          - B2
      `,
    )
  })

  it('can only indent selected part when the selection across multiple depth of a nested lists', () => {
    t.runCommand(
      commands.indentList,
      markdown`
        - A1a

          - B1a

            - C1

            B1b<start>

          A1b<end>
      `,
      markdown`
        - A1a

          - B1a

            - C1

              B1b<start>

            A1b<end>
      `,
    )
  })

  it('can indent multiple list nodes and append them to the previous list node', () => {
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

  it.skip('can keep the indentation of sub list nodes when moving multiple list', () => {
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

  it.skip('can keep the indentation of siblings around the indented item', () => {
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

  it.skip('can handle some complex nested lists', () => {
    t.runCommand(
      commands.indentList,
      markdown`
        - A1
          - B1
          - <start>B2
        - A2
          - B3
            - C1<end>
              - D1
          - B4
      `,
      markdown`
        - A1
          - B1
            - <start>B2
          - A2
            - B3
              - C1<end>
              - D1
          - B4
      `,
    )
  })
})
