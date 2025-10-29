/**
 * Finds a `<input type="checkbox">` element from a `<li>` element. It will stop
 * searching if it reaches a sub-list.
 *
 * @internal
 */
export function findCheckboxInListItem(
  node: Element,
  depth = 0,
  maxDepth = 3,
): HTMLInputElement | void {
  if (node.nodeName === 'INPUT' && node.getAttribute('type') === 'checkbox') {
    return node as HTMLInputElement
  }

  if (depth > 0 && ['UL', 'OL', 'LI'].includes(node.nodeName)) {
    return
  }

  if (depth >= maxDepth) {
    return
  }

  for (let child of node.children) {
    const checkbox = findCheckboxInListItem(child, depth + 1, maxDepth)
    if (checkbox) {
      return checkbox
    }
  }
}
