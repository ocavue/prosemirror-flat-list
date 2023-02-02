import { ResolvedPos } from '@remirror/pm'

export function atStartBoundary($pos: ResolvedPos, depth: number): boolean {
  for (let d = depth; d <= $pos.depth; d++) {
    const index = $pos.index(d)
    if (index !== 0) {
      return false
    }
  }
  return true
}

export function atEndBoundary($pos: ResolvedPos, depth: number): boolean {
  for (let d = depth; d <= $pos.depth; d++) {
    const index = $pos.index(d)
    if (index !== $pos.node(d).childCount - 1) {
      return false
    }
  }
  return true
}
