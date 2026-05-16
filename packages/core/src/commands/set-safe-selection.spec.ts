import type { Command } from 'prosemirror-state'
import { describe, it } from 'vitest'

import { setupTestingEditor } from '../../test/setup-editor'

import { setSafeSelection } from './set-safe-selection'

describe('setSafeSelection', () => {
  const {
    doc,
    p,
    collapsedToggleList,
    expandedToggleList,
    bulletList,
    applyCommand,
  } = setupTestingEditor()

  const command: Command = (state, dispatch) => {
    dispatch?.(setSafeSelection(state.tr))
    return true
  }

  it('can move cursor outside of collapsed content', () => {
    applyCommand(
      command,
      doc(
        collapsedToggleList(
          //
          p('123'),
          p('45<a>6'),
        ),
      ),
      doc(
        collapsedToggleList(
          //
          p('123<a>'),
          p('456'),
        ),
      ),
    )
  })

  it('can move cursor outside of collapsed and deep sub list', () => {
    applyCommand(
      command,
      doc(
        bulletList(
          bulletList(
            bulletList(
              collapsedToggleList(
                //
                p('123'),
                p('45<a>6'),
              ),
            ),
          ),
        ),
      ),
      doc(
        bulletList(
          bulletList(
            bulletList(
              collapsedToggleList(
                //
                p('123<a>'),
                p('456'),
              ),
            ),
          ),
        ),
      ),
    )
  })

  it('does not change if the cursor is visible ', () => {
    applyCommand(
      command,
      doc(
        collapsedToggleList(
          //
          p('12<a>3'),
          p('456'),
        ),
      ),
      doc(
        collapsedToggleList(
          //
          p('12<a>3'),
          p('456'),
        ),
      ),
    )
  })

  it('can handle from position', () => {
    applyCommand(
      command,
      doc(
        collapsedToggleList(
          //
          p('123'),
          p('45<a>6'),
        ),
        expandedToggleList(
          //
          p('12<b>3'),
          p('456'),
        ),
      ),
      doc(
        collapsedToggleList(
          //
          p('123<a>'),
          p('456'),
        ),
        expandedToggleList(
          //
          p('123'),
          p('456'),
        ),
      ),
    )
  })

  it('can handle to position', () => {
    applyCommand(
      command,
      doc(
        expandedToggleList(
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
      doc(
        expandedToggleList(
          //
          p('123'),
          p('456'),
        ),
        collapsedToggleList(
          //
          p('123<a>'),
          p('456'),
        ),
      ),
    )
  })
})
