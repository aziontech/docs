<template>
	<span class="inline-flex h-8 items-center">
		<!--
			Docs-side adapter around @aziontech/webkit's Dropdown. The DS `select` is
			still `draft` in the catalog, so the navigation dropdown is the supported
			control for this.

			`placement="auto"` replaces the hand-rolled "is there room below?"
			measurement this component used to run on every open — the footer sits at
			the bottom of the page, so in practice the panel resolves upward.
		-->
		<Dropdown v-if="i18nPages" placement="auto" @select="onSelect">
			<DropdownTrigger>
				<span
					class="flex h-8 items-center gap-2 rounded-[var(--shape-button)] border border-default bg-surface px-4 text-sm text-default transition-colors hover:bg-hover"
				>
					<span v-if="activeLang">{{ activeLang.lang }}</span>
					<i class="pi pi-chevron-down text-xs" aria-hidden="true" />
				</span>
			</DropdownTrigger>

			<DropdownGroup>
				<DropdownOption
					v-for="option in i18nPages"
					:key="option.langPrefix"
					:value="option.slug"
					:selected="option.langPrefix === activeLang?.langPrefix"
				>
					<!--
					A real anchor, not just the label text: it keeps the
					translated route crawlable and middle-clickable, exactly as
					the previous list did. The option itself is a
					`role="menuitem"` div, so the keyboard path never reaches
					this element — that is what `onSelect` below covers.
				-->
					<a :href="option.slug" class="block w-full text-inherit no-underline">{{
						option.lang
					}}</a>
				</DropdownOption>
			</DropdownGroup>
		</Dropdown>
	</span>
</template>

<script setup>
import Dropdown, {
	DropdownGroup,
	DropdownOption,
	DropdownTrigger,
} from '@aziontech/webkit/dropdown';

const props = defineProps({
	i18nPages: {
		type: Array,
		required: false,
	},
	lang: {
		type: String,
		required: true,
		default: 'en',
	},
});

// The list only ever holds the languages this page actually exists in, so a
// page with no translation has nothing to switch to and `activeLang` stays
// undefined — the trigger then renders bare, as it always has.
const activeLang = props.i18nPages
	? props.i18nPages.find((p) => p.langPrefix === props.lang.toLowerCase())
	: null;

function onSelect(_event, slug) {
	// Mouse clicks land on the anchor above and navigate natively; this covers
	// Enter/Space on the option, and re-targets the same URL when it does not.
	window.location.assign(slug);
}
</script>
