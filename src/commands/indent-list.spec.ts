import { describe, it } from 'vitest'
import { setupTestingEditor } from '../../test/setup-editor'

describe('indentList', () => {
  const t = setupTestingEditor()
  const commands = t.editor.commands

  it('can indent a list node', () => {
    t.runCommand(
      commands.indentList,
      t.markdown`
        - A1
        - A<cursor>2
        `,
      t.markdown`
        - A1
          - A<cursor>2
        `
    )
  })

  it('can indent multiple list nodes', () => {
    t.runCommand(
      commands.indentList,
      t.markdown`
        - A1
        - A<start>2
        - A<end>3
      `,
      t.markdown`
        - A1
          - A<start>2
          - A<end>3
      `
    )
  })

  it('can add ambitious indentations', () => {
    t.runCommand(
      commands.indentList,
      t.markdown`
        - A1
          - A<cursor>2
      `,
      t.markdown`
        - A1
          - - A<cursor>2
      `
    )
  })

  it('can keep attributes', () => {
    t.runCommand(
      commands.indentList,
      t.markdown`
        - [ ] A1
        - [x] A<cursor>2
      `,
      t.markdown`
        - [ ] A1
          - [x] A<cursor>2
      `
    )
  })

  it.skip('can keep the indentation of sub list nodes', () => {
    t.runCommand(
      commands.indentList,
      t.markdown`
        - A1
        - A2
        - A3<cursor>
          - B1 
          - B2 
          - B3
      `,
      t.markdown`
        - A1
        - A2
          - A3<cursor>
          - B1 
          - B2 
          - B3 
      `
    )
  })

  it.skip('can keep the indentation of sub list nodes when moving multiple list', () => {
    t.runCommand(
      commands.indentList,
      t.markdown`
        - A1
        - <start>A2
        - A3<end>
          - B1 
          - B2 
          - B3 
      `,
      t.markdown`
        - A1
          - <start>A2
          - A3<end>
          - B1 
          - B2 
          - B3 
      `
    )
  })
})
