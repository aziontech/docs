import { onMounted, onUnmounted, ref, type Ref } from 'vue';

import { tabStore } from './store';

export function useSharedTab(storeKey: string | undefined, fallback: string): Ref<string> {
	const curr = ref(fallback);

	let unsubscribe: (() => void) | undefined;

	onMounted(() => {
		if (!storeKey) return;
		unsubscribe = tabStore.subscribe((value) => {
			const next = value[storeKey]?.curr;
			if (next) curr.value = next;
		});
	});

	onUnmounted(() => unsubscribe?.());

	return curr;
}

export function useTabState(initial: string, storeKey?: string) {
	const curr = useSharedTab(storeKey, initial);

	const setCurr = (next: string) => {
		if (storeKey) {
			tabStore.setKey(storeKey, { curr: next });
			return;
		}
		curr.value = next;
	};

	return { curr, setCurr };
}
