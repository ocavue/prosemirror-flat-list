import { ResolvedPos, Transaction } from '@remirror/pm'

export function splitToDepth(
  tr: Transaction,
  $pos: ResolvedPos,
  targetDepth: number
): boolean {
  const maxDepthOffset = $pos.depth - targetDepth

  for (let depthOffset = 0; depthOffset < maxDepthOffset; depthOffset++) {
    const after = $pos.end($pos.depth - depthOffset)
    const expectedAfter = $pos.pos + depthOffset

    if (after !== expectedAfter) {
      console.log('split At depth', { depthOffset, after, expectedAfter })
      tr.split(expectedAfter, maxDepthOffset - depthOffset)
      return true
    }
  }
  return false
}
