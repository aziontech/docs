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
	| 'store-ai'
	| 'connector'
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
	/** Body tag: whether the resource is required, optional, or yours. */
	tag: { label: string; severity: TopologyTagSeverity };
	/** Identity row: what the resource does, in two or three words. */
	role: string;
	/** Body: what you enable or create on the resource, each linking to its reference. */
	items?: TopologyItem[];
	/** Language-prefixed permalink of the resource's reference page. */
	href: string;
	/** Ends its branch: the card receives a connector and originates none. */
	terminal?: boolean;
}

/** A connector the flow cannot draw by itself: from the top edge of one card to the bottom
 * edge of the card above it in the same column. */
export interface TopologyLink {
	from: TopologyNodeId;
	to: TopologyNodeId;
}

export interface PlatformTopologyContent {
	lang: Lang;
	/** Accessible name of the diagram. */
	ariaLabel: string;
	/** Label of the link that closes every card body. */
	referenceLabel: string;
	/** Left to right. Adjacent columns pair their cards in order, so the order inside a column is
	 * the wiring; a `terminal` card sends nothing to the next column. */
	columns: TopologyNode[][];
	links: TopologyLink[];
}
