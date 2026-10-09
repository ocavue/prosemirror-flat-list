import type { NodeChild } from '@prosekit/core'
import { history, undo, undoDepth } from '@prosekit/pm/history'
import { EditorState, type Command, type Transaction } from '@prosekit/pm/state'
import type { Node as ProsemirrorNode } from 'prosemirror-model'
import { describe, expect, it } from 'vitest'

import { setupTestingEditor } from '../../test/setup-editor'
import { isListNode } from '../utils/is-list-node'

import { createDedentListCommand } from './dedent-list'
import { createIndentListCommand } from './indent-list'
import { enterCommand } from './keymap'

/**
 * Returns `true` if the document has a hidden wrapper: a list node whose first
 * child is a list node. `listToDOM` hides the marker of such a list node.
 */
function hasHiddenWrapper(doc: ProsemirrorNode): boolean {
  let found = false
  doc.descendants((node) => {
    if (found) return false
    if (isListNode(node) && isListNode(node.firstChild)) {
      found = true
    }
    return !found
  })
  return found
}

/**
 * Returns the position right before the first occurrence of `text`.
 */
function posOf(doc: ProsemirrorNode, text: string): number {
  let result = -1
  doc.descendants((node, pos) => {
    if (result >= 0) return false
    if (node.isText) {
      const index = node.text!.indexOf(text)
      if (index >= 0) result = pos + index
    }
    return result < 0
  })
  if (result < 0) throw new Error(`Cannot find text ${JSON.stringify(text)}`)
  return result
}

describe('preventHiddenWrapper', () => {
  const t = setupTestingEditor()
  const L = t.bulletList
  const O = t.orderedList
  const Tc = t.collapsedToggleList
  const Te = t.expandedToggleList
  const p = t.p
  const doc = (...children: NodeChild[]) => t.doc(...children)

  const indent = createIndentListCommand()
  const dedent = createDedentListCommand()
  const strictIndent = createIndentListCommand({ preventHiddenWrapper: true })
  const strictDedent = createDedentListCommand({ preventHiddenWrapper: true })

  /**
   * Applies `command` and checks the result. Also checks that the result has
   * no hidden wrapper.
   */
  const applyStrict = (
    command: Command,
    before: ProsemirrorNode,
    after: ProsemirrorNode,
  ) => {
    t.applyCommand(command, before, after)
    expect(hasHiddenWrapper(t.editor.state.doc)).toBe(false)
  }

  /**
   * Checks that `command` returns `false`, dispatches no transaction, and
   * leaves the document unchanged. Also checks the dry run (no `dispatch`).
   */
  const expectRefused = (command: Command, before: ProsemirrorNode) => {
    t.add(before)
    const state = t.view.state
    expect(command(state)).toBe(false)

    const dispatched: Transaction[] = []
    const result = command(
      state,
      (tr) => {
        dispatched.push(tr)
      },
      t.view,
    )
    expect(result).toBe(false)
    expect(dispatched).toHaveLength(0)
    expect(t.view.state).toBe(state)
    expect(t.editor.state.doc.toJSON()).toEqual(before.toJSON())
  }

  /**
   * Runs `command` on a standalone state with the history plugin, then undoes
   * it once. The test editor has no history plugin.
   */
  const applyAndUndo = (command: Command, before: ProsemirrorNode) => {
    t.add(before)
    let state = EditorState.create({
      doc: t.view.state.doc,
      selection: t.view.state.selection,
      plugins: [history()],
    })
    const original = state.doc
    expect(
      command(state, (tr) => {
        state = state.apply(tr)
      }),
    ).toBe(true)
    const changed = state.doc
    expect(undoDepth(state)).toBe(1)
    expect(
      undo(state, (tr) => {
        state = state.apply(tr)
      }),
    ).toBe(true)
    return { original, changed, restored: state.doc }
  }

  describe('preventHiddenWrapper is off by default', () => {
    it('Tab on the first item wraps it in a hidden wrapper', () => {
      t.applyCommand(indent, doc(L(p('A<a>'))), doc(L(L(p('A<a>')))))
      expect(hasHiddenWrapper(t.editor.state.doc)).toBe(true)
    })

    it('Tab on the first item with children wraps the item and its children in a hidden wrapper', () => {
      t.applyCommand(
        indent,
        doc(L(p('B<a>'), L(p('D')), L(p('E')))),
        doc(L(L(p('B<a>')), L(p('D')), L(p('E')))),
      )
      expect(hasHiddenWrapper(t.editor.state.doc)).toBe(true)
    })

    it('Shift-Tab on an item with a child and a trailing sibling wraps the child in a hidden wrapper', () => {
      t.applyCommand(
        dedent,
        doc(L(p('A'), L(p('B<a>'), L(p('C'))), L(p('D')))),
        doc(L(p('A')), L(p('B<a>'), L(L(p('C'))), L(p('D')))),
      )
      expect(hasHiddenWrapper(t.editor.state.doc)).toBe(true)
    })

    it('Shift-Tab on a second paragraph wraps the trailing siblings in two hidden wrappers', () => {
      t.applyCommand(
        dedent,
        doc(L(p('A'), p('X<a>'), L(p('D')), L(p('E')))),
        doc(L(p('A')), p('X<a>'), L(L(L(p('D')), L(p('E'))))),
      )
      expect(hasHiddenWrapper(t.editor.state.doc)).toBe(true)
    })
  })

  describe('indent', () => {
    it('refuses to indent the first item of the document', () => {
      expectRefused(strictIndent, doc(L(p('A<a>'))))
    })

    it('refuses to indent the first item of the document when it has children', () => {
      expectRefused(strictIndent, doc(L(p('B<a>'), L(p('D')), L(p('E')))))
    })

    it('indents an item without children into the previous list sibling', () => {
      applyStrict(
        strictIndent,
        doc(L(p('A')), L(p('B<a>'))),
        doc(L(p('A'), L(p('B<a>')))),
      )
    })

    it('indents an item with children into the previous list sibling, the same as without the option', () => {
      const before = doc(L(p('A')), L(p('B<a>'), L(p('D')), L(p('E'))))
      const after = doc(L(p('A'), L(p('B<a>')), L(p('D')), L(p('E'))))
      t.applyCommand(indent, before, after)
      applyStrict(strictIndent, before, after)
    })

    it('refuses to indent an item whose previous sibling is a paragraph', () => {
      expectRefused(strictIndent, doc(p('X'), L(p('B<a>'))))
    })

    it('indents the second item once, then refuses the second Tab', () => {
      t.add(doc(L(p('A')), L(p('B<a>'))))
      expect(t.dispatchCommand(strictIndent)).toBe(true)
      const afterFirst = t.editor.state.doc
      expect(afterFirst.toJSON()).toEqual(doc(L(p('A'), L(p('B')))).toJSON())

      const dispatched: Transaction[] = []
      expect(
        strictIndent(
          t.view.state,
          (tr) => {
            dispatched.push(tr)
          },
          t.view,
        ),
      ).toBe(false)
      expect(dispatched).toHaveLength(0)
      expect(t.editor.state.doc).toBe(afterFirst)
      expect(hasHiddenWrapper(t.editor.state.doc)).toBe(false)
    })

    it('refuses to indent the first child of a parent item', () => {
      expectRefused(strictIndent, doc(L(p('A'), L(p('B<a>')))))
    })

    it('refuses to indent the first child of an expanded toggle', () => {
      expectRefused(strictIndent, doc(Te(p('B'), L(p('C<a>')))))
    })

    it('indents a collapsed toggle into a previous collapsed toggle and expands the previous toggle', () => {
      // Pins the master behavior: the target toggle becomes expanded.
      applyStrict(
        strictIndent,
        doc(Tc(p('A')), Tc(p('B<a>'), L(p('C')))),
        doc(Te(p('A'), Tc(p('B<a>'), L(p('C'))))),
      )
    })

    it('refuses to indent a collapsed toggle with no previous sibling', () => {
      expectRefused(strictIndent, doc(Tc(p('B<a>'), L(p('C')))))
    })

    it('refuses to indent the first ordered item', () => {
      expectRefused(strictIndent, doc(O(p('A<a>')), O(p('B'))))
    })

    it('refuses to indent the first task item', () => {
      expectRefused(
        strictIndent,
        doc(t.uncheckedTaskList(p('A<a>')), t.checkedTaskList(p('B'))),
      )
    })

    it('indents an ordered item into the previous sibling and keeps the ordered kind', () => {
      applyStrict(
        strictIndent,
        doc(O(p('A')), O(p('B<a>'))),
        doc(O(p('A'), O(p('B<a>')))),
      )
    })

    it('indents a task item into the previous sibling and keeps the checked state', () => {
      applyStrict(
        strictIndent,
        doc(t.uncheckedTaskList(p('A')), t.checkedTaskList(p('B<a>'))),
        doc(t.uncheckedTaskList(p('A'), t.checkedTaskList(p('B<a>')))),
      )
    })

    it('indents a multi-item selection when every item has a previous sibling', () => {
      applyStrict(
        strictIndent,
        doc(L(p('A')), L(p('B<a>')), L(p('C<b>'))),
        doc(L(p('A'), L(p('B<a>')), L(p('C<b>')))),
      )
    })

    it('refuses a multi-item selection when the first item has no previous sibling, even if the second item could indent', () => {
      expectRefused(strictIndent, doc(L(p('A'), L(p('B<a>'))), L(p('C<b>'))))
    })

    it('refuses a multi-item selection at the start of the document', () => {
      expectRefused(strictIndent, doc(L(p('A<a>')), L(p('B<b>'))))
    })

    it('refuses to split the list and leaves the document untouched', () => {
      const before = doc(L(p('A1'), L(p('B<a>2a'), p('B2b'), p('B2c'))))
      // Without the option, the first paragraph is split off into a hidden wrapper.
      t.applyCommand(
        indent,
        before,
        doc(L(p('A1'), L(L(p('B<a>2a'))), L(p('B2b'), p('B2c')))),
      )
      expect(hasHiddenWrapper(t.editor.state.doc)).toBe(true)

      expectRefused(strictIndent, before)
    })

    it('uses the explicit from and to options instead of the selection', () => {
      const before = doc(L(p('A')), L(p('B')), L(p('C<a>')))

      const fromB = posOf(before, 'B')
      applyStrict(
        createIndentListCommand({
          preventHiddenWrapper: true,
          from: fromB,
          to: fromB,
        }),
        before,
        doc(L(p('A'), L(p('B'))), L(p('C<a>'))),
      )

      const fromA = posOf(before, 'A')
      expectRefused(
        createIndentListCommand({
          preventHiddenWrapper: true,
          from: fromA,
          to: fromA,
        }),
        before,
      )

      // The range A..B starts at the first item, so it is refused.
      expectRefused(
        createIndentListCommand({
          preventHiddenWrapper: true,
          from: fromA,
          to: fromB,
        }),
        before,
      )
    })
  })

  describe('dedent', () => {
    it('moves the child and the trailing sibling up together, so both become direct children of the item', () => {
      applyStrict(
        strictDedent,
        doc(L(p('A'), L(p('B<a>'), L(p('C'))), L(p('D')))),
        doc(L(p('A')), L(p('B<a>'), L(p('C')), L(p('D')))),
      )
    })

    it('dedents a second paragraph and keeps the trailing items as siblings one level up', () => {
      applyStrict(
        strictDedent,
        doc(L(p('A'), p('X<a>'), L(p('D')), L(p('E')))),
        doc(L(p('A')), p('X<a>'), L(p('D')), L(p('E'))),
      )
    })

    it('dedents a first-level item with children out of the list and moves the children up', () => {
      applyStrict(
        strictDedent,
        doc(L(p('A<a>'), L(p('C')))),
        doc(p('A<a>'), L(p('C'))),
      )
    })

    it('dedents a first-level item with children and a following sibling out of the list', () => {
      applyStrict(
        strictDedent,
        doc(L(p('A<a>'), L(p('C'))), L(p('B'))),
        doc(p('A<a>'), L(p('C')), L(p('B'))),
      )
    })

    it('keeps the default shape when the trailing sibling is a paragraph, because the new wrapper has a visible marker', () => {
      const before = doc(L(p('A'), L(p('B<a>'), p('B2'), L(p('C')))))
      const after = doc(L(p('A')), L(p('B<a>'), L(p('B2'), L(p('C')))))
      t.applyCommand(dedent, before, after)
      applyStrict(strictDedent, before, after)
    })

    it('moves a deep child and the trailing sibling up together', () => {
      applyStrict(
        strictDedent,
        doc(L(p('A'), L(p('B<a>'), L(p('C'), L(p('E')))), L(p('D')))),
        doc(L(p('A')), L(p('B<a>'), L(p('C'), L(p('E'))), L(p('D')))),
      )
    })

    it('moves a deep child up when there is no trailing sibling', () => {
      applyStrict(
        strictDedent,
        doc(L(p('A'), L(p('B<a>'), L(p('C'), L(p('E')))))),
        doc(L(p('A')), L(p('B<a>'), L(p('C'), L(p('E'))))),
      )
    })

    it('dedents a multi-item selection B..D, the same as without the option', () => {
      const before = doc(L(p('A'), L(p('B<a>'), L(p('C'))), L(p('D<b>'))))
      const after = doc(L(p('A')), L(p('B<a>'), L(p('C'))), L(p('D<b>')))
      t.applyCommand(dedent, before, after)
      applyStrict(strictDedent, before, after)
    })

    it('dedents the first child of a blockquote and moves the trailing list out of the blockquote', () => {
      const before = doc(L(p('A'), t.blockquote(p('Q<a>'), L(p('D')))))
      t.applyCommand(
        dedent,
        before,
        doc(L(p('A'), p('Q<a>'), t.blockquote(L(L(p('D')))))),
      )
      expect(hasHiddenWrapper(t.editor.state.doc)).toBe(true)

      // Pins a side effect, not a desired behavior: the trailing list leaves the blockquote.
      applyStrict(strictDedent, before, doc(L(p('A'), p('Q<a>'), L(p('D')))))
    })

    it('dedents the second child of a blockquote and moves the trailing list out of the blockquote', () => {
      const before = doc(
        L(p('A'), t.blockquote(p('Q1'), p('Q2<a>'), L(p('D')))),
      )
      t.applyCommand(
        dedent,
        before,
        doc(
          L(
            p('A'),
            t.blockquote(p('Q1')),
            p('Q2<a>'),
            t.blockquote(L(L(p('D')))),
          ),
        ),
      )
      expect(hasHiddenWrapper(t.editor.state.doc)).toBe(true)

      // Pins a side effect, not a desired behavior: the trailing list leaves the blockquote.
      applyStrict(
        strictDedent,
        before,
        doc(L(p('A'), t.blockquote(p('Q1')), p('Q2<a>'), L(p('D')))),
      )
    })

    it('keeps the ordered kind on the moved children', () => {
      applyStrict(
        strictDedent,
        doc(O(p('A'), O(p('B<a>'), O(p('C'))), O(p('D')))),
        doc(O(p('A')), O(p('B<a>'), O(p('C')), O(p('D')))),
      )
    })

    it('keeps the task checked state on the moved children', () => {
      const U = t.uncheckedTaskList
      const C = t.checkedTaskList
      applyStrict(
        strictDedent,
        doc(U(p('A'), U(p('B<a>'), C(p('C'))), U(p('D')))),
        doc(U(p('A')), U(p('B<a>'), C(p('C')), U(p('D')))),
      )
    })

    it('keeps the collapsed state of toggles on the moved children', () => {
      applyStrict(
        strictDedent,
        doc(
          L(p('A'), L(p('B<a>'), Tc(p('C'), L(p('F')))), Tc(p('D'), L(p('G')))),
        ),
        doc(
          L(p('A')),
          L(p('B<a>'), Tc(p('C'), L(p('F'))), Tc(p('D'), L(p('G')))),
        ),
      )
    })

    it('does not change Enter in an empty nested item with a next sibling', () => {
      t.applyCommand(
        enterCommand,
        doc(L(p('A'), L(p('<a>')), L(p('D')))),
        doc(L(p('A'), p('<a>'), L(p('D')))),
      )
    })

    it('does not change Enter in an empty nested item with children and a next sibling', () => {
      t.applyCommand(
        enterCommand,
        doc(L(p('A'), L(p('<a>'), L(p('C'))), L(p('D')))),
        doc(L(p('A'), p('<a>'), L(p('C')), L(p('D')))),
      )
    })

    it('restores the original document with one undo after a dedent that moves trailing siblings', () => {
      const cases = [
        doc(L(p('A'), L(p('B<a>'), L(p('C'))), L(p('D')))),
        doc(L(p('A'), p('X<a>'), L(p('D')), L(p('E')))),
        doc(L(p('A<a>'), L(p('C'))), L(p('B'))),
      ]
      for (const before of cases) {
        const { original, changed, restored } = applyAndUndo(
          strictDedent,
          before,
        )
        expect(changed.eq(original)).toBe(false)
        expect(hasHiddenWrapper(changed)).toBe(false)
        expect(restored.toJSON()).toEqual(original.toJSON())
      }
    })
  })

  describe('paths that still produce hidden wrappers', () => {
    it('pasting a list item whose first child is a list creates a hidden wrapper', () => {
      t.add(doc(p('<a>')))
      t.pasteHTML('<ul><li><ul><li><p>B</p></li></ul></li></ul>')
      expect(t.editor.state.doc.toJSON()).toEqual(doc(L(L(p('B')))).toJSON())
      expect(hasHiddenWrapper(t.editor.state.doc)).toBe(true)
    })

    it('deleting a selection from the parent text into the child text creates a hidden wrapper', () => {
      t.add(doc(L(p('<a>A'), L(p('<b>B')))))
      t.view.dispatch(t.view.state.tr.deleteSelection())
      expect(t.editor.state.doc.toJSON()).toEqual(doc(L(L(p('B')))).toJSON())
      expect(hasHiddenWrapper(t.editor.state.doc)).toBe(true)
    })

    it('a strict Tab elsewhere leaves a pre-existing hidden wrapper alone', () => {
      t.applyCommand(
        strictIndent,
        doc(L(L(p('B'))), p('X'), L(p('Y')), L(p('Z<a>'))),
        doc(L(L(p('B'))), p('X'), L(p('Y'), L(p('Z<a>')))),
      )
      expect(hasHiddenWrapper(t.editor.state.doc)).toBe(true)
    })

    it('a strict Tab on the item inside a pre-existing hidden wrapper is refused', () => {
      expectRefused(strictIndent, doc(L(L(p('B<a>'))), L(p('C'))))
    })
  })
})
