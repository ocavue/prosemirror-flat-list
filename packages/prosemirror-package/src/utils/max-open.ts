import {
  Fragment,
  Node as ProsemirrorNode,
  ResolvedPos,
} from 'prosemirror-model'

// Copy from https://github.com/prosemirror/prosemirror-model/blob/1.19.0/src/replace.ts#L88-L95
export function maxOpenStart(
  fragment: Fragment | ProsemirrorNode,
  openIsolating = true,
) {
  let openStart = 0
  for (
    let n = fragment.firstChild;
    n && !n.isLeaf && (openIsolating || !n.type.spec.isolating);
    n = n.firstChild
  ) {
    openStart++
  }
  return openStart
}

// Copy from https://github.com/prosemirror/prosemirror-model/blob/1.19.0/src/replace.ts#L88-L95
export function maxOpenEnd(
  fragment: Fragment | ProsemirrorNode,
  openIsolating = true,
) {
  let openEnd = 0
  for (
    let n = fragment.lastChild;
    n && !n.isLeaf && (openIsolating || !n.type.spec.isolating);
    n = n.lastChild
  ) {
    openEnd++
  }
  return openEnd
}

// TODO: not used
export function equalMaxOpenStart(
  $a: ResolvedPos,
  $b: ResolvedPos,
  openIsolating = true,
) {
  return (
    $a.pos + maxOpenStart($a.parent, openIsolating) ===
    $b.pos + maxOpenStart($b.parent, openIsolating)
  )
}

// TODO: not used
export function equalMaxOpenEnd(
  $a: ResolvedPos,
  $b: ResolvedPos,
  openIsolating = true,
) {
  const nodeBeforeA = $a.nodeBefore
  const nodeBeforeB = $b.nodeBefore

  if (!nodeBeforeA || !nodeBeforeB) {
    return false
  }

  const maxOpenEndA = maxOpenEnd(nodeBeforeA, openIsolating)
  const maxOpenEndB = maxOpenEnd(nodeBeforeB, openIsolating)

  return $a.pos - maxOpenEndA === $b.pos - maxOpenEndB
}
