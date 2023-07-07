---
'prosemirror-flat-list': patch
---

Improve the `splitListCommand` for `NodeSelection`. If the current selection is a node selection, and this node is directly inside a parent list node, pressing Enter will create a new list node below.
