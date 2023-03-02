import { describe, it } from 'vitest'
import { setupTestingEditor } from '../../test/setup-editor'
import { setSafeSelection } from './set-safe-selection'

describe('setSafeSelection', () => {
  const { doc, p, view, collapsedToggleList, expandedToggleList, apply } =
    setupTestingEditor()

  const run = () => {
    view.dispatch(setSafeSelection(view.state.tr))
  }

  it('can move cursor outside of collapsed content', () => {
    apply(
      run,
      doc(
        collapsedToggleList(
          //
          p('123'),
          p('45<cursor>6'),
        ),
      ),
      doc(
        collapsedToggleList(
          //
          p('123<cursor>'),
          p('456'),
        ),
      ),
    )
  })

  it('does not change if the cursor is visible ', () => {
    apply(
      run,
      doc(
        collapsedToggleList(
          //
          p('12<cursor>3'),
          p('456'),
        ),
      ),
      doc(
        collapsedToggleList(
          //
          p('12<cursor>3'),
          p('456'),
        ),
      ),
    )
  })

  it('can handle from position', () => {
    apply(
      run,
      doc(
        collapsedToggleList(
          //
          p('123'),
          p('45<start>6'),
        ),
        expandedToggleList(
          //
          p('12<end>3'),
          p('456'),
        ),
      ),
      doc(
        collapsedToggleList(
          //
          p('123<cursor>'),
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
    apply(
      run,
      doc(
        expandedToggleList(
          //
          p('1<start>23'),
          p('456'),
        ),
        collapsedToggleList(
          //
          p('123'),
          p('4<end>56'),
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
          p('123<cursor>'),
          p('456'),
        ),
      ),
    )
  })
})
