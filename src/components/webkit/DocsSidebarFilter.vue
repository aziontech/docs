<template>
	<div ref="filterWrap">
		<InputText
			v-model="filter"
			:placeholder="placeholder"
			:aria-label="placeholder"
			size="medium"
		>
			<template #iconRight>
				<Kbd
					size="small"
					class="hidden sm:inline-flex"
				>
					/
				</Kbd>
			</template>
		</InputText>
	</div>
</template>

<script setup>
	import InputText from '@aziontech/webkit/input-text';
	import Kbd from '@aziontech/webkit/kbd';
	import { onBeforeUnmount, onMounted, ref } from 'vue';

	const props = defineProps({
		placeholder: { type: String, default: 'Filter sidebar' },
		/** Whether the `/` key should focus this filter right now (the host that is on screen says yes). */
		hotkey: { type: Boolean, default: true }
	});

	const filter = defineModel({ type: String, default: '' });
	const filterWrap = ref(null);

	function onSlash(event) {
		if (!props.hotkey || event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
		const target = event.target;
		if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
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
