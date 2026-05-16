import { describe, it } from 'vitest'
import { keyboard } from 'vitest-browser-commands/playwright'

import { expectStateToEqual } from '../../test/markdown'
import { setupTestingEditor } from '../../test/setup-editor'

describe('protectCollapsed', () => {
  const { add, doc, p, editor, collapsedToggleList, expandedToggleList } =
    setupTestingEditor()

  it('can skip collapsed content', async () => {
    add(
      doc(
        collapsedToggleList(
          //
          p('1<a>23'),
          p('456'),
        ),
        collapsedToggleList(
          //
          p('123'),
          p('4<b>56'),
        ),
      ),
    )
    await keyboard.press('Enter')
    expectStateToEqual(
      editor.state,
      doc(
        expandedToggleList(
          //
          p('1<a>23'),
          p('456'),
        ),
        expandedToggleList(
          //
          p('123'),
          p('4<b>56'),
        ),
      ),
    )
  })
})
