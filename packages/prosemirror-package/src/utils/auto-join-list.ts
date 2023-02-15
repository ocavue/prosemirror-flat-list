import { ProsemirrorNode } from '@remirror/core'
import { Transaction } from 'prosemirror-state'
import { canJoin, canSplit } from 'prosemirror-transform'
import { isListNode } from './is-list-node'

/** @internal */
export function getTransactionRanges(tr: Transaction): number[] {
  const ranges: number[] = []

  for (const map of tr.mapping.maps) {
    for (let i = 0; i < ranges.length; i++) {
      ranges[i] = map.map(ranges[i])
    }

    map.forEach((_oldStart, _oldEnd, newStart, newEnd) =>
      ranges.push(newStart, newEnd),
    )
  }

  return ranges
}

/** @internal */
export function getJoinableBoundaries(
  positions: number[],
  doc: ProsemirrorNode,
): Array<[number, boolean]> {
  const boundaries = new Set<number>()
  const joinable: Array<[number, boolean]> = []

  for (const pos of positions) {
    const $pos = doc.resolve(pos)
    for (let depth = $pos.depth; depth >= 0; depth--) {
      const boundary = $pos.before(depth + 1)
      if (boundaries.has(boundary)) {
        break
      }
      boundaries.add(boundary)

      const index = $pos.index(depth)
      const parent = $pos.node(depth)

      const before = parent.maybeChild(index - 1)
      if (!before) continue

      const after = parent.maybeChild(index)
      if (!after) continue

      if (isListSplitable(index, before, after, parent)) {
        joinable.push([boundary, false])
      } else if (isListJoinable(before, after)) {
        joinable.push([boundary, true])
      }
    }
  }
  return joinable
}

function isListJoinable(
  before: ProsemirrorNode,
  after: ProsemirrorNode,
): boolean {
  return isListNode(before) && isListNode(after) && isListNode(after.firstChild)
}

function isListSplitable(
  index: number,
  before: ProsemirrorNode,
  after: ProsemirrorNode,
  parent: ProsemirrorNode,
): boolean {
  return (
    index === 1 &&
    isListNode(parent) &&
    isListNode(before) &&
    !isListNode(after)
  )
}

/** @internal */
export function autoJoinList(tr: Transaction): void {
  const positions = getTransactionRanges(tr)
  const joinable = getJoinableBoundaries(positions, tr.doc)

  // Sort in the descending order
  joinable.sort((a, b) => b[0] - a[0])

  for (const [pos, join] of joinable) {
    if (join && canJoin(tr.doc, pos)) {
      tr.join(pos)
    } else if (!join && canSplit(tr.doc, pos)) {
      tr.split(pos)
    }
  }
}
