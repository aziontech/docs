<template>
	<!-- `w-28` (112px) matches the marketing footer, and the wrapper is what sizes the
	     control: the Select's trigger is `w-full`, and content-sizing would change width
	     between EN and PT-BR. `shrink-0` keeps the flex band from squeezing it to ~83px. -->
	<div v-if="i18nPages?.length" class="w-28 shrink-0">
		<Select
			:model-value="activeSlug"
			:display-value="displayValue"
			:placeholder="LANGUAGE_LABEL"
			@update:model-value="onSelect"
		>
			<Select.Trigger :aria-label="LANGUAGE_LABEL">
				<!-- The globe names the control: a bare `EN` reads as a label, not a switch.
				     It rides the trigger's `iconLeft` slot so it sits inside the border on
				     the control's own gap; `aria-hidden` leaves the name to `aria-label`. -->
				<template #iconLeft>
					<i class="pi pi-globe text-(--text-muted)" aria-hidden="true" />
				</template>
			</Select.Trigger>

			<Select.Content>
				<Select.Option v-for="option in i18nPages" :key="option.langPrefix" :value="option.slug">
					{{ codeFor(option.langPrefix) }}
				</Select.Option>
			</Select.Content>
		</Select>
	</div>
</template>

<script setup lang="ts">
import Select from '@aziontech/webkit/select';

/** One translation of the current page. */
interface I18nPage {
	langPrefix: string;
	slug: string;
	lang: string;
}

interface Props {
	/** Every language this page exists in. */
	i18nPages?: I18nPage[];
	/** The language currently being read. */
	lang?: string;
}

const props = withDefaults(defineProps<Props>(), {
	i18nPages: undefined,
	lang: 'en',
});

const LANGUAGE_LABEL = 'Language';

// Options are language codes, not endonyms: 112px with a glyph and chevron fits `PT-BR`
// but truncates `Português`, and codes are what the marketing footer shows.
const LANGUAGE_CODES = {
	en: 'EN',
	'pt-br': 'PT-BR',
	es: 'ES',
};

const codeFor = (langPrefix: string) =>
	LANGUAGE_CODES[langPrefix as keyof typeof LANGUAGE_CODES] ?? langPrefix.toUpperCase();

// The value is the target page's slug, since this control navigates; `displayValue` maps
// the selected slug back to its language so the trigger still reads as a code.
const activePage = props.i18nPages?.find((page) => page.langPrefix === props.lang.toLowerCase());
const activeSlug = activePage?.slug;

const displayValue = (slug: string) => {
	const page = props.i18nPages?.find((option) => option.slug === slug);
	return page ? codeFor(page.langPrefix) : '';
};

function onSelect(slug) {
	if (slug && slug !== activeSlug) window.location.assign(slug);
}
</script>
