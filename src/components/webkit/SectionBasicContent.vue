<template>
	<section class="flex flex-col gap-(--spacing-md)">
		<p v-if="description">{{ description }}</p>

		<div
			v-if="actionable.length"
			data-doc-chrome
			class="flex flex-row flex-wrap items-center gap-(--spacing-sm)"
		>
			<Button v-for="(button, index) in actionable" :key="index" v-bind="toButtonProps(button)" />
		</div>

		<div v-if="$slots.content" class="flex min-w-full flex-col gap-(--spacing-md) xl:flex-row">
			<slot name="content" />
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import Button from '@aziontech/webkit/button';

/** A call to action. `textLink`/`text`/`outlined`/`severity` are legacy spellings. */
export interface SectionButton {
	label?: string;
	link?: string;
	target?: string;
	icon?: string;
	textLink?: boolean;
	text?: boolean;
	outlined?: boolean;
	severity?: string;
}

interface Props {
	/** Body copy for the section. */
	description?: string;
	/** Calls to action; entries without a link are dropped. */
	buttons?: SectionButton[];
}

const props = withDefaults(defineProps<Props>(), {
	description: '',
	buttons: () => [],
});

defineSlots<{
	/** The section's body, when richer than `description`. */
	content(): unknown;
}>();

const actionable = computed(() => props.buttons.filter((button) => button.link));

const toButtonProps = (button: SectionButton) => ({
	label: button.label,
	href: button.link,
	target: button.target,
	icon: button.icon,
	size: 'medium',
	kind:
		button.textLink || button.text
			? 'text'
			: button.outlined
			? 'outlined'
			: button.severity === 'secondary'
			? 'secondary'
			: 'primary',
});
</script>
