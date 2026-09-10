<template>
	<!-- `w-28` (112px), the width the marketing site's footer gives this control: the
	     Select's trigger is `w-full`, so the wrapper is what sizes it, and a control
	     that sized itself to its content would change width between EN and PT-BR.

	     `shrink-0` because the footer's status band is a flex row: without it the
	     control gives up its width to the status text beside it at narrow widths and
	     lands at ~83px, which is the one thing a fixed width was for. -->
	<div v-if="i18nPages?.length" class="w-28 shrink-0">
		<Select
			:model-value="activeSlug"
			:display-value="displayValue"
			:placeholder="LANGUAGE_LABEL"
			@update:model-value="onSelect"
		>
			<Select.Trigger :aria-label="LANGUAGE_LABEL">
				<!-- THE GLOBE NAMES THE CONTROL WITHOUT SPENDING A WORD ON IT. A bare
				     `EN` in a footer row reads as a label until you click it; the glyph
				     is what says this is the language switch. It rides the trigger's own
				     `iconLeft` slot rather than a wrapper, so it sits inside the
				     control's border and on its `--spacing-xs` gap, and `aria-hidden`
				     keeps it out of the accessible name the `aria-label` already carries. -->
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

<script setup>
import Select from '@aziontech/webkit/select';

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

const LANGUAGE_LABEL = 'Language';

// THE OPTION LABEL IS THE LANGUAGE CODE, not its name in its own language: the control
// is 112px wide with a glyph and a chevron inside it, which fits `PT-BR` and truncates
// `Português`. The codes are also what the marketing site's footer shows, so a reader
// crossing from azion.com into the docs sees the same switch.
const LANGUAGE_CODES = {
	en: 'EN',
	'pt-br': 'PT-BR',
	es: 'ES',
};

const codeFor = (langPrefix) => LANGUAGE_CODES[langPrefix] ?? langPrefix.toUpperCase();

// The VALUE is the target page's own slug — this control navigates, so what it carries
// has to be a destination, not a label. `displayValue` is how the trigger still reads as
// a code: it maps the selected slug back to the language it belongs to.
const activePage = props.i18nPages?.find((page) => page.langPrefix === props.lang.toLowerCase());
const activeSlug = activePage?.slug;

const displayValue = (slug) => {
	const page = props.i18nPages?.find((option) => option.slug === slug);
	return page ? codeFor(page.langPrefix) : '';
};

function onSelect(slug) {
	if (slug && slug !== activeSlug) window.location.assign(slug);
}
</script>
