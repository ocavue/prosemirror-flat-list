# prosemirror-flat-list

## 0.4.2

### Patch Changes

- b7846a4: Keep the checkbox state when pasting task lists into an empty nested bullet list.

## 0.4.1

### Patch Changes

- 64c656e: Keep the checkbox state when pasting task lists into an empty bullet list.

## 0.4.0

### Minor Changes

- b5f2400: Add two command creators: `createToggleListCommand` and `createUnwrapListCommand`.

## 0.3.15

### Patch Changes

- eacfe4f: Improve the `splitListCommand` for `NodeSelection`. If the current selection is a node selection, and this node is directly inside a parent list node, pressing Enter will create a new list node below.

## 0.3.14

### Patch Changes

- 5a4bcda: Render ordered list counter correctly on Firefox.

## 0.3.13

### Patch Changes

- 9bae343: Prevent iOS from bouncing the text selection around when toggling a list or a task item.

## 0.3.12

### Patch Changes

- 2250b64: Parse TODO copied from Notion

## 0.3.11

### Patch Changes

- 7522b08: Parse checkbox inside a span or label

## 0.3.10

### Patch Changes

- 5632801: Parse invalid nested list html copied from Dropbox Paper

## 0.3.9

### Patch Changes

- 8e939fa: Expand a collapsed list if something is indented into it

## 0.3.8

### Patch Changes

- 0233699: Fix the custom counter for Safari

## 0.3.7

### Patch Changes

- 9e0a758: Fix a runtime crash when clicking the toggle mark in a deep list
- a45842a: Mark `flatListGroup` as an internal API

## 0.3.6

### Patch Changes

- 25ddceb: Fix a bug that causes pasting a deeply nested list will bring too many indentations

## 0.3.5

### Patch Changes

- 747bd73: Fix a bug that causes `wrapInList` to crash when the text cursor is right before an atom block node

## 0.3.4

### Patch Changes

- ca92161: Fix a bug in `dedentCommand` that causes an extra bullet will be added.

## 0.3.3

### Patch Changes

- 3e03b69: Improve parse dom rules for task list.

## 0.3.2

### Patch Changes

- 80e0a19: When the cursor is at the beginning of a checked list node, pressing Enter
  should create a unchecked list node above the cursor.
- ad81337: Fix a bug that causes checked state cannot be parsed.

## 0.3.1

### Patch Changes

- 737299f: If the cursor is inside the second paragraph of a list node, `wrapInList` will convert this paragraph into a list node.

## 0.3.0

### Minor Changes

- fc99feb: Remove the `alwaysTrue` util function.
- fc99feb: Replace `createListInputRules` with `listInputRules`.
- fc99feb: Rename `joinListBackward` to `joinListUp`.

### Patch Changes

- a7c0ad3: Fix a bug that causes a runtime error when dedent blockquote.

## 0.2.1

### Patch Changes

- 9cd4bbd: Adjust the Backspace behavior when there is a collapsed list node before the cursor. Now the current block will join into the first child of the list node.

## 0.2.0

### Minor Changes

- a933aca: Add `createListPlugins` and remove `createListPlugin`. `createListPlugins` will return an array of plugins.

## 0.1.5

### Patch Changes

- 22fd935: When collapsing a list node, make sure that the selection cursor won't stay inside hidden nodes.

## 0.1.4

### Patch Changes

- 92f6d3d: Improve the keybinding for `Enter`.

## 0.1.3

### Patch Changes

- 1e1c5b9: Improve the keybinding for `Backspace`. Add a new command `joinListBackward`.

## 0.1.2

### Patch Changes

- 3df4a31: Add a new plugin `createSafariInputMethodWorkaroundPlugin` as another workaround for the [Safari IME bug](https://github.com/ProseMirror/prosemirror/issues/934)

## 0.1.1

### Patch Changes

- be89e59: Add a workaround for a Safari bug, which causes the list node to be removed when input inside an empty list node with IME.

## 0.1.0

### Minor Changes

- 200ecdb: Release version 0.1.0
