---
'prosemirror-flat-list': patch
---

Add a `strict` option to `createIndentListCommand`, `createDedentListCommand` and `createSplitListCommand`, and a `createListKeymap(options)` function that passes it to all three.

A list node whose first child is a list node renders no marker; it only adds one level of indentation. With `strict` on, the commands never leave such a node behind, so a block is never more than one level deeper than the block before it:

- `indentList` returns `false` instead of wrapping a block that has no previous list sibling to move into (for example the first item of a list).
- `dedentList` lifts the trailing siblings together with the dedented block instead of keeping their depth inside such a node.
- `splitList` (`Enter` in an empty list node) dedents with the same rule.

The option is off by default, so existing behavior is unchanged.
