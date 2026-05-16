import { NodeSelection } from 'prosemirror-state'
import { describe, expect, it } from 'vitest'
import { keyboard } from 'vitest-browser-commands/playwright'

import { expectStateToEqual } from '../../test/markdown'
import { setupTestingEditor } from '../../test/setup-editor'

import { enterCommand } from './keymap'

describe('splitList', () => {
  const {
    add,
    doc,
    p,
    bulletList,
    blockquote,
    editor,
    markdown,
    applyCommand,
    collapsedToggleList,
    expandedToggleList,
    checkedTaskList,
    uncheckedTaskList,
  } = setupTestingEditor()

  it('can split non-empty item', () => {
    applyCommand(
      enterCommand,
      markdown`
        - 123
        - 234<a>

        paragraph
      `,
      markdown`
        - 123
        - 234
        - <a>

        paragraph
      `,
    )

    applyCommand(
      enterCommand,
      markdown`
        - 123
        - 23<a>4
      `,
      markdown`
        - 123
        - 23
        - <a>4
      `,
    )

    applyCommand(
      enterCommand,
      markdown`
        - 1<a>23
        - 234
      `,
      markdown`
        - 1
        - <a>23
        - 234
      `,
    )
  })

  it('can split non-empty sub item', () => {
    applyCommand(
      enterCommand,
      markdown`
        - 123
          - 456<a>

        paragraph
      `,
      markdown`
        - 123
          - 456
          - <a>

        paragraph
      `,
    )
  })

  it('can delete empty item', () => {
    applyCommand(
      enterCommand,
      markdown`
        - 123
        - <a>

        paragraph
      `,
      markdown`
        - 123

        <a>

        paragraph
      `,
    )

    applyCommand(
      enterCommand,
      markdown`
        - 123
        - <a>
        - 456
      `,
      markdown`
        - 123

        <a>

        - 456
      `,
    )

    applyCommand(
      enterCommand,
      markdown`
        - <a>
        - 123
      `,
      markdown`
        <a>

        - 123
      `,
    )
  })

  it('can dedent the last empty sub item', () => {
    applyCommand(
      enterCommand,
      markdown`
        - A1
          - <a>

        paragraph
      `,
      markdown`
        - A1

        - <a>

        paragraph
      `,
    )

    applyCommand(
      enterCommand,
      markdown`
        - A1
          - B1

          - <a>

        paragraph
      `,
      markdown`
        - A1
          - B1

        - <a>

        paragraph
      `,
    )
  })

  it('can delete selected text', () => {
    applyCommand(
      enterCommand,
      markdown`
        - <a>123<b>
        - 456
      `,
      markdown`
        -
        - <cusror>
        - 456
      `,
    )
  })

  it('can set attributes correctly', () => {
    applyCommand(
      enterCommand,
      doc(
        checkedTaskList(p('<a>A1')),
        uncheckedTaskList(p('A2')),
        uncheckedTaskList(p('A3')),
      ),
      doc(
        uncheckedTaskList(p('')),
        checkedTaskList(p('<a>A1')),
        uncheckedTaskList(p('A2')),
        uncheckedTaskList(p('A3')),
      ),
    )

    applyCommand(
      enterCommand,
      doc(
        uncheckedTaskList(p('A1')),
        checkedTaskList(p('A2<a>')),
        uncheckedTaskList(p('A3')),
      ),
      doc(
        uncheckedTaskList(p('A1')),
        checkedTaskList(p('A2')),
        uncheckedTaskList(p('<a>')),
        uncheckedTaskList(p('A3')),
      ),
    )

    applyCommand(
      enterCommand,
      doc(
        uncheckedTaskList(p('A1')),
        checkedTaskList(p('A<a>2')),
        uncheckedTaskList(p('A3')),
      ),
      doc(
        uncheckedTaskList(p('A1')),
        checkedTaskList(p('A')),
        uncheckedTaskList(p('<a>2')),
        uncheckedTaskList(p('A3')),
      ),
    )
  })

  it('escapes the item when the cursor is in the first paragraph of the item', () => {
    applyCommand(
      enterCommand,
      markdown`
        - 123<a>

          456

          789
      `,
      markdown`
        - 123

        - <a>

          456

          789
      `,
    )

    // Nested list item
    applyCommand(
      enterCommand,
      markdown`
        - Parent
          - 123<a>

            456

            789
      `,
      markdown`
        - Parent
          - 123

          - <a>

            456

            789
      `,
    )
  })

  it('can create new paragraph when the caret is not inside the first child of the list', async () => {
    // Cursor in the last paragraph of the item
    add(
      doc(
        bulletList(
          //
          p('123'),
          p('456<a>'),
        ),
      ),
    )
    await keyboard.press('Enter')
    expectStateToEqual(
      editor.state,
      doc(
        bulletList(
          //
          p('123'),
          p('456'),
          p('<a>'),
        ),
      ),
    )

    // Cursor in the middle paragraph of the item
    add(
      doc(
        bulletList(
          //
          p('123'),
          p('456<a>'),
          p('789'),
        ),
      ),
    )
    await keyboard.press('Enter')
    expectStateToEqual(
      editor.state,
      doc(
        bulletList(
          //
          p('123'),
          p('456'),
          p('<a>'),
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
            p('<a>456'),
          ),
        ),
      ),
    )
    await keyboard.press('Enter')
    expectStateToEqual(
      editor.state,
      doc(
        bulletList(
          p('parent'),
          bulletList(
            //
            p('123'),
            p(''),
            p('<a>456'),
          ),
        ),
      ),
    )

    add(
      doc(
        bulletList(
          //
          p('123'),
          p('<a>'),
        ),
      ),
    )
    await keyboard.press('Enter')
    expectStateToEqual(
      editor.state,
      doc(
        bulletList(
          //
          p('123'),
          p(''),
          p('<a>'),
        ),
      ),
    )

    add(
      doc(
        bulletList(
          //
          p('123'),
          p('<a>'),
          p('456'),
        ),
      ),
    )
    await keyboard.press('Enter')
    expectStateToEqual(
      editor.state,
      doc(
        bulletList(
          //
          p('123'),
          p(''),
          p('<a>'),
          p('456'),
        ),
      ),
    )
  })

  it('can skip collapsed content', async () => {
    // Cursor in the last paragraph of the item
    add(
      doc(
        collapsedToggleList(
          //
          p('1<a>23<b>'),
          p('456'),
        ),
      ),
    )
    await keyboard.press('Enter')
    expectStateToEqual(
      editor.state,
      doc(
        collapsedToggleList(
          //
          p('1'),
          p('456'),
        ),
        expandedToggleList(
          //
          p('<a>'),
        ),
      ),
    )
  })

  it("won't effect non-list document", async () => {
    applyCommand(
      enterCommand,
      markdown`
        # h1

        1<a>23
      `,
      null,
    )

    applyCommand(
      enterCommand,
      markdown`
        # h1

        123

        > 4<a>56
      `,
      null,
    )

    add(
      doc(
        blockquote(
          p('123'),
          blockquote(
            //
            p('4<a>56'),
          ),
        ),
      ),
    )
    await keyboard.press('Enter')
    expectStateToEqual(
      editor.state,
      doc(
        blockquote(
          p('123'),
          blockquote(
            //
            p('4'),
            p('<a>56'),
          ),
        ),
      ),
    )
  })

  it('can split list node for a block node selection', async () => {
    add(markdown`
      # h1

      1. ***
    `)

    let hrPos = -1
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'horizontalRule') {
        hrPos = pos
      }
      return true
    })

    expect(hrPos > -1).toBe(true)
    const nodeSelection = NodeSelection.create(editor.state.doc, hrPos)
    editor.view.dispatch(editor.view.state.tr.setSelection(nodeSelection))
    expect(editor.view.state.selection.toJSON()).toMatchInlineSnapshot(`
      {
        "anchor": 5,
        "type": "node",
      }
    `)

    await keyboard.press('Enter')

    expectStateToEqual(
      editor.state,
      markdown`
        # h1

        1. ***
        2. <a>\n
      `,
    )
  })
})
