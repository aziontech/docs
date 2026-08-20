<template>
	<!-- open sidebar button -->
	<button
		type="button"
		@click="visibleRight = true"
		class="wk-drawer-icon-button lg:hidden flex flex-none w-8 h-8 items-center justify-center"
		aria-label="Menu"
	>
		<span
			class="pi pi-bars"
			data-pc-section="icon"
		></span>
	</button>

	<!-- Teleport only after mount: Astro islands SSR this component, and a
	     server-rendered teleport has no matching node on the client (the
	     drawer is closed until interaction anyway). -->
	<Teleport
		v-if="isMounted"
		to="body"
	>
		<!-- mask -->
		<div
			v-if="visibleRight"
			class="fixed inset-0 z-[1100] bg-[var(--bg-backdrop)] flex justify-end"
			@click.self="visibleRight = false"
		>
			<!-- sidebar -->
			<aside
				class="relative flex flex-col md:pt-3 pb-20 h-[100%] border-l border-default bg-surface text-default w-[20rem] md:w-[22rem] text-sm"
				role="complementary"
				aria-modal="true"
			>
				<div class="grow overflow-y-auto p-3 md:p-8">
					<!-- close sidebar button -->
					<div class="flex justify-end pb-6 pr-2 md:pr-0">
						<button
							type="button"
							@click="visibleRight = false"
							class="wk-drawer-icon-button flex flex-none w-8 h-8 items-center justify-center"
							aria-label="Close"
						>
							<span
								class="pi pi-times"
								data-pc-section="icon"
							></span>
						</button>
					</div>

					<!-- slot to receive custom menu -->
					<slot name="main-content" />

					<template v-if="menuSecondary">
						<div
							class="my-8 w-full border-t border-t-[var(--border-default)]"
							role="separator"
						></div>
						<div class="w-full p-0 bg-transparent">
							<ul
								class="list-none p-0 m-0"
								role="menu"
							>
								<template
									v-for="(entry, entryIndex) in menuSecondary"
									:key="entryIndex"
								>
									<li
										v-if="entry.items && entry.label"
										class="px-2 py-2 text-xs font-medium uppercase tracking-wider text-muted"
									>
										{{ entry.label }}
									</li>
									<li
										v-for="(item, itemIndex) in entry.items || [entry]"
										:key="itemIndex"
										role="menuitem"
									>
										<a
											v-if="item.url"
											:target="item.target"
											:href="item.url"
											class="p-2 flex gap-2 items-center no-underline rounded-[var(--shape-elements)] text-default hover:bg-[var(--bg-hover)]"
										>
											<span
												v-if="item.icon"
												:class="item.icon"
											></span>
											<span class="ml-2 font-medium text-sm">
												{{ item.label }}
											</span>
											<Tag
												v-for="tag in item.tags"
												:key="tag"
												:value="tag"
												severity="info"
											/>
										</a>
									</li>
								</template>
							</ul>
						</div>
					</template>

					<template v-if="bottomButtons">
						<div class="fixed bottom-6 flex gap-2 items-center">
							<a
								v-for="(button, index) in bottomButtons"
								:key="index"
								:href="button.url"
								:title="button.urlTitle"
								:class="[
									button.destak
										? 'wk-drawer-button wk-drawer-button-primary justify-between'
										: 'wk-drawer-button wk-drawer-button-outlined',
									{ 'wk-drawer-button-info': button.severity === 'info' }
								]"
							>
								{{ button.label }}
								<i
									v-if="button.icon"
									:class="button.icon"
								></i>
							</a>
						</div>
					</template>
				</div>
			</aside>
		</div>
	</Teleport>
</template>

<script setup>
	import { onBeforeUnmount, onMounted, onUpdated, ref } from 'vue'
	import Tag from '~/components/webkit/Tag.vue'

	let props = defineProps({
		menuData: Object,
		menuSecondary: Array,
		bottomButtons: Array
	})

	const { menuSecondary, bottomButtons } = props
	const visibleRight = ref(false)
	const isMounted = ref(false)

	function getHTMLElement() {
		return document.querySelector('html')
	}

	function pageScroll(action) {
		const overflow = action === 'stop' ? 'hidden' : 'auto'
		getHTMLElement().style.overflow = overflow

		return overflow
	}

	onUpdated(() => {
		visibleRight.value ? pageScroll('stop') : pageScroll('auto')
	})

	function onDocumentKeydown(event) {
		if (event.key === 'Escape' && visibleRight.value) visibleRight.value = false
	}

	onMounted(() => {
		isMounted.value = true
		document.addEventListener('keydown', onDocumentKeydown)
	})

	onBeforeUnmount(() => {
		document.removeEventListener('keydown', onDocumentKeydown)
	})
</script>

<style scoped>
	/*
		Visual port of azion-theme's PrimeVue `.p-button` (small size) variants
		used by this drawer -- the outlined icon buttons that open/close it and
		the call-to-action links pinned to its bottom edge. Rebuilt on
		@aziontech/theme v4 tokens.
	*/
	.wk-drawer-icon-button {
		background: transparent;
		border: var(--border-width-default) solid var(--border-default);
		border-radius: var(--shape-button);
		color: var(--text-default);
		font-size: var(--text-sm);
		cursor: pointer;
		user-select: none;
		transition:
			background-color var(--transition-duration-fast-02) var(--ease-productive-entrance),
			border-color var(--transition-duration-fast-02) var(--ease-productive-entrance);
	}

	.wk-drawer-icon-button:hover,
	.wk-drawer-icon-button:active {
		background: var(--bg-hover);
	}

	.wk-drawer-button {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-xs);
		white-space: nowrap;
		padding: var(--spacing-xxs) var(--spacing-sm);
		border: var(--border-width-default) solid transparent;
		border-radius: var(--shape-button);
		font-size: var(--text-sm);
		font-weight: 500;
		line-height: 1.25rem;
		text-decoration: none;
		cursor: pointer;
		user-select: none;
		transition:
			background-color var(--transition-duration-fast-02) var(--ease-productive-entrance),
			border-color var(--transition-duration-fast-02) var(--ease-productive-entrance),
			color var(--transition-duration-fast-02) var(--ease-productive-entrance);
	}

	.wk-drawer-button-primary {
		background: var(--primary);
		border-color: var(--primary);
		color: var(--primary-contrast);
	}

	.wk-drawer-button-outlined {
		background: transparent;
		border-color: var(--border-default);
		color: var(--text-default);
	}

	.wk-drawer-button-outlined:hover,
	.wk-drawer-button-outlined:active {
		background: var(--bg-hover);
	}

	/* info severity (last, so it wins over the primary/outlined variants) */
	.wk-drawer-button-info,
	.wk-drawer-button-info:hover,
	.wk-drawer-button-info:active {
		background: var(--info);
		border-color: var(--info-border);
		color: var(--info-contrast);
	}
</style>
