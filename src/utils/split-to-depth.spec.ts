import { TaggedProsemirrorNode } from 'jest-remirror'
import { describe, expect, it } from 'vitest'
import { setupTestingEditor } from '../../test/setup-editor'
import { splitToDepth } from './split-to-depth'

describe('splitToDepth', () => {
  const t = setupTestingEditor()

  const check = ({
    targetDepth,
    before,
    after,
    pos,
  }: {
    targetDepth: number
    before: TaggedProsemirrorNode
    after: TaggedProsemirrorNode | null
    pos?: number
  }) => {
    const tr = t.add(before).tr
    pos = pos ?? tr.selection.$from.pos
    const changed = splitToDepth(tr, tr.doc.resolve(pos), targetDepth)
    if (after) {
      expect(changed).toBe(true)
      expect(tr.doc).toEqualRemirrorDocument(after)
    } else {
      expect(changed).toBe(false)
      expect(tr.doc).toEqualRemirrorDocument(before)
    }
  }

  it.each([
    {
      targetDepth: 0,
      before: t.doc(
        t.bulletList(
          //
          t.p('A', '<cursor>', 'B')
        )
      ),
      after: t.doc(
        t.bulletList(
          //
          t.p('A')
        ),
        t.bulletList(
          //
          t.p('B')
        )
      ),
    },
    {
      targetDepth: 1,
      before: t.doc(
        t.bulletList(
          //
          t.p('A', '<cursor>', 'B')
        )
      ),
      after: t.doc(
        t.bulletList(
          //
          t.p('A'),
          t.p('B')
        )
      ),
    },
    {
      targetDepth: 2,
      before: t.doc(
        t.bulletList(
          //
          t.p('A', '<cursor>', 'B')
        )
      ),
      after: null,
    },
    {
      targetDepth: 3,
      before: t.doc(
        t.bulletList(
          //
          t.p('A', '<cursor>', 'B')
        )
      ),
      after: null,
    },
    {
      targetDepth: 0,
      before: t.doc(
        t.bulletList(
          //
          t.p('A'),
          t.p('B', '<cursor>', 'C'),
          t.p('D')
        )
      ),
      after: t.doc(
        t.bulletList(
          //
          t.p('A'),
          t.p('B')
        ),
        t.bulletList(
          //
          t.p('C'),
          t.p('D')
        )
      ),
    },
    {
      targetDepth: 1,
      before: t.doc(
        t.bulletList(
          //
          t.p('A'),
          t.p('B', '<cursor>', 'C'),
          t.p('D')
        )
      ),
      after: t.doc(
        t.bulletList(
          //
          t.p('A'),
          t.p('B'),
          t.p('C'),
          t.p('D')
        )
      ),
    },
    {
      targetDepth: 2,
      before: t.doc(
        t.bulletList(
          //
          t.p('A'),
          t.p('B', '<cursor>', 'C'),
          t.p('D')
        )
      ),
      after: null,
    },
  ])('can split node %#', check)

  it.each([
    {
      targetDepth: 0,
      pos: 4,
      before: t.doc(
        t.bulletList(
          //
          t.p('AB')
        )
      ),
      after: null,
    },
    {
      targetDepth: 0,
      pos: 4,
      before: t.doc(
        t.bulletList(
          //
          t.p('AB'),
          t.p('CD')
        )
      ),
      after: t.doc(
        t.bulletList(
          //
          t.p('AB')
        ),
        t.bulletList(
          //
          t.p('CD')
        )
      ),
    },
    {
      targetDepth: 0,
      pos: 5,
      before: t.doc(
        t.bulletList(
          //
          t.p('AB'),
          t.p('CD')
        )
      ),
      after: t.doc(
        t.bulletList(
          //
          t.p('AB')
        ),
        t.bulletList(
          //
          t.p('CD')
        )
      ),
    },
    {
      targetDepth: 0,
      pos: 6,
      before: t.doc(
        t.bulletList(
          //
          t.p('AB'),
          t.p('CD')
        )
      ),
      after: t.doc(
        t.bulletList(
          //
          t.p('AB'),
          t.p('')
        ),
        t.bulletList(
          //
          t.p('CD')
        )
      ),
    },
    {
      targetDepth: 1,
      pos: 4,
      before: t.doc(
        t.bulletList(
          //
          t.p('AB'),
          t.p('CD')
        )
      ),
      after: null,
    },
  ])('can skip splitted blocks %#', check)
})
