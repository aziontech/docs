<template>
	<!-- Plain list markup on purpose: it sits inside the prose, which styles lists and links,
	     so the rendered list matches the markdown lists around it. -->
	<ul v-bind="$attrs" :data-testid="testId">
		<li v-for="useCase in shown" :key="useCase.id">
			<a v-if="useCase.href" :href="useCase.href">{{ useCase.title }}</a>
			<template v-else>{{ useCase.title }}</template>
		</li>
	</ul>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

import type { Lang } from '~/data/docs-home/types';
import { useCaseCatalog } from '~/data/use-cases';
import type { UseCaseSolutionId } from '~/data/use-cases';

defineOptions({ name: 'UseCaseList', inheritAttrs: false });

interface Props {
	/** The Solution whose use cases the list shows. */
	solution: UseCaseSolutionId;
	/** Language of the titles and the permalinks. */
	lang?: Lang;
	/** Only the featured selection, or every catalogued use case of the Solution. */
	featured?: boolean;
}

const props = withDefaults(defineProps<Props>(), { lang: 'en', featured: true });

const attrs = useAttrs();

const testId = computed(
	() => (attrs['data-testid'] as string | undefined) ?? `use-case-list-${props.solution}`
);
const shown = computed(() =>
	useCaseCatalog[props.lang].useCases.filter(
		(useCase) => useCase.solution === props.solution && (!props.featured || useCase.featured)
	)
);
</script>
