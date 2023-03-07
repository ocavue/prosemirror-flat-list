# ListExtension

[remirror-extension-flat-list](../modules/remirror_extension_flat_list.md).ListExtension

A Remirror extension for creating lists. It's a simple wrapper around the API from `prosemirror-flat-list`.

## Hierarchy

- [`NodeExtension`]( https://remirror.io/docs/api/core/#class-nodeextension )

  ↳ **`ListExtension`**

## Table of contents

### Constructors

- [constructor](remirror_extension_flat_list.ListExtension.md#constructor)

### Properties

- [disableExtraAttributes](remirror_extension_flat_list.ListExtension.md#disableextraattributes)

### Accessors

- [name](remirror_extension_flat_list.ListExtension.md#name)

### Methods

- [createCommands](remirror_extension_flat_list.ListExtension.md#createcommands)
- [createExternalPlugins](remirror_extension_flat_list.ListExtension.md#createexternalplugins)
- [createInputRules](remirror_extension_flat_list.ListExtension.md#createinputrules)
- [createKeymap](remirror_extension_flat_list.ListExtension.md#createkeymap)
- [createNodeSpec](remirror_extension_flat_list.ListExtension.md#createnodespec)
- [createTags](remirror_extension_flat_list.ListExtension.md#createtags)

## Constructors

### constructor

• **new ListExtension**(`...args`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [options?: ConditionalPick<EmptyShape, StaticAnnotation\> & Partial<ConditionalPick<PickPartial<EmptyShape\>, StaticAnnotation\>\> & GetDynamic<EmptyShape\> & BaseExtensionOptions] |

#### Inherited from

NodeExtension.constructor

## Properties

### disableExtraAttributes

▪ `Static` **disableExtraAttributes**: `boolean` = `true`

#### Overrides

NodeExtension.disableExtraAttributes

## Accessors

### name

• `get` **name**(): ``"list"``

#### Returns

``"list"``

#### Overrides

NodeExtension.name

## Methods

### createCommands

▸ **createCommands**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `dedentList` | (`props?`: [`DedentListOptions`](../interfaces/remirror_extension_flat_list.DedentListOptions.md)) => `CommandFunction`<`object`\> |
| `indentList` | (`props?`: [`IndentListOptions`](../interfaces/remirror_extension_flat_list.IndentListOptions.md)) => `CommandFunction`<`object`\> |
| `moveList` | (`direction`: ``"up"`` \| ``"down"``) => `CommandFunction`<`object`\> |
| `protectCollapsed` | () => `CommandFunction`<`object`\> |
| `splitList` | () => `CommandFunction`<`object`\> |
| `toggleCollapsed` | (`props?`: [`ToggleCollapsedOptions`](../interfaces/remirror_extension_flat_list.ToggleCollapsedOptions.md)) => `CommandFunction`<`object`\> |
| `wrapInList` | (`getAttrs`: [`ListAttributes`](../interfaces/remirror_extension_flat_list.ListAttributes.md) \| (`range`: [`NodeRange`]( https://prosemirror.net/docs/ref/#model.NodeRange )) => ``null`` \| [`ListAttributes`](../interfaces/remirror_extension_flat_list.ListAttributes.md)) => `CommandFunction`<`object`\> |

#### Overrides

NodeExtension.createCommands

___

### createExternalPlugins

▸ **createExternalPlugins**(): [`Plugin`]( https://prosemirror.net/docs/ref/#state.Plugin )<`any`\>[]

#### Returns

[`Plugin`]( https://prosemirror.net/docs/ref/#state.Plugin )<`any`\>[]

#### Overrides

NodeExtension.createExternalPlugins

___

### createInputRules

▸ **createInputRules**(): [`InputRule`]( https://prosemirror.net/docs/ref/#inputrules.InputRule )[]

#### Returns

[`InputRule`]( https://prosemirror.net/docs/ref/#inputrules.InputRule )[]

#### Overrides

NodeExtension.createInputRules

___

### createKeymap

▸ **createKeymap**(): `KeyBindings`

#### Returns

`KeyBindings`

#### Overrides

NodeExtension.createKeymap

___

### createNodeSpec

▸ **createNodeSpec**(): `NodeExtensionSpec`

#### Returns

`NodeExtensionSpec`

#### Overrides

NodeExtension.createNodeSpec

___

### createTags

▸ **createTags**(): ``"block"``[]

#### Returns

``"block"``[]

#### Overrides

NodeExtension.createTags
