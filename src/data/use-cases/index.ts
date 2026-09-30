import type { Lang } from '~/data/docs-home/types';

import { en } from './en';
import { ptBr } from './pt-br';
import type { UseCaseCatalogContent } from './types';

export type { UseCase, UseCaseCatalogContent, UseCaseSolutionId } from './types';

export const useCaseCatalog: Record<Lang, UseCaseCatalogContent> = {
	en,
	'pt-br': ptBr,
};
