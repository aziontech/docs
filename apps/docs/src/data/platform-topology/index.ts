import type { Lang } from '~/data/docs-home/types';

import { en } from './en';
import { ptBr } from './pt-br';
import type { PlatformTopologyContent } from './types';

export type { PlatformTopologyContent, TopologyItem, TopologyNode, TopologyNodeId } from './types';

export const platformTopology: Record<Lang, PlatformTopologyContent> = {
	en,
	'pt-br': ptBr,
};
