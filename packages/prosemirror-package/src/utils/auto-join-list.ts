import { ProsemirrorNode } from '@remirror/core'
import { Transaction } from 'prosemirror-state'
import { canJoin } from 'prosemirror-transform'
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
  isJoinable: (nodeA: ProsemirrorNode, nodeB: ProsemirrorNode) => boolean,
): number[] {
  const boundaries = new Set<number>()
  const joinable: number[] = []

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

      if (before.type === after.type && isJoinable(before, after)) {
        joinable.push(boundary)
      }
    }
  }

  return joinable
}

/** @internal */
export function autoJoinList(tr: Transaction): void {
  const isListJoinable = (before: ProsemirrorNode, after: ProsemirrorNode) => {
    return (
      isListNode(before) && isListNode(after) && isListNode(after.firstChild)
    )
  }

  const positions = getTransactionRanges(tr)
  const joinable = getJoinableBoundaries(positions, tr.doc, isListJoinable)

  // Sort in the descending order
  joinable.sort((a, b) => b - a)

  for (const pos of joinable) {
    if (canJoin(tr.doc, pos)) {
      tr.join(pos)
    }
  }
}
