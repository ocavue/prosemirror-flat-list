# remirror-extension-flat-list

## Modules

- [ListExtension](index.md#listextension)

## Classes

### ListExtension

A Remirror extension for creating lists. It's a simple wrapper around the API from `prosemirror-flat-list`.

#### Constructors

##### constructor()

> **new ListExtension**(...`args`): [`ListExtension`](index.md#listextension)

###### Parameters

| Parameter | Type                                                                                                                                                                                                            |
| :-------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ...`args` | [`ConditionalPick`\< `EmptyShape`, `StaticAnnotation` \> & `Partial`\< `ConditionalPick`\< `PickPartial`\< `EmptyShape` \>, `StaticAnnotation` \> \> & `GetDynamic`\< `EmptyShape` \> & `BaseExtensionOptions`] |

###### Returns

[`ListExtension`](index.md#listextension)

###### Inherited from

NodeExtension.constructor

#### Properties

| Property                          | Type      |
| :-------------------------------- | :-------- |
| `static` `disableExtraAttributes` | `boolean` |

#### Accessors

##### name

> `get` name(): `"list"`

###### Overrides

NodeExtension.name

#### Methods

##### createCommands()

> **createCommands**(): `object`

###### Returns

| Member                        | Type                                             |
| :---------------------------- | :----------------------------------------------- |
| `readonly` `dedentList`       | (`props`?) => `CommandFunction`\< `object` \>    |
| `readonly` `indentList`       | (`props`?) => `CommandFunction`\< `object` \>    |
| `readonly` `moveList`         | (`direction`) => `CommandFunction`\< `object` \> |
| `readonly` `protectCollapsed` | () => `CommandFunction`\< `object` \>            |
| `readonly` `splitList`        | () => `CommandFunction`\< `object` \>            |
| `readonly` `toggleCollapsed`  | (`props`?) => `CommandFunction`\< `object` \>    |
| `readonly` `wrapInList`       | (`getAttrs`) => `CommandFunction`\< `object` \>  |

###### Overrides

NodeExtension.createCommands

---

##### createExternalPlugins()

> **createExternalPlugins**(): `ProsemirrorPlugin`[]

###### Returns

`ProsemirrorPlugin`[]

###### Overrides

NodeExtension.createExternalPlugins

---

##### createInputRules()

> **createInputRules**(): [`InputRule`](https://prosemirror.net/docs/ref/#inputrules.InputRule)[]

###### Returns

[`InputRule`](https://prosemirror.net/docs/ref/#inputrules.InputRule)[]

###### Overrides

NodeExtension.createInputRules

---

##### createKeymap()

> **createKeymap**(): `KeyBindings`

###### Returns

`KeyBindings`

###### Overrides

NodeExtension.createKeymap

---

##### createNodeSpec()

> **createNodeSpec**(): `NodeExtensionSpec`

###### Returns

`NodeExtensionSpec`

###### Overrides

NodeExtension.createNodeSpec

---

##### createTags()

> **createTags**(): `"block"`[]

###### Returns

`"block"`[]

###### Overrides

NodeExtension.createTags

## Interfaces

### DedentListOptions

#### Properties

| Property | Type     | Description                                                                                        |
| :------- | :------- | :------------------------------------------------------------------------------------------------- |
| `from`?  | `number` | A optional from position to indent.<br /><br />**Default Value**<br /><br />`state.selection.from` |
| `to`?    | `number` | A optional to position to indent.<br /><br />**Default Value**<br /><br />`state.selection.to`     |

---

### IndentListOptions

#### Properties

| Property | Type     | Description                                                                                        |
| :------- | :------- | :------------------------------------------------------------------------------------------------- |
| `from`?  | `number` | A optional from position to indent.<br /><br />**Default Value**<br /><br />`state.selection.from` |
| `to`?    | `number` | A optional to position to indent.<br /><br />**Default Value**<br /><br />`state.selection.to`     |

---

### ListAttributes

#### Properties

| Property     | Type                            |
| :----------- | :------------------------------ |
| `checked`?   | `boolean`                       |
| `collapsed`? | `boolean`                       |
| `kind`?      | [`ListKind`](index.md#listkind) |
| `order`?     | `null` \| `number`              |

---

### ToggleCollapsedOptions

#### Properties

| Property        | Type                  | Description                                                                                                               |
| :-------------- | :-------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| `collapsed`?    | `boolean`             | If this value exists, the command will set the `collapsed` attribute to<br />this value instead of toggle it.             |
| `isToggleable`? | (`node`) => `boolean` | An optional function to accept a list node and return whether or not this<br />node can toggle its `collapsed` attribute. |

## Schema

### ListKind

> **ListKind**: `"bullet"` \| `"ordered"` \| `"task"` \| `"toggle"`

All default list node kinds.

---

Generated using [TypeDoc](https://typedoc.org/) and [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown)
