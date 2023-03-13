# remirror-extension-flat-list

## Classes

### ListExtension

A Remirror extension for creating lists. It's a simple wrapper around the API from `prosemirror-flat-list`.

#### Hierarchy

- [`NodeExtension`]( https://remirror.io/docs/api/core/#class-nodeextension ).**ListExtension**

#### Constructors

#### constructor()

##### Signature

```ts
new ListExtension(...args: [options?: ConditionalPick<EmptyShape, StaticAnnotation> & Partial<ConditionalPick<PickPartial<EmptyShape>, StaticAnnotation>> & GetDynamic<EmptyShape> & BaseExtensionOptions]): ListExtension;
```

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [`options?: ConditionalPick<EmptyShape, StaticAnnotation> & Partial<ConditionalPick<PickPartial<EmptyShape>, StaticAnnotation>> & GetDynamic<EmptyShape> & BaseExtensionOptions`] |

##### Returns

[`ListExtension`](remirror_extension_flat_list.md#listextension)

Inherited from: NodeExtension.constructor

#### Properties

##### disableExtraAttributes

> **`Static`** `boolean`  = `true`

Overrides: NodeExtension.disableExtraAttributes

#### Accessors

##### name

###### Signature

```ts
name(): "list";
```

###### Returns

`"list"`

Overrides: NodeExtension.name

Overrides: NodeExtension.name

#### Methods

##### createCommands()

###### Signature

```ts
createCommands(): object;
```

###### Returns

`object`

| Member | Type |
| :------ | :------ |
| `dedentList` | (`props?`: [`DedentListOptions`](remirror_extension_flat_list.md#dedentlistoptions)) => `CommandFunction`\<`object`\> |
| `indentList` | (`props?`: [`IndentListOptions`](remirror_extension_flat_list.md#indentlistoptions)) => `CommandFunction`\<`object`\> |
| `moveList` | (`direction`: `"up"` \| `"down"`) => `CommandFunction`\<`object`\> |
| `protectCollapsed` | () => `CommandFunction`\<`object`\> |
| `splitList` | () => `CommandFunction`\<`object`\> |
| `toggleCollapsed` | (`props?`: [`ToggleCollapsedOptions`](remirror_extension_flat_list.md#togglecollapsedoptions)) => `CommandFunction`\<`object`\> |
| `wrapInList` | (`getAttrs`: [`ListAttributes`](remirror_extension_flat_list.md#listattributes) \| (`range`: [`NodeRange`]( https://prosemirror.net/docs/ref/#model.NodeRange )) => `null` \| [`ListAttributes`](remirror_extension_flat_list.md#listattributes)) => `CommandFunction`\<`object`\> |

Overrides: NodeExtension.createCommands

##### createExternalPlugins()

###### Signature

```ts
createExternalPlugins(): Plugin<any>[];
```

###### Returns

[`Plugin`]( https://prosemirror.net/docs/ref/#state.Plugin )\<`any`\>[]

Overrides: NodeExtension.createExternalPlugins

##### createInputRules()

###### Signature

```ts
createInputRules(): InputRule[];
```

###### Returns

[`InputRule`]( https://prosemirror.net/docs/ref/#inputrules.InputRule )[]

Overrides: NodeExtension.createInputRules

##### createKeymap()

###### Signature

```ts
createKeymap(): KeyBindings;
```

###### Returns

`KeyBindings`

Overrides: NodeExtension.createKeymap

##### createNodeSpec()

###### Signature

```ts
createNodeSpec(): NodeExtensionSpec;
```

###### Returns

`NodeExtensionSpec`

Overrides: NodeExtension.createNodeSpec

##### createTags()

###### Signature

```ts
createTags(): "block"[];
```

###### Returns

`"block"`[]

Overrides: NodeExtension.createTags

## Interfaces

### DedentListOptions

#### Properties

##### from?

> `number`

A optional from position to indent.

###### Default Value

`state.selection.from`

##### to?

> `number`

A optional to position to indent.

###### Default Value

`state.selection.to`

---

### IndentListOptions

#### Properties

##### from?

> `number`

A optional from position to indent.

###### Default Value

`state.selection.from`

##### to?

> `number`

A optional to position to indent.

###### Default Value

`state.selection.to`

---

### ListAttributes

#### Properties

##### checked?

> `boolean`

##### collapsed?

> `boolean`

##### kind?

> [`ListKind`](remirror_extension_flat_list.md#listkind)

##### order?

> `null` \| `number`

---

### ToggleCollapsedOptions

#### Properties

##### collapsed?

> `boolean`

If this value exists, the command will set the `collapsed` attribute to
this value instead of toggle it.

##### isToggleable?

> `Function`

###### Type declaration

An optional function to accept a list node and return whether or not this
node can toggle its `collapsed` attribute.

####### Signature

```ts
(node: Node): boolean;
```

####### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`]( https://prosemirror.net/docs/ref/#model.Node ) |

####### Returns

`boolean`

## Schema

### ListKind

> `"bullet"` \| `"ordered"` \| `"task"` \| `"toggle"`

All default list node kinds.
