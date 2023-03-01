import { chainCommands, pcBaseKeymap } from 'prosemirror-commands'
import { describe, expect, it } from 'vitest'
import { setupTestingEditor } from '../../test/setup-editor'
import { listKeymap } from './keymap'

describe('splitList', () => {
  const {
    add,
    doc,
    p,
    bulletList,
    blockquote,
    editor,
    markdown,
    apply,
    view,
    collapsedToggleList,
    expandedToggleList,
  } = setupTestingEditor()

  const run = () => {
    const command = chainCommands(listKeymap['Enter'], pcBaseKeymap['Enter'])
    command(view.state, view.dispatch, view)
  }

  it('can split non-empty item', () => {
    apply(
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

    apply(
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

    apply(
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
    apply(
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
    apply(
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

    apply(
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

    apply(
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

  it('can dedent the last empty sub item', () => {
    apply(
      run,
      markdown`
        - A1

          - <cursor>

        paragraph
      `,
      markdown`
        - A1

        - <cursor>

        paragraph
      `,
    )

    apply(
      run,
      markdown`
        - A1

          - B1

          - <cursor>

        paragraph
      `,
      markdown`
        - A1

          - B1

        - <cursor>

        paragraph
      `,
    )
  })

  it('can delete selected text', () => {
    apply(
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
    apply(
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
    apply(
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
        bulletList(
          //
          p('123'),
          p('456<cursor>'),
        ),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        bulletList(
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
        bulletList(
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
        bulletList(
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
        bulletList(
          p('parent'),
          bulletList(
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
        bulletList(
          p('parent'),
          bulletList(
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
        bulletList(
          //
          p('123'),
          p('<cursor>'),
        ),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        bulletList(
          //
          p('123'),
          p(''),
          p('<cursor>'),
        ),
      ),
    )

    add(
      doc(
        bulletList(
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
        bulletList(
          //
          p('123'),
          p(''),
          p('<cursor>'),
          p('456'),
        ),
      ),
    )
  })

  it('can skip collapsed content', () => {
    // Cursor in the last paragraph of the item
    add(
      doc(
        collapsedToggleList(
          //
          p('1<start>23<end>'),
          p('456'),
        ),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        collapsedToggleList(
          //
          p('1'),
          p('456'),
        ),
        expandedToggleList(
          //
          p('<cursor>'),
        ),
      ),
    )
  })

  it("won't effect non-list document", () => {
    apply(
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

    apply(
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
