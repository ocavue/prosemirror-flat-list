import { chainCommands, pcBaseKeymap } from 'prosemirror-commands'
import { Command } from 'prosemirror-state'
import { describe, expect, it } from 'vitest'
import { setupTestingEditor } from '../../test/setup-editor'
import { createSplitListCommand } from './split-list'

describe('splitList', () => {
  const { add, doc, p, list, blockquote, editor, markdown, runCommand, view } =
    setupTestingEditor()

  const enterCommand: Command = chainCommands(
    createSplitListCommand(),
    pcBaseKeymap['Enter'],
  )

  const run = () => {
    enterCommand(view.state, view.dispatch, view)
  }

  it('can split non-empty item', () => {
    runCommand(
      run,
      markdown`
        - 123
        - 234<cursor>

        paragraph
      `,
      markdown`
        - 123
        - 234
        - <cursor>

        paragraph
      `,
    )

    runCommand(
      run,
      markdown`
        - 123
        - 23<cursor>4
      `,
      markdown`
        - 123
        - 23
        - <cursor>4
      `,
    )

    runCommand(
      run,
      markdown`
        - 1<cursor>23
        - 234
      `,
      markdown`
        - 1
        - <cursor>23
        - 234
      `,
    )
  })

  it('can split non-empty sub item', () => {
    runCommand(
      run,
      markdown`
        - 123
          - 456<cursor>

        paragraph
      `,
      markdown`
        - 123
          - 456
          - <cursor>

        paragraph
      `,
    )
  })

  it('can delete empty item', () => {
    runCommand(
      run,
      markdown`
        - 123
        - <cursor>

        paragraph
      `,
      markdown`
        - 123

        <cursor>

        paragraph
      `,
    )

    runCommand(
      run,
      markdown`
        - 123
        - <cursor>
        - 456
      `,
      markdown`
        - 123

        <cursor>

        - 456
      `,
    )

    runCommand(
      run,
      markdown`
        - <cursor>
        - 123
      `,
      markdown`
        <cursor>

        - 123
      `,
    )
  })

  it('can dedent empty sub item', () => {
    runCommand(
      run,
      markdown`
        - 123
          - <cursor>

        paragraph
      `,
      markdown`
        - 123

          <cursor>

        paragraph
      `,
    )
  })

  it('can delete selected text', () => {
    runCommand(
      run,
      markdown`
        - <start>123<end>
        - 456
      `,
      markdown`
        -
        - <cusror>
        - 456
      `,
    )
  })

  it('escapes the item when the cursor is in the first paragraph of the item', () => {
    runCommand(
      run,
      markdown`
        - 123<cursor>

          456

          789
      `,
      markdown`
        - 123

        - <cursor>

          456

          789
      `,
    )

    // Nested list item
    runCommand(
      run,
      markdown`
        - Parent

          - 123<cursor>

            456

            789
      `,
      markdown`
        - Parent

          - 123

          - <cursor>

            456

            789
      `,
    )
  })

  it('can create new paragraph when the caret is not inside the first child of the list', () => {
    // Cursor in the last paragraph of the item
    add(
      doc(
        list(
          //
          p('123'),
          p('456<cursor>'),
        ),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123'),
          p('456'),
          p('<cursor>'),
        ),
      ),
    )

    // Cursor in the middle paragraph of the item
    add(
      doc(
        list(
          //
          p('123'),
          p('456<cursor>'),
          p('789'),
        ),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123'),
          p('456'),
          p('<cursor>'),
          p('789'),
        ),
      ),
    )

    // Cursor in the last paragraph of the item (nested list item)
    add(
      doc(
        list(
          p('parent'),
          list(
            //
            p('123'),
            p('<cursor>456'),
          ),
        ),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          p('parent'),
          list(
            //
            p('123'),
            p(''),
            p('<cursor>456'),
          ),
        ),
      ),
    )

    add(
      doc(
        list(
          //
          p('123'),
          p('<cursor>'),
        ),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123'),
          p(''),
          p('<cursor>'),
        ),
      ),
    )

    add(
      doc(
        list(
          //
          p('123'),
          p('<cursor>'),
          p('456'),
        ),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123'),
          p(''),
          p('<cursor>'),
          p('456'),
        ),
      ),
    )
  })

  it("won't effect non-list document", () => {
    runCommand(
      run,
      markdown`
        # h1

        1<cursor>23
      `,
      markdown`
        # h1

        1

        <cursor>23
      `,
    )

    runCommand(
      run,
      markdown`
        # h1

        123

        > 4<cursor>56
      `,
      markdown`
        # h1

        123

        > 4
        >
        > <cursor>56
      `,
    )

    add(
      doc(
        blockquote(
          p('123'),
          blockquote(
            //
            p('4<cursor>56'),
          ),
        ),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        blockquote(
          p('123'),
          blockquote(
            //
            p('4'),
            p('<cursor>56'),
          ),
        ),
      ),
    )
  })
})
