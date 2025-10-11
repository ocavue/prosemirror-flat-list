# remirror-extension-flat-list

## Classes

### ListExtension {#listextension}

A Remirror extension for creating lists. It's a simple wrapper around the API from `prosemirror-flat-list`.

#### Constructors

##### Constructor

<dl>

<dt>

<code data-typedoc-code>new <a id="constructor" href="#constructor">ListExtension</a>(...`args`: \[`ConditionalPick`\<`EmptyShape`, `StaticAnnotation`\> & [`Partial`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)\<`ConditionalPick`\<`PickPartial`\<`EmptyShape`\>, `StaticAnnotation`\>\> & `GetDynamic`\<`EmptyShape`\> & `BaseExtensionOptions`\]): [`ListExtension`](#listextension)</code>

</dt>

</dl>

#### Properties

| Property | Modifier | Type | Default value | Description | Overrides |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="disableextraattributes"></a> `disableExtraAttributes` | `static` | `boolean` | `true` | Whether to disable extra attributes for this extension. |  |

#### Accessors

<dl>

<dt>

<code data-typedoc-code>get <a id="name" href="#name">name</a>(): `"list"`</code>

</dt>

<dd>

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

</dd>

</dl>

#### Methods

<dl>

<dt>

<code data-typedoc-code><a id="createcommands" href="#createcommands">createCommands</a>(): \{
  `dedentList`: (`props?`: [`DedentListOptions`](#dedentlistoptions)) => `CommandFunction`\<`object`\>;
  `indentList`: (`props?`: [`IndentListOptions`](#indentlistoptions)) => `CommandFunction`\<`object`\>;
  `moveList`: (`direction`: `"up"` \| `"down"`) => `CommandFunction`\<`object`\>;
  `protectCollapsed`: () => `CommandFunction`\<`object`\>;
  `splitList`: () => `CommandFunction`\<`object`\>;
  `toggleCollapsed`: (`props?`: [`ToggleCollapsedOptions`](#togglecollapsedoptions)) => `CommandFunction`\<`object`\>;
  `toggleList`: (`attrs`: [`ListAttributes`](#listattributes)) => `CommandFunction`\<`object`\>;
  `unwrapList`: (`options?`: [`UnwrapListOptions`](prosemirror-flat-list.md#unwraplistoptions)) => `CommandFunction`\<`object`\>;
  `wrapInList`: (`getAttrs`: 
     \| [`ListAttributes`](#listattributes)
    \| (`range`: [`NodeRange`](https://prosemirror.net/docs/ref/#model.NodeRange)) => [`ListAttributes`](#listattributes) \| `null`) => `CommandFunction`\<`object`\>;
\}</code>

</dt>

<dd>

Create and register commands for that can be called within the editor.

These are typically used to create menu's actions and as a direct
response to user actions.

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

</dd>

</dl>

<dl>

<dt>

<code data-typedoc-code><a id="createexternalplugins" href="#createexternalplugins">createExternalPlugins</a>(): [`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)\<`any`\>[]</code>

</dt>

<dd>

Register third party plugins when this extension is placed into the
editor.

###### Remarks

Some plugins (like the table plugin) consume several different plugins,
creator method allows you to return a list of plugins you'd like to
support.

</dd>

</dl>

<dl>

<dt>

<code data-typedoc-code><a id="createinputrules" href="#createinputrules">createInputRules</a>(): [`InputRule`](https://prosemirror.net/docs/ref/#inputrules.InputRule)[]</code>

</dt>

<dd>

Register input rules which are activated if the regex matches as a user is
typing.

</dd>

</dl>

<dl>

<dt>

<code data-typedoc-code><a id="createkeymap" href="#createkeymap">createKeymap</a>(): `KeyBindings`</code>

</dt>

<dd>

Add keymap bindings for this extension.

</dd>

</dl>

<dl>

<dt>

<code data-typedoc-code><a id="createnodespec" href="#createnodespec">createNodeSpec</a>(): `NodeExtensionSpec`</code>

</dt>

<dd>

Provide a method for creating the schema. This is required in order to
create a `NodeExtension`.

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

</dd>

</dl>

<dl>

<dt>

<code data-typedoc-code><a id="createtags" href="#createtags">createTags</a>(): `"block"`[]</code>

</dt>

<dd>

Dynamically create tags for the extension.

Tags are a helpful tool for categorizing the behavior of an extension.
This behavior is later grouped in the `Manager` and passed to the
`extensionStore`. Tags can be used by commands that need to remove all
formatting and use the tag to identify which registered extensions are
formatters.

###### Remarks

Tags are also automatically added to the node and mark extensions as a
group when they are found there.

There are internally defined tags but it's also possible to define any
custom string as a tag. See [[`ExtensionTag`]].

</dd>

</dl>

## Commands

### DedentListOptions {#dedentlistoptions}

#### Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| <a id="from"></a> `from?` | `number` | `state.selection.from` | A optional from position to indent. |
| <a id="to"></a> `to?` | `number` | `state.selection.to` | A optional to position to indent. |

***

### IndentListOptions {#indentlistoptions}

#### Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| <a id="from-1"></a> `from?` | `number` | `state.selection.from` | A optional from position to indent. |
| <a id="to-1"></a> `to?` | `number` | `state.selection.to` | A optional to position to indent. |

***

### ToggleCollapsedOptions {#togglecollapsedoptions}

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="collapsed-1"></a> `collapsed?` | `boolean` | If this value exists, the command will set the `collapsed` attribute to this value instead of toggle it. |
| <a id="istoggleable"></a> `isToggleable?` | (`node`: [`Node`](https://prosemirror.net/docs/ref/#model.Node)) => `boolean` | An optional function to accept a list node and return whether or not this node can toggle its `collapsed` attribute. |

## Schema

### ListAttributes {#listattributes}

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="checked"></a> `checked?` | `boolean` |
| <a id="collapsed"></a> `collapsed?` | `boolean` |
| <a id="kind"></a> `kind?` | `string` |
| <a id="order"></a> `order?` | `number` \| `null` |

***

### ListKind {#listkind}

<dl>

<dt>

<code data-typedoc-code>type <a id="listkind" href="#listkind">ListKind</a> = `"bullet"` \| `"ordered"` \| `"task"` \| `"toggle"`</code>

</dt>

<dd>

All default list node kinds.

</dd>

</dl>
