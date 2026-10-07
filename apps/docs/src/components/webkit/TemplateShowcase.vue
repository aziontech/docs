<template>
	<SectionBasicContent :description="description" :buttons="buttons">
		<template #content>
			<div class="min-w-(--container-2xs) flex-1">
				<slot name="details" />
			</div>
			<div class="flex flex-1 items-center justify-center">
				<img :src="image" :alt="imageAlt" class="h-auto w-full max-w-full" loading="lazy" />
			</div>
		</template>
	</SectionBasicContent>
</template>

<script setup lang="ts">
import SectionBasicContent, { type SectionButton } from './SectionBasicContent.vue';

interface Props {
	/** Body copy for the section. */
	description?: string;
	/** Calls to action; forwarded to SectionBasicContent. */
	buttons?: SectionButton[];
	/** Screenshot of the template, shown beside the details table. */
	image: string;
	/** Accessible description of the screenshot. */
	imageAlt: string;
}

withDefaults(defineProps<Props>(), {
	description: '',
	buttons: () => [],
});

defineSlots<{
	/** The details table (repository, framework, use case). */
	details(): unknown;
}>();
</script>
