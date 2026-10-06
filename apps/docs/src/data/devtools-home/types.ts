import type { Heading, Lang, SectionFooter } from '~/data/docs-home/types';

export interface DevtoolsHero {
	title: string;
	description: string;
	buttonLabel: string;
	buttonLink: string;
}

/** Labels of the panel that shows the documentation home's setup prompt before it is copied. */
export interface PromptPreview {
	label: string;
	hideLabel: string;
	title: string;
	copyLabel: string;
	copiedLabel: string;
}

/** A tool card's own dressing; its title, description and link come from the hub tree. */
export interface ToolCard {
	icon: string;
	link: string;
}

export interface DevtoolsHomeContent {
	lang: Lang;
	hero: DevtoolsHero;
	promptPreview: PromptPreview;
	tools: {
		heading: Heading;
		intro: string;
		/** Keyed by tree id. */
		cards: Record<string, ToolCard>;
		footer: SectionFooter;
	};
}
