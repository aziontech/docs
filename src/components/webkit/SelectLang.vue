<template>
	<!-- The reference footer's language control: webkit's Select at its 7rem measure, a globe
	     leading the trigger, and the locale shown as its short code. -->
	<div class="w-28">
		<Select
			v-if="i18nPages"
			:model-value="current"
			:display-value="code"
			placeholder="Language"
			@update:model-value="onSelect"
		>
			<Select.Trigger aria-label="Language">
				<template #iconLeft>
					<i
						class="pi pi-globe text-(--text-muted)"
						aria-hidden="true"
					/>
				</template>
			</Select.Trigger>
			<Select.Content>
				<Select.Option
					v-for="option in i18nPages"
					:key="option.langPrefix"
					:value="option.langPrefix"
				>
					{{ code(option.langPrefix) }}
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

const current = props.lang.toLowerCase();

/** `en` reads as `EN`, `pt-br` as `PT-BR`. */
const code = (value) => String(value).toUpperCase();

function onSelect(value) {
	const page = props.i18nPages?.find((option) => option.langPrefix === value);
	if (page && value !== current) window.location.assign(page.slug);
}
</script>
