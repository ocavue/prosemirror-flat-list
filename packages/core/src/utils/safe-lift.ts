import { NodeRange } from 'prosemirror-model'
import { Transaction } from 'prosemirror-state'
import { liftTarget } from 'prosemirror-transform'

export function safeLift(tr: Transaction, range: NodeRange): boolean {
  const target = liftTarget(range)
  if (target == null) {
    return false
  }
  tr.lift(range, target)
  return true
}
