import { NodeRange } from '@remirror/pm/model'

export function zoomInRange(range: NodeRange, index: number): NodeRange | null {
  const { $from, $to, depth, parent, start: posBeforeChildren } = range

  const child = parent.child(index)

  let posBeforeChild = posBeforeChildren
  for (let i = range.startIndex; i < index; i++) {
    posBeforeChild += parent.child(i).nodeSize
  }
  const posAfterChild = posBeforeChild + child.nodeSize

  const posChildStart = posBeforeChild + 1
  const posChildEnd = posAfterChild - 1

  if (!child.isBlock) {
    return null
  }

  const doc = $from.doc

  if (child.isTextblock) {
    return new NodeRange(
      doc.resolve($from.pos),
      doc.resolve(Math.min($to.pos, posChildEnd)),
      depth,
    )
  }

  const posContentStart = posChildStart + 1
  const posContentEnd = posChildEnd - 1

  const from = $from.pos >= posContentStart ? $from.pos : posContentStart
  const to = $to.pos <= posContentEnd ? $to.pos : posContentEnd

  const result = new NodeRange(doc.resolve(from), doc.resolve(to), depth + 1)
  console.assert(
    0 <= result.startIndex && result.startIndex < result.parent.childCount,
    `wrong start index

result:    
parent: ${parent.toString()}
posContentStart ${posContentStart}
child.nodeSize ${child.nodeSize}
child ${child.toString()}
posContentEnd ${posContentEnd}
from: ${$from.pos} ${from}
to: ${$to.pos} ${to}
startIndex: ${result.startIndex}
endIndex: ${result.endIndex}
result.parent.childCount: ${result.parent.childCount}
    `,
  )
  console.assert(
    result.startIndex < result.endIndex &&
      result.endIndex <= result.parent.childCount,
    'wrong end index',
  )

  return result
}
