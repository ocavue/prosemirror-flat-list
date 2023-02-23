import { TaggedProsemirrorNode } from 'jest-remirror'
import { Node as ProsemirrorNode } from 'prosemirror-model'
import { describe, expect, it } from 'vitest'
import { setupTestingEditor } from '../../test/setup-editor'
import { ListAttributes } from '../types'
import { setListAttributes } from '../utils/set-list-attributes'
import { createIndentListCommand } from './indent-list'

describe('indentList', () => {
  const t = setupTestingEditor()
  const markdown = t.markdown
  const commands = t.editor.commands

  it('can indent a list node and append it to the previous list node', () => {
    t.apply(
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

    t.apply(
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

    t.apply(
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
    t.apply(
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

  it('should not wrap a paragraph with a new list node when it will bring a new visual bullet', () => {
    t.apply(
      commands.indentList,
      markdown`
        - A1
        - A2a

          A2b<cursor>
      `,
      markdown`
        - A1

        - A2a

          A2b<cursor>
      `,
    )

    t.apply(
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

          A2b<cursor>

          A2c
      `,
    )
  })

  it('can indent a paragraph and append it to the previous sibling list node', () => {
    t.apply(
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

    t.apply(
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
    t.apply(
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

    t.apply(
      commands.indentList,
      markdown`
        - A1a

          - B1a

            - C1

            B1b<start>

          - B2

          - B3

          - B4

          A1b<end>
      `,
      markdown`
        - A1a

          - B1a

            - C1

              B1b<start>

            - B2

            - B3

            - B4

            A1b<end>
      `,
    )
  })

  it('can indent multiple list nodes and append them to the previous list node', () => {
    t.apply(
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
    t.apply(
      commands.indentList,
      markdown`
        - A1
          - B<cursor>2
      `,
      markdown`
        - A1
          - - B<cursor>2
      `,
    )
  })

  it('can split the list when necessary', () => {
    t.apply(
      commands.indentList,
      markdown`
        - A1

          - B<cursor>2a

            B2b

            B2c
      `,
      markdown`
        - A1

          - - B<cursor>2a

          - B2b

            B2c
      `,
    )
  })

  it('can keep attributes', () => {
    t.apply(
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

    t.apply(
      commands.indentList,
      markdown`
        1. A1

        2. A<cursor>2

           - B1
      `,
      markdown`
        1. A1

           1. A<cursor>2

           - B1
      `,
    )

    t.apply(
      commands.indentList,
      markdown`
        - [x] A1
          - B1
        - [x] A<cursor>2
          1. B2
      `,
      markdown`
        - [x] A1
          - B1
          - [x] A<cursor>2
          1. B2
      `,
    )
  })

  it('can keep the indentation of sub list nodes', () => {
    t.apply(
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

  it('can move all collapsed content', () => {
    t.apply(
      () => {
        let tr = t.view.state.tr
        let attrs: ListAttributes = { kind: 'toggle', collapsed: true }
        setListAttributes(tr, t.view.state.selection.from, attrs)
        t.view.dispatch(tr)

        commands.indentList()

        tr = t.view.state.tr
        attrs = { kind: 'bullet', collapsed: false }
        setListAttributes(tr, t.view.state.selection.from, attrs)
        t.view.dispatch(tr)
      },
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
    t.apply(
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

    t.apply(
      commands.indentList,
      markdown`
        - A1
          - B1
        - A2<start>
          - B2<end>
            - C1
      `,
      markdown`
        - A1
          - B1
          - A2<start>
            - B2<end>
            - C1
      `,
    )
  })

  it('can keep the indentation of siblings around the indented item', () => {
    t.apply(
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

    t.apply(
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

    t.apply(
      commands.indentList,
      markdown`
        - A1

        - A2

          - B1

          A2<cursor>

          A2

          - B1
      `,
      markdown`
        - A1

        - A2

          - B1

            A2<cursor>

          A2

          - B1
      `,
    )

    t.apply(
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

  it('can indent a paragraph that not inside a list node', () => {
    t.apply(
      commands.indentList,
      markdown`
        - A1

        P1<cursor>
      `,
      markdown`
        - A1

          P1<cursor>
      `,
    )

    t.apply(
      commands.indentList,
      markdown`
        - A1

        P1<start>

        P2<end>

        P3
      `,
      markdown`
        - A1

          P1<start>

          P2<end>

        P3
      `,
    )
  })

  it('can handle some complex nested lists', () => {
    t.apply(
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

  it('only needs one step for some of the most comment indent action', () => {
    const countSteps = (
      doc: TaggedProsemirrorNode,
      expected: TaggedProsemirrorNode,
    ) => {
      t.add(doc)
      const state = t.view.state
      const command = createIndentListCommand()
      let count = -1
      let actual: ProsemirrorNode | null = null
      command(state, (tr) => {
        count = tr.steps.length
        actual = tr.doc
      })
      expect(actual).not.equal(null)
      expect(actual).toEqualRemirrorDocument(expected)
      return count
    }

    expect(
      countSteps(
        markdown`
          - A1
          - A2<cursor>
        `,
        markdown`
          - A1
            - A2<cursor>
        `,
      ),
    ).toBe(1)

    expect(
      countSteps(
        markdown`
          - A1
          - [ ] A2<cursor>
          - [x] A3
        `,
        markdown`
          - A1
            - [ ] A2<cursor>
          - [x] A3
        `,
      ),
    ).toBe(1)

    expect(
      countSteps(
        markdown`
          1. A1
          2. <start>A2
          3. A3<end>
          4. A4
        `,
        markdown`
          1. A1
             1. <start>A2
             2. A3<end>
          2. A4
        `,
      ),
    ).toBe(1)

    expect(
      countSteps(
        markdown`
          1. A1
             - B1
             - <start>B2
             - B3
             - B4<end>
        `,
        markdown`
          1. A1
             - B1
               - <start>B2
               - B3
               - B4<end>
        `,
      ),
    ).toBe(1)

    // For more complex (and less common) cases, more steps is acceptable
    expect(
      countSteps(
        markdown`
          - A1

            - B1

              - C1

                - D1

                  D1b

                - <start>D2

                C1b

                C1c

            - B2

              - C2

          - A2

          - A3

            - B3

              B3b

            - B4<end>

            A3b
        `,
        markdown`
          - A1

            - B1

              - C1

                - D1

                  D1b

                  - <start>D2

                  C1b

                  C1c

              - B2

                - C2

            - A2

            - A3

              - B3

                B3b

              - B4<end>

            A3b
        `,
      ),
    ).toBeGreaterThan(1)
  })
})
