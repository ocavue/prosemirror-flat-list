import { renderEditor } from 'jest-remirror'
import { BlockquoteExtension } from '@remirror/extension-blockquote'
import { describe, expect, it } from 'vitest'

import { ExperimentalItemExtension } from '../src'

const setup = () => {
  const extensions = [
    new ExperimentalItemExtension(),
    new BlockquoteExtension(),
  ]
  const editor = renderEditor(extensions, {})
  const {
    view,
    add,
    nodes: { doc, p, list, hardBreak, blockquote },
    manager,
    schema,
  } = editor

  return {
    manager,
    view,
    schema,
    add,
    doc,
    p,
    list,
    hardBreak,
    blockquote,
  }
}

describe('Enter', () => {
  const { add, doc, p, list, blockquote } = setup()

  let editor: ReturnType<typeof add>

  it('can split non-empty item', () => {
    editor = add(
      doc(
        //
        list(p('123')),
        list(p('456<cursor>'))
      )
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        //
        list(p('123')),
        list(p('456')),
        list(p('<cursor>'))
      )
    )

    editor = add(
      doc(
        //
        list(p('123')),
        list(p('45<cursor>6'))
      )
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        //
        list(p('123')),
        list(p('45')),
        list(p('<cursor>6'))
      )
    )

    editor = add(
      doc(
        //
        list(p('1<cursor>23')),
        list(p('456'))
      )
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        //
        list(p('1')),
        list(p('<cursor>23')),
        list(p('456'))
      )
    )
  })

  it('can split non-empty sub item', () => {
    editor = add(
      doc(
        list(
          //
          p('123'),
          list(p('456<cursor>'))
        )
      )
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123'),
          list(p('456')),
          list(p('<cursor>'))
        )
      )
    )
  })

  it('can delete empty item', () => {
    editor = add(
      doc(
        //
        list(p('123')),
        list(p('<cursor>'))
      )
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        //
        list(p('123')),
        p('<cursor>')
      )
    )

    editor = add(
      doc(
        //
        list(p('123')),
        list(p('<cursor>')),
        list(p('456'))
      )
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        //
        list(p('123')),
        p('<cursor>'),
        list(p('456'))
      )
    )

    editor = add(
      doc(
        //
        list(p('<cursor>')),
        list(p('123'))
      )
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        //
        p('<cursor>'),
        list(p('123'))
      )
    )
  })

  it('can dedent empty sub item', () => {
    editor = add(
      doc(
        list(
          //
          p('123'),
          list(p('<cursor>'))
        )
      )
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123'),
          p('<cursor>')
        )
      )
    )
  })

  it('can delete selected text', () => {
    editor = add(
      doc(
        //
        list(p('<start>123<end>')),
        list(p('456'))
      )
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        //
        list(p('')),
        list(p('<cursor>')),
        list(p('456'))
      )
    )
  })

  it('escapes the item when the cursor is in the first paragraph of the item', () => {
    editor = add(
      doc(
        list(
          //
          p('123<cursor>'),
          p('456'),
          p('789')
        )
      )
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123')
        ),
        list(
          //
          p('<cursor>'),
          p('456'),
          p('789')
        )
      )
    )

    // Nested list item
    editor = add(
      doc(
        list(
          p('0'),
          list(
            //
            p('123<cursor>'),
            p('456'),
            p('789')
          )
        )
      )
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          p('0'),
          list(
            //
            p('123')
          ),
          list(
            //
            p('<cursor>'),
            p('456'),
            p('789')
          )
        )
      )
    )
  })

  it('does not escapes the item when the cursor is not in the first paragraph of the item', () => {
    // Cursor in the last paragraph of the item
    editor = add(
      doc(
        list(
          //
          p('123'),
          p('456<cursor>')
        )
      )
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123'),
          p('456'),
          p('<cursor>')
        )
      )
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123'),
          p('456'),
          p(''),
          p('<cursor>')
        )
      )
    )

    // Cursor in the middle paragraph of the item
    editor = add(
      doc(
        list(
          //
          p('123'),
          p('456<cursor>'),
          p('789')
        )
      )
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123'),
          p('456'),
          p('<cursor>'),
          p('789')
        )
      )
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123'),
          p('456'),
          p(''),
          p('<cursor>'),
          p('789')
        )
      )
    )

    // Cursor in the last paragraph of the item (nested list item)
    editor = add(
      doc(
        list(
          p(),
          list(
            //
            p('123'),
            p('456<cursor>')
          )
        )
      )
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          p(),
          list(
            //
            p('123'),
            p('456'),
            p('<cursor>')
          )
        )
      )
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          p(),
          list(
            //
            p('123'),
            p('456'),
            p(''),
            p('<cursor>')
          )
        )
      )
    )

    // Cursor in the middle paragraph of the item (nested list item)
    editor = add(
      doc(
        list(
          p(),
          list(
            //
            p('123'),
            p('456<cursor>'),
            p('789')
          )
        )
      )
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          p(),
          list(
            //
            p('123'),
            p('456'),
            p('<cursor>'),
            p('789')
          )
        )
      )
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          p(),
          list(
            //
            p('123'),
            p('456'),
            p(''),
            p('<cursor>'),
            p('789')
          )
        )
      )
    )
  })

  describe('extra cases', () => {
    it("won't effect non-list document", () => {
      editor = add(
        doc(
          //
          p('1<cursor>23')
        )
      )
      editor.press('Enter')
      expect(editor.state).toEqualRemirrorState(
        doc(
          //
          p('1'),
          p('23')
        )
      )

      editor = add(
        doc(
          blockquote(
            p('123'),
            blockquote(
              //
              p('4<cursor>56')
            )
          )
        )
      )
      editor.press('Enter')
      expect(editor.state).toEqualRemirrorState(
        doc(
          blockquote(
            p('123'),
            blockquote(
              //
              p('4'),
              p('<cursor>56')
            )
          )
        )
      )
    })
  })
})

describe('Shift-Tab', () => {
  const { add, doc, p, list } = setup()

  let editor: ReturnType<typeof add>

  it('can decrease the indentation of a nested item', () => {
    editor = add(
      doc(
        list(
          //
          p('123'),
          list(p('456<cursor>'))
        )
      )
    )
    editor.press('Shift-Tab')
    expect(editor.state).toEqualRemirrorState(
      doc(
        //
        list(p('123')),
        list(p('456<cursor>'))
      )
    )
  })

  it('can decrease the indentation of multiple nested items', () => {
    editor = add(
      doc(
        list(
          //
          p('123'),
          list(p('45<start>6')),
          list(p('7<end>89'))
        )
      )
    )
    editor.press('Shift-Tab')
    expect(editor.state).toEqualRemirrorState(
      doc(
        //
        list(p('123')),
        list(p('45<start>6')),
        list(p('7<end>89'))
      )
    )

    editor = add(
      doc(
        list(
          //
          p('123'),
          list(
            //
            p('45<start>6'),
            list(
              //
              p('7<end>89')
            )
          )
        )
      )
    )
    editor.press('Shift-Tab')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123')
        ),
        list(
          //
          p('45<start>6'),
          list(
            //
            p('7<end>89')
          )
        )
      )
    )
  })

  it('can keep the indentation of siblings around the dedented item', () => {
    editor = add(
      doc(
        list(
          //
          p('123'),
          list(p('456<cursor>')),
          list(p('789'))
        )
      )
    )
    editor.press('Shift-Tab')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(p('123')),
        list(
          //
          p('456<cursor>'),
          list(p('789'))
        )
      )
    )

    editor = add(
      doc(
        list(
          //
          p('123'),
          list(p('456<cursor>')),
          p('789')
        )
      )
    )
    editor.press('Shift-Tab')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(p('123')),
        list(
          //
          p('456<cursor>'),
          p('789')
        )
      )
    )

    editor = add(
      doc(
        list(
          //
          p('123'),
          p('123'),
          list(p('456<cursor>'))
        )
      )
    )
    editor.press('Shift-Tab')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123'),
          p('123')
        ),
        list(
          //
          p('456<cursor>')
        )
      )
    )
  })

  it('can decrease the indentation of a multiple level nested item', () => {
    editor = add(
      doc(
        //
        list(list(list(p('123<cursor>'))))
      )
    )
    editor.press('Shift-Tab')
    expect(editor.state).toEqualRemirrorState(
      doc(
        //
        list(list(p('123<cursor>')))
      )
    )
    editor.press('Shift-Tab')
    expect(editor.state).toEqualRemirrorState(
      doc(
        //
        list(p('123<cursor>'))
      )
    )
  })
})

describe('Tab', () => {
  const { add, doc, p, list } = setup()

  let editor: ReturnType<typeof add>

  it('can increase the indentation of a nested item', () => {
    editor = add(
      doc(
        //
        list(p('123')),
        list(p('456<cursor>'))
      )
    )
    editor.press('Tab')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123'),
          list(p('456<cursor>'))
        )
      )
    )
  })

  it('can increase the indentation of multiple nested items', () => {
    editor = add(
      doc(
        //
        list(p('123')),
        list(p('45<start>6')),
        list(p('7<end>89'))
      )
    )
    editor.press('Tab')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123'),
          list(p('45<start>6')),
          list(p('7<end>89'))
        )
      )
    )

    editor = add(
      doc(
        list(
          //
          p('123')
        ),
        list(
          //
          p('45<start>6'),
          list(
            //
            p('7<end>89')
          )
        )
      )
    )
    editor.press('Tab')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123'),
          list(
            //
            p('45<start>6'),
            list(
              //
              p('7<end>89')
            )
          )
        )
      )
    )
  })

  it('can keep the indentation of siblings around the indented item', () => {
    editor = add(
      doc(
        list(p('123')),
        list(
          //
          p('456<cursor>'),
          list(p('789'))
        )
      )
    )
    editor.press('Tab')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123'),
          list(p('456<cursor>')),
          list(p('789'))
        )
      )
    )

    editor = add(
      doc(
        list(p('123')),
        list(
          //
          p('456<cursor>'),
          p('789')
        )
      )
    )
    editor.press('Tab')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123'),
          list(p('456<cursor>')),
          p('789')
        )
      )
    )

    editor = add(
      doc(
        list(
          //
          p('123'),
          p('123')
        ),
        list(
          //
          p('456<cursor>')
        )
      )
    )
    editor.press('Tab')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123'),
          p('123'),
          list(p('456<cursor>'))
        )
      )
    )
  })
})
