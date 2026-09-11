<template>
	<div class="flex flex-col gap-(--spacing-sm)">
		<div v-if="header" class="flex items-center gap-(--spacing-xs)">
			<IconButton
				icon="pi pi-arrow-left"
				kind="outlined"
				size="small"
				:aria-label="header.backLabel"
				:href="header.backHref"
			/>
			<a :href="header.href" class="truncate text-label-md text-(--text-default) no-underline">
				{{ header.title }}
			</a>
		</div>
		<div ref="filterWrap">
			<InputText
				v-model="filter"
				:placeholder="placeholder"
				:aria-label="placeholder"
				size="medium"
			>
				<template #iconRight>
					<span class="hidden sm:inline-flex">
						<Kbd size="small"> / </Kbd>
					</span>
				</template>
			</InputText>
		</div>
	</div>
</template>

<script setup lang="ts">
import IconButton from '@aziontech/webkit/icon-button';
import InputText from '@aziontech/webkit/input-text';
import Kbd from '@aziontech/webkit/kbd';
import { onBeforeUnmount, onMounted, ref } from 'vue';

import type { SidebarHeader } from '~/nav/resolve';

interface Props {
	/** The rail's header row, when the host shows one. */
	header?: SidebarHeader | null;
	/** Placeholder for the filter input. */
	placeholder?: string;
	/** Whether the `/` key should focus this filter right now (the host that is on screen says yes). */
	hotkey?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	header: null,
	placeholder: 'Filter sidebar',
	hotkey: true,
});

const filter = defineModel<string>({ default: '' });
const filterWrap = ref<HTMLElement | null>(null);

function onSlash(event: KeyboardEvent) {
	if (!props.hotkey || event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
	const target = event.target;
	if (
		target instanceof HTMLElement &&
		(target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
	)
		return;
	const input = filterWrap.value?.querySelector('input');
	if (!input) return;
	event.preventDefault();
	input.focus();
}

onMounted(() => {
	window.addEventListener('keydown', onSlash, true);
});

onBeforeUnmount(() => {
	window.removeEventListener('keydown', onSlash, true);
});
</script>
