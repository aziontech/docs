<template>
	<section class="flex flex-col gap-(--spacing-md)">
		<p v-if="description">{{ description }}</p>

		<div
			v-if="actionable.length"
			data-doc-chrome
			class="flex flex-row flex-wrap items-center gap-(--spacing-sm)"
		>
			<Button
				v-for="(button, index) in actionable"
				:key="index"
				v-bind="toButtonProps(button)"
			/>
		</div>

		<div
			v-if="$slots.content"
			class="flex min-w-full flex-col gap-(--spacing-md) xl:flex-row"
		>
			<slot name="content" />
		</div>
	</section>
</template>

<script setup>
	import { computed } from 'vue';

	import Button from '@aziontech/webkit/button';

	const props = defineProps({
		description: {
			type: String,
			default: () => ''
		},
		buttons: {
			type: Array,
			default: () => []
		}
	});

	const actionable = computed(() => props.buttons.filter((button) => button.link));

	const toButtonProps = (button) => ({
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
						: 'primary'
	});
</script>
