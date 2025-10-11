---
title: Guide
---

## Requirements

You will need a ProseMirror project. Or you can use https://github.com/ocavue/prosemirror-playground to create a some

## Install

```bash
npm install prosemirror-flat-list
```

## Usage

```ts
import {
  createListPlugins,
  createListSpec,
  listInputRules,
  listKeymap,
} from 'prosemirror-flat-list'
```

## Schema

First step is to add a `list` node type to your schema.

```ts
import { createListSpec } from 'prosemirror-flat-list'
import { Schema } from 'prosemirror-model'

const mySchema = new Schema({
  nodes: {
    doc: { content: 'paragraph+' },
    paragraph: { content: 'text*' },
    /* ... and so on */
    list: createListSpec(),
  },
})
```

If you already have a schema object (perhaps from [prosemirror-example-setup]), you can

```ts
import { schema } from 'prosemirror-schema-basic'

const mySchema = new Schema({
  nodes: schema.spec.nodes.append({ list: createListSpec() }),
  marks: schema.spec.marks,
})
```

The node type `list` has the following attributes.

- `kind`:
  A string representing the kind of the list node. It can be chose from the
  following values: `bullet`, `ordered`, `task` or `toggle`. Based on the
  `kind` attribute, the list node will has different appearance and behavior.
  The default value is `bullet`.

  ![Node kinds](https://user-images.githubusercontent.com/24715727/216966304-c2f9a7f4-fc65-430c-91e8-2eb7aff956fa.png).

- `counter`:
  An optional number to determine the number of an ordered list node.

- `checked`:
  A boolean value to determine the checked state of the checkbox for a task
  list node.
- `collapsed`:
  A boolean value to determine the collapse state of a toggle list node.

## Keymap

Next step should be add keybindings for the list node type.

```ts
import { keymap } from 'prosemirror-keymap'
import { listKeymap } from 'prosemirror-flat-list'

const listKeymapPlugin = keymap(listKeymap)
```

Make sure that you add this plugin before other plugins that handle the some keybindings.

## Input rules

You can also add input rules for the list node type.

```ts
import { inputRules } from 'prosemirror-inputrules'
import { listInputRules } from 'prosemirror-flat-list'

const listInputRulePlugin = inputRules({ rules: listInputRules })
```

## Other plugins

Use `createListPlugins` to create other plugins. You can view its [reference](../docs/prosemirror-flat-list.md#createlistplugins) to see what plugins it creates.

```ts
import { createListPlugins } from 'prosemirror-flat-list'

const listPlugins = createListPlugins({ schema })
```

## Commands

`prosemirror-flat-list` provides a variety of commands to manipulate the list node type. Please view the [reference](../docs/prosemirror-flat-list.md#commands) to see what commands it provides.

## Example

Here is an full example of how to use `prosemirror-flat-list` with ProseMirror.

https://github.com/ocavue/prosemirror-flat-list/tree/master/examples/with-prosemirror

[prosemirror-example-setup]: https://github.com/ProseMirror/prosemirror-example-setup
