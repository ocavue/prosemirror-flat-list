# remirror-extension-flat-list

## Classes

### ListExtension

A Remirror extension for creating lists. It's a simple wrapper around the API from `prosemirror-flat-list`.

#### Hierarchy

- [`NodeExtension`](https://remirror.io/docs/api/core/#class-nodeextension).**ListExtension**

#### Constructors

#### constructor()

> **new ListExtension**(...args: [options?: ConditionalPick\<EmptyShape, StaticAnnotation\> & Partial\<ConditionalPick\<PickPartial\<EmptyShape\>, StaticAnnotation\>\> & GetDynamic\<EmptyShape\> & BaseExtensionOptions]): [`ListExtension`](remirror-extension-flat-list.md#listextension)

##### Parameters

| Parameter | Type                                                                                                                                                                                      |
| :-------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ...args   | [options?: ConditionalPick\<EmptyShape, StaticAnnotation\> & Partial\<ConditionalPick\<PickPartial\<EmptyShape\>, StaticAnnotation\>\> & GetDynamic\<EmptyShape\> & BaseExtensionOptions] |

##### Returns

[`ListExtension`](remirror-extension-flat-list.md#listextension)

##### Inherited from

NodeExtension.constructor

#### Properties

##### disableExtraAttributes

> `static` **disableExtraAttributes**: `boolean` = `true`

###### Overrides

NodeExtension.disableExtraAttributes

#### Accessors

##### name

> get **name()**: "list"

###### Overrides

NodeExtension.name

#### Methods

##### createCommands()

> **createCommands**(): `object`

###### Returns

`object`

`readonly` **dedentList**: `Function`

####### Type declaration - dedentList

> (props?: [`DedentListOptions`](remirror-extension-flat-list.md#dedentlistoptions)): `CommandFunction`\<`object`\>

######## Parameters

| Parameter | Type                                                                     |
| :-------- | :----------------------------------------------------------------------- |
| props?    | [`DedentListOptions`](remirror-extension-flat-list.md#dedentlistoptions) |

######## Returns

`CommandFunction`\<`object`\>

`readonly` **indentList**: `Function`

####### Type declaration - indentList

> (props?: [`IndentListOptions`](remirror-extension-flat-list.md#indentlistoptions)): `CommandFunction`\<`object`\>

######## Parameters

| Parameter | Type                                                                     |
| :-------- | :----------------------------------------------------------------------- |
| props?    | [`IndentListOptions`](remirror-extension-flat-list.md#indentlistoptions) |

######## Returns

`CommandFunction`\<`object`\>

`readonly` **moveList**: `Function`

####### Type declaration - moveList

> (direction: "up" \| "down"): `CommandFunction`\<`object`\>

######## Parameters

| Parameter | Type           |
| :-------- | :------------- |
| direction | "up" \| "down" |

######## Returns

`CommandFunction`\<`object`\>

`readonly` **protectCollapsed**: `Function`

####### Type declaration - protectCollapsed

> (): `CommandFunction`\<`object`\>

######## Returns

`CommandFunction`\<`object`\>

`readonly` **splitList**: `Function`

####### Type declaration - splitList

> (): `CommandFunction`\<`object`\>

######## Returns

`CommandFunction`\<`object`\>

`readonly` **toggleCollapsed**: `Function`

####### Type declaration - toggleCollapsed

> (props?: [`ToggleCollapsedOptions`](remirror-extension-flat-list.md#togglecollapsedoptions)): `CommandFunction`\<`object`\>

######## Parameters

| Parameter | Type                                                                               |
| :-------- | :--------------------------------------------------------------------------------- |
| props?    | [`ToggleCollapsedOptions`](remirror-extension-flat-list.md#togglecollapsedoptions) |

######## Returns

`CommandFunction`\<`object`\>

`readonly` **wrapInList**: `Function`

####### Type declaration - wrapInList

> (getAttrs: [`ListAttributes`](remirror-extension-flat-list.md#listattributes) \| (`range`: [`NodeRange`](https://prosemirror.net/docs/ref/#model.NodeRange)) => `null` \| [`ListAttributes`](remirror-extension-flat-list.md#listattributes)): `CommandFunction`\<`object`\>

######## Parameters

| Parameter | Type                                                                                                                                                                                                                              |
| :-------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| getAttrs  | [`ListAttributes`](remirror-extension-flat-list.md#listattributes) \| (`range`: [`NodeRange`](https://prosemirror.net/docs/ref/#model.NodeRange)) => `null` \| [`ListAttributes`](remirror-extension-flat-list.md#listattributes) |

######## Returns

`CommandFunction`\<`object`\>

###### Overrides

NodeExtension.createCommands

##### createExternalPlugins()

> **createExternalPlugins**(): `ProsemirrorPlugin`[]

###### Returns

`ProsemirrorPlugin`[]

###### Overrides

NodeExtension.createExternalPlugins

##### createInputRules()

> **createInputRules**(): [`InputRule`](https://prosemirror.net/docs/ref/#inputrules.InputRule)[]

###### Returns

[`InputRule`](https://prosemirror.net/docs/ref/#inputrules.InputRule)[]

###### Overrides

NodeExtension.createInputRules

##### createKeymap()

> **createKeymap**(): `KeyBindings`

###### Returns

`KeyBindings`

###### Overrides

NodeExtension.createKeymap

##### createNodeSpec()

> **createNodeSpec**(): `NodeExtensionSpec`

###### Returns

`NodeExtensionSpec`

###### Overrides

NodeExtension.createNodeSpec

##### createTags()

> **createTags**(): "block"[]

###### Returns

"block"[]

###### Overrides

NodeExtension.createTags

---

## Interfaces

### DedentListOptions

#### Properties

##### from

> `optional` **from**: `number`

A optional from position to indent.

###### Default Value

`state.selection.from`

##### to

> `optional` **to**: `number`

A optional to position to indent.

###### Default Value

`state.selection.to`

---

### IndentListOptions

#### Properties

##### from

> `optional` **from**: `number`

A optional from position to indent.

###### Default Value

`state.selection.from`

##### to

> `optional` **to**: `number`

A optional to position to indent.

###### Default Value

`state.selection.to`

---

### ListAttributes

#### Properties

##### checked

> `optional` **checked**: `boolean`

##### collapsed

> `optional` **collapsed**: `boolean`

##### kind

> `optional` **kind**: [`ListKind`](remirror-extension-flat-list.md#listkind)

##### order

> `optional` **order**: `null` \| `number`

---

### ToggleCollapsedOptions

#### Properties

##### collapsed

> `optional` **collapsed**: `boolean`

If this value exists, the command will set the `collapsed` attribute to
this value instead of toggle it.

##### isToggleable

> `optional` **isToggleable**: `Function`

###### Type declaration

An optional function to accept a list node and return whether or not this
node can toggle its `collapsed` attribute.

> (node: [`Node`](https://prosemirror.net/docs/ref/#model.Node)): `boolean`

####### Parameters

| Parameter | Type                                                   |
| :-------- | :----------------------------------------------------- |
| node      | [`Node`](https://prosemirror.net/docs/ref/#model.Node) |

####### Returns

`boolean`

---

## Schema

### ListKind

> **ListKind**: "bullet" \| "ordered" \| "task" \| "toggle"

All default list node kinds.

---
