import { NodeRange } from '@remirror/pm/model'
import { Transaction } from '@remirror/pm/state'
import { liftTarget } from '@remirror/pm/transform'

export function safeLift(tr: Transaction, range: NodeRange): boolean {
  const target = liftTarget(range)
  if (target == null) {
    return false
  }
  tr.lift(range, target)
  return true
}
