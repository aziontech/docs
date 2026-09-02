<template>
	<!--
		What 70 content files actually ask of this component, measured rather
		than assumed: `description`, `buttons`, a `content` slot, and
		`titleTag` on seven of them, which had no effect because none of the 70
		passes a `title`. Everything else the two former variants and their
		shared ContentSection accepted -- title, overline, descriptionRawHtml,
		id, margin, position, reverse, isSticky, textCenter, pt, hasContainer,
		and the `title` / `main` / `principal` slots -- had no call site at all.

		So the design system's SectionTitle, which the titled branch of
		ContentSection used to route to, is *not* what these pages are:
		SectionTitle takes `title` as a required prop and would emit an empty
		`h2` for every one of them. A section with no heading is the gap;
		DocProse covers the rest.

		The description is a bare `<p>` on purpose. These sections render inside
		the article body, so DocProse paints it with the same
		`text-body-prose-md` / `--text-muted` / rhythm as every other paragraph
		on the page -- which is what the old hand-written
		`text-muted text-base leading-relaxed text-balance` was approximating.
		Leaving it unmarked is the change: no local typography at all.

		The actions row keeps one `data-doc-chrome` wrapper (not DocButton per
		button, whose `data-doc-block` top margin would land on each item of a
		flex row) so DocProse leaves the Buttons' own tokens alone.

		The two-column band around the `content` slot stays local. It is page
		layout, and the design system has no container or two-column primitive
		to hand it to.
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
		Maps the author-shaped button objects in src/content (the old
		LinkButton prop surface: link / severity / outlined / text) onto webkit
		Button's props. `iconPos` is not in the mapping: Button places its icon
		before the label and has no position prop, which is what the authored
		`iconPos: 'left'` already asked for.
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
