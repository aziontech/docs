import type {
	MenuGroupNode,
	SidebarHeader as SidebarHeaderModel,
	SidebarParent,
} from '~/nav/resolve';
import type { PlatformVersion, Stage } from '~/nav/versions';

/** The rail's props, in a file of their own so the island that wires the version in can type them. */
export interface DocsSidebarProps {
	groups: MenuGroupNode[];
	activeId?: string;
	initialExpanded?: string[];
	header?: SidebarHeaderModel | null;
	ariaLabel?: string;
	filterPlaceholder?: string;
	noMatchesLabel?: string;
	catalogGroups?: MenuGroupNode[] | null;
	treesHref?: string;
	backLabel?: string;
	backToPattern?: string;
	parentLevel?: SidebarParent | null;
	/** The platform version whose rows show; the host owns the choice. */
	version?: PlatformVersion;
	/** Words for the stage tags. */
	stageLabels?: Record<Stage, string>;
	/** Short names for the version tags (`v3.x`, `v4.x`). */
	versionLabels?: Record<PlatformVersion, string>;
}
