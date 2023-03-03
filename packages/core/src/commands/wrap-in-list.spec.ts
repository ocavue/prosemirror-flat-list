import { describe, it } from 'vitest'
import { setupTestingEditor } from '../../test/setup-editor'
import { createWrapInListCommand } from './wrap-in-list'

describe('wrapInList', () => {
  const t = setupTestingEditor()
  const markdown = t.markdown

  const wrapInBulletList = createWrapInListCommand({ kind: 'bullet' })
  const wrapInOrderedList = createWrapInListCommand({ kind: 'ordered' })
  const wrapInTaskList = createWrapInListCommand({ kind: 'task' })

  it('can wrap a paragraph node to a list node', () => {
    t.applyCommand(
      wrapInBulletList,
      markdown`
        P1

        P2<cursor>
      `,
      markdown`
        P1

        - P2
      `,
    )
  })

  it('can wrap multiple paragraph nodes to list nodes', () => {
    t.applyCommand(
      wrapInTaskList,
      markdown`
        P1

        P2<start>

        P3<end>
      `,
      markdown`
        P1

        - [ ] P2
        - [ ] P3
      `,
    )
  })

  it('can change the type of an existing list node', () => {
    t.applyCommand(
      wrapInOrderedList,
      markdown`
        - P1

        - P2<cursor>
      `,
      markdown`
        - P1

        1. P2
      `,
    )
  })

  it('can change the type of multiple existing list nodes', () => {
    t.applyCommand(
      wrapInTaskList,
      markdown`
        - P1

        - P2<start>

        1. P3<end>
      `,
      markdown`
        - P1
        - [ ] P2
        - [ ] P3
      `,
    )
  })
})
