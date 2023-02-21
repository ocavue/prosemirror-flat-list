[prosemirror-flat-list-monorepo](../README.md) / [Modules](../modules.md) / [remirror-extension-flat-list](../modules/remirror_extension_flat_list.md) / ListExtension

# Class: ListExtension

[remirror-extension-flat-list](../modules/remirror_extension_flat_list.md).ListExtension

## Hierarchy

- `NodeExtension`

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
- [createNodeViews](remirror_extension_flat_list.ListExtension.md#createnodeviews)
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
| `dedentList` | () => `CommandFunction`<`object`\> |
| `indentList` | () => `CommandFunction`<`object`\> |
| `moveList` | (`direction`: ``"up"`` \| ``"down"``) => `CommandFunction`<`object`\> |
| `protectCollapsed` | () => `CommandFunction`<`object`\> |
| `splitList` | () => `CommandFunction`<`object`\> |
| `wrapInList` | (`getAttrs`: `ListAttributes` \| (`range`: `NodeRange`) => ``null`` \| `ListAttributes`) => `CommandFunction`<`object`\> |

#### Overrides

NodeExtension.createCommands

___

### createExternalPlugins

▸ **createExternalPlugins**(): `Plugin`<`any`\>[]

#### Returns

`Plugin`<`any`\>[]

#### Overrides

NodeExtension.createExternalPlugins

___

### createInputRules

▸ **createInputRules**(): `InputRule`[]

#### Returns

`InputRule`[]

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

### createNodeViews

▸ **createNodeViews**(): `NodeViewMethod`<`NodeView`\>

#### Returns

`NodeViewMethod`<`NodeView`\>

#### Overrides

NodeExtension.createNodeViews

___

### createTags

▸ **createTags**(): ``"block"``[]

#### Returns

``"block"``[]

#### Overrides

NodeExtension.createTags
