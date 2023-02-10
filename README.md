# ProseMirror Flat List

_Project status: Alpha. Document are not complete and the API are likely to change. Do not use in production._

## [Online demo](https://remirror-extension-flat-list.netlify.app/)

## Sponsored by

<table style="align:center;">
  <tr>
    <td align="center">
      <a href="https://reflect.app/" rel="nofollow">
        <img src="https://user-images.githubusercontent.com/2003804/170265087-fb7bf84e-0413-49d5-8a30-15b71bc9055b.png" height="200px" width="200px" style="max-width: 100%;" alt="Reflect logo"><br>
        <strong style="font-size: 2em">Reflect</strong>
      </a>
    </td>
  </tr>
</table>

## Motivation

This project introduces a new [ProseMirror] list design different from the [prosemirror-schema-list].

Instead of having three types of node (`bullet_list`, `ordered_list` and `list_item`), this project only provides one node type `list`. This node type can have any block node as its children. Particularly, the first child of a `list` node can be any block type in addition to a paragraph.

It's "flat" because it doesn't need the `<ul>` and `<ol>` elements to wrap the list items. This provides a simpler data structure and thus makes it easier to implement some interactions. The new list node will be rendered as a `<div>` element.

> ⬇ The HTML structure of the old list nodes in `prosemirror-schema-list`.

```HTML
<ul>
  <li>
    <p>Item A</p>
  </li>
  <li>
    <p>Item B</p>
    <ol>
      <li>
        <p>Sub Item C</p>
      </li>
      <li>
        <p>Sub Item D</p>
      </li>
    </ol>
  </li>
</ul>
```

> ⬇ The HTML structure of the new list node in `prosemirror-flat-list`.

```HTML
<div class="prosemirror-flat-list" data-list-type="bullet">
  <p>Item A</p>
</div>
<div class="prosemirror-flat-list" data-list-type="bullet">
  <p>Item B</p>
  <div class="prosemirror-flat-list" data-list-type="ordered">
    <p>Sub Item C</p>
  </div>
  <div class="prosemirror-flat-list" data-list-type="ordered">
    <p>Sub Item D</p>
  </div>
</div>
```

## Installation and Usage

- If you are using plain [ProseMirror], please check the document of [prosemirror-flat-list].
- If you are using [Remirror], please check the document of [remirror-extension-flat-list].

## Node Specs

The node type `list` has the following attributes.

- `type`:
  A string representing the type of the list node. It can be chose from the
  following values: `bullet`, `ordered`, `task` or `toggle`. Based on the
  `type` attribute, the list node will has different appearance and behavior.
  The default value is `bullet`.

  ![Node types](https://user-images.githubusercontent.com/24715727/216966304-c2f9a7f4-fc65-430c-91e8-2eb7aff956fa.png).

- `counter`:
  An optional number to determine the number of an ordered list node.

- `checked`:
  A boolean value to determine the checked state of the checkbox for a task
  list node.
- `collapsed`:
  A boolean value to determine the collapse state of a toggle list node.

## Features

### New list type

In addition of bullet and ordere list, this module adds other two kind of lists: `task` and `toggle`. Both of them can be interacted with the mouse.

![task-and-toggle](https://user-images.githubusercontent.com/24715727/216984786-b686a5fe-c9e3-47ae-8b06-6fbdb81200d2.gif)

### Accurate indent and dedent range

This module improves the indent and dedent commands (they are called `liftListItem` and `sinkListItem` in [prosemirror-schema-list]). These two commands now will try its best to only move selected part of the document.

> ⬇ Unselected paragraph (e.g. "A complex list") is also moved when using the old `sinkListItem` command in `prosemirror-schema-list`.

![old-dedent](https://user-images.githubusercontent.com/24715727/216982142-4fc89391-5dec-426b-bcfb-b0290920f08e.gif)

> ⬇ Only selected paragraph are moved when using the new `dedent` command in `prosemirror-flat-list`.

![new-dedent](https://user-images.githubusercontent.com/24715727/216982134-4e222d58-033c-4dbf-acfc-132d6264f524.gif)

### Arbitrary indentations

Since the first child of a list node can also be a list node, we can have multiple bullet points on one line. If we hide all the bullets except the last one in one line, we actually allow a list item to have arbitrary indentations.

![arbitrary indentation](https://user-images.githubusercontent.com/24715727/216973979-af271633-62a2-4744-a522-e87b89426f90.gif)

### Safe copy and paste

Despite that we no longer use HTML list tags (`<ul>`, `<ol>`, `<li>`) for rendering, this module still supports copy and paste with other programs using the HTML list tags.

### Input rules

This module provides the following input rules for creating list nodes.

- Type `- ` or `* ` to create a bullet list node.
- Type `1. ` to create an ordered list node.
- Type `[ ] ` or `[x] ` to create a task list node.
- Type `>> ` to create a toggle list node.

You can also use `wrappingListInputRule` to create you own input rules.

## Migration

`migrateDocJSON` accepts an ProseMirror document JSON object and returns an updated document JSON object. It will replace all the list nodes from [prosemirror-schema-list] or [@remirror/extension-list] with the new `list` node.

## License

MIT

[ProseMirror]: https://prosemirror.net/
[prosemirror-schema-list]: https://github.com/ProseMirror/prosemirror-schema-list
[@remirror/extension-list]: https://www.npmjs.com/package/@remirror/extension-list
[Remirror]: https://github.com/remirror/remirror
[prosemirror-flat-list]: https://github.com/ocavue/prosemirror-flat-list/tree/master/packages/prosemirror-package
[remirror-extension-flat-list]: https://github.com/ocavue/prosemirror-flat-list/tree/master/packages/remirror-package
