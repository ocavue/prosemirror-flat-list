import type { Node as ProsemirrorNode } from 'prosemirror-model'
import { describe, expect, it } from 'vitest'

import { setupTestingEditor } from '../../test/setup-editor'

import { createIndentListCommand } from './indent-list'

describe('indentList', () => {
  const t = setupTestingEditor()
  const markdown = t.markdown

  const indentList = createIndentListCommand()

  it('can indent a list node and append it to the previous list node', () => {
    t.applyCommand(
      indentList,
      markdown`
        - A1
        - A<a>2
      `,
      markdown`
        - A1
          - A<a>2
      `,
    )

    t.applyCommand(
      indentList,
      markdown`
        - A1
        - ## A<a>2
      `,
      markdown`
        - A1
          - ## A<a>2
      `,
    )

    t.applyCommand(
      indentList,
      markdown`
        - A1
        - > ## A<a>2
      `,
      markdown`
        - A1
          - > ## A<a>2
      `,
    )
  })

  it('can indent multiple list nodes and append them to the previous list node', () => {
    t.applyCommand(
      indentList,
      markdown`
        - A1
        - A2<a>
        - A3<b>
      `,
      markdown`
        - A1
          - A2<a>
          - A3<b>
      `,
    )
  })

  it('should not wrap a paragraph with a new list node when it will bring a new visual bullet', () => {
    t.applyCommand(
      indentList,
      markdown`
        - A1
        - A2a

          A2b<a>
      `,
      markdown`
        - A1

        - A2a

          A2b<a>
      `,
    )

    t.applyCommand(
      indentList,
      markdown`
        - A1
        - A2a

          A2b<a>

          A2c
      `,
      markdown`
        - A1

        - A2a

          A2b<a>

          A2c
      `,
    )
  })

  it('can indent a paragraph and append it to the previous sibling list node', () => {
    t.applyCommand(
      indentList,
      markdown`
        - A1
        - A2a
          - B1

          A2b<a>
      `,
      markdown`
        - A1

        - A2a
          - B1

            A2b<a>
      `,
    )

    t.applyCommand(
      indentList,
      markdown`
        - A1
        - A2a
          - B1

          A2b<a>
          - B2
      `,
      markdown`
        - A1

        - A2a
          - B1

            A2b<a>

          - B2
      `,
    )
  })

  it('can only indent selected part when the selection across multiple depth of a nested lists', () => {
    t.applyCommand(
      indentList,
      markdown`
        - A1a
          - B1a
            - C1

            B1b<a>

          A1b<b>
      `,
      markdown`
        - A1a
          - B1a
            - C1

              B1b<a>

            A1b<b>
      `,
    )

    t.applyCommand(
      indentList,
      markdown`
        - A1a
          - B1a
            - C1

            B1b<a>

          - B2

          - B3

          - B4

          A1b<b>
      `,
      markdown`
        - A1a
          - B1a
            - C1

              B1b<a>

            - B2

            - B3

            - B4

            A1b<b>
      `,
    )
  })

  it('can indent multiple list nodes and append them to the previous list node', () => {
    t.applyCommand(
      indentList,
      markdown`
        - A1
        - A<a>2
        - A<b>3
      `,
      markdown`
        - A1
          - A<a>2
          - A<b>3
      `,
    )
  })

  it('can add ambitious indentations', () => {
    t.applyCommand(
      indentList,
      markdown`
        - A1
          - B<a>2
      `,
      markdown`
        - A1
          - - B<a>2
      `,
    )
  })

  it('can split the list when necessary', () => {
    t.applyCommand(
      indentList,
      markdown`
        - A1
          - B<a>2a

            B2b

            B2c
      `,
      markdown`
        - A1
          - - B<a>2a

          - B2b

            B2c
      `,
    )
  })

  it('can keep attributes', () => {
    t.applyCommand(
      indentList,
      markdown`
        - [ ] A1
        - [x] A<a>2
      `,
      markdown`
        - [ ] A1
          - [x] A<a>2
      `,
    )

    t.applyCommand(
      indentList,
      markdown`
        1. A1

        2. A<a>2
           - B1
      `,
      markdown`
        1. A1
           1. A<a>2
           - B1
      `,
    )

    t.applyCommand(
      indentList,
      markdown`
        - [x] A1
          - B1
        - [x] A<a>2
          1. B2
      `,
      markdown`
        - [x] A1
          - B1
          - [x] A<a>2
          1. B2
      `,
    )
  })

  it('can keep the indentation of sub list nodes', () => {
    t.applyCommand(
      indentList,
      markdown`
        - A1
        - A2
        - A3<a>
          - B1
          - B2
          - B3
      `,
      markdown`
        - A1
        - A2
          - A3<a>
          - B1
          - B2
          - B3
      `,
    )
  })

  it('can move all collapsed content', () => {
    t.applyCommand(
      indentList,
      t.doc(
        t.bulletList(t.p('A1')),
        t.bulletList(t.p('A2')),
        t.collapsedToggleList(
          t.p('A3<a>'),
          t.bulletList(t.p('B1')),
          t.bulletList(t.p('B2')),
          t.bulletList(t.p('B3')),
        ),
      ),
      t.doc(
        t.bulletList(t.p('A1')),
        t.bulletList(
          t.p('A2'),
          t.collapsedToggleList(
            t.p('A3<a>'),
            t.bulletList(t.p('B1')),
            t.bulletList(t.p('B2')),
            t.bulletList(t.p('B3')),
          ),
        ),
      ),
    )
  })

  it('can expand a collapsed list node if something is indent into it', () => {
    t.applyCommand(
      indentList,
      t.doc(
        t.collapsedToggleList(
          t.p('A1'),
          t.bulletList(t.p('B1')),
          t.bulletList(t.p('B2')),
          t.bulletList(t.p('B3')),
        ),
        t.p('<a>'),
      ),
      t.doc(
        t.expandedToggleList(
          t.p('A1'),
          t.bulletList(t.p('B1')),
          t.bulletList(t.p('B2')),
          t.bulletList(t.p('B3')),
          t.p('<a>'),
        ),
      ),
    )
  })

  it('can keep the indentation of sub list nodes when moving multiple list', () => {
    t.applyCommand(
      indentList,
      markdown`
        - A1
        - <a>A2
        - A3<b>
          - B1
          - B2
          - B3
      `,
      markdown`
        - A1
          - <a>A2
          - A3<b>
          - B1
          - B2
          - B3
      `,
    )

    t.applyCommand(
      indentList,
      markdown`
        - A1
          - B1
        - A2<a>
          - B2<b>
            - C1
      `,
      markdown`
        - A1
          - B1
          - A2<a>
            - B2<b>
            - C1
      `,
    )
  })

  it('can keep the indentation of siblings around the indented item', () => {
    t.applyCommand(
      indentList,
      markdown`
        - A1

        - A2<a>

          A2
      `,
      markdown`
        - A1
          - A2<a>

          A2
      `,
    )

    t.applyCommand(
      indentList,
      markdown`
        - A1

        - A2<a>

          A2
          - B1
      `,
      markdown`
        - A1
          - A2<a>

          A2
          - B1
      `,
    )

    t.applyCommand(
      indentList,
      markdown`
        - A1

        - A2
          - B1

          A2<a>

          A2
          - B1
      `,
      markdown`
        - A1

        - A2
          - B1

            A2<a>

          A2
          - B1
      `,
    )

    t.applyCommand(
      indentList,
      markdown`
        - A1

          A1

        - <a>A2
      `,
      markdown`
        - A1

          A1
          - <a>A2
      `,
    )
  })

  it('can indent a paragraph that not inside a list node', () => {
    t.applyCommand(
      indentList,
      markdown`
        - A1

        P1<a>
      `,
      markdown`
        - A1

          P1<a>
      `,
    )

    t.applyCommand(
      indentList,
      markdown`
        - A1

        P1<a>

        P2<b>

        P3
      `,
      markdown`
        - A1

          P1<a>

          P2<b>

        P3
      `,
    )
  })

  it('can accept custom positions', () => {
    t.applyCommand(
      createIndentListCommand({ from: 13, to: 17 }),
      t.doc(
        /*0*/
        t.bulletList(/*1*/ t.p('A1') /*5*/),
        /*6*/
        t.bulletList(/*7*/ t.p('A2<a>') /*11*/),
        /*12*/
        t.bulletList(/*13*/ t.p('A3') /*17*/),
        /*18*/
      ),
      t.doc(
        t.bulletList(t.p('A1')),
        t.bulletList(t.p('A2'), t.bulletList(t.p('A3'))),
      ),
    )

    t.applyCommand(
      createIndentListCommand({ from: 10, to: 17 }),
      t.doc(
        /*0*/
        t.bulletList(/*1*/ t.p('A1') /*5*/),
        /*6*/
        t.bulletList(/*7*/ t.p('A2<a>') /*11*/),
        /*12*/
        t.bulletList(/*13*/ t.p('A3') /*17*/),
        /*18*/
      ),
      t.doc(
        t.bulletList(
          t.p('A1'),
          t.bulletList(t.p('A2')),
          t.bulletList(t.p('A3')),
        ),
      ),
    )
  })

  it('can handle some complex nested lists', () => {
    t.applyCommand(
      indentList,
      markdown`
        - A1
          - B1
          - <a>B2
        - A2
          - B3
            - C1<b>
              - D1
          - B4
      `,
      markdown`
        - A1
          - B1
            - <a>B2
          - A2
            - B3
              - C1<b>
              - D1
          - B4
      `,
    )
  })

  it('only needs one step for some of the most comment indent action', () => {
    const countSteps = (doc: ProsemirrorNode, expected: ProsemirrorNode) => {
      t.add(doc)
      const state = t.view.state
      const command = createIndentListCommand()
      const captured: { count: number; actual: ProsemirrorNode | null } = {
        count: -1,
        actual: null,
      }
      command(state, (tr) => {
        captured.count = tr.steps.length
        captured.actual = tr.doc
      })
      if (!captured.actual) throw new Error('expected command to dispatch')
      expect(captured.actual.toJSON()).toEqual(expected.toJSON())
      return captured.count
    }

    expect(
      countSteps(
        markdown`
          - A1
          - A2<a>
        `,
        markdown`
          - A1
            - A2<a>
        `,
      ),
    ).toBe(1)

    expect(
      countSteps(
        markdown`
          - A1
          - [ ] A2<a>
          - [x] A3
        `,
        markdown`
          - A1
            - [ ] A2<a>
          - [x] A3
        `,
      ),
    ).toBe(1)

    expect(
      countSteps(
        markdown`
          1. A1
          2. <a>A2
          3. A3<b>
          4. A4
        `,
        markdown`
          1. A1
             1. <a>A2
             2. A3<b>
          2. A4
        `,
      ),
    ).toBe(1)

    expect(
      countSteps(
        markdown`
          1. A1
             - B1
             - <a>B2
             - B3
             - B4<b>
        `,
        markdown`
          1. A1
             - B1
               - <a>B2
               - B3
               - B4<b>
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

                - <a>D2

                C1b

                C1c

            - B2
              - C2

          - A2

          - A3
            - B3

              B3b

            - B4<b>

            A3b
        `,
        markdown`
          - A1
            - B1
              - C1
                - D1

                  D1b
                  - <a>D2

                  C1b

                  C1c

              - B2
                - C2

            - A2

            - A3
              - B3

                B3b

              - B4<b>

            A3b
        `,
      ),
    ).toBeGreaterThan(1)
  })
})
