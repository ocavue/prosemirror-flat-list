---
'prosemirror-flat-list': minor
---

Add a `strict` option to `createIndentListCommand` and `createDedentListCommand`.

A hidden wrapper is a list node whose first child is a list node; its marker is not rendered. With the option on, a block can never end up more than one level deeper than the block before it:

- `indentList` returns `false` instead of wrapping a block that has no previous list sibling to move into (for example the first item of a list).
- `dedentList` lifts the trailing siblings together with the dedented block instead of keeping their depth inside a hidden wrapper.

The option is off by default, so existing behavior is unchanged.
