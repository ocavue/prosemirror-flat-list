import { NodeRange } from '@remirror/pm/model'

export function zoomInRange(range: NodeRange, index: number) {
  const { $from, $to, depth, parent, start: posBeforeChildren } = range

  const child = parent.child(index)

  let posBeforeChild = posBeforeChildren
  for (let i = range.startIndex; i < index; i++) {
    posBeforeChild += parent.child(i).nodeSize
  }
  const posAfterChild = posBeforeChild + child.nodeSize

  const posChildStart = posBeforeChild + 1
  const posChildEnd = posAfterChild - 1

  const doc = $from.doc

  if (child.isBlock && !child.isTextblock) {
    const posContentStart = posChildStart + 1
    const posContentEnd = posChildEnd - 1

    const from = $from.pos >= posContentStart ? $from.pos : posContentStart
    const to = $to.pos <= posContentEnd ? $to.pos : posContentEnd

    return new NodeRange(doc.resolve(from), doc.resolve(to), depth + 1)
  } else {
    const from = $from.pos >= posChildStart ? $from.pos : posChildStart
    const to = $to.pos <= posChildEnd ? $to.pos : posChildEnd

    return new NodeRange(doc.resolve(from), doc.resolve(to), depth)
  }
}
