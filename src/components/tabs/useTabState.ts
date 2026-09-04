import { onMounted, onUnmounted, ref, type Ref } from 'vue';

import { tabStore } from './store';

/**
 * Follows the shared tab choice stored under `storeKey`, resting on
 * `fallback` while nothing has been chosen.
 *
 * The subscription opens on mount and never during SSR: `tabStore` is a module
 * singleton, so subscribing on the server would both leak a listener per render
 * and let one request's choice bleed into the next. Rendering `fallback` on the
 * server and again on the client's first pass is also what keeps the two
 * markups identical, which is all hydration compares.
 */
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

/**
 * The active tab of a single tab view: shared across the page when the author
 * passed a `sharedStore` key, local to this view otherwise.
 *
 * In the shared case writes go to the store and come back through the
 * subscription above, so sibling views on the page move together instead of
 * each keeping its own copy of the answer.
 */
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
