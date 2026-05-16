import { DOMSerializer, Fragment, NodeRange, Slice } from "prosemirror-model";
import { ReplaceAroundStep, ReplaceStep, canJoin, canSplit, findWrapping, liftTarget, replaceStep } from "prosemirror-transform";
import { Plugin, Selection, TextSelection } from "prosemirror-state";
import { chainCommands, createParagraphNear, deleteSelection, joinTextblockBackward, joinTextblockForward, newlineInCode, selectNodeBackward, selectNodeForward, splitBlock } from "prosemirror-commands";
import { InputRule } from "prosemirror-inputrules";
import { imeSpan } from "prosemirror-safari-ime-span";
//#region src/utils/find-checkbox-in-list-item.ts
/**
* Finds a `<input type="checkbox">` element from a `<li>` element. It will stop
* searching if it reaches a sub-list.
*
* @internal
*/
function findCheckboxInListItem(node, depth = 0, maxDepth = 3) {
	if (node.nodeName === "INPUT" && node.getAttribute("type") === "checkbox") return node;
	if (depth > 0 && [
		"UL",
		"OL",
		"LI"
	].includes(node.nodeName)) return;
	if (depth >= maxDepth) return;
	for (let child of node.children) {
		const checkbox = findCheckboxInListItem(child, depth + 1, maxDepth);
		if (checkbox) return checkbox;
	}
}
//#endregion
//#region src/utils/parse-integer.ts
/** @internal */
function parseInteger(attr) {
	if (attr == null) return null;
	const int = Number.parseInt(attr, 10);
	if (Number.isInteger(int)) return int;
	return null;
}
//#endregion
//#region src/schema/parse-dom.ts
/**
* Returns a set of rules for parsing HTML into ProseMirror list nodes.
*
* @public @group Schema
*/
function createParseDomRules() {
	return [
		{
			tag: "div[data-list-kind]",
			getAttrs: (element) => {
				if (typeof element === "string") return {};
				return {
					kind: element.getAttribute("data-list-kind") || "bullet",
					order: parseInteger(element.getAttribute("data-list-order")),
					checked: element.hasAttribute("data-list-checked"),
					collapsed: element.hasAttribute("data-list-collapsed")
				};
			}
		},
		{
			tag: "div[data-list]",
			getAttrs: (element) => {
				if (typeof element === "string") return {};
				return {
					kind: element.getAttribute("data-list-kind") || "bullet",
					order: parseInteger(element.getAttribute("data-list-order")),
					checked: element.hasAttribute("data-list-checked"),
					collapsed: element.hasAttribute("data-list-collapsed")
				};
			}
		},
		{
			tag: "ul > li",
			getAttrs: (element) => {
				if (typeof element !== "string") {
					const checkbox = findCheckboxInListItem(element);
					if (checkbox) return {
						kind: "task",
						checked: checkbox.hasAttribute("checked")
					};
					if (element.hasAttribute("data-task-list-item") || element.getAttribute("data-list-kind") === "task") return {
						kind: "task",
						checked: element.hasAttribute("data-list-checked") || element.hasAttribute("data-checked")
					};
					if (element.hasAttribute("data-toggle-list-item") || element.getAttribute("data-list-kind") === "toggle") return {
						kind: "toggle",
						collapsed: element.hasAttribute("data-list-collapsed")
					};
					if (element.firstChild?.nodeType === 3) {
						const textContent = element.firstChild.textContent;
						if (textContent && /^\[[\sx|]]\s{1,2}/.test(textContent)) {
							element.firstChild.textContent = textContent.replace(/^\[[\sx|]]\s{1,2}/, "");
							return {
								kind: "task",
								checked: textContent.startsWith("[x]")
							};
						}
					}
				}
				return { kind: "bullet" };
			}
		},
		{
			tag: "ol > li",
			getAttrs: (element) => {
				if (typeof element === "string") return { kind: "ordered" };
				return {
					kind: "ordered",
					order: parseInteger(element.getAttribute("data-list-order"))
				};
			}
		},
		{
			tag: ":is(ul, ol) > :is(ul, ol)",
			getAttrs: () => {
				return { kind: "bullet" };
			}
		}
	];
}
//#endregion
//#region src/schema/to-dom.ts
/**
* Renders a list node to DOM output spec.
*
* @public @group Schema
*/
function listToDOM(options) {
	const { node, nativeList = false, getMarkers = defaultMarkerGetter, getAttributes = defaultAttributesGetter } = options;
	const attrs = node.attrs;
	const markers = node.firstChild?.type === node.type ? null : getMarkers(node);
	const domAttrs = getAttributes(node);
	const contentContainer = [
		"div",
		{ class: "list-content" },
		0
	];
	const markerContainer = markers && [
		"div",
		{
			class: "list-marker list-marker-click-target",
			contenteditable: "false"
		},
		...markers
	];
	if (nativeList) {
		const listTag = attrs.kind === "ordered" ? "ol" : "ul";
		if (markerContainer) return [listTag, [
			"li",
			domAttrs,
			markerContainer,
			contentContainer
		]];
		else return [listTag, [
			"li",
			domAttrs,
			0
		]];
	} else if (markerContainer) return [
		"div",
		domAttrs,
		markerContainer,
		contentContainer
	];
	else return [
		"div",
		domAttrs,
		contentContainer
	];
}
/** @internal */
function defaultMarkerGetter(node) {
	const attrs = node.attrs;
	switch (attrs.kind) {
		case "task": return [["label", ["input", {
			type: "checkbox",
			checked: attrs.checked ? "" : void 0
		}]]];
		case "toggle": return [];
		default: return null;
	}
}
/** @internal */
function defaultAttributesGetter(node) {
	const attrs = node.attrs;
	return {
		class: "prosemirror-flat-list",
		"data-list-kind": node.firstChild?.type === node.type ? void 0 : attrs.kind || "bullet",
		"data-list-order": attrs.order != null ? String(attrs.order) : void 0,
		"data-list-checked": attrs.checked ? "" : void 0,
		"data-list-collapsed": attrs.collapsed ? "" : void 0,
		"data-list-collapsable": node.childCount >= 2 ? "" : void 0,
		style: attrs.order != null ? `--prosemirror-flat-list-order: ${attrs.order};` : void 0
	};
}
//#endregion
//#region src/schema/node-spec.ts
/**
* The default group name for list nodes. This is used to find the list node
* type from the schema.
*
* @internal Schema
*/
const flatListGroup = "flatList";
/**
* Return the spec for list node.
*
*  @public @group Schema
*/
function createListSpec() {
	return {
		content: "block+",
		group: `${flatListGroup} block`,
		definingForContent: true,
		definingAsContext: false,
		attrs: {
			kind: { default: "bullet" },
			order: { default: null },
			checked: { default: false },
			collapsed: { default: false }
		},
		toDOM: (node) => {
			return listToDOM({ node });
		},
		parseDOM: createParseDomRules()
	};
}
//#endregion
//#region src/utils/get-list-type-name.ts
const key = "PROSEMIRROR_FLAT_LIST_TYPE_NAME";
/** @internal */
function getListTypeName(schema) {
	let name = schema.cached[key];
	if (!name) {
		for (const type of Object.values(schema.nodes)) if ((type.spec.group || "").split(" ").includes("flatList")) {
			name = type.name;
			break;
		}
		if (!name) throw new TypeError("[prosemirror-flat-list] Unable to find a flat list type in the schema");
		schema.cached[key] = name;
		return name;
	}
	return name;
}
//#endregion
//#region src/utils/is-list-type.ts
/** @public */
function isListType(type) {
	return getListTypeName(type.schema) === type.name;
}
//#endregion
//#region src/utils/is-list-node.ts
/** @public */
function isListNode(node) {
	if (!node) return false;
	return isListType(node.type);
}
//#endregion
//#region src/utils/patch-command.ts
function patchCommand(patch) {
	const withPatch = (command) => {
		const patchedCommand = (state, dispatch, view) => {
			return command(state, dispatch ? (tr) => dispatch(patch(tr)) : void 0, view);
		};
		return patchedCommand;
	};
	return withPatch;
}
//#endregion
//#region src/utils/auto-fix-list.ts
/** @internal */
function* getTransactionRanges(tr) {
	const ranges = [];
	let i = 0;
	while (true) {
		for (; i < tr.mapping.maps.length; i++) {
			const map = tr.mapping.maps[i];
			for (let j = 0; j < ranges.length; j++) ranges[j] = map.map(ranges[j]);
			map.forEach((_oldStart, _oldEnd, newStart, newEnd) => ranges.push(newStart, newEnd));
		}
		yield ranges;
	}
}
/** @internal */
function findBoundaries(positions, doc, prediction) {
	const boundaries = /* @__PURE__ */ new Set();
	const joinable = [];
	for (const pos of positions) {
		const $pos = doc.resolve(pos);
		for (let depth = $pos.depth; depth >= 0; depth--) {
			const boundary = $pos.before(depth + 1);
			if (boundaries.has(boundary)) break;
			boundaries.add(boundary);
			const index = $pos.index(depth);
			const parent = $pos.node(depth);
			const before = parent.maybeChild(index - 1);
			if (!before) continue;
			const after = parent.maybeChild(index);
			if (!after) continue;
			if (prediction(before, after, parent, index)) joinable.push(boundary);
		}
	}
	return joinable.sort((a, b) => b - a);
}
function isListJoinable(before, after) {
	return isListNode(before) && isListNode(after) && isListNode(after.firstChild);
}
function isListSplitable(before, after, parent, index) {
	if (index === 1 && isListNode(parent) && isListNode(before) && !isListNode(after)) return true;
	return false;
}
function fixList(tr) {
	const ranges = getTransactionRanges(tr);
	const joinable = findBoundaries(ranges.next().value, tr.doc, isListJoinable);
	for (const pos of joinable) if (canJoin(tr.doc, pos)) tr.join(pos);
	const splitable = findBoundaries(ranges.next().value, tr.doc, isListSplitable);
	for (const pos of splitable) if (canSplit(tr.doc, pos)) tr.split(pos);
	return tr;
}
/** @internal */
const withAutoFixList = patchCommand(fixList);
//#endregion
//#region src/utils/block-boundary.ts
function atStartBlockBoundary($pos, depth) {
	for (let d = depth; d <= $pos.depth; d++) {
		if ($pos.node(d).isTextblock) continue;
		if ($pos.index(d) !== 0) return false;
	}
	return true;
}
function atEndBlockBoundary($pos, depth) {
	for (let d = depth; d <= $pos.depth; d++) {
		if ($pos.node(d).isTextblock) continue;
		if ($pos.index(d) !== $pos.node(d).childCount - 1) return false;
	}
	return true;
}
//#endregion
//#region src/utils/get-list-type.ts
/** @internal */
function getListType(schema) {
	return schema.nodes[getListTypeName(schema)];
}
//#endregion
//#region src/utils/list-range.ts
/**
* Returns a minimal block range that includes the given two positions and
* represents one or multiple sibling list nodes.
*
* @public
*/
function findListsRange($from, $to = $from) {
	if ($to.pos < $from.pos) return findListsRange($to, $from);
	let range = $from.blockRange($to);
	while (range) {
		if (isListsRange(range)) return range;
		if (range.depth <= 0) break;
		range = new NodeRange($from, $to, range.depth - 1);
	}
	return null;
}
/** @internal */
function isListsRange(range) {
	const { startIndex, endIndex, parent } = range;
	for (let i = startIndex; i < endIndex; i++) if (!isListNode(parent.child(i))) return false;
	return true;
}
//#endregion
//#region src/utils/map-pos.ts
function mapPos(tr, pos) {
	let nextStepIndex = tr.steps.length;
	const getPos = () => {
		if (nextStepIndex < tr.steps.length) {
			const mapping = tr.mapping.slice(nextStepIndex);
			nextStepIndex = tr.steps.length;
			pos = mapping.map(pos);
		}
		return pos;
	};
	return getPos;
}
//#endregion
//#region src/utils/safe-lift.ts
function safeLift(tr, range) {
	const target = liftTarget(range);
	if (target == null) return false;
	tr.lift(range, target);
	return true;
}
function safeLiftFromTo(tr, from, to) {
	const $from = tr.doc.resolve(from);
	const $to = tr.doc.resolve(to);
	const range = $from.blockRange($to);
	if (!range) return false;
	return safeLift(tr, range);
}
//#endregion
//#region src/utils/zoom-in-range.ts
/**
* Returns a deeper block range if possible
*/
function zoomInRange(range) {
	const { $from, $to, depth, start, end } = range;
	const doc = $from.doc;
	const deeper = ($from.pos > start ? $from : doc.resolve(start + 1)).blockRange($to.pos < end ? $to : doc.resolve(end - 1));
	if (deeper && deeper.depth > depth) return deeper;
	return null;
}
//#endregion
//#region src/utils/is-collapsed-list-node.ts
/**
* @internal
*/
function isCollapsedListNode(node) {
	return !!(isListNode(node) && node.attrs.collapsed);
}
//#endregion
//#region src/utils/set-node-attributes.ts
function setNodeAttributes(tr, pos, oldAttrs, newAttrs) {
	let needUpdate = false;
	for (const key of Object.keys(newAttrs)) if (newAttrs[key] !== oldAttrs[key]) {
		tr.setNodeAttribute(pos, key, newAttrs[key]);
		needUpdate = true;
	}
	return needUpdate;
}
//#endregion
//#region src/utils/set-list-attributes.ts
function setListAttributes(tr, pos, attrs) {
	const node = tr.doc.resolve(pos).nodeAfter;
	if (node && isListNode(node)) {
		const oldAttrs = node.attrs;
		return setNodeAttributes(tr, pos, oldAttrs, {
			...oldAttrs,
			...attrs
		});
	}
	return false;
}
//#endregion
//#region src/commands/set-safe-selection.ts
function moveOutOfCollapsed($pos, minDepth) {
	for (let depth = minDepth; depth <= $pos.depth; depth++) if (isCollapsedListNode($pos.node(depth)) && $pos.index(depth) >= 1) {
		const before = $pos.posAtIndex(1, depth);
		const $before = $pos.doc.resolve(before);
		return TextSelection.near($before, -1);
	}
	return null;
}
/**
* If one of the selection's end points is inside a collapsed node, move the selection outside of it
*
* @internal
*/
function setSafeSelection(tr) {
	const { $from, $to, to } = tr.selection;
	const selection = moveOutOfCollapsed($from, 0) || moveOutOfCollapsed($to, $from.sharedDepth(to));
	if (selection) tr.setSelection(selection);
	return tr;
}
const withSafeSelection = patchCommand(setSafeSelection);
function getCollapsedPosition($pos, minDepth) {
	for (let depth = minDepth; depth <= $pos.depth; depth++) if (isCollapsedListNode($pos.node(depth)) && $pos.index(depth) >= 1) return $pos.before(depth);
	return null;
}
/**
* If one of the selection's end points is inside a collapsed node, expand it
*
* @internal
*/
function setVisibleSelection(tr) {
	const { $from, $to, to } = tr.selection;
	const pos = getCollapsedPosition($from, 0) ?? getCollapsedPosition($to, $from.sharedDepth(to));
	if (pos != null) {
		tr.doc.resolve(pos);
		setListAttributes(tr, pos, { collapsed: false });
	}
	return tr;
}
const withVisibleSelection = patchCommand(setVisibleSelection);
//#endregion
//#region src/commands/dedent-list.ts
/**
* Returns a command function that decreases the indentation of selected list nodes.
*
* @public @group Commands
*/
function createDedentListCommand(options) {
	const dedentListCommand = (state, dispatch) => {
		const tr = state.tr;
		const range = findListsRange(options?.from == null ? tr.selection.$from : tr.doc.resolve(options.from), options?.to == null ? tr.selection.$to : tr.doc.resolve(options.to));
		if (!range) return false;
		if (dedentRange(range, tr)) {
			dispatch?.(tr);
			return true;
		}
		return false;
	};
	return withVisibleSelection(withAutoFixList(dedentListCommand));
}
function dedentRange(range, tr, startBoundary, endBoundary) {
	const { depth, $from, $to } = range;
	startBoundary = startBoundary || atStartBlockBoundary($from, depth + 1);
	if (!startBoundary) {
		const { startIndex, endIndex } = range;
		if (endIndex - startIndex === 1) {
			const contentRange = zoomInRange(range);
			return contentRange ? dedentRange(contentRange, tr) : false;
		} else return splitAndDedentRange(range, tr, startIndex + 1);
	}
	endBoundary = endBoundary || atEndBlockBoundary($to, depth + 1);
	if (!endBoundary) {
		fixEndBoundary(range, tr);
		const endOfParent = $to.end(depth);
		range = new NodeRange(tr.doc.resolve($from.pos), tr.doc.resolve(endOfParent), depth);
		return dedentRange(range, tr, void 0, true);
	}
	if (range.startIndex === 0 && range.endIndex === range.parent.childCount && isListNode(range.parent)) return dedentNodeRange(new NodeRange($from, $to, depth - 1), tr);
	return dedentNodeRange(range, tr);
}
/**
* Split a range into two parts, and dedent them separately.
*/
function splitAndDedentRange(range, tr, splitIndex) {
	const { $from, $to, depth } = range;
	const splitPos = $from.posAtIndex(splitIndex, depth);
	const range1 = $from.blockRange(tr.doc.resolve(splitPos - 1));
	if (!range1) return false;
	const getRange2From = mapPos(tr, splitPos + 1);
	const getRange2To = mapPos(tr, $to.pos);
	dedentRange(range1, tr, void 0, true);
	let range2 = tr.doc.resolve(getRange2From()).blockRange(tr.doc.resolve(getRange2To()));
	if (range2 && range2.depth >= depth) {
		range2 = new NodeRange(range2.$from, range2.$to, depth);
		dedentRange(range2, tr, true, void 0);
	}
	return true;
}
function dedentNodeRange(range, tr) {
	if (isListNode(range.parent)) return safeLiftRange(tr, range);
	else if (isListsRange(range)) return dedentOutOfList(tr, range);
	else return safeLiftRange(tr, range);
}
function safeLiftRange(tr, range) {
	if (moveRangeSiblings(tr, range)) range = new NodeRange(tr.doc.resolve(range.$from.pos), tr.doc.resolve(range.$to.pos), range.depth);
	return safeLift(tr, range);
}
function moveRangeSiblings(tr, range) {
	const listType = getListType(tr.doc.type.schema);
	const { $to, depth, end, parent, endIndex } = range;
	const endOfParent = $to.end(depth);
	if (end < endOfParent) {
		const lastChild = parent.maybeChild(endIndex - 1);
		if (!lastChild) return false;
		if (endIndex < parent.childCount && lastChild.canReplace(lastChild.childCount, lastChild.childCount, parent.content, endIndex, parent.childCount)) {
			tr.step(new ReplaceAroundStep(end - 1, endOfParent, end, endOfParent, new Slice(Fragment.from(listType.create(null)), 1, 0), 0, true));
			return true;
		} else {
			tr.step(new ReplaceAroundStep(end, endOfParent, end, endOfParent, new Slice(Fragment.from(listType.create(null)), 0, 0), 1, true));
			return true;
		}
	}
	return false;
}
function fixEndBoundary(range, tr) {
	if (range.endIndex - range.startIndex >= 2) range = new NodeRange(range.$to.doc.resolve(range.$to.posAtIndex(range.endIndex - 1, range.depth)), range.$to, range.depth);
	const contentRange = zoomInRange(range);
	if (contentRange) {
		fixEndBoundary(contentRange, tr);
		range = new NodeRange(tr.doc.resolve(range.$from.pos), tr.doc.resolve(range.$to.pos), range.depth);
	}
	moveRangeSiblings(tr, range);
}
function dedentOutOfList(tr, range) {
	const { startIndex, endIndex, parent } = range;
	const getRangeStart = mapPos(tr, range.start);
	const getRangeEnd = mapPos(tr, range.end);
	for (let end = getRangeEnd(), i = endIndex - 1; i > startIndex; i--) {
		end -= parent.child(i).nodeSize;
		tr.delete(end - 1, end + 1);
	}
	const $start = tr.doc.resolve(getRangeStart());
	const listNode = $start.nodeAfter;
	if (!listNode) return false;
	const start = range.start;
	const end = start + listNode.nodeSize;
	if (getRangeEnd() !== end) return false;
	if (!$start.parent.canReplace(startIndex, startIndex + 1, Fragment.from(listNode))) return false;
	tr.step(new ReplaceAroundStep(start, end, start + 1, end - 1, new Slice(Fragment.empty, 0, 0), 0, true));
	return true;
}
//#endregion
//#region src/commands/enter-without-lift.ts
/**
* This command has the same behavior as the `Enter` keybinding from
* `prosemirror-commands`, but without the `liftEmptyBlock` command.
*
* @internal
*/
const enterWithoutLift = chainCommands(newlineInCode, createParagraphNear, splitBlock);
//#endregion
//#region src/utils/in-collapsed-list.ts
function inCollapsedList($pos) {
	for (let depth = $pos.depth; depth >= 0; depth--) {
		const node = $pos.node(depth);
		if (isListNode(node)) {
			if (node.attrs.collapsed) return true;
		}
	}
	return false;
}
//#endregion
//#region src/commands/indent-list.ts
/**
* Returns a command function that increases the indentation of selected list
* nodes.
*
* @public @group Commands
*/
function createIndentListCommand(options) {
	const indentListCommand = (state, dispatch) => {
		const tr = state.tr;
		const $from = options?.from == null ? tr.selection.$from : tr.doc.resolve(options.from);
		const $to = options?.to == null ? tr.selection.$to : tr.doc.resolve(options.to);
		const range = findListsRange($from, $to) || $from.blockRange($to);
		if (!range) return false;
		if (indentRange(range, tr)) {
			dispatch?.(tr);
			return true;
		}
		return false;
	};
	return withVisibleSelection(withAutoFixList(indentListCommand));
}
function indentRange(range, tr, startBoundary, endBoundary) {
	const { depth, $from, $to } = range;
	startBoundary = startBoundary || atStartBlockBoundary($from, depth + 1);
	if (!startBoundary) {
		const { startIndex, endIndex } = range;
		if (endIndex - startIndex === 1) {
			const contentRange = zoomInRange(range);
			return contentRange ? indentRange(contentRange, tr) : false;
		} else return splitAndIndentRange(range, tr, startIndex + 1);
	}
	endBoundary = endBoundary || atEndBlockBoundary($to, depth + 1);
	if (!endBoundary && !inCollapsedList($to)) {
		const { startIndex, endIndex } = range;
		if (endIndex - startIndex === 1) {
			const contentRange = zoomInRange(range);
			return contentRange ? indentRange(contentRange, tr) : false;
		} else return splitAndIndentRange(range, tr, endIndex - 1);
	}
	return indentNodeRange(range, tr);
}
/**
* Split a range into two parts, and indent them separately.
*/
function splitAndIndentRange(range, tr, splitIndex) {
	const { $from, $to, depth } = range;
	const splitPos = $from.posAtIndex(splitIndex, depth);
	const range1 = $from.blockRange(tr.doc.resolve(splitPos - 1));
	if (!range1) return false;
	const getRange2From = mapPos(tr, splitPos + 1);
	const getRange2To = mapPos(tr, $to.pos);
	indentRange(range1, tr, void 0, true);
	const range2 = tr.doc.resolve(getRange2From()).blockRange(tr.doc.resolve(getRange2To()));
	if (range2) indentRange(range2, tr, true, void 0);
	return true;
}
/**
* Increase the indentation of a block range.
*/
function indentNodeRange(range, tr) {
	const listType = getListType(tr.doc.type.schema);
	const { parent, startIndex } = range;
	const prevChild = startIndex >= 1 && parent.child(startIndex - 1);
	if (prevChild && isListNode(prevChild)) {
		const { start, end } = range;
		tr.step(new ReplaceAroundStep(start - 1, end, start, end, new Slice(Fragment.from(listType.create(null)), 1, 0), 0, true));
		return true;
	}
	const isParentListNode = isListNode(parent);
	const isFirstChildListNode = isListNode(parent.maybeChild(startIndex));
	if (startIndex === 0 && isParentListNode || isFirstChildListNode) {
		const { start, end } = range;
		const listAttrs = isFirstChildListNode ? parent.child(startIndex).attrs : isParentListNode ? parent.attrs : null;
		tr.step(new ReplaceAroundStep(start, end, start, end, new Slice(Fragment.from(listType.create(listAttrs)), 0, 0), 1, true));
		return true;
	}
	return false;
}
//#endregion
//#region src/utils/at-textblock-start.ts
function atTextblockStart(state, view) {
	const { $cursor } = state.selection;
	if (!$cursor || (view ? !view.endOfTextblock("backward", state) : $cursor.parentOffset > 0)) return null;
	return $cursor;
}
//#endregion
//#region src/commands/join-textblocks-around.ts
function joinTextblocksAround(tr, $cut, dispatch) {
	let beforeText = $cut.nodeBefore, beforePos = $cut.pos - 1;
	for (; !beforeText.isTextblock; beforePos--) {
		if (beforeText.type.spec.isolating) return false;
		let child = beforeText.lastChild;
		if (!child) return false;
		beforeText = child;
	}
	let afterText = $cut.nodeAfter, afterPos = $cut.pos + 1;
	for (; !afterText.isTextblock; afterPos++) {
		if (afterText.type.spec.isolating) return false;
		let child = afterText.firstChild;
		if (!child) return false;
		afterText = child;
	}
	let step = replaceStep(tr.doc, beforePos, afterPos, Slice.empty);
	if (!step || step.from != beforePos || step instanceof ReplaceStep && step.slice.size >= afterPos - beforePos) return false;
	if (dispatch) {
		tr.step(step);
		tr.setSelection(TextSelection.create(tr.doc, beforePos));
		dispatch(tr.scrollIntoView());
	}
	return true;
}
//#endregion
//#region src/commands/join-collapsed-backward.ts
/**
* If the selection is empty and at the start of a block, and there is a
* collapsed list node right before the cursor, move current block and append it
* to the first child of the collapsed list node (i.e. skip the hidden content).
*
* @public @group Commands
*/
const joinCollapsedListBackward = (state, dispatch, view) => {
	const $cursor = atTextblockStart(state, view);
	if (!$cursor) return false;
	const $cut = findCutBefore($cursor);
	if (!$cut) return false;
	const { nodeBefore, nodeAfter } = $cut;
	if (nodeBefore && nodeAfter && isListNode(nodeBefore) && nodeBefore.attrs.collapsed && nodeAfter.isBlock) {
		const tr = state.tr;
		const listPos = $cut.pos - nodeBefore.nodeSize;
		tr.delete($cut.pos, $cut.pos + nodeAfter.nodeSize);
		const insert = listPos + 1 + nodeBefore.child(0).nodeSize;
		tr.insert(insert, nodeAfter);
		const $insert = tr.doc.resolve(insert);
		tr.setSelection(TextSelection.near($insert));
		if (joinTextblocksAround(tr, $insert, dispatch)) return true;
	}
	return false;
};
function findCutBefore($pos) {
	if (!$pos.parent.type.spec.isolating) for (let i = $pos.depth - 1; i >= 0; i--) {
		if ($pos.index(i) > 0) return $pos.doc.resolve($pos.before(i + 1));
		if ($pos.node(i).type.spec.isolating) break;
	}
	return null;
}
//#endregion
//#region src/commands/join-list-up.ts
/**
* If the text cursor is at the start of the first child of a list node, lift
* all content inside the list. If the text cursor is at the start of the last
* child of a list node, lift this child.
*
* @public @group Commands
*/
const joinListUp = (state, dispatch, view) => {
	const $cursor = atTextblockStart(state, view);
	if (!$cursor) return false;
	const { depth } = $cursor;
	if (depth < 2) return false;
	const listDepth = depth - 1;
	const listNode = $cursor.node(listDepth);
	if (!isListNode(listNode)) return false;
	const indexInList = $cursor.index(listDepth);
	if (indexInList === 0) {
		if (dispatch) liftListContent(state, dispatch, $cursor);
		return true;
	}
	if (indexInList === listNode.childCount - 1) {
		if (dispatch) liftParent(state, dispatch, $cursor);
		return true;
	}
	return false;
};
function liftListContent(state, dispatch, $cursor) {
	const tr = state.tr;
	const listDepth = $cursor.depth - 1;
	if (safeLift(tr, new NodeRange($cursor, tr.doc.resolve($cursor.end(listDepth)), listDepth))) dispatch(tr);
}
function liftParent(state, dispatch, $cursor) {
	const tr = state.tr;
	const range = $cursor.blockRange();
	if (range && safeLift(tr, range)) dispatch(tr);
}
//#endregion
//#region src/commands/protect-collapsed.ts
/**
* This command will protect the collapsed items from being deleted.
*
* If current selection contains a collapsed item, we don't want the user to
* delete this selection by pressing Backspace or Delete, because this could
* be unintentional.
*
* In such case, we will stop the delete action and expand the collapsed items
* instead. Therefore the user can clearly know what content he is trying to
* delete.
*
* @public @group Commands
*
*/
const protectCollapsed = (state, dispatch) => {
	const tr = state.tr;
	let found = false;
	const { from, to } = state.selection;
	state.doc.nodesBetween(from, to, (node, pos, parent, index) => {
		if (found && !dispatch) return false;
		if (parent && isCollapsedListNode(parent) && index >= 1) {
			found = true;
			if (!dispatch) return false;
			const $pos = state.doc.resolve(pos);
			tr.setNodeAttribute($pos.before($pos.depth), "collapsed", false);
		}
	});
	if (found) dispatch?.(tr);
	return found;
};
//#endregion
//#region src/utils/create-and-fill.ts
function createAndFill(type, attrs, content, marks) {
	const node = type.createAndFill(attrs, content, marks);
	if (!node) throw new RangeError(`Failed to create '${type.name}' node`);
	node.check();
	return node;
}
//#endregion
//#region src/utils/is-node-selection.ts
function isNodeSelection(selection) {
	return Boolean(selection.node);
}
//#endregion
//#region src/utils/is-block-node-selection.ts
function isBlockNodeSelection(selection) {
	return isNodeSelection(selection) && selection.node.type.isBlock;
}
//#endregion
//#region src/utils/is-text-selection.ts
function isTextSelection(value) {
	return Boolean(value && value instanceof TextSelection);
}
//#endregion
//#region src/commands/split-list.ts
/**
* Returns a command that split the current list node.
*
* @public @group Commands
*
*/
function createSplitListCommand() {
	return withAutoFixList(chainCommands(splitBlockNodeSelectionInListCommand, splitListCommand));
}
function deriveListAttributes(listNode) {
	return { kind: listNode.attrs.kind };
}
const splitBlockNodeSelectionInListCommand = (state, dispatch) => {
	if (!isBlockNodeSelection(state.selection)) return false;
	const { $to, node } = state.selection;
	const parent = $to.parent;
	if (isListNode(node) || !isListNode(parent) || parent.childCount !== 1 || parent.firstChild !== node) return false;
	const listType = parent.type;
	const nextList = listType.createAndFill(deriveListAttributes(parent));
	if (!nextList) return false;
	if (dispatch) {
		const tr = state.tr;
		const cutPoint = $to.pos;
		tr.replace(cutPoint, cutPoint, new Slice(Fragment.fromArray([listType.create(), nextList]), 1, 1));
		const newSelection = TextSelection.near(tr.doc.resolve(cutPoint));
		if (isTextSelection(newSelection)) {
			tr.setSelection(newSelection);
			dispatch(tr);
		}
	}
	return true;
};
const splitListCommand = (state, dispatch) => {
	if (isBlockNodeSelection(state.selection)) return false;
	const { $from, $to } = state.selection;
	if (!$from.sameParent($to)) return false;
	if ($from.depth < 2) return false;
	const listDepth = $from.depth - 1;
	const listNode = $from.node(listDepth);
	if (!isListNode(listNode)) return false;
	const parent = $from.parent;
	const indexInList = $from.index(listDepth);
	const parentEmpty = parent.content.size === 0;
	if (indexInList === 0) if (parentEmpty) {
		const $listEnd = state.doc.resolve($from.end(listDepth));
		const listParentDepth = listDepth - 1;
		const listParent = $from.node(listParentDepth);
		const range = $from.index(listParentDepth) === listParent.childCount - 1 ? new NodeRange($from, $listEnd, listParentDepth) : new NodeRange($from, $listEnd, listDepth);
		const tr = state.tr;
		if (range && dedentNodeRange(range, tr)) {
			dispatch?.(tr);
			return true;
		}
		return false;
	} else return doSplitList(state, listNode, dispatch);
	else if (parentEmpty) return enterWithoutLift(state, dispatch);
	else return false;
};
/**
* @internal
*/
function doSplitList(state, listNode, dispatch) {
	const tr = state.tr;
	const listType = listNode.type;
	const attrs = listNode.attrs;
	const newAttrs = deriveListAttributes(listNode);
	tr.delete(tr.selection.from, tr.selection.to);
	const { $from, $to } = tr.selection;
	const { parentOffset } = $to;
	const atStart = parentOffset == 0;
	const atEnd = parentOffset == $to.parent.content.size;
	if (atStart) {
		if (dispatch) {
			const pos = $from.before(-1);
			tr.insert(pos, createAndFill(listType, newAttrs));
			dispatch(tr.scrollIntoView());
		}
		return true;
	}
	if (atEnd && attrs.collapsed) {
		if (dispatch) {
			const pos = $from.after(-1);
			tr.insert(pos, createAndFill(listType, newAttrs));
			tr.setSelection(Selection.near(tr.doc.resolve(pos)));
			dispatch(tr.scrollIntoView());
		}
		return true;
	}
	const nextType = atEnd ? listNode.contentMatchAt(0).defaultType : void 0;
	const typesAfter = [{
		type: listType,
		attrs: newAttrs
	}, nextType ? { type: nextType } : null];
	if (!canSplit(tr.doc, $from.pos, 2, typesAfter)) return false;
	dispatch?.(tr.split($from.pos, 2, typesAfter).scrollIntoView());
	return true;
}
//#endregion
//#region src/commands/keymap.ts
/**
* Keybinding for `Enter`. It's chained with following commands:
*
* - {@link protectCollapsed}
* - {@link createSplitListCommand}
*
* @public @group Commands
*/
const enterCommand = chainCommands(protectCollapsed, createSplitListCommand());
/**
* Keybinding for `Backspace`. It's chained with following commands:
*
* - {@link protectCollapsed}
* - [deleteSelection](https://prosemirror.net/docs/ref/#commands.deleteSelection)
* - {@link joinListUp}
* - {@link joinCollapsedListBackward}
* - [joinTextblockBackward](https://prosemirror.net/docs/ref/#commands.joinTextblockBackward)
* - [selectNodeBackward](https://prosemirror.net/docs/ref/#commands.selectNodeBackward)
*
* @public @group Commands
*
*/
const backspaceCommand = chainCommands(protectCollapsed, deleteSelection, joinListUp, joinCollapsedListBackward, joinTextblockBackward, selectNodeBackward);
/**
* Keybinding for `Delete`. It's chained with following commands:
*
* - {@link protectCollapsed}
* - [deleteSelection](https://prosemirror.net/docs/ref/#commands.deleteSelection)
* - [joinTextblockForward](https://prosemirror.net/docs/ref/#commands.joinTextblockForward)
* - [selectNodeForward](https://prosemirror.net/docs/ref/#commands.selectNodeForward)
*
* @public @group Commands
*
*/
const deleteCommand = chainCommands(protectCollapsed, deleteSelection, joinTextblockForward, selectNodeForward);
/**
* Returns an object containing the keymap for the list commands.
*
* - `Enter`: See {@link enterCommand}.
* - `Backspace`: See {@link backspaceCommand}.
* - `Delete`: See {@link deleteCommand}.
* - `Mod-[`: Decrease indentation. See {@link createDedentListCommand}.
* - `Mod-]`: Increase indentation. See {@link createIndentListCommand}.
*
* @public @group Commands
*/
const listKeymap = {
	Enter: enterCommand,
	Backspace: backspaceCommand,
	Delete: deleteCommand,
	"Mod-[": createDedentListCommand(),
	"Mod-]": createIndentListCommand()
};
//#endregion
//#region src/utils/cut-by-index.ts
function cutByIndex(fragment, from, to) {
	return fragment.cutByIndex(from, to);
}
//#endregion
//#region src/commands/move-list.ts
/**
* Returns a command function that moves up or down selected list nodes.
*
* @public @group Commands
*
*/
function createMoveListCommand(direction) {
	const moveList = (state, dispatch) => {
		const tr = state.tr;
		if (doMoveList(tr, direction, true, !!dispatch)) {
			dispatch?.(tr);
			return true;
		}
		return false;
	};
	return withAutoFixList(moveList);
}
/** @internal */
function doMoveList(tr, direction, canDedent, dispatch) {
	const { $from, $to } = tr.selection;
	const range = findListsRange($from, $to);
	if (!range) return false;
	const { parent, depth, startIndex, endIndex } = range;
	if (direction === "up") if (startIndex >= 2 || startIndex === 1 && isListNode(parent.child(0))) {
		const before = cutByIndex(parent.content, startIndex - 1, startIndex);
		const selected = cutByIndex(parent.content, startIndex, endIndex);
		if (parent.canReplace(startIndex - 1, endIndex, selected.append(before))) {
			if (dispatch) {
				tr.insert($from.posAtIndex(endIndex, depth), before);
				tr.delete($from.posAtIndex(startIndex - 1, depth), $from.posAtIndex(startIndex, depth));
			}
			return true;
		} else return false;
	} else if (canDedent && isListNode(parent)) return safeLift(tr, range) && doMoveList(tr, direction, false, dispatch);
	else return false;
	else if (endIndex < parent.childCount) {
		const selected = cutByIndex(parent.content, startIndex, endIndex);
		const after = cutByIndex(parent.content, endIndex, endIndex + 1);
		if (parent.canReplace(startIndex, endIndex + 1, after.append(selected))) {
			if (dispatch) {
				tr.delete($from.posAtIndex(endIndex, depth), $from.posAtIndex(endIndex + 1, depth));
				tr.insert($from.posAtIndex(startIndex, depth), after);
			}
			return true;
		} else return false;
	} else if (canDedent && isListNode(parent)) return safeLift(tr, range) && doMoveList(tr, direction, false, dispatch);
	else return false;
}
//#endregion
//#region src/commands/toggle-collapsed.ts
/**
* Return a command function that toggle the `collapsed` attribute of the list node.
*
* @public @group Commands
*/
function createToggleCollapsedCommand(options = {}) {
	const { collapsed = void 0, isToggleable = defaultIsToggleable } = options;
	const toggleCollapsed = (state, dispatch) => {
		const { $from } = state.selection;
		for (let depth = $from.depth; depth >= 0; depth--) {
			const node = $from.node(depth);
			if (isListNode(node) && isToggleable(node)) {
				if (dispatch) {
					const pos = $from.before(depth);
					const attrs = node.attrs;
					const tr = state.tr;
					tr.setNodeAttribute(pos, "collapsed", collapsed ?? !attrs.collapsed);
					dispatch(setSafeSelection(tr));
				}
				return true;
			}
		}
		return false;
	};
	return toggleCollapsed;
}
function defaultIsToggleable(node) {
	return node.attrs.kind === "toggle" && node.childCount >= 2 && !isListNode(node.firstChild);
}
//#endregion
//#region src/commands/unwrap-list.ts
/**
* Returns a command function that unwraps the list around the selection.
*
* @public @group Commands
*/
function createUnwrapListCommand(options) {
	const kind = options?.kind;
	const unwrapList = (state, dispatch) => {
		const selection = state.selection;
		if (isNodeSelection(selection) && isTargetList(selection.node, kind)) {
			if (dispatch) {
				const tr = state.tr;
				safeLiftFromTo(tr, tr.selection.from + 1, tr.selection.to - 1);
				dispatch(tr.scrollIntoView());
			}
			return true;
		}
		const range = selection.$from.blockRange(selection.$to);
		if (range && isTargetListsRange(range, kind)) {
			const tr = state.tr;
			if (dedentOutOfList(tr, range)) {
				dispatch?.(tr);
				return true;
			}
		}
		if (range && isTargetList(range.parent, kind)) {
			if (dispatch) {
				const tr = state.tr;
				safeLiftFromTo(tr, range.$from.start(range.depth), range.$to.end(range.depth));
				dispatch(tr.scrollIntoView());
			}
			return true;
		}
		return false;
	};
	return unwrapList;
}
function isTargetList(node, kind) {
	if (isListNode(node)) {
		if (kind) return node.attrs.kind === kind;
		return true;
	}
	return false;
}
function isTargetListsRange(range, kind) {
	const { startIndex, endIndex, parent } = range;
	for (let i = startIndex; i < endIndex; i++) if (!isTargetList(parent.child(i), kind)) return false;
	return true;
}
//#endregion
//#region src/commands/wrap-in-list.ts
/**
* Returns a command function that wraps the selection in a list with the given
* type and attributes.
*
* @public @group Commands
*/
function createWrapInListCommand(getAttrs) {
	const wrapInList = (state, dispatch) => {
		const { $from, $to } = state.selection;
		let range = $from.blockRange($to);
		if (!range) return false;
		if (rangeAllowInlineContent(range) && isListNode(range.parent) && range.depth > 0 && range.startIndex === 0) range = new NodeRange($from, $to, range.depth - 1);
		const attrs = typeof getAttrs === "function" ? getAttrs(range) : getAttrs;
		if (!attrs) return false;
		const { parent, startIndex, endIndex, depth } = range;
		const tr = state.tr;
		const listType = getListType(state.schema);
		for (let i = endIndex - 1; i >= startIndex; i--) {
			const node = parent.child(i);
			if (isListNode(node)) {
				const oldAttrs = node.attrs;
				const newAttrs = {
					...oldAttrs,
					...attrs
				};
				setNodeAttributes(tr, $from.posAtIndex(i, depth), oldAttrs, newAttrs);
			} else {
				const beforeNode = $from.posAtIndex(i, depth);
				const afterNode = $from.posAtIndex(i + 1, depth);
				let nodeStart = beforeNode + 1;
				let nodeEnd = afterNode - 1;
				if (nodeStart > nodeEnd) [nodeStart, nodeEnd] = [nodeEnd, nodeStart];
				const range = new NodeRange(tr.doc.resolve(nodeStart), tr.doc.resolve(nodeEnd), depth);
				const wrapping = findWrapping(range, listType, attrs);
				if (wrapping) tr.wrap(range, wrapping);
			}
		}
		dispatch?.(tr);
		return true;
	};
	return wrapInList;
}
function rangeAllowInlineContent(range) {
	const { parent, startIndex, endIndex } = range;
	for (let i = startIndex; i < endIndex; i++) if (parent.child(i).inlineContent) return true;
	return false;
}
//#endregion
//#region src/commands/toggle-list.ts
/**
* Returns a command function that wraps the selection in a list with the given
* type and attributes, or change the list kind if the selection is already in
* another kind of list, or unwrap the selected list if otherwise.
*
* @public @group Commands
*/
function createToggleListCommand(attrs) {
	return chainCommands(createUnwrapListCommand({ kind: attrs.kind }), createWrapInListCommand(attrs));
}
//#endregion
//#region src/dom-events.ts
/** @internal */
function handleListMarkerMouseDown({ view, event, onListClick = defaultListClickHandler }) {
	const target = event.target;
	if (target?.closest(".list-marker-click-target")) {
		event.preventDefault();
		return handleMouseDown(view.posAtDOM(target, -10, -10), onListClick)(view.state, (tr) => view.dispatch(tr));
	}
	return false;
}
function handleMouseDown(pos, onListClick) {
	const mouseDown = (state, dispatch) => {
		const tr = state.tr;
		const $pos = tr.doc.resolve(pos);
		const list = $pos.parent;
		if (!isListNode(list)) return false;
		const listPos = $pos.before($pos.depth);
		const attrs = onListClick(list);
		if (setNodeAttributes(tr, listPos, list.attrs, attrs)) dispatch?.(tr);
		return true;
	};
	return withSafeSelection(mouseDown);
}
/** @internal */
const defaultListClickHandler = (node) => {
	const attrs = node.attrs;
	if (attrs.kind === "task") return {
		...attrs,
		checked: !attrs.checked
	};
	else if (attrs.kind === "toggle") return {
		...attrs,
		collapsed: !attrs.collapsed
	};
	else return attrs;
};
//#endregion
//#region src/input-rule.ts
/**
* Build an input rule for automatically wrapping a textblock into a list node
* when a given string is typed.
*
* @public @group Input Rules
*/
function wrappingListInputRule(regexp, getAttrs) {
	return new InputRule(regexp, (state, match, start, end) => {
		const tr = state.tr;
		tr.deleteRange(start, end);
		const $pos = tr.selection.$from;
		const listNode = $pos.index(-1) === 0 && $pos.node(-1);
		if (listNode && isListNode(listNode)) {
			const oldAttrs = listNode.attrs;
			const newAttrs = typeof getAttrs === "function" ? getAttrs({
				match,
				attributes: oldAttrs
			}) : getAttrs;
			const entries = Object.entries(newAttrs).filter(([key, value]) => {
				return oldAttrs[key] !== value;
			});
			if (entries.length === 0) return null;
			else {
				const pos = $pos.before(-1);
				for (const [key, value] of entries) tr.setNodeAttribute(pos, key, value);
				return tr;
			}
		}
		const range = tr.doc.resolve(start).blockRange();
		if (!range) return null;
		const newAttrs = typeof getAttrs === "function" ? getAttrs({ match }) : getAttrs;
		const wrapping = findWrapping(range, getListType(state.schema), newAttrs);
		if (!wrapping) return null;
		return tr.wrap(range, wrapping);
	});
}
/**
* All input rules for lists.
*
* @public @group Input Rules
*/
const listInputRules = [
	wrappingListInputRule(/^\s?([*-])\s$/, {
		kind: "bullet",
		collapsed: false
	}),
	wrappingListInputRule(/^\s?(\d+)\.\s$/, ({ match }) => {
		const order = parseInteger(match[1]);
		return {
			kind: "ordered",
			collapsed: false,
			order: order != null && order >= 2 ? order : null
		};
	}),
	wrappingListInputRule(/^\s?\[([\sXx]?)]\s$/, ({ match }) => {
		return {
			kind: "task",
			checked: ["x", "X"].includes(match[1]),
			collapsed: false
		};
	}),
	wrappingListInputRule(/^\s?>>\s$/, { kind: "toggle" })
];
//#endregion
//#region src/migrate.ts
function migrateNodes(nodes) {
	const content = [];
	let updated = false;
	for (const node of nodes) if (node.type === "bullet_list" || node.type === "bulletList") {
		updated = true;
		for (const child of node.content ?? []) content.push(migrateNode(child, { kind: "bullet" })[0]);
	} else if (node.type === "ordered_list" || node.type === "orderedList") {
		updated = true;
		for (const child of node.content ?? []) content.push(migrateNode(child, { kind: "ordered" })[0]);
	} else if (node.type === "task_list" || node.type === "taskList") {
		updated = true;
		for (const child of node.content ?? []) content.push(migrateNode(child, { kind: "task" })[0]);
	} else content.push(node);
	return [content, updated];
}
function migrateNode(node, { kind } = {}) {
	if (node.type === "list_item" || node.type === "listItem" || node.type === "taskListItem") return [{
		...node,
		type: "list",
		attrs: {
			collapsed: Boolean(node.attrs?.closed),
			...node.attrs,
			kind: kind ?? "bullet"
		},
		content: node.content ? migrateNodes(node.content)[0] : void 0
	}, true];
	else if (node.content) {
		const [content, updated] = migrateNodes(node.content);
		return [{
			...node,
			content
		}, updated];
	} else return [node, false];
}
/**
* Migrate a ProseMirror document JSON object from the old list structure to the
* new. A new document JSON object is returned if the document is updated,
* otherwise `null` is returned.
*
* @public
*/
function migrateDocJSON(docJSON) {
	const [migrated, updated] = migrateNode(docJSON);
	return updated ? migrated : null;
}
//#endregion
//#region src/utils/browser.ts
const nav = typeof navigator != "undefined" ? navigator : null;
const agent = nav && nav.userAgent || "";
const ie_edge = /Edge\/(\d+)/.exec(agent);
const ie_upto10 = /MSIE \d/.exec(agent);
const ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(agent);
const safari = !!!(ie_upto10 || ie_11up || ie_edge) && !!nav && /Apple Computer/.test(nav.vendor);
//#endregion
//#region src/node-view.ts
/**
* A simple node view that is used to render the list node. It ensures that the
* list node get updated when its marker styling should changes.
*
* @public @group Plugins
*/
const createListNodeView = (node) => {
	let prevNode = node;
	const prevNested = node.firstChild?.type === node.type;
	const prevSingleChild = node.childCount === 1;
	const spec = node.type.spec.toDOM(node);
	const { dom, contentDOM } = DOMSerializer.renderSpec(document, spec);
	if (safari && node.attrs.kind === "toggle") dom.querySelector(".list-marker-click-target")?.appendChild(document.createElement("span"));
	const update = (node) => {
		if (!node.sameMarkup(prevNode)) return false;
		const nested = node.firstChild?.type === node.type;
		const singleChild = node.childCount === 1;
		if (prevNested !== nested || prevSingleChild !== singleChild) return false;
		prevNode = node;
		return true;
	};
	return {
		dom,
		contentDOM,
		update
	};
};
//#endregion
//#region src/utils/list-serializer.ts
/**
* A custom DOM serializer class that can serialize flat list nodes into native
* HTML list elements (i.e. `<ul>` and `<ol>`).
*
* @public @group Plugins
*/
var ListDOMSerializer = class ListDOMSerializer extends DOMSerializer {
	static nodesFromSchema(schema) {
		return {
			...DOMSerializer.nodesFromSchema(schema),
			list: (node) => listToDOM({
				node,
				nativeList: true,
				getMarkers: () => null
			})
		};
	}
	static fromSchema(schema) {
		return schema.cached.listDomSerializer || (schema.cached.listDomSerializer = new ListDOMSerializer(this.nodesFromSchema(schema), this.marksFromSchema(schema)));
	}
	serializeFragment(fragment, options, target) {
		return joinListElements(super.serializeFragment(fragment, options, target));
	}
};
/**
* Merge adjacent <ul> elements or adjacent <ol> elements into a single list element.
*
* @public
*/
function joinListElements(parent) {
	for (let i = 0; i < parent.childNodes.length; i++) {
		const child = parent.children.item(i);
		if (!child) continue;
		if (child.tagName === "UL" || child.tagName === "OL") {
			let next = null;
			while (next = child.nextElementSibling, next?.tagName === child.tagName) {
				child.append(...Array.from(next.children));
				next.remove();
			}
		}
		joinListElements(child);
	}
	return parent;
}
//#endregion
//#region src/utils/unwrap-list-slice.ts
/**
* Reduce the open depth of a slice if it only contains a single list node. When
* copying some text from a deep nested list node, we don't want to paste the
* entire list structure into the document later.
*
* @internal
*/
function unwrapListSlice(slice) {
	while (slice.openStart >= 2 && slice.openEnd >= 2 && slice.content.childCount === 1 && isListNode(slice.content.child(0))) slice = new Slice(slice.content.child(0).content, slice.openStart - 1, slice.openEnd - 1);
	return slice;
}
//#endregion
//#region src/plugins/clipboard.ts
/**
* Serialize list nodes into native HTML list elements (i.e. `<ul>`, `<ol>`) to
* clipboard. See {@link ListDOMSerializer}.
*
* @public @group Plugins
*/
function createListClipboardPlugin(schema) {
	return new Plugin({ props: {
		clipboardSerializer: ListDOMSerializer.fromSchema(schema),
		transformCopied: unwrapListSlice
	} });
}
//#endregion
//#region src/plugins/event.ts
/**
* Handle DOM events for list.
*
* @public @group Plugins
*/
function createListEventPlugin() {
	return new Plugin({ props: { handleDOMEvents: { mousedown: (view, event) => handleListMarkerMouseDown({
		view,
		event
	}) } } });
}
//#endregion
//#region src/plugins/rendering.ts
/**
* Handle the list node rendering.
*
* @public @group Plugins
*/
function createListRenderingPlugin() {
	return new Plugin({ props: { nodeViews: { list: createListNodeView } } });
}
//#endregion
//#region src/plugins/safari-workaround.ts
/**
* Return a plugin as a workaround for a bug in Safari that causes the composition
* based IME to remove the empty HTML element with CSS `position: relative`.
*
* See also https://github.com/ProseMirror/prosemirror/issues/934
*
* @public @group Plugins
*/
function createSafariInputMethodWorkaroundPlugin() {
	return imeSpan;
}
//#endregion
//#region src/plugins/index.ts
/**
* This function returns an array of plugins that are required for list to work.
*
* The plugins are shown below. You can pick and choose which plugins you want
* to use if you want to customize some behavior.
*
* - {@link createListEventPlugin}
* - {@link createListRenderingPlugin}
* - {@link createListClipboardPlugin}
* - {@link createSafariInputMethodWorkaroundPlugin}
*
* @public @group Plugins
*/
function createListPlugins(options) {
	const { schema } = options;
	return [
		createListEventPlugin(),
		createListRenderingPlugin(),
		createListClipboardPlugin(schema),
		createSafariInputMethodWorkaroundPlugin()
	];
}
//#endregion
//#region src/utils/range-to-string.ts
/**
* Return a debugging string that describes this range.
*
* @internal
*/
function rangeToString(range) {
	const { parent, startIndex, endIndex } = range;
	return cutByIndex(parent.content, startIndex, endIndex).toString();
}
//#endregion
export { ListDOMSerializer, backspaceCommand, createDedentListCommand, createIndentListCommand, createListClipboardPlugin, createListEventPlugin, createListNodeView, createListPlugins, createListRenderingPlugin, createListSpec, createMoveListCommand, createParseDomRules, createSafariInputMethodWorkaroundPlugin, createSplitListCommand, createToggleCollapsedCommand, createToggleListCommand, createUnwrapListCommand, createWrapInListCommand, defaultAttributesGetter, defaultListClickHandler, defaultMarkerGetter, deleteCommand, doSplitList, enterCommand, enterWithoutLift, findCheckboxInListItem, findListsRange, flatListGroup, getListType, handleListMarkerMouseDown, isCollapsedListNode, isListNode, isListType, isListsRange, joinCollapsedListBackward, joinListElements, joinListUp, listInputRules, listKeymap, listToDOM, migrateDocJSON, parseInteger, protectCollapsed, rangeToString, setSafeSelection, unwrapListSlice, wrappingListInputRule };

//# sourceMappingURL=prosemirror-flat-list.js.map