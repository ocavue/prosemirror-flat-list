import { NodeRange } from '@remirror/pm/model'

export function isItemRangeForIndentation(itemRange: NodeRange): boolean {
  const itemCount = itemRange.endIndex - itemRange.startIndex

  if (itemCount > 1) {
    return true
  }

  const { $from, depth } = itemRange

  return $from.depth > depth && $from.index(depth + 1) === 0
}
