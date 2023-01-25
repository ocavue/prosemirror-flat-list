import { ResolvedPos } from '@remirror/pm/model'

// TODO: this is not used

export function isFirstChild($pos: ResolvedPos, depth: number): boolean {
  return $pos.index(depth) === 0
}

export function isLastChild($pos: ResolvedPos, depth: number): boolean {
  return $pos.indexAfter(depth) === $pos.node(depth).childCount
}
