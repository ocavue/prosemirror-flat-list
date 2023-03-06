# Interface: ToggleCollapsedOptions

[prosemirror-flat-list](../modules/prosemirror_flat_list.md).ToggleCollapsedOptions

## Table of contents

### Properties

- [collapsed](prosemirror_flat_list.ToggleCollapsedOptions.md#collapsed)
- [isToggleable](prosemirror_flat_list.ToggleCollapsedOptions.md#istoggleable)

## Properties

### collapsed

• `Optional` **collapsed**: `boolean`

If this value exists, the command will set the `collapsed` attribute to
this value instead of toggle it.

___

### isToggleable

• `Optional` **isToggleable**: (`node`: [`Node`]( https://prosemirror.net/docs/ref/#model.Node )) => `boolean`

#### Type declaration

▸ (`node`): `boolean`

An optional function to accept a list node and return whether or not this
node can toggle its `collapsed` attribute.

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`]( https://prosemirror.net/docs/ref/#model.Node ) |

##### Returns

`boolean`
