# ProseMirror Flat List

**Powerful list for [ProseMirror] and [Remirror]**

This project introduces a new [ProseMirror] list design different from the [prosemirror-schema-list].

## Features

### Simpler data structure

This project simplifies the list design in [ProseMirror] by providing only one node type: `list`. You can add any block nodes as a children of a list node, including another list node. The first child can also be any block type, not just a paragraph.

This design is “flat” because it does not use `<ul>` (`bullet_list`) and `<ol>` (`order_list`) elements to wrap list items. This makes the data structure simpler and easier to manipulate. The list node will render as a `<div>` element.

### New list kinds

We adds two new kinds of lists: `task` and `toggle`. You can interact with them using the mouse. These types are in addition to the existing `bullet` and `ordered` lists from [prosemirror-schema-list].

![task-and-toggle](https://user-images.githubusercontent.com/24715727/216984786-b686a5fe-c9e3-47ae-8b06-6fbdb81200d2.gif)

### Accurate indent and dedent range

This module improves how the indent and dedent commands work (they are called `liftListItem` and `sinkListItem` in [prosemirror-schema-list]). These two commands now try to move only the selected part of the document.

> ⬇ Unselected paragraph (e.g. "A complex list") is also moved when using the old `sinkListItem` command in `prosemirror-schema-list`.

![old-dedent](https://user-images.githubusercontent.com/24715727/216982142-4fc89391-5dec-426b-bcfb-b0290920f08e.gif)

> ⬇ Only selected paragraph are moved when using the new `dedent` command in `prosemirror-flat-list`.

![new-dedent](https://user-images.githubusercontent.com/24715727/216982134-4e222d58-033c-4dbf-acfc-132d6264f524.gif)

### Arbitrary indentations

Since the first child of a list node can also be a list node, we can have multiple bullet points on one line. This feature allows a list item to have arbitrary indentations by hiding all the bullets except the last one in one line.

![arbitrary indentation](https://user-images.githubusercontent.com/24715727/216973979-af271633-62a2-4744-a522-e87b89426f90.gif)

### Input rules

prosemirror-flat-list provides some input rules for creating list nodes. You can type:

- `-` or `*` followed by a space to create a bullet list node
- `1.` followed by a space to create an ordered list node
- `[ ]` or `[x]` followed by a space to create a task list node
- `>>` followed by a space to create a toggle list node

You can also use `wrappingListInputRule` function from this module to create your own input rules.

### Migration

If you want to migrate your existing documents that use [prosemirror-schema-list] or [@remirror/extension-list], you can use `migrateDocJSON` function from this module. It accepts an ProseMirror document JSON object and returns an updated document JSON object (or `null` if no migration is needed). It will replace all the old list nodes with the new list nodes. For example:

```typescript
import { migrateDocJSON } from 'prosemirror-flat-list'

const oldDoc = {
  type: 'doc',
  content: [
    {
      type: 'ordered_list',
      content: [
        {
          type: 'list_item',
          content: [{ type: 'paragraph', text: 'Item 1' }],
        },
        {
          type: 'list_item',
          content: [{ type: 'paragraph', text: 'Item 2' }],
        },
      ],
    },
  ],
}

const newDoc = migrateDocJSON(oldDoc)

console.log(newDoc)
// {
//   type: 'doc',
//   content: [{
//     type: 'list',
//     attrs: { kind: 'ordered' },
//     content: [
//       { type: 'paragraph', text: 'Item 1' },
//       { type: 'paragraph', text: 'Item 2' }
//     ]
//   }]
// }
```

[ProseMirror]: https://prosemirror.net/
[Remirror]: https://remirror.io
[prosemirror-schema-list]: https://github.com/ProseMirror/prosemirror-schema-list
[@remirror/extension-list]: https://www.npmjs.com/package/@remirror/extension-list
[Remirror]: https://github.com/remirror/remirror
[prosemirror-flat-list]: https://github.com/ocavue/prosemirror-flat-list/tree/master/packages/prosemirror-package
[remirror-extension-flat-list]: https://github.com/ocavue/prosemirror-flat-list/tree/master/packages/remirror-package
