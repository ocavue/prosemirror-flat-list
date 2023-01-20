import { ResolvedPos } from '@remirror/pm/model';

// TODO: this is not used

export function isLastChild($pos: ResolvedPos, depth: number): boolean {
  return $pos.node(depth).childCount === $pos.indexAfter(depth);
}
