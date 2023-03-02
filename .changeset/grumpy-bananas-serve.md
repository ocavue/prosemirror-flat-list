---
'prosemirror-flat-list': minor
---

Remove `createListNodeView` and replace it with `createListRenderingPlugin`. This plugin is included in the array returned by `createListPlugins`, so you don't have to add it separately.
