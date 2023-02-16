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

- [classNames](remirror_extension_flat_list.ListExtension.md#classnames)
- [constructor](remirror_extension_flat_list.ListExtension.md#constructor-1)
- [decoratedCommands](remirror_extension_flat_list.ListExtension.md#decoratedcommands)
- [decoratedHelpers](remirror_extension_flat_list.ListExtension.md#decoratedhelpers)
- [decoratedKeybindings](remirror_extension_flat_list.ListExtension.md#decoratedkeybindings)
- [externalPlugins](remirror_extension_flat_list.ListExtension.md#externalplugins)
- [getPluginState](remirror_extension_flat_list.ListExtension.md#getpluginstate)
- [onAddCustomHandler](remirror_extension_flat_list.ListExtension.md#onaddcustomhandler)
- [plugin](remirror_extension_flat_list.ListExtension.md#plugin)
- [pluginKey](remirror_extension_flat_list.ListExtension.md#pluginkey)
- [requiredExtensions](remirror_extension_flat_list.ListExtension.md#requiredextensions)
- [spec](remirror_extension_flat_list.ListExtension.md#spec)
- [tags](remirror_extension_flat_list.ListExtension.md#tags)
- [~C](remirror_extension_flat_list.ListExtension.md#~c)
- [~E](remirror_extension_flat_list.ListExtension.md#~e)
- [~H](remirror_extension_flat_list.ListExtension.md#~h)
- [~O](remirror_extension_flat_list.ListExtension.md#~o)
- [customHandlerKeys](remirror_extension_flat_list.ListExtension.md#customhandlerkeys)
- [defaultOptions](remirror_extension_flat_list.ListExtension.md#defaultoptions)
- [defaultPriority](remirror_extension_flat_list.ListExtension.md#defaultpriority)
- [disableExtraAttributes](remirror_extension_flat_list.ListExtension.md#disableextraattributes)
- [handlerKeyOptions](remirror_extension_flat_list.ListExtension.md#handlerkeyoptions)
- [handlerKeys](remirror_extension_flat_list.ListExtension.md#handlerkeys)
- [staticKeys](remirror_extension_flat_list.ListExtension.md#statickeys)

### Accessors

- [[\_\_\_INTERNAL\_REMIRROR\_IDENTIFIER\_KEY\_\_]](remirror_extension_flat_list.ListExtension.md#[___internal_remirror_identifier_key__])
- [constructorName](remirror_extension_flat_list.ListExtension.md#constructorname)
- [dynamicKeys](remirror_extension_flat_list.ListExtension.md#dynamickeys)
- [extensions](remirror_extension_flat_list.ListExtension.md#extensions)
- [initialOptions](remirror_extension_flat_list.ListExtension.md#initialoptions)
- [name](remirror_extension_flat_list.ListExtension.md#name)
- [options](remirror_extension_flat_list.ListExtension.md#options)
- [priority](remirror_extension_flat_list.ListExtension.md#priority)
- [store](remirror_extension_flat_list.ListExtension.md#store)
- [type](remirror_extension_flat_list.ListExtension.md#type)
- [[\_\_\_INTERNAL\_REMIRROR\_IDENTIFIER\_KEY\_\_]](remirror_extension_flat_list.ListExtension.md#[___internal_remirror_identifier_key__]-1)

### Lifecycle Methods Methods

- [onAppendTransaction](remirror_extension_flat_list.ListExtension.md#onappendtransaction)
- [onApplyState](remirror_extension_flat_list.ListExtension.md#onapplystate)
- [onCreate](remirror_extension_flat_list.ListExtension.md#oncreate)
- [onDestroy](remirror_extension_flat_list.ListExtension.md#ondestroy)
- [onInitState](remirror_extension_flat_list.ListExtension.md#oninitstate)
- [onStateUpdate](remirror_extension_flat_list.ListExtension.md#onstateupdate)
- [onView](remirror_extension_flat_list.ListExtension.md#onview)

### Other Methods

- [addCustomHandler](remirror_extension_flat_list.ListExtension.md#addcustomhandler)
- [addHandler](remirror_extension_flat_list.ListExtension.md#addhandler)
- [clone](remirror_extension_flat_list.ListExtension.md#clone)
- [createAttributes](remirror_extension_flat_list.ListExtension.md#createattributes)
- [createCommands](remirror_extension_flat_list.ListExtension.md#createcommands)
- [createDecorations](remirror_extension_flat_list.ListExtension.md#createdecorations)
- [createEventHandlers](remirror_extension_flat_list.ListExtension.md#createeventhandlers)
- [createExtensions](remirror_extension_flat_list.ListExtension.md#createextensions)
- [createExternalPlugins](remirror_extension_flat_list.ListExtension.md#createexternalplugins)
- [createHelpers](remirror_extension_flat_list.ListExtension.md#createhelpers)
- [createInputRules](remirror_extension_flat_list.ListExtension.md#createinputrules)
- [createKeymap](remirror_extension_flat_list.ListExtension.md#createkeymap)
- [createNodeSpec](remirror_extension_flat_list.ListExtension.md#createnodespec)
- [createNodeViews](remirror_extension_flat_list.ListExtension.md#createnodeviews)
- [createPasteRules](remirror_extension_flat_list.ListExtension.md#createpasterules)
- [createPlugin](remirror_extension_flat_list.ListExtension.md#createplugin)
- [createSchemaAttributes](remirror_extension_flat_list.ListExtension.md#createschemaattributes)
- [createSuggesters](remirror_extension_flat_list.ListExtension.md#createsuggesters)
- [createTags](remirror_extension_flat_list.ListExtension.md#createtags)
- [getExtension](remirror_extension_flat_list.ListExtension.md#getextension)
- [hasHandlers](remirror_extension_flat_list.ListExtension.md#hashandlers)
- [init](remirror_extension_flat_list.ListExtension.md#init)
- [isOfType](remirror_extension_flat_list.ListExtension.md#isoftype)
- [onSetOptions](remirror_extension_flat_list.ListExtension.md#onsetoptions)
- [replaceChildExtension](remirror_extension_flat_list.ListExtension.md#replacechildextension)
- [resetOptions](remirror_extension_flat_list.ListExtension.md#resetoptions)
- [setOptions](remirror_extension_flat_list.ListExtension.md#setoptions)
- [setPriority](remirror_extension_flat_list.ListExtension.md#setpriority)
- [setStore](remirror_extension_flat_list.ListExtension.md#setstore)

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

### classNames

• `Optional` **classNames**: `ClassName`<`string`\>[]

A list of class names to add to the main editor element.

#### Inherited from

NodeExtension.classNames

___

### constructor

• **constructor**: `ExtensionConstructor`<`EmptyShape`\>

The type of the constructor for the extension.

#### Inherited from

NodeExtension.constructor

___

### decoratedCommands

• `Optional` **decoratedCommands**: `Record`<`string`, `CommandDecoratorOptions`<`Shape`\>\>

Stores all the command names for this decoration that have been added
as decorators to the extension instance. This is used by the
`CommandsExtension` to pick the commands and store meta data attached
to each command.

#### Inherited from

NodeExtension.decoratedCommands

___

### decoratedHelpers

• `Optional` **decoratedHelpers**: `Record`<`string`, `HelperDecoratorOptions`\>

Stores all the helpers that have been added via decorators to the
extension instance. This is used by the `HelpersExtension` to pick the
helpers.

#### Inherited from

NodeExtension.decoratedHelpers

___

### decoratedKeybindings

• `Optional` **decoratedKeybindings**: `Record`<`string`, `KeybindingDecoratorOptions`<`Shape`\>\>

Stores all the keybinding names and options for this decoration that
have been added as decorators to the extension instance. This is used
by the `KeymapExtension` to pick the commands and store metadata
attached to each command.

#### Inherited from

NodeExtension.decoratedKeybindings

___

### externalPlugins

• **externalPlugins**: `Plugin`<`any`\>[]

The external plugins created by the `createExternalPlugins` method.

#### Inherited from

NodeExtension.externalPlugins

___

### getPluginState

• **getPluginState**: <State\>(`state?`: `EditorState`) => `State`

#### Type declaration

▸ <`State`\>(`state?`): `State`

Retrieve the state of the custom plugin for this extension. This will
throw an error if the extension doesn't have a valid `createPlugin`
method.

**`Remarks`**

```ts
const pluginState = this.getPluginState();
```

This is only available after the initialize stage of the editor manager
lifecycle.

If you would like to use it before that e.g. in the decorations prop of
the `createPlugin` method, you can call it with a current state which
will be used to retrieve the plugin state.

Please note that when using this in the decorations callback it is
advisable to pass in the `state` argument in case the callback is
called before the framework, or the view have been initialized.

##### Type parameters

| Name |
| :------ |
| `State` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `state?` | `EditorState` |

##### Returns

`State`

#### Inherited from

NodeExtension.getPluginState

___

### onAddCustomHandler

• `Protected` `Optional` **onAddCustomHandler**: `AddCustomHandler`<`EmptyShape`\>

Override this method if you want to set custom handlers on your extension.

This must return a dispose function.

#### Inherited from

NodeExtension.onAddCustomHandler

___

### plugin

• **plugin**: `Plugin`<`any`\>

The plugin that was created by the `createPlugin` method. This only
exists for extension which implement that method.

#### Inherited from

NodeExtension.plugin

___

### pluginKey

• **pluginKey**: `PluginKey`<`any`\>

The plugin key for custom plugin created by this extension. This only
exists when there is a valid `createPlugin` method on the extension.

This can be used to set and retrieve metadata.

```ts
const meta = tr.getMeta(this.pluginKey);
```

#### Inherited from

NodeExtension.pluginKey

___

### requiredExtensions

• `Optional` **requiredExtensions**: `AnyExtensionConstructor`[]

An extension can declare the extensions it requires.

**`Remarks`**

When creating the extension manager the extension will be checked for
required extension as well as a quick check to see if the required
extension is already included. If not present a descriptive error will be
thrown.

#### Inherited from

NodeExtension.requiredExtensions

___

### spec

• **spec**: `NodeExtensionSpec`

Provides access to the `NodeExtensionSpec`.

#### Inherited from

NodeExtension.spec

___

### tags

• **tags**: `ExtensionTagType`[]

The generated tags for this extension are added here. Do not add this
property to your extensions as it will be overridden.

#### Inherited from

NodeExtension.tags

___

### ~C

• **~C**: `Object`

`ExtensionCommands`

This pseudo property makes it easier to infer Generic types of this
class.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `dedentList` | () => `CommandFunction`<`object`\> |
| `indentList` | () => `CommandFunction`<`object`\> |
| `moveList` | (`direction`: ``"up"`` \| ``"down"``) => `CommandFunction`<`object`\> |
| `protectCollapsed` | () => `CommandFunction`<`object`\> |
| `splitList` | () => `CommandFunction`<`object`\> |
| `wrapInList` | (`getAttrs`: [`ListAttributes`](../interfaces/remirror_extension_flat_list.ListAttributes.md) \| (`range`: `NodeRange`) => ``null`` \| [`ListAttributes`](../interfaces/remirror_extension_flat_list.ListAttributes.md)) => `CommandFunction`<`object`\> |

#### Inherited from

NodeExtension.~C

___

### ~E

• **~E**: `AnyExtension`

Not for usage. This is purely for types to make it easier to infer
available sub extension types.

#### Inherited from

NodeExtension.~E

___

### ~H

• **~H**: `EmptyShape`

`ExtensionHelpers`

This pseudo property makes it easier to infer Generic types of this
class.

#### Inherited from

NodeExtension.~H

___

### ~O

• **~O**: `EmptyShape` & `BaseExtensionOptions`

This is not for external use. It is purely here for TypeScript inference of
the generic `Options` type parameter.

#### Inherited from

NodeExtension.~O

___

### customHandlerKeys

▪ `Static` `Readonly` **customHandlerKeys**: `string`[]

The custom keys.

#### Inherited from

NodeExtension.customHandlerKeys

___

### defaultOptions

▪ `Static` `Readonly` **defaultOptions**: `any`

The default options for this extension.

TODO see if this can be cast to something other than any and allow
composition.

#### Inherited from

NodeExtension.defaultOptions

___

### defaultPriority

▪ `Static` `Readonly` **defaultPriority**: `ExtensionPriority`

The default priority for this family of extensions.

#### Inherited from

NodeExtension.defaultPriority

___

### disableExtraAttributes

▪ `Static` **disableExtraAttributes**: `boolean` = `true`

#### Overrides

NodeExtension.disableExtraAttributes

___

### handlerKeyOptions

▪ `Static` **handlerKeyOptions**: `Partial`<`Record`<`string`, `HandlerKeyOptions`<`any`, `any`[]\>\> & { `__ALL__?`: `HandlerKeyOptions`<`any`, `any`[]\>  }\>

Customize the way the handler should behave.

#### Inherited from

NodeExtension.handlerKeyOptions

___

### handlerKeys

▪ `Static` `Readonly` **handlerKeys**: `string`[]

The event handler keys.

#### Inherited from

NodeExtension.handlerKeys

___

### staticKeys

▪ `Static` `Readonly` **staticKeys**: `string`[]

The static keys for this class.

#### Inherited from

NodeExtension.staticKeys

## Accessors

### [\_\_\_INTERNAL\_REMIRROR\_IDENTIFIER\_KEY\_\_]

• `get` **[___INTERNAL_REMIRROR_IDENTIFIER_KEY__]**(): `NodeExtension`

#### Returns

`NodeExtension`

#### Inherited from

NodeExtension.\_\_@\_\_\_INTERNAL\_REMIRROR\_IDENTIFIER\_KEY\_\_@9848

___

### constructorName

• `get` **constructorName**(): `string`

The name that the constructor should have, which doesn't get mangled in
production.

#### Returns

`string`

#### Inherited from

NodeExtension.constructorName

___

### dynamicKeys

• `get` **dynamicKeys**(): `string`[]

Get the dynamic keys for this extension.

#### Returns

`string`[]

#### Inherited from

NodeExtension.dynamicKeys

___

### extensions

• `get` **extensions**(): `this`[``"~E"``][]

The list of extensions added to the editor by this `Preset`.

#### Returns

`this`[``"~E"``][]

#### Inherited from

NodeExtension.extensions

___

### initialOptions

• `get` **initialOptions**(): `RemoveAnnotations`<`Readonly`<`Required`<`Options`\>\> & `DefaultStaticOptions`\>

The options that this instance was created with, merged with all the
default options.

#### Returns

`RemoveAnnotations`<`Readonly`<`Required`<`Options`\>\> & `DefaultStaticOptions`\>

#### Inherited from

NodeExtension.initialOptions

___

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Overrides

NodeExtension.name

___

### options

• `get` **options**(): `RemoveAnnotations`<`Readonly`<`Required`<`Options`\>\> & `DefaultStaticOptions`\>

The options for this extension.

**`Remarks`**

Options are composed of Static, Dynamic, Handlers and ObjectHandlers.

- `Static` - set at instantiation by the constructor.
- `Dynamic` - optionally set at instantiation by the constructor and also
  set during the runtime.
- `Handlers` - can only be set during the runtime.
- `ObjectHandlers` - Can only be set during the runtime of the extension.

#### Returns

`RemoveAnnotations`<`Readonly`<`Required`<`Options`\>\> & `DefaultStaticOptions`\>

#### Inherited from

NodeExtension.options

___

### priority

• `get` **priority**(): `ExtensionPriority`

The priority level for this instance of the extension. A higher value
corresponds to a higher priority extension

#### Returns

`ExtensionPriority`

#### Inherited from

NodeExtension.priority

___

### store

• `Protected` `get` **store**(): `ExtensionStore`

The store is a shared object that's internal to each extension. It includes
often used items like the `view` and `schema` that are added by the
extension manager and also the lifecycle extension methods.

**NOTE** - The store is not available until the manager has been created
and received the extension. As a result trying to access the store during
`init` and `constructor` will result in a runtime error.

Some properties of the store are available at different phases. You should
check the inline documentation to know when a certain property is useable
in your extension.

#### Returns

`ExtensionStore`

#### Inherited from

NodeExtension.store

___

### type

• `get` **type**(): `NodeType`

Provides access to the node type from the schema.

#### Returns

`NodeType`

#### Inherited from

NodeExtension.type

___

### [\_\_\_INTERNAL\_REMIRROR\_IDENTIFIER\_KEY\_\_]

• `Static` `get` **[___INTERNAL_REMIRROR_IDENTIFIER_KEY__]**(): `NodeExtensionConstructor`

#### Returns

`NodeExtensionConstructor`

#### Inherited from

NodeExtension.\_\_@\_\_\_INTERNAL\_REMIRROR\_IDENTIFIER\_KEY\_\_@9848

## Lifecycle Methods Methods

### onAppendTransaction

▸ `Optional` **onAppendTransaction**(`props`): `void`

This can be used by the `Extension` to append a transaction to the latest
update.

This is shorthand for the `ProsemirrorPlugin.spec.appendTransaction`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `AppendLifecycleProps` |

#### Returns

`void`

#### Inherited from

NodeExtension.onAppendTransaction

___

### onApplyState

▸ `Optional` **onApplyState**(`props`): `void`

This is called when the state is being applied to the editor. This can be
used as a shorthand for the [[`Plugin.spec.state.apply`]] method.

For example, when using [[`createDecorations`]] you can respond to editor
updates within this callback.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `ApplyStateLifecycleProps` |

#### Returns

`void`

#### Inherited from

NodeExtension.onApplyState

___

### onCreate

▸ `Optional` **onCreate**(): `void` \| `Dispose`

This handler is called when the `RemirrorManager` is first created.

**`Remarks`**

Since it is called as soon as the manager is some methods may not be
available in the extension store. When accessing methods on `this.store` be
shore to check when they become available in the lifecycle.

You can return a `Dispose` function which will automatically be called when
the extension is destroyed.

This handler is called before the `onView` handler.

#### Returns

`void` \| `Dispose`

#### Inherited from

NodeExtension.onCreate

___

### onDestroy

▸ `Optional` **onDestroy**(): `void`

Called when the extension is being destroyed.

#### Returns

`void`

#### Inherited from

NodeExtension.onDestroy

___

### onInitState

▸ `Optional` **onInitState**(`state`): `void`

This is called when the prosemirror editor state is first attached to the
editor. It can be useful for doing some preparation work.

This is a shorthand for creating a plugin and adding the
[[`Plugin.spec.state.init`]].

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `Readonly`<`EditorState`\> |

#### Returns

`void`

#### Inherited from

NodeExtension.onInitState

___

### onStateUpdate

▸ `Optional` **onStateUpdate**(`props`): `void`

This handler is called after a transaction successfully updates the editor
state. It is called asynchronously after the [[`onApplyState`]] hook has
been run run.

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `StateUpdateLifecycleProps` |

#### Returns

`void`

#### Inherited from

NodeExtension.onStateUpdate

___

### onView

▸ `Optional` **onView**(`view`): `void` \| `Dispose`

This event happens when the view is first received from the view layer
(e.g. React).

Return a dispose function which will be called when the extension is
destroyed.

This handler is called after the `onCreate` handler.

#### Parameters

| Name | Type |
| :------ | :------ |
| `view` | [`EditorView`]( https://prosemirror.net/docs/ref/#view.EditorView ) |

#### Returns

`void` \| `Dispose`

#### Inherited from

NodeExtension.onView

___

## Other Methods

### addCustomHandler

▸ **addCustomHandler**<`Key`\>(`key`, `value`): `Dispose`

A method that can be used to add a custom handler. It is up to the
extension creator to manage the handlers and dispose methods.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Key` | extends `never` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Key` |
| `value` | `Required`<`GetCustomHandler`<`EmptyShape`\>\>[`Key`] |

#### Returns

`Dispose`

#### Inherited from

NodeExtension.addCustomHandler

___

### addHandler

▸ **addHandler**<`Key`\>(`key`, `method`, `priority?`): `Dispose`

Add a handler to the event handlers so that it is called along with all the
other handler methods.

This is helpful for integrating react hooks which can be used in multiple
places. The original problem with fixed properties is that you can only
assign to a method once and it overwrites any other methods. This pattern
for adding handlers allows for multiple usages of the same handler in the
most relevant part of the code.

More to come on this pattern.

**`Non Virtual`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Key` | extends `never` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Key` |
| `method` | `GetHandler`<`EmptyShape`\>[`Key`] |
| `priority?` | `ExtensionPriority` |

#### Returns

`Dispose`

#### Inherited from

NodeExtension.addHandler

___

### clone

▸ **clone**(`...args`): `Extension`<`EmptyShape`\>

Clone an extension.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [options?: ConditionalPick<EmptyShape, StaticAnnotation\> & Partial<ConditionalPick<PickPartial<EmptyShape\>, StaticAnnotation\>\> & GetDynamic<EmptyShape\> & BaseExtensionOptions] |

#### Returns

`Extension`<`EmptyShape`\>

#### Inherited from

NodeExtension.clone

___

### createAttributes

▸ `Optional` **createAttributes**(): `ProsemirrorAttributes`<`object`\>

Allows the extension to modify the attributes for the Prosemirror editor
dom element.

**`Remarks`**

Sometimes an extension will need to make a change to the attributes of the
editor itself. For example a placeholder may need to do some work to make
the editor more accessible by setting the `aria-placeholder` value to match
the value of the placeholder.

#### Returns

`ProsemirrorAttributes`<`object`\>

#### Inherited from

NodeExtension.createAttributes

___

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
| `wrapInList` | (`getAttrs`: [`ListAttributes`](../interfaces/remirror_extension_flat_list.ListAttributes.md) \| (`range`: `NodeRange`) => ``null`` \| [`ListAttributes`](../interfaces/remirror_extension_flat_list.ListAttributes.md)) => `CommandFunction`<`object`\> |

#### Overrides

NodeExtension.createCommands

___

### createDecorations

▸ `Optional` **createDecorations**(`state`): `DecorationSet`

Create a decoration set which adds decorations to your editor. The
first parameter is the `EditorState`.

This can be used in combination with the `onApplyState` handler which
can map the decoration.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `state` | `Readonly`<`EditorState`\> | the editor state which was passed in. |

#### Returns

`DecorationSet`

#### Inherited from

NodeExtension.createDecorations

___

### createEventHandlers

▸ `Optional` **createEventHandlers**(): `CreateEventHandlers`

Create a click handler for this extension. Returns a function which is
used as the click handler. The callback provided is handled via the
`Events` extension and comes with a helpers object
`ClickHandlerHelper`.

The returned function should return `true` if you want to prevent any
further click handlers from being handled.

#### Returns

`CreateEventHandlers`

#### Inherited from

NodeExtension.createEventHandlers

___

### createExtensions

▸ **createExtensions**(): `AnyExtension`[]

Create the extensions which will be consumed by the preset. Override this
if you would like to make your extension a parent to other (holder)
extensions which don't make sense existing outside of the context of this
extension.

**`Remarks`**

Since this method is called in the constructor it should always be created
as an instance method and not a property. Properties aren't available for
the call to the parent class.

```ts
class HolderExtension extends PlainExtension {
  get name() {
    return 'holder'
  }

  // GOOD ✅
  createExtensions() {
    return [];
  }

  // BAD ❌
  createExtensions = () => {
    return [];
  }
}
```

#### Returns

`AnyExtension`[]

#### Inherited from

NodeExtension.createExtensions

___

### createExternalPlugins

▸ **createExternalPlugins**(): `Plugin`<`any`\>[]

#### Returns

`Plugin`<`any`\>[]

#### Overrides

NodeExtension.createExternalPlugins

___

### createHelpers

▸ `Optional` **createHelpers**(): `ExtensionHelperReturn`

A helper method is a function that takes in arguments and returns a
value depicting the state of the editor specific to this extension.

**`Remarks`**

Unlike commands they can return anything and may not effect the
behavior of the editor.

Below is an example which should provide some idea on how to add
helpers to the app.

```tsx
// extension.ts
import { ExtensionFactory } from '@remirror/core';

const MyBeautifulExtension = ExtensionFactory.plain({
  name: 'beautiful',
  createHelpers: () => ({
    checkBeautyLevel: () => 100
  }),
})
```

```
// app.tsx
import { useRemirrorContext } from '@remirror/react';

const MyEditor = () => {
  const { helpers } = useRemirrorContext({ autoUpdate: true });

  return helpers.beautiful.checkBeautyLevel() > 50
    ? (<span>😍</span>)
    : (<span>😢</span>);
};
```

#### Returns

`ExtensionHelperReturn`

#### Inherited from

NodeExtension.createHelpers

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

### createPasteRules

▸ `Optional` **createPasteRules**(): `PasteRule` \| `PasteRule`[]

Register paste rules for this extension.

Paste rules are activated when text, images, or html is pasted into the
editor.

#### Returns

`PasteRule` \| `PasteRule`[]

#### Inherited from

NodeExtension.createPasteRules

___

### createPlugin

▸ `Optional` **createPlugin**(): `CreateExtensionPlugin`<`any`\>

Create a custom plugin directly in the editor.

**`Remarks`**

A unique `key` is automatically applied to enable easier retrieval of
the plugin state.

```ts
import { CreateExtensionPlugin } from 'remirror';

class MyExtension extends PlainExtension {
  get name() {
    return 'me' as const;
  }

  createPlugin(): CreateExtensionPlugin {
    return {
      props: {
        handleKeyDown: keydownHandler({
          Backspace: handler,
          'Mod-Backspace': handler,
          Delete: handler,
          'Mod-Delete': handler,
          'Ctrl-h': handler,
          'Alt-Backspace': handler,
          'Ctrl-d': handler,
          'Ctrl-Alt-Backspace': handler,
          'Alt-Delete': handler,
          'Alt-d': handler,
        }),
        decorations: state => {
          const pluginState = this.getPluginState(state);
          pluginState.setDeleted(false);
          return pluginState.decorationSet;
        },
      },
    }
  }
}
```

#### Returns

`CreateExtensionPlugin`<`any`\>

#### Inherited from

NodeExtension.createPlugin

___

### createSchemaAttributes

▸ `Optional` **createSchemaAttributes**(): `IdentifierSchemaAttributes`[]

Allows the extension to create an extra attributes array that will be
added to the extra attributes.

For example the `@remirror/extension-bidi` adds a `dir` attribute to
all node extensions which allows them to automatically infer whether
the text direction should be right-to-left, or left-to-right.

#### Returns

`IdentifierSchemaAttributes`[]

#### Inherited from

NodeExtension.createSchemaAttributes

___

### createSuggesters

▸ `Optional` **createSuggesters**(): `Suggester` \| `Suggester`[]

Create suggesters which respond to an activation `char` or regex
pattern within the editor instance. The onChange handler provided is
called with the data around the matching text.

**`Remarks`**

Suggesters are a  powerful way of building up the editors
functionality. They can support `@` mentions, `#` tagging, `/` special
command keys which trigger action menus and much more.

#### Returns

`Suggester` \| `Suggester`[]

#### Inherited from

NodeExtension.createSuggesters

___

### createTags

▸ **createTags**(): ``"block"``[]

#### Returns

``"block"``[]

#### Overrides

NodeExtension.createTags

___

### getExtension

▸ **getExtension**<`Type`\>(`Constructor`): `InstanceType`<`Type`\>

Get an extension from this holder extension by providing the desired
`Constructor`.

**`Remarks`**

This method will throw an error if the constructor doesn't exist within the
extension created by this extension.

It can be used to forward options and attach handlers to the children
extensions. It is the spiritual replacement of the `Preset` extension.

```ts
import { PlainExtension, OnSetOptionsProps } from 'remirror';

interface ParentOptions { weight?: string }

class ParentExtension extends PlainExtension<ParentOptions> {
  get name() {
    return 'parent' as const;
  }

  createExtensions() {
    return [new BoldExtension()]
  }

  onSetOptions(options: OnSetOptionsProps<ParentOptions>): void {
    if (options.changes.weight.changed) {
      // Update the value of the provided extension.
      this.getExtension(BoldExtension).setOption({ weight: options.changes.weight.value });
    }
  }
}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends `Function` & `Omit`<`ExtensionConstructor`<`any`\>, `never`\> & (...`args`: `any`[]) => `AnyExtension` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `Constructor` | `Type` | the extension constructor to find in the editor. |

#### Returns

`InstanceType`<`Type`\>

#### Inherited from

NodeExtension.getExtension

___

### hasHandlers

▸ **hasHandlers**<`Key`\>(`key`): `boolean`

Determines if handlers exist for the given key.

Checking the existence of a handler property directly gives wrong results.
`this.options.onHandlerName` is always truthy because it is a reference to
the wrapper function that calls each handler.

```ts

// GOOD ✅
if (!this.hasHandlers('onHandlerName')) {
  return;
}

// BAD ❌
if (!this.options.onHandlerName) {
  return;
}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Key` | extends `never` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `Key` | The handler to test |

#### Returns

`boolean`

#### Inherited from

NodeExtension.hasHandlers

___

### init

▸ `Protected` **init**(): `void`

This method is called by the extension constructor. It is not strictly a
lifecycle method since at this point the manager has not yet been
instantiated.

**`Remarks`**

It should be used instead of overriding the constructor which is strongly
advised against.

There are some limitations when using this method.

- Accessing `this.store` will throw an error since the manager hasn't been
  created and it hasn't yet been attached to the extensions.
- `this.type` in `NodeExtension` and `MarkExtension` will also throw an
  error since the schema hasn't been created yet.

You should use this to setup any instance properties with the options
provided to the extension.

#### Returns

`void`

#### Inherited from

NodeExtension.init

___

### isOfType

▸ **isOfType**<`Type`\>(`Constructor`): this is InstanceType<Type\>

Check if the type of this extension's constructor matches the type of the
provided constructor.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Type` | extends `AnyExtensionConstructor` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `Constructor` | `Type` |

#### Returns

this is InstanceType<Type\>

#### Inherited from

NodeExtension.isOfType

___

### onSetOptions

▸ `Protected` `Optional` **onSetOptions**(`props`): `void`

Override this to receive updates whenever the options have been updated on
this instance. This method is called after the updates have already been
applied to the instance. If you need more control over exactly how the
option should be applied you should set the option to be `Custom`.

**Please Note**:

This must be defined as a instance method and not a property since it is
called in the constructor.

```ts
class ThisPreset extends Preset {
  // GOOD ✅
  onSetOptions(props: OnSetOptionsProps<Options>) {}

   // BAD ❌
  onSetOptions = (props: OnSetOptionsProps<Options>) => {}
}
```

**`Abstract`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `OnSetOptionsProps`<`EmptyShape`\> |

#### Returns

`void`

#### Inherited from

NodeExtension.onSetOptions

___

### replaceChildExtension

▸ **replaceChildExtension**(`constructor`, `extension`): `void`

When there are duplicate extensions used within the editor the extension
manager will call this method and make sure all extension holders are using
the same instance of the `ExtensionConstructor`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `constructor` | `AnyExtensionConstructor` |
| `extension` | `AnyExtension` |

#### Returns

`void`

#### Inherited from

NodeExtension.replaceChildExtension

___

### resetOptions

▸ **resetOptions**(): `void`

Reset the extension properties to their default values.

**`Non Virtual`**

#### Returns

`void`

#### Inherited from

NodeExtension.resetOptions

___

### setOptions

▸ **setOptions**(`update`): `void`

Update the properties with the provided partial value when changed.

#### Parameters

| Name | Type |
| :------ | :------ |
| `update` | `Partial`<`GetDynamic`<`EmptyShape`\>\> |

#### Returns

`void`

#### Inherited from

NodeExtension.setOptions

___

### setPriority

▸ **setPriority**(`priority`): `void`

Set the priority override for this extension. This is used in the
`RemirrorManager` in order to override the priority of an extension.

If you set the first parameter to `undefined` it will remove the priority
override.

#### Parameters

| Name | Type |
| :------ | :------ |
| `priority` | `undefined` \| `ExtensionPriority` |

#### Returns

`void`

#### Inherited from

NodeExtension.setPriority

___

### setStore

▸ **setStore**(`store`): `void`

Pass a reference to the globally shared `ExtensionStore` for this
extension.

**`Remarks`**

The extension store allows extensions to access important variables without
complicating their creator methods.

```ts
import { PlainExtension } from 'remirror';

class Awesome extends PlainExtension {
  customMethod() {
    if (this.store.view.hasFocus()) {
      log('dance dance dance');
    }
  }
}
```

This should only be called by the `RemirrorManager`.

**`Non Virtual`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `store` | `ExtensionStore` |

#### Returns

`void`

#### Inherited from

NodeExtension.setStore
