import type { Lang } from '~/data/docs-home/types';

/** Severity values the webkit Tag accepts. */
export type TopologyTagSeverity =
	| 'primary'
	| 'secondary'
	| 'success'
	| 'info'
	| 'warning'
	| 'danger'
	| 'accent'
	| 'contrast';

export type TopologyNodeId =
	| 'workload'
	| 'firewall'
	| 'application'
	| 'custom-pages'
	| 'connector'
	| 'store'
	| 'ai'
	| 'origin';

/** A product or feature listed inside a card once it is open. */
export interface TopologyItem {
	id: string;
	label: string;
	/** Language-prefixed permalink of the item's reference page. */
	href: string;
}

/** One card of the diagram. Its header names the resource; its body opens in place. */
export interface TopologyNode {
	id: TopologyNodeId;
	/** Icon-font class, for example `ai ai-workloads`. */
	icon: string;
	/** Header: the resource kind. */
	kind: string;
	/** Body tag: whether the resource is required or optional. A card that stands for
	 * something outside Azion has none. */
	tag?: { label: string; severity: TopologyTagSeverity };
	/** Body chips: examples of what the card can be, for a card outside Azion. */
	examples?: string[];
	/** Identity row: what the resource does, in two or three words. */
	role: string;
	/** Body: what you enable or create on the resource, each linking to its reference. */
	items?: TopologyItem[];
	/** Language-prefixed permalink of the resource's reference page. A card that groups
	 * resources has none: its items carry the references. */
	href?: string;
	/** Ends its branch: the card receives a connector and originates none. */
	terminal?: boolean;
}

export interface PlatformTopologyContent {
	lang: Lang;
	/** Accessible name of the diagram. */
	ariaLabel: string;
	/** Label of the link that closes every card body. */
	referenceLabel: string;
	/** Left to right. A `terminal` card sends nothing to the next column. When one card of a
	 * column sends, it fans out to every card of the next column; otherwise adjacent columns
	 * pair their cards in order, so the order inside a column is the wiring. */
	columns: TopologyNode[][];
}
