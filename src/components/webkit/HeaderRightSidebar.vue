<template>
	<!-- open sidebar button -->
	<button
		type="button"
		@click="visibleRight = true"
		class="p-button p-component p-button-sm p-button-icon-only lg:hidden flex text-white flex-none border-header w-8 h-8 bg-header hover:bg-header-button-hover items-center justify-center"
		aria-label="Menu"
	>
		<span class="pi pi-bars p-button-icon text-white" data-pc-section="icon"></span>
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
			class="p-sidebar-mask fixed inset-0 z-[1100] bg-black/40 flex justify-end"
			@click.self="visibleRight = false"
		>
			<!-- sidebar -->
			<aside
				class="p-sidebar p-sidebar-right p-component relative flex flex-col md:pt-3 pb-20 h-[100%] border-l surface-border w-[20rem] md:w-[22rem] text-sm"
				role="complementary"
				aria-modal="true"
			>
				<div class="p-sidebar-content grow overflow-y-auto">
					<!-- close sidebar button -->
					<div class="flex justify-end pb-6 pr-2 md:pr-0">
						<button
							type="button"
							@click="visibleRight = false"
							class="p-button p-component p-button-sm p-button-outlined p-button-icon-only flex-none w-8 h-8 items-center justify-center"
							aria-label="Close"
						>
							<span class="pi pi-times p-button-icon" data-pc-section="icon"></span>
						</button>
					</div>

					<!-- slot to receive custom menu -->
					<slot name="main-content" />

					<template v-if="menuSecondary">
						<div
							class="p-divider p-component p-divider-horizontal my-8"
							role="separator"
						></div>
						<div class="p-menu p-component p-0 w-full border-none bg-transparent">
							<ul
								class="p-menu-list list-none p-0 m-0"
								role="menu"
							>
								<template
									v-for="(entry, entryIndex) in menuSecondary"
									:key="entryIndex"
								>
									<li
										v-if="entry.items && entry.label"
										class="p-submenu-header"
									>
										{{ entry.label }}
									</li>
									<li
										v-for="(item, itemIndex) in entry.items || [entry]"
										:key="itemIndex"
										class="p-menuitem"
										role="menuitem"
									>
										<a
											v-if="item.url"
											:target="item.target"
											:href="item.url"
											class="p-menuitem-link p-2 flex gap-2 no-underline"
										>
											<span
												v-if="item.icon"
												:class="item.icon"
											></span>
											<span class="ml-2 font-medium text-sm">
												{{ item.label }}
											</span>
											<span
												v-for="tag in item.tags"
												:key="tag"
												class="p-tag p-component p-tag-info"
											>
												<span class="p-tag-value">{{ tag }}</span>
											</span>
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
										? 'flex gap-2 justify-between p-button p-button-primary p-button-sm whitespace-nowrap'
										: 'flex gap-2 p-button p-button-primary p-button-outlined p-button-sm text-white hover:surface-hover whitespace-nowrap',
									{ 'p-button-info': button.severity === 'info' }
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
