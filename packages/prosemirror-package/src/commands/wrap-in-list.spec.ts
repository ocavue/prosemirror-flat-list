import { describe, it } from 'vitest'
import { setupTestingEditor } from '../../test/setup-editor'

describe('wrapInList', () => {
  const t = setupTestingEditor()
  const markdown = t.markdown
  const commands = t.editor.commands

  const wrapInBulletList = () => commands.wrapInList({ type: 'bullet' })
  const wrapInOrderedList = () => commands.wrapInList({ type: 'ordered' })
  const wrapInTaskList = () => commands.wrapInList({ type: 'task' })

  it('can wrap a paragraph node to a list node', () => {
    t.runCommand(
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
    t.runCommand(
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
    t.runCommand(
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
    t.runCommand(
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
