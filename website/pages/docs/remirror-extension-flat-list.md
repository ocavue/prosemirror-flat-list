# remirror-extension-flat-list

## Classes

### ListExtension

A Remirror extension for creating lists. It's a simple wrapper around the API from `prosemirror-flat-list`.

#### Extends

- [`NodeExtension`](https://remirror.io/docs/api/core/#class-nodeextension)

#### Constructors

##### Constructor

```ts
new ListExtension(...args: [ConditionalPick<EmptyShape, StaticAnnotation> & Partial<ConditionalPick<PickPartial<EmptyShape>, StaticAnnotation>> & GetDynamic<EmptyShape> & BaseExtensionOptions]): ListExtension;
```

###### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | \[`ConditionalPick`\<`EmptyShape`, `StaticAnnotation`\> & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<`ConditionalPick`\<`PickPartial`\<`EmptyShape`\>, `StaticAnnotation`\>\> & `GetDynamic`\<`EmptyShape`\> & `BaseExtensionOptions`\] |

###### Returns

[`ListExtension`](#listextension)

###### Inherited from

```ts
NodeExtension.constructor
```

#### Properties

| Property | Modifier | Type | Default value | Description | Overrides |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="disableextraattributes"></a> `disableExtraAttributes` | `static` | `boolean` | `true` | Whether to disable extra attributes for this extension. | `NodeExtension.disableExtraAttributes` |

#### Accessors

##### name

###### Get Signature

```ts
get name(): "list";
```

The unique name of this extension.

###### Remarks

Every extension **must** have a name. The name should have a distinct type
to allow for better type inference for end users. By convention the name
should be `camelCased` and unique within your editor instance.

```ts
class SimpleExtension extends Extension {
  get name() {
    return 'simple' as const;
  }
}
```

###### Returns

`"list"`

###### Overrides

```ts
NodeExtension.name
```

#### Methods

##### createCommands()

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
  wrapInList: (getAttrs: 
     | ListAttributes
    | (range: NodeRange) => null | ListAttributes) => CommandFunction<object>;
};
```

Create and register commands for that can be called within the editor.

These are typically used to create menu's actions and as a direct
response to user actions.

###### Returns

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
  wrapInList: (getAttrs: 
     | ListAttributes
    | (range: NodeRange) => null | ListAttributes) => CommandFunction<object>;
}
```

| Name | Type |
| ------ | ------ |
| `dedentList()` | (`props?`: [`DedentListOptions`](#dedentlistoptions)) => `CommandFunction`\<`object`\> |
| `indentList()` | (`props?`: [`IndentListOptions`](#indentlistoptions)) => `CommandFunction`\<`object`\> |
| `moveList()` | (`direction`: `"up"` \| `"down"`) => `CommandFunction`\<`object`\> |
| `protectCollapsed()` | () => `CommandFunction`\<`object`\> |
| `splitList()` | () => `CommandFunction`\<`object`\> |
| `toggleCollapsed()` | (`props?`: [`ToggleCollapsedOptions`](#togglecollapsedoptions)) => `CommandFunction`\<`object`\> |
| `toggleList()` | (`attrs`: [`ListAttributes`](#listattributes)) => `CommandFunction`\<`object`\> |
| `unwrapList()` | (`options?`: [`UnwrapListOptions`](prosemirror-flat-list.md#unwraplistoptions)) => `CommandFunction`\<`object`\> |
| `wrapInList()` | (`getAttrs`: \| [`ListAttributes`](#listattributes) \| (`range`: [`NodeRange`](https://prosemirror.net/docs/ref/#model.NodeRange)) => `null` \| [`ListAttributes`](#listattributes)) => `CommandFunction`\<`object`\> |

###### Remarks

The `createCommands` method should return an object with each key being
unique within the editor. To ensure that this is the case it is
recommended that the keys of the command are namespaced with the name
of the extension.

```ts
import { ExtensionFactory } from '@remirror/core';

const MyExtension = ExtensionFactory.plain({
  name: 'myExtension',
  version: '1.0.0',
  createCommands() {
    return {
      haveFun() {
        return ({ state, dispatch }) => {
          if (dispatch) {
            dispatch(tr.insertText('Have fun!'));
          }

          return true; // True return signifies that this command is enabled.
        }
      },
    }
  }
})
```

The actions available in this case would be `undoHistory` and
`redoHistory`. It is unlikely that any other extension would override
these commands.

Another benefit of commands is that they are picked up by typescript
and can provide code completion for consumers of the extension.

###### Overrides

```ts
NodeExtension.createCommands
```

##### createExternalPlugins()

```ts
createExternalPlugins(): Plugin<any>[];
```

Register third party plugins when this extension is placed into the
editor.

###### Returns

[`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)\<`any`\>[]

###### Remarks

Some plugins (like the table plugin) consume several different plugins,
creator method allows you to return a list of plugins you'd like to
support.

###### Overrides

```ts
NodeExtension.createExternalPlugins
```

##### createInputRules()

```ts
createInputRules(): InputRule[];
```

Register input rules which are activated if the regex matches as a user is
typing.

###### Returns

[`InputRule`](https://prosemirror.net/docs/ref/#inputrules.InputRule)[]

###### Overrides

```ts
NodeExtension.createInputRules
```

##### createKeymap()

```ts
createKeymap(): KeyBindings;
```

Add keymap bindings for this extension.

###### Returns

`KeyBindings`

###### Overrides

```ts
NodeExtension.createKeymap
```

##### createNodeSpec()

```ts
createNodeSpec(): NodeExtensionSpec;
```

Provide a method for creating the schema. This is required in order to
create a `NodeExtension`.

###### Returns

`NodeExtensionSpec`

###### Remarks

A node schema defines the behavior of the content within the editor. This
is very tied to the prosemirror implementation and the best place to learn
more about it is in the
[docs](https://prosemirror.net/docs/guide/#schema).

###### Params

hole - a method that is meant to indicate where extra attributes
should be placed (if they exist).

The `hole` is a function that augments the passed object adding a special
`secret` key which is used to insert the extra attributes setter.

```ts
import { NodeExtension, SpecHole } from 'remirror';

class AwesomeExtension extends NodeExtension {
  get name() { return 'awesome' as const'; }

  createNodeSpec() {
    return {
      toDOM: (node) => {
        return ['p', hole(), 0]
      }
    }
  }
}
```

The above example will have the `hole()` method call replaced with the
extra attributes.

###### Overrides

```ts
NodeExtension.createNodeSpec
```

##### createTags()

```ts
createTags(): "block"[];
```

Dynamically create tags for the extension.

Tags are a helpful tool for categorizing the behavior of an extension.
This behavior is later grouped in the `Manager` and passed to the
`extensionStore`. Tags can be used by commands that need to remove all
formatting and use the tag to identify which registered extensions are
formatters.

###### Returns

`"block"`[]

###### Remarks

Tags are also automatically added to the node and mark extensions as a
group when they are found there.

There are internally defined tags but it's also possible to define any
custom string as a tag. See [[`ExtensionTag`]].

###### Overrides

```ts
NodeExtension.createTags
```

## Commands

### DedentListOptions

#### Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| <a id="from"></a> `from?` | `number` | `state.selection.from` | A optional from position to indent. |
| <a id="to"></a> `to?` | `number` | `state.selection.to` | A optional to position to indent. |

***

### IndentListOptions

#### Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| <a id="from-1"></a> `from?` | `number` | `state.selection.from` | A optional from position to indent. |
| <a id="to-1"></a> `to?` | `number` | `state.selection.to` | A optional to position to indent. |

***

### ToggleCollapsedOptions

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="collapsed-1"></a> `collapsed?` | `boolean` | If this value exists, the command will set the `collapsed` attribute to this value instead of toggle it. |
| <a id="istoggleable"></a> `isToggleable?` | (`node`: [`Node`](https://prosemirror.net/docs/ref/#model.Node)) => `boolean` | An optional function to accept a list node and return whether or not this node can toggle its `collapsed` attribute. |

## Schema

### ListAttributes

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="checked"></a> `checked?` | `boolean` |
| <a id="collapsed"></a> `collapsed?` | `boolean` |
| <a id="kind"></a> `kind?` | `string` |
| <a id="order"></a> `order?` | `null` \| `number` |

***

### ListKind

```ts
type ListKind = "bullet" | "ordered" | "task" | "toggle";
```

All default list node kinds.
