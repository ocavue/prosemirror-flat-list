import { Transaction } from '@remirror/pm/state'

export function mapPos(tr: Transaction) {
  let nextStepIndex = tr.steps.length

  const map = (pos: number): number => {
    if (nextStepIndex < tr.steps.length) {
      const mapping = tr.mapping.slice(nextStepIndex)
      nextStepIndex = tr.steps.length
      return mapping.map(pos)
    } else {
      return pos
    }
  }

  return map
}
