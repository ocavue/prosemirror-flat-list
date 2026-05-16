import { describe, it } from 'vitest'
import { keyboard } from 'vitest-browser-commands/playwright'

import { expectStateToEqual } from '../../test/markdown'
import { setupTestingEditor } from '../../test/setup-editor'

import { backspaceCommand } from './keymap'

describe('Keymap', () => {
  const t = setupTestingEditor()
  const markdown = t.markdown

  describe('Backspace', () => {
    it('should delete the empty paragraph between two list nodes', () => {
      t.applyCommand(
        backspaceCommand,
        t.doc(t.bulletList(t.p('A1')), t.p('<a>'), t.bulletList(t.p('A2'))),
        t.doc(t.bulletList(t.p('A1')), t.bulletList(t.p('A2'))),
      )
    })

    it('can handle nested list', async () => {
      const doc1 = markdown`
        - A1
          - B1

          - <a>B2
      `
      const doc2 = markdown`
        - A1
          - B1

          <a>B2
      `
      const doc3 = markdown`
        - A1
          - B1

        <a>B2
      `
      const doc4 = markdown`
        - A1
          - B1<a>B2
      `

      t.add(doc1)
      await keyboard.press('Backspace')
      expectStateToEqual(t.editor.state, doc2)
      await keyboard.press('Backspace')
      expectStateToEqual(t.editor.state, doc3)
      await keyboard.press('Backspace')
      expectStateToEqual(t.editor.state, doc4)
    })

    it('can handle nested list with multiple children', async () => {
      const doc1 = markdown`
        - A1
          - B1

          - <a>B2a

            B2b

            B2c
      `
      const doc2 = markdown`
        - A1
          - B1

          <a>B2a

          B2b

          B2c
      `
      const doc3 = markdown`
        - A1
          - B1<a>B2a

          B2b

          B2c
      `

      t.add(doc1)
      await keyboard.press('Backspace')
      expectStateToEqual(t.editor.state, doc2)
      await keyboard.press('Backspace')
      expectStateToEqual(t.editor.state, doc3)
    })

    it('can handle cursor in the middle child', async () => {
      const doc1 = markdown`
        - A1
          - B1

          - B2a

            <a>B2b

            B2c
      `
      const doc2 = markdown`
        - A1
          - B1

          - B2a<a>B2b

            B2c
      `
      t.add(doc1)
      await keyboard.press('Backspace')
      expectStateToEqual(t.editor.state, doc2)
    })

    it('can handle cursor in the last child', async () => {
      const doc1 = markdown`
        - A1
          - B1

          - B2a

            B2b

            <a>B2c
      `
      const doc2 = markdown`
        - A1
          - B1

          - B2a

            B2b

          <a>B2c
      `
      const doc3 = markdown`
        - A1
          - B1

          - B2a

            B2b

        <a>B2c
      `
      t.add(doc1)
      await keyboard.press('Backspace')
      expectStateToEqual(t.editor.state, doc2)
      await keyboard.press('Backspace')
      expectStateToEqual(t.editor.state, doc3)
    })

    it('can skip collapsed content', () => {
      t.applyCommand(
        backspaceCommand,
        t.doc(
          t.collapsedToggleList(
            //
            t.p('A1'),
            t.bulletList(t.p('B1')),
          ),
          t.p('<a>A2'),
        ),
        t.doc(
          t.collapsedToggleList(
            //
            t.p('A1<a>A2'),
            t.bulletList(t.p('B1')),
          ),
        ),
      )

      t.applyCommand(
        backspaceCommand,
        t.doc(
          t.collapsedToggleList(
            //
            t.p('A1'),
            t.bulletList(t.p('B1')),
          ),
          t.blockquote(t.p('<a>A2')),
        ),
        t.doc(
          t.collapsedToggleList(
            //
            t.p('A1<a>A2'),
            t.bulletList(t.p('B1')),
          ),
        ),
      )
    })
  })
})
