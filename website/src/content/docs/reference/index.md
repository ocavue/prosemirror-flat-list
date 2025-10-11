---
title: API reference
---

# prosemirror-flat-list

## Functions

### findListsRange() {#findlistsrange}

<dl>

<dt>

<code data-typedoc-code><i>function</i> <a id="findlistsrange" href="#findlistsrange">findListsRange</a>(`$from`: [`ResolvedPos`](https://prosemirror.net/docs/ref/#model.ResolvedPos), `$to`: [`ResolvedPos`](https://prosemirror.net/docs/ref/#model.ResolvedPos)): [`NodeRange`](https://prosemirror.net/docs/ref/#model.NodeRange) \| `null`</code>

</dt>

<dd>

Returns a minimal block range that includes the given two positions and
represents one or multiple sibling list nodes.

</dd>

</dl>

***

### isListNode() {#islistnode}

<dl>

<dt>

<code data-typedoc-code><i>function</i> <a id="islistnode" href="#islistnode">isListNode</a>(`node`: 
  \| [`Node`](https://prosemirror.net/docs/ref/#model.Node)
  \| `null`
  \| `undefined`): `boolean`</code>

</dt>

</dl>

***

### isListType() {#islisttype}

<dl>

<dt>

<code data-typedoc-code><i>function</i> <a id="islisttype" href="#islisttype">isListType</a>(`type`: [`NodeType`](https://prosemirror.net/docs/ref/#model.NodeType)): `boolean`</code>

</dt>

</dl>

***

### joinListElements() {#joinlistelements}

<dl>

<dt>

<code data-typedoc-code><i>function</i> <a id="joinlistelements" href="#joinlistelements">joinListElements</a>\<T\>(`parent`: `T`): `T`</code>

</dt>

<dd>

Merge adjacent <ul> elements or adjacent <ol> elements into a single list element.

</dd>

</dl>

***

### migrateDocJSON() {#migratedocjson}

<dl>

<dt>

<code data-typedoc-code><i>function</i> <a id="migratedocjson" href="#migratedocjson">migrateDocJSON</a>(`docJSON`: [`ProsemirrorNodeJSON`](#prosemirrornodejson)): [`ProsemirrorNodeJSON`](#prosemirrornodejson) \| `null`</code>

</dt>

<dd>

Migrate a ProseMirror document JSON object from the old list structure to the
new. A new document JSON object is returned if the document is updated,
otherwise `null` is returned.

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

***

### UnwrapListOptions {#unwraplistoptions}

#### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="kind-1"></a> `kind?` | `string` | If given, only this kind of list will be unwrap. |

***

### WrapInListGetAttrs {#wrapinlistgetattrs}

<dl>

<dt>

<code data-typedoc-code>type <a id="wrapinlistgetattrs" href="#wrapinlistgetattrs">WrapInListGetAttrs</a>\<T\> = 
  \| `T`
  \| (`range`: [`NodeRange`](https://prosemirror.net/docs/ref/#model.NodeRange)) => `T` \| `null`</code>

</dt>

<dd>

The list node attributes or a callback function to take the current
selection block range and return list node attributes. If this callback
function returns null, the command won't do anything.

</dd>

</dl>

***

### backspaceCommand {#backspacecommand}

<dl>

<dt>

<code data-typedoc-code><i>const</i> <a id="backspacecommand" href="#backspacecommand">backspaceCommand</a>: [`Command`](https://prosemirror.net/docs/ref/#state.Command)</code>

</dt>

<dd>

Keybinding for `Backspace`. It's chained with following commands:

- [protectCollapsed](#protectcollapsed)
- [deleteSelection](https://prosemirror.net/docs/ref/#commands.deleteSelection)
- [joinListUp](#joinlistup)
- [joinCollapsedListBackward](#joincollapsedlistbackward)
- [joinTextblockBackward](https://prosemirror.net/docs/ref/#commands.joinTextblockBackward)
- [selectNodeBackward](https://prosemirror.net/docs/ref/#commands.selectNodeBackward)

</dd>

</dl>

***

### deleteCommand {#deletecommand}

<dl>

<dt>

<code data-typedoc-code><i>const</i> <a id="deletecommand" href="#deletecommand">deleteCommand</a>: [`Command`](https://prosemirror.net/docs/ref/#state.Command)</code>

</dt>

<dd>

Keybinding for `Delete`. It's chained with following commands:

- [protectCollapsed](#protectcollapsed)
- [deleteSelection](https://prosemirror.net/docs/ref/#commands.deleteSelection)
- [joinTextblockForward](https://prosemirror.net/docs/ref/#commands.joinTextblockForward)
- [selectNodeForward](https://prosemirror.net/docs/ref/#commands.selectNodeForward)

</dd>

</dl>

***

### enterCommand {#entercommand}

<dl>

<dt>

<code data-typedoc-code><i>const</i> <a id="entercommand" href="#entercommand">enterCommand</a>: [`Command`](https://prosemirror.net/docs/ref/#state.Command)</code>

</dt>

<dd>

Keybinding for `Enter`. It's chained with following commands:

- [protectCollapsed](#protectcollapsed)
- [createSplitListCommand](#createsplitlistcommand)

</dd>

</dl>

***

### joinCollapsedListBackward {#joincollapsedlistbackward}

<dl>

<dt>

<code data-typedoc-code><i>const</i> <a id="joincollapsedlistbackward" href="#joincollapsedlistbackward">joinCollapsedListBackward</a>: [`Command`](https://prosemirror.net/docs/ref/#state.Command)</code>

</dt>

<dd>

If the selection is empty and at the start of a block, and there is a
collapsed list node right before the cursor, move current block and append it
to the first child of the collapsed list node (i.e. skip the hidden content).

</dd>

</dl>

***

### joinListUp {#joinlistup}

<dl>

<dt>

<code data-typedoc-code><i>const</i> <a id="joinlistup" href="#joinlistup">joinListUp</a>: [`Command`](https://prosemirror.net/docs/ref/#state.Command)</code>

</dt>

<dd>

If the text cursor is at the start of the first child of a list node, lift
all content inside the list. If the text cursor is at the start of the last
child of a list node, lift this child.

</dd>

</dl>

***

### listKeymap {#listkeymap}

<dl>

<dt>

<code data-typedoc-code><i>const</i> <a id="listkeymap" href="#listkeymap">listKeymap</a>: \{
  `Backspace`: [`Command`](https://prosemirror.net/docs/ref/#state.Command);
  `Delete`: [`Command`](https://prosemirror.net/docs/ref/#state.Command);
  `Enter`: [`Command`](https://prosemirror.net/docs/ref/#state.Command);
  `Mod-[`: [`Command`](https://prosemirror.net/docs/ref/#state.Command);
  `Mod-]`: [`Command`](https://prosemirror.net/docs/ref/#state.Command);
\}</code>

</dt>

<dd>

Returns an object containing the keymap for the list commands.

- `Enter`: See [enterCommand](#entercommand).
- `Backspace`: See [backspaceCommand](#backspacecommand).
- `Delete`: See [deleteCommand](#deletecommand).
- `Mod-[`: Decrease indentation. See [createDedentListCommand](#creatededentlistcommand).
- `Mod-]`: Increase indentation. See [createIndentListCommand](#createindentlistcommand).

</dd>

</dl>

***

### protectCollapsed {#protectcollapsed}

<dl>

<dt>

<code data-typedoc-code><i>const</i> <a id="protectcollapsed" href="#protectcollapsed">protectCollapsed</a>: [`Command`](https://prosemirror.net/docs/ref/#state.Command)</code>

</dt>

<dd>

This command will protect the collapsed items from being deleted.

If current selection contains a collapsed item, we don't want the user to
delete this selection by pressing Backspace or Delete, because this could
be unintentional.

In such case, we will stop the delete action and expand the collapsed items
instead. Therefore the user can clearly know what content he is trying to
delete.

</dd>

</dl>

***

### createDedentListCommand() {#creatededentlistcommand}

<dl>

<dt>

<code data-typedoc-code><i>function</i> <a id="creatededentlistcommand" href="#creatededentlistcommand">createDedentListCommand</a>(`options?`: [`DedentListOptions`](#dedentlistoptions)): [`Command`](https://prosemirror.net/docs/ref/#state.Command)</code>

</dt>

<dd>

Returns a command function that decreases the indentation of selected list nodes.

</dd>

</dl>

***

### createIndentListCommand() {#createindentlistcommand}

<dl>

<dt>

<code data-typedoc-code><i>function</i> <a id="createindentlistcommand" href="#createindentlistcommand">createIndentListCommand</a>(`options?`: [`IndentListOptions`](#indentlistoptions)): [`Command`](https://prosemirror.net/docs/ref/#state.Command)</code>

</dt>

<dd>

Returns a command function that increases the indentation of selected list
nodes.

</dd>

</dl>

***

### createMoveListCommand() {#createmovelistcommand}

<dl>

<dt>

<code data-typedoc-code><i>function</i> <a id="createmovelistcommand" href="#createmovelistcommand">createMoveListCommand</a>(`direction`: `"up"` \| `"down"`): [`Command`](https://prosemirror.net/docs/ref/#state.Command)</code>

</dt>

<dd>

Returns a command function that moves up or down selected list nodes.

</dd>

</dl>

***

### createSplitListCommand() {#createsplitlistcommand}

<dl>

<dt>

<code data-typedoc-code><i>function</i> <a id="createsplitlistcommand" href="#createsplitlistcommand">createSplitListCommand</a>(): [`Command`](https://prosemirror.net/docs/ref/#state.Command)</code>

</dt>

<dd>

Returns a command that split the current list node.

</dd>

</dl>

***

### createToggleCollapsedCommand() {#createtogglecollapsedcommand}

<dl>

<dt>

<code data-typedoc-code><i>function</i> <a id="createtogglecollapsedcommand" href="#createtogglecollapsedcommand">createToggleCollapsedCommand</a>(`options`: [`ToggleCollapsedOptions`](#togglecollapsedoptions)): [`Command`](https://prosemirror.net/docs/ref/#state.Command)</code>

</dt>

<dd>

Return a command function that toggle the `collapsed` attribute of the list node.

</dd>

</dl>

***

### createToggleListCommand() {#createtogglelistcommand}

<dl>

<dt>

<code data-typedoc-code><i>function</i> <a id="createtogglelistcommand" href="#createtogglelistcommand">createToggleListCommand</a>\<T\>(`attrs`: `T`): [`Command`](https://prosemirror.net/docs/ref/#state.Command)</code>

</dt>

<dd>

Returns a command function that wraps the selection in a list with the given
type and attributes, or change the list kind if the selection is already in
another kind of list, or unwrap the selected list if otherwise.

</dd>

</dl>

***

### createUnwrapListCommand() {#createunwraplistcommand}

<dl>

<dt>

<code data-typedoc-code><i>function</i> <a id="createunwraplistcommand" href="#createunwraplistcommand">createUnwrapListCommand</a>(`options?`: [`UnwrapListOptions`](#unwraplistoptions)): [`Command`](https://prosemirror.net/docs/ref/#state.Command)</code>

</dt>

<dd>

Returns a command function that unwraps the list around the selection.

</dd>

</dl>

***

### createWrapInListCommand() {#createwrapinlistcommand}

<dl>

<dt>

<code data-typedoc-code><i>function</i> <a id="createwrapinlistcommand" href="#createwrapinlistcommand">createWrapInListCommand</a>\<T\>(`getAttrs`: [`WrapInListGetAttrs`](#wrapinlistgetattrs)\<`T`\>): [`Command`](https://prosemirror.net/docs/ref/#state.Command)</code>

</dt>

<dd>

Returns a command function that wraps the selection in a list with the given
type and attributes.

</dd>

</dl>

## Input Rules

### ListInputRuleAttributesGetter() {#listinputruleattributesgetter}

<dl>

<dt>

<code data-typedoc-code>type <a id="listinputruleattributesgetter" href="#listinputruleattributesgetter">ListInputRuleAttributesGetter</a>\<T\> = (`options`: \{
  `attributes?`: `T`;
  `match`: `RegExpMatchArray`;
\}) => `T`</code>

</dt>

<dd>

A callback function to get the attributes for a list input rule.

</dd>

</dl>

***

### listInputRules {#listinputrules}

<dl>

<dt>

<code data-typedoc-code><i>const</i> <a id="listinputrules" href="#listinputrules">listInputRules</a>: [`InputRule`](https://prosemirror.net/docs/ref/#inputrules.InputRule)[]</code>

</dt>

<dd>

All input rules for lists.

</dd>

</dl>

***

### wrappingListInputRule() {#wrappinglistinputrule}

<dl>

<dt>

<code data-typedoc-code><i>function</i> <a id="wrappinglistinputrule" href="#wrappinglistinputrule">wrappingListInputRule</a>\<T\>(`regexp`: [`RegExp`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp), `getAttrs`: 
  \| `T`
  \| [`ListInputRuleAttributesGetter`](#listinputruleattributesgetter)\<`T`\>): [`InputRule`](https://prosemirror.net/docs/ref/#inputrules.InputRule)</code>

</dt>

<dd>

Build an input rule for automatically wrapping a textblock into a list node
when a given string is typed.

</dd>

</dl>

## Plugins

### ListDOMSerializer {#listdomserializer}

A custom DOM serializer class that can serialize flat list nodes into native
HTML list elements (i.e. `<ul>` and `<ol>`).

#### Constructors

##### Constructor

<dl>

<dt>

<code data-typedoc-code>new <a id="constructor" href="#constructor">ListDOMSerializer</a>(`nodes`: \{
\[`node`: `string`\]: (`node`: [`Node`](https://prosemirror.net/docs/ref/#model.Node)) => [`DOMOutputSpec`](https://prosemirror.net/docs/ref/#model.DOMOutputSpec);
\}, `marks`: \{
\[`mark`: `string`\]: (`mark`: [`Mark`](https://prosemirror.net/docs/ref/#model.Mark), `inline`: `boolean`) => [`DOMOutputSpec`](https://prosemirror.net/docs/ref/#model.DOMOutputSpec);
\}): [`ListDOMSerializer`](#listdomserializer)</code>

</dt>

<dd>

Create a serializer. `nodes` should map node names to functions
that take a node and return a description of the corresponding
DOM. `marks` does the same for mark names, but also gets an
argument that tells it whether the mark's content is block or
inline content (for typical use, it'll always be inline). A mark
serializer may be `null` to indicate that marks of that type
should not be serialized.

</dd>

</dl>

#### Methods

<dl>

<dt>

<code data-typedoc-code><a id="serializefragment" href="#serializefragment">serializeFragment</a>(
   `fragment`: [`Fragment`](https://prosemirror.net/docs/ref/#model.Fragment), 
   `options?`: \{
  `document?`: [`Document`](https://developer.mozilla.org/docs/Web/API/Document);
\}, 
   `target?`: 
  \| [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)
  \| [`DocumentFragment`](https://developer.mozilla.org/docs/Web/API/DocumentFragment)): 
  \| [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)
  \| [`DocumentFragment`](https://developer.mozilla.org/docs/Web/API/DocumentFragment)</code>

</dt>

<dd>

Serialize the content of this fragment to a DOM fragment. When
not in the browser, the `document` option, containing a DOM
document, should be passed so that the serializer can create
nodes.

</dd>

</dl>

<dl>

<dt>

<code data-typedoc-code><i>static</i> <a id="fromschema" href="#fromschema">fromSchema</a>(`schema`: [`Schema`](https://prosemirror.net/docs/ref/#model.Schema)): [`ListDOMSerializer`](#listdomserializer)</code>

</dt>

<dd>

Build a serializer using the [`toDOM`](https://prosemirror.net/docs/ref/#model.NodeSpec.toDOM)
properties in a schema's node and mark specs.

</dd>

</dl>

<dl>

<dt>

<code data-typedoc-code><i>static</i> <a id="nodesfromschema" href="#nodesfromschema">nodesFromSchema</a>(`schema`: [`Schema`](https://prosemirror.net/docs/ref/#model.Schema)): \{
\[`node`: `string`\]: (`node`: [`Node`](https://prosemirror.net/docs/ref/#model.Node)) => [`DOMOutputSpec`](https://prosemirror.net/docs/ref/#model.DOMOutputSpec);
\}</code>

</dt>

<dd>

Gather the serializers in a schema's node specs into an object.
This can be useful as a base to build a custom serializer from.

</dd>

</dl>

***

### createListNodeView {#createlistnodeview}

<dl>

<dt>

<code data-typedoc-code><i>const</i> <a id="createlistnodeview" href="#createlistnodeview">createListNodeView</a>: [`NodeViewConstructor`](https://prosemirror.net/docs/ref/#view.NodeViewConstructor)</code>

</dt>

<dd>

A simple node view that is used to render the list node. It ensures that the
list node get updated when its marker styling should changes.

</dd>

</dl>

***

### createListClipboardPlugin() {#createlistclipboardplugin}

<dl>

<dt>

<code data-typedoc-code><i>function</i> <a id="createlistclipboardplugin" href="#createlistclipboardplugin">createListClipboardPlugin</a>(`schema`: [`Schema`](https://prosemirror.net/docs/ref/#model.Schema)): [`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)</code>

</dt>

<dd>

Serialize list nodes into native HTML list elements (i.e. `<ul>`, `<ol>`) to
clipboard. See [ListDOMSerializer](#listdomserializer).

</dd>

</dl>

***

### createListEventPlugin() {#createlisteventplugin}

<dl>

<dt>

<code data-typedoc-code><i>function</i> <a id="createlisteventplugin" href="#createlisteventplugin">createListEventPlugin</a>(): [`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)</code>

</dt>

<dd>

Handle DOM events for list.

</dd>

</dl>

***

### createListPlugins() {#createlistplugins}

<dl>

<dt>

<code data-typedoc-code><i>function</i> <a id="createlistplugins" href="#createlistplugins">createListPlugins</a>(`options`: \{
  `schema`: [`Schema`](https://prosemirror.net/docs/ref/#model.Schema);
\}): [`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)\<`any`\>[]</code>

</dt>

<dd>

This function returns an array of plugins that are required for list to work.

The plugins are shown below. You can pick and choose which plugins you want
to use if you want to customize some behavior.

- [createListEventPlugin](#createlisteventplugin)
- [createListRenderingPlugin](#createlistrenderingplugin)
- [createListClipboardPlugin](#createlistclipboardplugin)
- [createSafariInputMethodWorkaroundPlugin](#createsafariinputmethodworkaroundplugin)

</dd>

</dl>

***

### createListRenderingPlugin() {#createlistrenderingplugin}

<dl>

<dt>

<code data-typedoc-code><i>function</i> <a id="createlistrenderingplugin" href="#createlistrenderingplugin">createListRenderingPlugin</a>(): [`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)</code>

</dt>

<dd>

Handle the list node rendering.

</dd>

</dl>

***

### createSafariInputMethodWorkaroundPlugin() {#createsafariinputmethodworkaroundplugin}

<dl>

<dt>

<code data-typedoc-code><i>function</i> <a id="createsafariinputmethodworkaroundplugin" href="#createsafariinputmethodworkaroundplugin">createSafariInputMethodWorkaroundPlugin</a>(): [`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)</code>

</dt>

<dd>

Return a plugin as a workaround for a bug in Safari that causes the composition
based IME to remove the empty HTML element with CSS `position: relative`.

See also https://github.com/ProseMirror/prosemirror/issues/934

</dd>

</dl>

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

### ListToDOMOptions {#listtodomoptions}

#### Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| <a id="getattributes"></a> `getAttributes?` | (`node`: [`Node`](https://prosemirror.net/docs/ref/#model.Node)) => [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `string` \| `undefined`\> | `undefined` | An optional function to get the attributes added to HTML element. |
| <a id="getmarkers"></a> `getMarkers?` | (`node`: [`Node`](https://prosemirror.net/docs/ref/#model.Node)) => \| [`DOMOutputSpec`](https://prosemirror.net/docs/ref/#model.DOMOutputSpec)[] \| `null` | `undefined` | An optional function to get elements inside `<div class="list-marker">`. Return `null` to hide the marker. |
| <a id="nativelist"></a> `nativeList?` | `boolean` | `false` | If `true`, the list will be rendered as a native `<ul>` or `<ol>` element. You might want to use [joinListElements](#joinlistelements) to join the list elements afterward. |
| <a id="node"></a> `node` | [`Node`](https://prosemirror.net/docs/ref/#model.Node) | `undefined` | The list node to be rendered. |

***

### ProsemirrorNodeJSON {#prosemirrornodejson}

#### Properties

| Property | Type |
| ------ | ------ |
| <a id="attrs"></a> `attrs?` | [`Attrs`](https://prosemirror.net/docs/ref/#model.Attrs) |
| <a id="content"></a> `content?` | [`ProsemirrorNodeJSON`](#prosemirrornodejson)[] |
| <a id="marks"></a> `marks?` | ( \| `string` \| \{ `attrs?`: [`Attrs`](https://prosemirror.net/docs/ref/#model.Attrs); `type`: `string`; \})[] |
| <a id="text"></a> `text?` | `string` |
| <a id="type"></a> `type` | `string` |

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

***

### createListSpec() {#createlistspec}

<dl>

<dt>

<code data-typedoc-code><i>function</i> <a id="createlistspec" href="#createlistspec">createListSpec</a>(): [`NodeSpec`](https://prosemirror.net/docs/ref/#model.NodeSpec)</code>

</dt>

<dd>

Return the spec for list node.

</dd>

</dl>

***

### createParseDomRules() {#createparsedomrules}

<dl>

<dt>

<code data-typedoc-code><i>function</i> <a id="createparsedomrules" href="#createparsedomrules">createParseDomRules</a>(): readonly [`TagParseRule`](https://prosemirror.net/docs/ref/#model.TagParseRule)[]</code>

</dt>

<dd>

Returns a set of rules for parsing HTML into ProseMirror list nodes.

</dd>

</dl>

***

### listToDOM() {#listtodom}

<dl>

<dt>

<code data-typedoc-code><i>function</i> <a id="listtodom" href="#listtodom">listToDOM</a>(`options`: [`ListToDOMOptions`](#listtodomoptions)): [`DOMOutputSpec`](https://prosemirror.net/docs/ref/#model.DOMOutputSpec)</code>

</dt>

<dd>

Renders a list node to DOM output spec.

</dd>

</dl>
