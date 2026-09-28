import type { Heading, Lang, SectionFooter } from '~/data/docs-home/types';
import type { DevtoolsHero } from '~/data/devtools-home/types';

export interface ArchitecturesHomeContent {
	lang: Lang;
	hero: DevtoolsHero;
	directory: {
		heading: Heading;
		intro: string;
		/** Call-to-action label every architecture card carries. */
		cardLink: string;
		/** Card icon per Solution group, keyed by the group's English URL segment. */
		icons: Record<string, string>;
		footer: SectionFooter;
	};
}
