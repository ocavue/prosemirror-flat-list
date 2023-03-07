# prosemirror-flat-list

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
