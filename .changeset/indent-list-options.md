---
'prosemirror-flat-list': minor
---

Add two options to `createIndentListCommand`:

- `wrap` (default `true`): when `false`, the command does nothing instead of wrapping a range in a new list node when there is no previous list node to indent into.
- `getHiddenListAttrs`: returns the attributes for a list node whose marker is hidden after the indent (its first child is a list node). Use it when a hidden marker still carries meaning, for example a task checkbox that would otherwise be serialized as `- [ ] - [ ] text` in Markdown.
