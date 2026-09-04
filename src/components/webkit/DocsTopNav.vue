<template>
	<!-- The directory half of the navigation: reachable from any page, and the
	     only place the product one-liners and the developer tools appear. The
	     sidebar answers "where am I", this answers "what else is there". It is
	     an island because the sliding hover highlight and the disclosure panels
	     only exist once Vue mounts. -->
	<NavigationMenu
		:aria-label="ariaLabel"
		class="hidden lg:flex"
	>
		<NavigationMenu.List class="items-center gap-(--spacing-xxs)">
			<NavigationMenu.Item
				v-if="products.length"
				value="products"
			>
				<NavigationMenu.Trigger>
					{{ labels.products }}
					<NavigationMenu.Icon>
						<svg
							width="12"
							height="12"
							viewBox="0 0 12 12"
							fill="none"
							aria-hidden="true"
						>
							<path
								d="M3 4.5L6 7.5L9 4.5"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</NavigationMenu.Icon>
				</NavigationMenu.Trigger>
				<NavigationMenu.Content class="w-full p-0">
					<div class="grid grid-cols-4 gap-(--spacing-md) p-(--spacing-sm)">
						<NavigationMenu.List
							v-for="column in products"
							:key="column.label"
							:label="column.label"
						>
							<template
								v-for="entry in column.items"
								:key="entry.href"
							>
								<NavigationMenu.Item
									layout="entry"
									:href="entry.href"
									:description="entry.description"
									close-on-click
								>
									{{ entry.label }}
								</NavigationMenu.Item>
								<NavigationMenu.Item
									v-for="module in entry.modules ?? []"
									:key="module.href"
									layout="entry"
									:href="module.href"
									class="ps-(--spacing-md)"
									close-on-click
								>
									{{ module.label }}
								</NavigationMenu.Item>
							</template>
						</NavigationMenu.List>
					</div>
				</NavigationMenu.Content>
			</NavigationMenu.Item>

			<NavigationMenu.Item v-if="guides">
				<NavigationMenu.Trigger :href="guides.href">{{ labels.guides }}</NavigationMenu.Trigger>
			</NavigationMenu.Item>

			<NavigationMenu.Item
				v-if="devtools.length"
				value="devtools"
			>
				<NavigationMenu.Trigger>
					{{ labels.devtools }}
					<NavigationMenu.Icon>
						<svg
							width="12"
							height="12"
							viewBox="0 0 12 12"
							fill="none"
							aria-hidden="true"
						>
							<path
								d="M3 4.5L6 7.5L9 4.5"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</NavigationMenu.Icon>
				</NavigationMenu.Trigger>
				<NavigationMenu.Content class="w-full p-0">
					<div class="grid grid-cols-3 gap-(--spacing-md) p-(--spacing-sm)">
						<NavigationMenu.List>
							<NavigationMenu.Item
								v-for="tool in devtools"
								:key="tool.href"
								layout="entry"
								:href="tool.href"
								:description="tool.description"
								close-on-click
							>
								{{ tool.label }}
							</NavigationMenu.Item>
						</NavigationMenu.List>
					</div>
				</NavigationMenu.Content>
			</NavigationMenu.Item>
		</NavigationMenu.List>

		<NavigationMenu.Portal>
			<NavigationMenu.Positioner
				side="bottom"
				align="start"
				:side-offset="12"
			>
				<NavigationMenu.Popup>
					<NavigationMenu.Arrow />
					<NavigationMenu.Viewport />
				</NavigationMenu.Popup>
			</NavigationMenu.Positioner>
		</NavigationMenu.Portal>
	</NavigationMenu>
</template>

<script setup lang="ts">
	import NavigationMenu from '@aziontech/webkit/navigation-menu'

	interface Entry {
		label: string
		href?: string
		description?: string
		modules?: Entry[]
	}

	interface Column {
		label: string
		items: Entry[]
	}

	withDefaults(
		defineProps<{
			products?: Column[]
			devtools?: Entry[]
			guides?: Entry | null
			labels?: { products: string; guides: string; devtools: string }
			ariaLabel?: string
		}>(),
		{
			products: () => [],
			devtools: () => [],
			guides: null,
			labels: () => ({ products: 'Products', guides: 'Guides', devtools: 'Developer tools' }),
			ariaLabel: 'Documentation'
		}
	)
</script>
