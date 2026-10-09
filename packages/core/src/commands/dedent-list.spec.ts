import type { Node as ProsemirrorNode } from 'prosemirror-model'
import { describe, expect, it } from 'vitest'

import { setupTestingEditor } from '../../test/setup-editor'

import { createDedentListCommand } from './dedent-list'
import { enterCommand } from './keymap'

describe('dedentList', () => {
  const t = setupTestingEditor()
  const markdown = t.markdown

  it('can dedent a list node to outer list', () => {
    t.applyCommand(
      createDedentListCommand(),
      markdown`
        - A1
          - B<a>1
      `,
      markdown`
        - A1
        - B<a>1
      `,
    )

    t.applyCommand(
      createDedentListCommand(),
      markdown`
        - - <a>B1
        - A1
      `,
      markdown`
        - B1
        - A1
      `,
    )
  })

  it('can dedent a paragraph node to outer list', () => {
    t.applyCommand(
      createDedentListCommand(),
      markdown`
        - A1
          - B1a

            B1b<a>
      `,
      markdown`
        - A1
          - B1a

          B1b<a>
      `,
    )
  })

  it('can unwrap a list node', () => {
    t.applyCommand(
      createDedentListCommand(),
      markdown`
        - A1<a>

        paragraph
      `,
      markdown`
        A1<a>

        paragraph
      `,
    )

    t.applyCommand(
      createDedentListCommand(),
      markdown`
        - A1<a>
        - A2
      `,
      markdown`
        A1<a>

        - A2
      `,
    )

    t.applyCommand(
      createDedentListCommand(),
      markdown`
        - A1
        - A2<a>
      `,
      markdown`
        - A1

        A2
      `,
    )
  })

  it('can unwrap multiple list nodes', () => {
    t.applyCommand(
      createDedentListCommand(),
      markdown`
        - A1<a>
        - A2<b>
      `,
      markdown`
        A1

        A2
      `,
    )

    t.applyCommand(
      createDedentListCommand(),
      markdown`
        - A1
        - A2<a>
        - A3<b>
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
    t.applyCommand(
      createDedentListCommand(),
      markdown`
        - A1
          - B1

          - B2<a>

          - B3
            - C1<b>

            B3

          - B4
      `,
      markdown`
        - A1
          - B1

        - B2<a>

        - B3
          - C1<b>

            B3

          - B4
      `,
    )

    t.applyCommand(
      createDedentListCommand(),
      markdown`
        - A1
          - B1

          - B2<a>

          A1
      `,
      markdown`
        - A1
          - B1

        - B2<a>

          A1
      `,
    )
  })

  it('can only dedent selected part when the selection across multiple depth of a nested lists', () => {
    t.applyCommand(
      createDedentListCommand(),
      markdown`
        - A1
          - B1

          - B2
            - C1<a>

          - B3<b>
      `,
      markdown`
        - A1
          - B1

          - B2

          - C1<a>

        - B3<b>
      `,
    )

    t.applyCommand(
      createDedentListCommand(),
      markdown`
        - A1
          - B1

          - B2
            - C1<a>

          - B3<b>
            - C2
      `,
      markdown`
        - A1
          - B1

          - B2

          - C1<a>

        - B3<b>
          - - C2
      `,
    )
  })

  it('can wrap unselected paragraphs with a list node if necessary', () => {
    t.applyCommand(
      createDedentListCommand(),
      markdown`
        - A1
          - B1

          - B2<a>

          - B3<b>

            B3

            B3

          - B4
      `,
      markdown`
        - A1
          - B1

        - B2<a>

        - B3<b>
          - B3

            B3

          - B4
      `,
    )
  })

  it('can keep the indentation of sub list', () => {
    t.applyCommand(
      createDedentListCommand(),
      markdown`
        - A1
          - B1<a>
            - C1
      `,
      markdown`
        - A1

        - B1<a>
          - - C1
      `,
    )

    t.applyCommand(
      createDedentListCommand(),
      markdown`
        - A1<a>
          - B1
      `,
      markdown`
        A1<a>

        - - B1
      `,
    )
  })

  it('do nothing when not inside a list', () => {
    t.applyCommand(
      createDedentListCommand(),
      markdown`
        Hello<a>

        paragraph
      `,
      markdown`
        Hello<a>

        paragraph
      `,
    )
  })

  it('can dedent a nested list item', () => {
    t.applyCommand(
      createDedentListCommand(),
      markdown`
        - - B1<a>

            B1

          A1
      `,
      markdown`
        - B1
          - B1

          A1
      `,
    )
  })

  it('can dedent a blockquote inside a list', () => {
    t.applyCommand(
      createDedentListCommand(),
      markdown`
        - > A1
          >
          > A2<a>
      `,
      markdown`
        - > A1

          A2<a>
      `,
    )
  })

  it('can accept custom positions', () => {
    t.applyCommand(
      createDedentListCommand({ from: 13, to: 17 }),
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
        //
        t.bulletList(t.p('A1')),
        t.bulletList(t.p('A2')),
        t.p('A3'),
      ),
    )

    t.applyCommand(
      createDedentListCommand({ from: 10, to: 14 }),
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
        //
        t.bulletList(t.p('A1')),
        t.p('A2'),
        t.p('A3'),
      ),
    )
  })

  it('can handle some complex nested lists', () => {
    t.applyCommand(
      createDedentListCommand(),
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

        A2

        - B3
          - C1<b>
            - - D1
          - B4
      `,
    )

    t.applyCommand(
      createDedentListCommand(),
      markdown`
        - A1
          - B1

          - B2
            - C1
              - D1

                D1<a>

        - A2
          - B3
            - C2

              C2
              - D2<b>

              C2

            - C3
      `,
      markdown`
        - A1
          - B1

          - B2
            - C1
              - D1

              D1<a>

        A2

        - B3
          - C2

            C2
            - D2<b>

              C2

            - C3
      `,
    )
  })

  it('only needs one step for some of the most comment indent action', () => {
    const countSteps = (doc: ProsemirrorNode, expected: ProsemirrorNode) => {
      t.add(doc)
      const state = t.view.state
      const command = createDedentListCommand()
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
            - B1<a>
        `,
        markdown`
          - A1
          - B1<a>
        `,
      ),
    ).toBe(1)

    expect(
      countSteps(
        markdown`
          - A1
          - A2<a>
        `,
        markdown`
          - A1

          A2<a>
        `,
      ),
    ).toBe(1)

    expect(
      countSteps(
        markdown`
          # heading

          - A1<a>
        `,
        markdown`
          # heading

          A1<a>
        `,
      ),
    ).toBe(1)

    expect(
      countSteps(
        markdown`
          # heading

          - - A1<a>
        `,
        markdown`
          # heading

          - A1<a>
        `,
      ),
    ).toBe(1)
  })

  it('can keep the depth of trailing siblings with a hidden wrapper by default', () => {
    t.applyCommand(
      createDedentListCommand(),
      markdown`
        - A
          - B<a>
            - C
          - D
      `,
      markdown`
        - A
        - B<a>
          - - C
          - D
      `,
    )

    t.applyCommand(
      createDedentListCommand(),
      markdown`
        - A

          X<a>
          - D
          - E
      `,
      markdown`
        - A

        X<a>

        - - - D
            - E
      `,
    )
  })

  it('can move trailing siblings up together when preventHiddenWrapper is true', () => {
    t.applyCommand(
      createDedentListCommand({ preventHiddenWrapper: true }),
      markdown`
        - A
          - B<a>
            - C
          - D
      `,
      markdown`
        - A
        - B<a>
          - C
          - D
      `,
    )

    t.applyCommand(
      createDedentListCommand({ preventHiddenWrapper: true }),
      markdown`
        - A

          X<a>
          - D
          - E
      `,
      markdown`
        - A

        X<a>

        - D
        - E
      `,
    )

    t.applyCommand(
      createDedentListCommand({ preventHiddenWrapper: true }),
      markdown`
        - A
          - B<a>
            - C
              - E
          - D
      `,
      markdown`
        - A
        - B<a>
          - C
            - E
          - D
      `,
    )

    t.applyCommand(
      createDedentListCommand({ preventHiddenWrapper: true }),
      markdown`
        - A
          - B<a>
            - C
              - E
      `,
      markdown`
        - A
        - B<a>
          - C
            - E
      `,
    )
  })

  it('can unwrap a list node and move its children up when preventHiddenWrapper is true', () => {
    t.applyCommand(
      createDedentListCommand({ preventHiddenWrapper: true }),
      markdown`
        - A<a>
          - C
      `,
      markdown`
        A<a>

        - C
      `,
    )

    t.applyCommand(
      createDedentListCommand({ preventHiddenWrapper: true }),
      markdown`
        - A<a>
          - C
        - B
      `,
      markdown`
        A<a>

        - C
        - B
      `,
    )
  })

  it('can keep the default result when it has no hidden wrapper', () => {
    // The new list node wraps a paragraph, so its marker is visible.
    const before1 = markdown`
      - A
        - B<a>

          B2
          - C
    `
    const after1 = markdown`
      - A
      - B<a>
        - B2
          - C
    `
    t.applyCommand(createDedentListCommand(), before1, after1)
    t.applyCommand(
      createDedentListCommand({ preventHiddenWrapper: true }),
      before1,
      after1,
    )

    const before2 = markdown`
      - A
        - B<a>
          - C
        - D<b>
    `
    const after2 = markdown`
      - A
      - B<a>
        - C
      - D<b>
    `
    t.applyCommand(createDedentListCommand(), before2, after2)
    t.applyCommand(
      createDedentListCommand({ preventHiddenWrapper: true }),
      before2,
      after2,
    )
  })

  it('can dedent a blockquote inside a list when preventHiddenWrapper is true', () => {
    t.applyCommand(
      createDedentListCommand(),
      markdown`
        - A

          > Q<a>
          >
          > - D
      `,
      markdown`
        - A

          Q<a>

          > - - D
      `,
    )

    // Pins a side effect, not a desired behavior: the trailing list leaves the blockquote.
    t.applyCommand(
      createDedentListCommand({ preventHiddenWrapper: true }),
      markdown`
        - A

          > Q<a>
          >
          > - D
      `,
      markdown`
        - A

          Q<a>
          - D
      `,
    )

    t.applyCommand(
      createDedentListCommand(),
      markdown`
        - A

          > Q1
          >
          > Q2<a>
          >
          > - D
      `,
      markdown`
        - A

          > Q1

          Q2<a>

          > - - D
      `,
    )

    // Pins a side effect, not a desired behavior: the trailing list leaves the blockquote.
    t.applyCommand(
      createDedentListCommand({ preventHiddenWrapper: true }),
      markdown`
        - A

          > Q1
          >
          > Q2<a>
          >
          > - D
      `,
      markdown`
        - A

          > Q1

          Q2<a>
          - D
      `,
    )
  })

  it('can keep attributes when preventHiddenWrapper is true', () => {
    t.applyCommand(
      createDedentListCommand({ preventHiddenWrapper: true }),
      markdown`
        1. A
           1. B<a>
              1. C
           2. D
      `,
      markdown`
        1. A
        2. B<a>
           1. C
           2. D
      `,
    )

    t.applyCommand(
      createDedentListCommand({ preventHiddenWrapper: true }),
      markdown`
        - [ ] A
          - [ ] B<a>
            - [x] C
          - [ ] D
      `,
      markdown`
        - [ ] A
        - [ ] B<a>
          - [x] C
          - [ ] D
      `,
    )

    t.applyCommand(
      createDedentListCommand({ preventHiddenWrapper: true }),
      t.doc(
        t.bulletList(
          t.p('A'),
          t.bulletList(
            t.p('B<a>'),
            t.collapsedToggleList(t.p('C'), t.bulletList(t.p('F'))),
          ),
          t.collapsedToggleList(t.p('D'), t.bulletList(t.p('G'))),
        ),
      ),
      t.doc(
        t.bulletList(t.p('A')),
        t.bulletList(
          t.p('B<a>'),
          t.collapsedToggleList(t.p('C'), t.bulletList(t.p('F'))),
          t.collapsedToggleList(t.p('D'), t.bulletList(t.p('G'))),
        ),
      ),
    )
  })

  it('should not change Enter in an empty nested list node', () => {
    t.applyCommand(
      enterCommand,
      t.doc(
        t.bulletList(
          t.p('A'),
          t.bulletList(t.p('<a>')),
          t.bulletList(t.p('D')),
        ),
      ),
      t.doc(t.bulletList(t.p('A'), t.p('<a>'), t.bulletList(t.p('D')))),
    )

    t.applyCommand(
      enterCommand,
      t.doc(
        t.bulletList(
          t.p('A'),
          t.bulletList(t.p('<a>'), t.bulletList(t.p('C'))),
          t.bulletList(t.p('D')),
        ),
      ),
      t.doc(
        t.bulletList(
          t.p('A'),
          t.p('<a>'),
          t.bulletList(t.p('C')),
          t.bulletList(t.p('D')),
        ),
      ),
    )
  })
})
