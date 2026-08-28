<template>
	<!-- open sidebar button -->
	<IconButton
		icon="pi pi-bars"
		aria-label="Menu"
		kind="outlined"
		size="medium"
		class="lg:hidden flex-none"
		@click="visibleRight = true"
	/>

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
						<IconButton
							icon="pi pi-times"
							aria-label="Close"
							kind="outlined"
							size="medium"
							class="flex-none"
							@click="visibleRight = false"
						/>
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
						<!--
							`flex-wrap` and the `small` size below keep the three CTAs
							inside the drawer: webkit's `medium` Button carries a
							`min-w-16` that the hand-styled anchors did not have, which
							pushed the row past the 320px drawer on mobile.
						-->
						<div class="fixed bottom-6 flex flex-wrap gap-2 items-center">
							<Button
								v-for="(button, index) in bottomButtons"
								:key="index"
								:label="button.label"
								:href="button.url"
								:title="button.urlTitle"
								:icon="button.icon"
								:kind="bottomButtonKind(button)"
								size="small"
							/>
						</div>
					</template>
				</div>
			</aside>
		</div>
	</Teleport>
</template>

<script setup>
	import { onBeforeUnmount, onMounted, onUpdated, ref } from 'vue'

	import Button from '@aziontech/webkit/button'
	import IconButton from '@aziontech/webkit/icon-button'

	import Tag from '~/components/webkit/Tag.vue'

	/*
		The drawer's controls come from @aziontech/webkit now (IconButton for
		the open/close triggers, Button for the bottom CTAs) instead of the
		`.wk-drawer-icon-button` / `.wk-drawer-button` CSS this file used to
		carry -- that was a hand-made port of azion-theme's PrimeVue
		`.p-button`, i.e. a parallel implementation of the design system's own
		button.

		`severity: 'info'` has no counterpart among webkit's kinds (theme@4's
		`--info` is a tinted surface, not a button kind), so it falls back to
		`outlined` like everywhere else in this repo.
	*/
	function bottomButtonKind(button) {
		if (button.severity === 'info') return 'outlined'

		return button.destak ? 'primary' : 'outlined'
	}

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

