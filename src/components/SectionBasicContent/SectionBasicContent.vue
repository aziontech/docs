<template>
	<!--
		The 70 content files that use this only ever pass `description`,
		`buttons` and a `content` slot -- never a `title`, which is why it does
		not route to webkit's SectionTitle: that requires `title` and would
		emit an empty `h2` for every one of them.

		The description is a bare `<p>` so DocProse paints it like any other
		paragraph in the article body. `data-doc-chrome` goes on the actions
		row, not on each button, whose `data-doc-block` top margin would land
		on every item of the flex row.
	-->
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

	// A button with no destination rendered nothing before and still does.
	const actionable = computed(() => props.buttons.filter((button) => button.link));

	/*
		Maps the authored button shape (link / severity / outlined / text) onto
		webkit Button. No `iconPos`: Button always puts the icon before the
		label, which is what the authored `iconPos: 'left'` asked for.
	*/
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
