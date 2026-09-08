<template>
	<span class="inline-flex h-8 items-center">
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

const activeLang = props.i18nPages
	? props.i18nPages.find((p) => p.langPrefix === props.lang.toLowerCase())
	: null;

function onSelect(_event, slug) {
	window.location.assign(slug);
}
</script>
