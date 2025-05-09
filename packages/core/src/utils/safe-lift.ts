import type { NodeRange } from 'prosemirror-model'
import type { Transaction } from 'prosemirror-state'
import { liftTarget } from 'prosemirror-transform'

export function safeLift(tr: Transaction, range: NodeRange): boolean {
  const target = liftTarget(range)
  if (target == null) {
    return false
  }
  tr.lift(range, target)
  return true
}

export function safeLiftFromTo(
  tr: Transaction,
  from: number,
  to: number,
): boolean {
  const $from = tr.doc.resolve(from)
  const $to = tr.doc.resolve(to)
  const range = $from.blockRange($to)
  if (!range) return false
  return safeLift(tr, range)
}
