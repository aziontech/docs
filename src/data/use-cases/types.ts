import type { Lang } from '~/data/docs-home/types';

/** The five Solutions the Use Case catalog files every entry under. */
export type UseCaseSolutionId =
	| 'build-and-run-applications'
	| 'improve-performance-and-reliability'
	| 'build-and-run-ai-workloads'
	| 'secure-applications-and-networks'
	| 'deliver-media-and-streaming';

/** One catalogued Use Case. The catalog is the source of the names; this module carries every entry
 * so that the pages listing use cases read one source, and `featured` picks the few a page shows. */
export interface UseCase {
	id: string;
	solution: UseCaseSolutionId;
	/** The Use Case name, as the catalog states it. */
	title: string;
	/** Language-prefixed permalink of the page that implements it, when one is published. */
	href?: string;
	/** Listed by the pages that show a selection, such as How Azion works. */
	featured?: boolean;
}

export interface UseCaseCatalogContent {
	lang: Lang;
	/** Solution names, keyed by id. */
	solutions: Record<UseCaseSolutionId, string>;
	/** Catalog order. */
	useCases: UseCase[];
}
