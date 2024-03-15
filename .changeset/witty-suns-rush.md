---
"prosemirror-flat-list": minor
---

The second parameter of the `wrappingListInputRule` now should accept an object. Here is an example of how to migrate your existing input rules:

```diff
const myTaskListInputRule = wrappingListInputRule(
  /^\s?\[([\sXx]?)]\s$/, 
- (match) => {
+ ({ match }) => {
    return {
      kind: 'task',
      checked: ['x', 'X'].includes(match[1]),
      collapsed: false,
    }
  },
)
```
