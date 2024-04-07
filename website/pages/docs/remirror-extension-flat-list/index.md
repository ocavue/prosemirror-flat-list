# remirror-extension-flat-list

## ListExtension

A Remirror extension for creating lists. It's a simple wrapper around the API from `prosemirror-flat-list`.

### Extends

- [`NodeExtension`]( https://remirror.io/docs/api/core/#class-nodeextension )

### Constructors

#### new ListExtension(args)

```ts
new ListExtension(...args: [ConditionalPick<EmptyShape, StaticAnnotation> & Partial<ConditionalPick<PickPartial<EmptyShape>, StaticAnnotation>> & GetDynamic<EmptyShape> & BaseExtensionOptions]): ListExtension
```

##### Parameters

| Parameter | Type |
| :------ | :------ |
| ...`args` | [`ConditionalPick`\<`EmptyShape`, `StaticAnnotation`\> & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<`ConditionalPick`\<`PickPartial`\<`EmptyShape`\>, `StaticAnnotation`\>\> & `GetDynamic`\<`EmptyShape`\> & `BaseExtensionOptions`] |

##### Returns

[`ListExtension`](index.md#listextension)

##### Inherited from

`NodeExtension.constructor`

### Properties

| Property | Modifier | Type | Overrides |
| :------ | :------ | :------ | :------ |
| `disableExtraAttributes` | `static` | `boolean` | `NodeExtension.disableExtraAttributes` |

### Accessors

#### name

```ts
get name(): "list"
```

##### Returns

`"list"`

### Methods

#### createCommands()

```ts
createCommands(): {
  dedentList: (props?: DedentListOptions) => CommandFunction<object>;
  indentList: (props?: IndentListOptions) => CommandFunction<object>;
  moveList: (direction: "up" | "down") => CommandFunction<object>;
  protectCollapsed: () => CommandFunction<object>;
  splitList: () => CommandFunction<object>;
  toggleCollapsed: (props?: ToggleCollapsedOptions) => CommandFunction<object>;
  toggleList: (attrs: ListAttributes) => CommandFunction<object>;
  unwrapList: (options?: UnwrapListOptions) => CommandFunction<object>;
  wrapInList: (getAttrs: ListAttributes | (range: NodeRange) => null | ListAttributes) => CommandFunction<object>;
}
```

##### Returns

```ts
{
  dedentList: (props?: DedentListOptions) => CommandFunction<object>;
  indentList: (props?: IndentListOptions) => CommandFunction<object>;
  moveList: (direction: "up" | "down") => CommandFunction<object>;
  protectCollapsed: () => CommandFunction<object>;
  splitList: () => CommandFunction<object>;
  toggleCollapsed: (props?: ToggleCollapsedOptions) => CommandFunction<object>;
  toggleList: (attrs: ListAttributes) => CommandFunction<object>;
  unwrapList: (options?: UnwrapListOptions) => CommandFunction<object>;
  wrapInList: (getAttrs: ListAttributes | (range: NodeRange) => null | ListAttributes) => CommandFunction<object>;
}
```

| Member | Type | Value |
| :------ | :------ | :------ |
| `dedentList` | (`props`?: [`DedentListOptions`](index.md#dedentlistoptions)) => `CommandFunction`\<`object`\> | - |
| `indentList` | (`props`?: [`IndentListOptions`](index.md#indentlistoptions)) => `CommandFunction`\<`object`\> | - |
| `moveList` | (`direction`: `"up"` \| `"down"`) => `CommandFunction`\<`object`\> | - |
| `protectCollapsed` | () => `CommandFunction`\<`object`\> | - |
| `splitList` | () => `CommandFunction`\<`object`\> | - |
| `toggleCollapsed` | (`props`?: [`ToggleCollapsedOptions`](index.md#togglecollapsedoptions)) => `CommandFunction`\<`object`\> | - |
| `toggleList` | (`attrs`: [`ListAttributes`](index.md#listattributes)) => `CommandFunction`\<`object`\> | - |
| `unwrapList` | (`options`?: [`UnwrapListOptions`](../prosemirror-flat-list/index.md#unwraplistoptions)) => `CommandFunction`\<`object`\> | - |
| `wrapInList` | (`getAttrs`: [`ListAttributes`](index.md#listattributes) \| (`range`: [`NodeRange`]( https://prosemirror.net/docs/ref/#model.NodeRange )) => `null` \| [`ListAttributes`](index.md#listattributes)) => `CommandFunction`\<`object`\> | - |

##### Overrides

`NodeExtension.createCommands`

#### createExternalPlugins()

```ts
createExternalPlugins(): ProsemirrorPlugin[]
```

##### Returns

`ProsemirrorPlugin`[]

##### Overrides

`NodeExtension.createExternalPlugins`

#### createInputRules()

```ts
createInputRules(): InputRule[]
```

##### Returns

[`InputRule`]( https://prosemirror.net/docs/ref/#inputrules.InputRule )[]

##### Overrides

`NodeExtension.createInputRules`

#### createKeymap()

```ts
createKeymap(): KeyBindings
```

##### Returns

`KeyBindings`

##### Overrides

`NodeExtension.createKeymap`

#### createNodeSpec()

```ts
createNodeSpec(): NodeExtensionSpec
```

##### Returns

`NodeExtensionSpec`

##### Overrides

`NodeExtension.createNodeSpec`

#### createTags()

```ts
createTags(): "block"[]
```

##### Returns

`"block"`[]

##### Overrides

`NodeExtension.createTags`

***

## DedentListOptions

### Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| `from?` | `number` | A optional from position to indent.<br /><br />**Default Value**<br />`state.selection.from` |
| `to?` | `number` | A optional to position to indent.<br /><br />**Default Value**<br />`state.selection.to` |

***

## IndentListOptions

### Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| `from?` | `number` | A optional from position to indent.<br /><br />**Default Value**<br />`state.selection.from` |
| `to?` | `number` | A optional to position to indent.<br /><br />**Default Value**<br />`state.selection.to` |

***

## ListAttributes

### Properties

| Property | Type |
| :------ | :------ |
| `checked?` | `boolean` |
| `collapsed?` | `boolean` |
| `kind?` | `string` |
| `order?` | `null` \| `number` |

***

## ToggleCollapsedOptions

### Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| `collapsed?` | `boolean` | If this value exists, the command will set the `collapsed` attribute to<br />this value instead of toggle it. |
| `isToggleable?` | (`node`: [`Node`]( https://prosemirror.net/docs/ref/#model.Node )) => `boolean` | An optional function to accept a list node and return whether or not this<br />node can toggle its `collapsed` attribute. |

***

## ListKind

```ts
type ListKind: "bullet" | "ordered" | "task" | "toggle";
```

All default list node kinds.
