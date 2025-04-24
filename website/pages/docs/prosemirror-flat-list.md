# prosemirror-flat-list

## Functions

### findListsRange()

```ts
function findListsRange($from: ResolvedPos, $to: ResolvedPos): null | NodeRange;
```

Returns a minimal block range that includes the given two positions and
represents one or multiple sibling list nodes.

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `$from` | [`ResolvedPos`](https://prosemirror.net/docs/ref/#model.ResolvedPos) | `undefined` |
| `$to` | [`ResolvedPos`](https://prosemirror.net/docs/ref/#model.ResolvedPos) | `$from` |

#### Returns

`null` \| [`NodeRange`](https://prosemirror.net/docs/ref/#model.NodeRange)

***

### isListNode()

```ts
function isListNode(node: 
  | undefined
  | null
  | Node): boolean;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | \| `undefined` \| `null` \| [`Node`](https://prosemirror.net/docs/ref/#model.Node) |

#### Returns

`boolean`

***

### isListType()

```ts
function isListType(type: NodeType): boolean;
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | [`NodeType`](https://prosemirror.net/docs/ref/#model.NodeType) |

#### Returns

`boolean`

***

### joinListElements()

```ts
function joinListElements<T>(parent: T): T;
```

Merge adjacent <ul> elements or adjacent <ol> elements into a single list element.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* \| [`Element`](https://developer.mozilla.org/docs/Web/API/Element) \| [`DocumentFragment`](https://developer.mozilla.org/docs/Web/API/DocumentFragment) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `parent` | `T` |

#### Returns

`T`

***

### migrateDocJSON()

```ts
function migrateDocJSON(docJSON: ProsemirrorNodeJSON): null | ProsemirrorNodeJSON;
```

Migrate a ProseMirror document JSON object from the old list structure to the
new. A new document JSON object is returned if the document is updated,
otherwise `null` is returned.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `docJSON` | [`ProsemirrorNodeJSON`](#prosemirrornodejson) |

#### Returns

`null` \| [`ProsemirrorNodeJSON`](#prosemirrornodejson)

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

***

### UnwrapListOptions

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="kind-1"></a> `kind?` | `string` | If given, only this kind of list will be unwrap. |

***

### WrapInListGetAttrs\<T\>

```ts
type WrapInListGetAttrs<T> = 
  | T
  | (range: NodeRange) => T | null;
```

The list node attributes or a callback function to take the current
selection block range and return list node attributes. If this callback
function returns null, the command won't do anything.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`ListAttributes`](#listattributes) |

***

### backspaceCommand

```ts
const backspaceCommand: Command;
```

Keybinding for `Backspace`. It's chained with following commands:

- [protectCollapsed](#protectcollapsed)
- [deleteSelection](https://prosemirror.net/docs/ref/#commands.deleteSelection)
- [joinListUp](#joinlistup)
- [joinCollapsedListBackward](#joincollapsedlistbackward)
- [joinTextblockBackward](https://prosemirror.net/docs/ref/#commands.joinTextblockBackward)
- [selectNodeBackward](https://prosemirror.net/docs/ref/#commands.selectNodeBackward)

***

### deleteCommand

```ts
const deleteCommand: Command;
```

Keybinding for `Delete`. It's chained with following commands:

- [protectCollapsed](#protectcollapsed)
- [deleteSelection](https://prosemirror.net/docs/ref/#commands.deleteSelection)
- [joinTextblockForward](https://prosemirror.net/docs/ref/#commands.joinTextblockForward)
- [selectNodeForward](https://prosemirror.net/docs/ref/#commands.selectNodeForward)

***

### enterCommand

```ts
const enterCommand: Command;
```

Keybinding for `Enter`. It's chained with following commands:

- [protectCollapsed](#protectcollapsed)
- [createSplitListCommand](#createsplitlistcommand)

***

### joinCollapsedListBackward

```ts
const joinCollapsedListBackward: Command;
```

If the selection is empty and at the start of a block, and there is a
collapsed list node right before the cursor, move current block and append it
to the first child of the collapsed list node (i.e. skip the hidden content).

***

### joinListUp

```ts
const joinListUp: Command;
```

If the text cursor is at the start of the first child of a list node, lift
all content inside the list. If the text cursor is at the start of the last
child of a list node, lift this child.

***

### listKeymap

```ts
const listKeymap: {
  Backspace: Command;
  Delete: Command;
  Enter: Command;
  Mod-[: Command;
  Mod-]: Command;
};
```

Returns an object containing the keymap for the list commands.

- `Enter`: See [enterCommand](#entercommand).
- `Backspace`: See [backspaceCommand](#backspacecommand).
- `Delete`: See [deleteCommand](#deletecommand).
- `Mod-[`: Decrease indentation. See [createDedentListCommand](#creatededentlistcommand).
- `Mod-]`: Increase indentation. See [createIndentListCommand](#createindentlistcommand).

#### Type declaration

| Name | Type | Default value |
| ------ | ------ | ------ |
| <a id="backspace"></a> `Backspace` | [`Command`](https://prosemirror.net/docs/ref/#state.Command) | `backspaceCommand` |
| <a id="delete"></a> `Delete` | [`Command`](https://prosemirror.net/docs/ref/#state.Command) | `deleteCommand` |
| <a id="enter"></a> `Enter` | [`Command`](https://prosemirror.net/docs/ref/#state.Command) | `enterCommand` |
| <a id="mod-"></a> `Mod-[` | [`Command`](https://prosemirror.net/docs/ref/#state.Command) | - |
| <a id="mod--1"></a> `Mod-]` | [`Command`](https://prosemirror.net/docs/ref/#state.Command) | - |

***

### protectCollapsed

```ts
const protectCollapsed: Command;
```

This command will protect the collapsed items from being deleted.

If current selection contains a collapsed item, we don't want the user to
delete this selection by pressing Backspace or Delete, because this could
be unintentional.

In such case, we will stop the delete action and expand the collapsed items
instead. Therefore the user can clearly know what content he is trying to
delete.

***

### createDedentListCommand()

```ts
function createDedentListCommand(options?: DedentListOptions): Command;
```

Returns a command function that decreases the indentation of selected list nodes.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`DedentListOptions`](#dedentlistoptions) |

#### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

***

### createIndentListCommand()

```ts
function createIndentListCommand(options?: IndentListOptions): Command;
```

Returns a command function that increases the indentation of selected list
nodes.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`IndentListOptions`](#indentlistoptions) |

#### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

***

### createMoveListCommand()

```ts
function createMoveListCommand(direction: "up" | "down"): Command;
```

Returns a command function that moves up or down selected list nodes.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `direction` | `"up"` \| `"down"` |

#### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

***

### createSplitListCommand()

```ts
function createSplitListCommand(): Command;
```

Returns a command that split the current list node.

#### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

***

### createToggleCollapsedCommand()

```ts
function createToggleCollapsedCommand(options: ToggleCollapsedOptions): Command;
```

Return a command function that toggle the `collapsed` attribute of the list node.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`ToggleCollapsedOptions`](#togglecollapsedoptions) |

#### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

***

### createToggleListCommand()

```ts
function createToggleListCommand<T>(attrs: T): Command;
```

Returns a command function that wraps the selection in a list with the given
type and attributes, or change the list kind if the selection is already in
another kind of list, or unwrap the selected list if otherwise.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`ListAttributes`](#listattributes) | [`ListAttributes`](#listattributes) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `attrs` | `T` | The list node attributes to toggle. |

#### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

***

### createUnwrapListCommand()

```ts
function createUnwrapListCommand(options?: UnwrapListOptions): Command;
```

Returns a command function that unwraps the list around the selection.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`UnwrapListOptions`](#unwraplistoptions) |

#### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

***

### createWrapInListCommand()

```ts
function createWrapInListCommand<T>(getAttrs: WrapInListGetAttrs<T>): Command;
```

Returns a command function that wraps the selection in a list with the given
type and attributes.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`ListAttributes`](#listattributes) | [`ListAttributes`](#listattributes) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `getAttrs` | [`WrapInListGetAttrs`](#wrapinlistgetattrs)\<`T`\> |

#### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

## Input Rules

### ListInputRuleAttributesGetter()\<T\>

```ts
type ListInputRuleAttributesGetter<T> = (options: {
  attributes?: T;
  match: RegExpMatchArray;
}) => T;
```

A callback function to get the attributes for a list input rule.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`ListAttributes`](#listattributes) | [`ListAttributes`](#listattributes) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | \{ `attributes?`: `T`; `match`: `RegExpMatchArray`; \} | - |
| `options.attributes?` | `T` | The previous attributes of the existing list node, if it exists. |
| `options.match` | `RegExpMatchArray` | The match result of the regular expression. |

#### Returns

`T`

***

### listInputRules

```ts
const listInputRules: InputRule[];
```

All input rules for lists.

***

### wrappingListInputRule()

```ts
function wrappingListInputRule<T>(regexp: RegExp, getAttrs: 
  | T
  | ListInputRuleAttributesGetter<T>): InputRule;
```

Build an input rule for automatically wrapping a textblock into a list node
when a given string is typed.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`ListAttributes`](#listattributes) | [`ListAttributes`](#listattributes) |

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `regexp` | [`RegExp`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp) |
| `getAttrs` | \| `T` \| [`ListInputRuleAttributesGetter`](#listinputruleattributesgetter)\<`T`\> |

#### Returns

[`InputRule`](https://prosemirror.net/docs/ref/#inputrules.InputRule)

## Plugins

### ListDOMSerializer

A custom DOM serializer class that can serialize flat list nodes into native
HTML list elements (i.e. `<ul>` and `<ol>`).

#### Extends

- [`DOMSerializer`](https://prosemirror.net/docs/ref/#model.DOMSerializer)

#### Constructors

##### Constructor

```ts
new ListDOMSerializer(nodes: {
[node: string]: (node: Node) => DOMOutputSpec;
}, marks: {
[mark: string]: (mark: Mark, inline: boolean) => DOMOutputSpec;
}): ListDOMSerializer;
```

Create a serializer. `nodes` should map node names to functions
that take a node and return a description of the corresponding
DOM. `marks` does the same for mark names, but also gets an
argument that tells it whether the mark's content is block or
inline content (for typical use, it'll always be inline). A mark
serializer may be `null` to indicate that marks of that type
should not be serialized.

###### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `nodes` | \{ [`node`: `string`]: (`node`: [`Node`](https://prosemirror.net/docs/ref/#model.Node)) => [`DOMOutputSpec`](https://prosemirror.net/docs/ref/#model.DOMOutputSpec); \} | The node serialization functions. |
| `marks` | \{ [`mark`: `string`]: (`mark`: [`Mark`](https://prosemirror.net/docs/ref/#model.Mark), `inline`: `boolean`) => [`DOMOutputSpec`](https://prosemirror.net/docs/ref/#model.DOMOutputSpec); \} | The mark serialization functions. |

###### Returns

[`ListDOMSerializer`](#listdomserializer)

###### Inherited from

```ts
DOMSerializer.constructor
```

#### Methods

##### serializeFragment()

```ts
serializeFragment(
   fragment: Fragment, 
   options?: {
  document?: Document;
}, 
   target?: 
  | HTMLElement
  | DocumentFragment): 
  | HTMLElement
  | DocumentFragment;
```

Serialize the content of this fragment to a DOM fragment. When
not in the browser, the `document` option, containing a DOM
document, should be passed so that the serializer can create
nodes.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `fragment` | [`Fragment`](https://prosemirror.net/docs/ref/#model.Fragment) |
| `options?` | \{ `document?`: [`Document`](https://developer.mozilla.org/docs/Web/API/Document); \} |
| `options.document?` | [`Document`](https://developer.mozilla.org/docs/Web/API/Document) |
| `target?` | \| [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement) \| [`DocumentFragment`](https://developer.mozilla.org/docs/Web/API/DocumentFragment) |

###### Returns

  \| [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)
  \| [`DocumentFragment`](https://developer.mozilla.org/docs/Web/API/DocumentFragment)

###### Overrides

```ts
DOMSerializer.serializeFragment
```

##### fromSchema()

```ts
static fromSchema(schema: Schema): ListDOMSerializer;
```

Build a serializer using the [`toDOM`](https://prosemirror.net/docs/ref/#model.NodeSpec.toDOM)
properties in a schema's node and mark specs.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `schema` | [`Schema`](https://prosemirror.net/docs/ref/#model.Schema) |

###### Returns

[`ListDOMSerializer`](#listdomserializer)

###### Overrides

```ts
DOMSerializer.fromSchema
```

##### nodesFromSchema()

```ts
static nodesFromSchema(schema: Schema): {
[node: string]: (node: Node) => DOMOutputSpec;
};
```

Gather the serializers in a schema's node specs into an object.
This can be useful as a base to build a custom serializer from.

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `schema` | [`Schema`](https://prosemirror.net/docs/ref/#model.Schema) |

###### Returns

```ts
{
[node: string]: (node: Node) => DOMOutputSpec;
}
```

###### Overrides

```ts
DOMSerializer.nodesFromSchema
```

***

### createListNodeView

```ts
const createListNodeView: NodeViewConstructor;
```

A simple node view that is used to render the list node. It ensures that the
list node get updated when its marker styling should changes.

***

### createListClipboardPlugin()

```ts
function createListClipboardPlugin(schema: Schema): Plugin;
```

Serialize list nodes into native HTML list elements (i.e. `<ul>`, `<ol>`) to
clipboard. See [ListDOMSerializer](#listdomserializer).

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `schema` | [`Schema`](https://prosemirror.net/docs/ref/#model.Schema) |

#### Returns

[`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)

***

### createListEventPlugin()

```ts
function createListEventPlugin(): Plugin;
```

Handle DOM events for list.

#### Returns

[`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)

***

### createListPlugins()

```ts
function createListPlugins(options: {
  schema: Schema;
}): Plugin<any>[];
```

This function returns an array of plugins that are required for list to work.

The plugins are shown below. You can pick and choose which plugins you want
to use if you want to customize some behavior.

- [createListEventPlugin](#createlisteventplugin)
- [createListRenderingPlugin](#createlistrenderingplugin)
- [createListClipboardPlugin](#createlistclipboardplugin)
- [createSafariInputMethodWorkaroundPlugin](#createsafariinputmethodworkaroundplugin)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | \{ `schema`: [`Schema`](https://prosemirror.net/docs/ref/#model.Schema); \} |
| `options.schema` | [`Schema`](https://prosemirror.net/docs/ref/#model.Schema) |

#### Returns

[`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)\<`any`\>[]

***

### createListRenderingPlugin()

```ts
function createListRenderingPlugin(): Plugin;
```

Handle the list node rendering.

#### Returns

[`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)

***

### createSafariInputMethodWorkaroundPlugin()

```ts
function createSafariInputMethodWorkaroundPlugin(): Plugin;
```

Return a plugin as a workaround for a bug in Safari that causes the composition
based IME to remove the empty HTML element with CSS `position: relative`.

See also https://github.com/ProseMirror/prosemirror/issues/934

#### Returns

[`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)

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

### ListToDOMOptions

#### Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| <a id="getattributes"></a> `getAttributes?` | (`node`: [`Node`](https://prosemirror.net/docs/ref/#model.Node)) => [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `undefined` \| `string`\> | `undefined` | An optional function to get the attributes added to HTML element. |
| <a id="getmarkers"></a> `getMarkers?` | (`node`: [`Node`](https://prosemirror.net/docs/ref/#model.Node)) => \| `null` \| [`DOMOutputSpec`](https://prosemirror.net/docs/ref/#model.DOMOutputSpec)[] | `undefined` | An optional function to get elements inside `<div class="list-marker">`. Return `null` to hide the marker. |
| <a id="nativelist"></a> `nativeList?` | `boolean` | `false` | If `true`, the list will be rendered as a native `<ul>` or `<ol>` element. You might want to use [joinListElements](#joinlistelements) to join the list elements afterward. |
| <a id="node"></a> `node` | [`Node`](https://prosemirror.net/docs/ref/#model.Node) | `undefined` | The list node to be rendered. |

***

### ProsemirrorNodeJSON

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="attrs"></a> `attrs?` | [`Attrs`](https://prosemirror.net/docs/ref/#model.Attrs) |
| <a id="content"></a> `content?` | [`ProsemirrorNodeJSON`](#prosemirrornodejson)[] |
| <a id="marks"></a> `marks?` | ( \| `string` \| \{ `attrs?`: [`Attrs`](https://prosemirror.net/docs/ref/#model.Attrs); `type`: `string`; \})[] |
| <a id="text"></a> `text?` | `string` |
| <a id="type"></a> `type` | `string` |

***

### ListKind

```ts
type ListKind = "bullet" | "ordered" | "task" | "toggle";
```

All default list node kinds.

***

### createListSpec()

```ts
function createListSpec(): NodeSpec;
```

Return the spec for list node.

#### Returns

[`NodeSpec`](https://prosemirror.net/docs/ref/#model.NodeSpec)

***

### createParseDomRules()

```ts
function createParseDomRules(): readonly TagParseRule[];
```

Returns a set of rules for parsing HTML into ProseMirror list nodes.

#### Returns

readonly [`TagParseRule`](https://prosemirror.net/docs/ref/#model.TagParseRule)[]

***

### listToDOM()

```ts
function listToDOM(options: ListToDOMOptions): DOMOutputSpec;
```

Renders a list node to DOM output spec.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `options` | [`ListToDOMOptions`](#listtodomoptions) |

#### Returns

[`DOMOutputSpec`](https://prosemirror.net/docs/ref/#model.DOMOutputSpec)
