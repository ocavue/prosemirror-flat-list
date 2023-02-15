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
  isJoinable: (
    before: ProsemirrorNode,
    after: ProsemirrorNode,
    parent: ProsemirrorNode,
    index: number,
  ) => boolean,
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

      if (isJoinable(before, after, parent, index)) {
        joinable.push(boundary)
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
  before: ProsemirrorNode,
  after: ProsemirrorNode,
  parent: ProsemirrorNode,
  index: number,
): boolean {
  if (
    index === 1 &&
    isListNode(parent) &&
    isListNode(before) &&
    !isListNode(after)
  ) {
    return true
  }
  return false
}

/** @internal */
export function autoJoinList(tr: Transaction): void {
  const joinable = getJoinableBoundaries(
    getTransactionRanges(tr),
    tr.doc,
    isListJoinable,
  )

  // Sort in the descending order
  joinable.sort((a, b) => b - a)

  for (const pos of joinable) {
    if (canJoin(tr.doc, pos)) {
      tr.join(pos)
    }
  }

  const splitable = getJoinableBoundaries(
    getTransactionRanges(tr),
    tr.doc,
    isListSplitable,
  )

  joinable.sort((a, b) => b - a)

  for (const pos of splitable) {
    if (canSplit(tr.doc, pos)) {
      tr.split(pos)
    }
  }
}
