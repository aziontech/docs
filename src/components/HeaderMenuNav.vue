<template>
	<!--
		The header's primary navigation, rebuilt on @aziontech/webkit's
		NavigationMenu. What this file used to be: ~420 lines that hand-rolled a
		mega-menu -- open/close state, an outside-click listener, an Escape
		handler, hover intent, rotating chevrons, panel positioning and a
		`.wk-nav-button*` CSS block ported from azion-theme's PrimeVue button.
		NavigationMenu owns every one of those concerns, so all of it is gone.

		The composition mirrors the design system's own reference usage
		(apps/webkit-sample, SiteNav.vue): a `List` is the bar, each entry is an
		`Item`, and an entry either renders a plain `Trigger` with an `href` or a
		`Trigger` + `Content` panel whose columns are nested `List`s of
		`layout="entry"` items.

		Both shapes are kept even though the docs' current header data only ever
		takes the first one -- `src/i18n/*/header.ts` ships three entries with
		`items: []`, i.e. three plain links. The panel branch is what makes
		adding a submenu a data change rather than a component change.

		Visibility classes go on the Item wrapper, never on the Trigger: the
		design system's own note on this (SiteNav.vue) is that a control's base
		`inline-flex` outranks a `hidden` passed in as a class, so an element
		told to hide itself stays visible. Same cascade trap the header CTAs hit.
	-->
	<NavigationMenu>
		<NavigationMenu.List class="items-center gap-[var(--spacing-xxs)] hidden lg:flex">
			<NavigationMenu.Item
				v-for="(menuitem, index) in menuData?.items || []"
				:key="menuitem.label || index"
				:value="menuitem.ref || menuitem.label || index"
				:class="getBreakpointClass(menuitem)"
			>
				<!-- Leaf entry: a link in the bar, no panel. -->
				<NavigationMenu.Trigger
					v-if="!menuitem.items || !menuitem.items.length"
					:href="menuitem.href || ''"
				>
					{{ menuitem.label }}
				</NavigationMenu.Trigger>

				<!-- Branch entry: label + chevron opening a grouped panel. -->
				<template v-else>
					<NavigationMenu.Trigger>
						{{ menuitem.label }}
						<NavigationMenu.Icon>
							<i
								class="pi pi-angle-down text-sm"
								aria-hidden="true"
							/>
						</NavigationMenu.Icon>
					</NavigationMenu.Trigger>

					<NavigationMenu.Content class="w-full p-0">
						<div class="grid gap-[var(--spacing-md)] p-[var(--spacing-sm)] grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
							<NavigationMenu.List
								v-for="(group, groupIndex) in menuitem.items"
								:key="group.label || groupIndex"
								:label="group.overline || group.label"
							>
								<NavigationMenu.Item
									v-for="(entry, entryIndex) in group.items || [group]"
									:key="entry.label || entryIndex"
									layout="entry"
									:href="entry.href || '#'"
									:description="entry.description"
									close-on-click
								>
									<template
										v-if="entry.icon"
										#icon
									>
										<i
											:class="entry.icon"
											aria-hidden="true"
										/>
									</template>
									{{ entry.label }}
								</NavigationMenu.Item>
							</NavigationMenu.List>
						</div>
					</NavigationMenu.Content>
				</template>
			</NavigationMenu.Item>
		</NavigationMenu.List>
	</NavigationMenu>
</template>

<script setup>
	import NavigationMenu from '@aziontech/webkit/navigation-menu'

	defineProps({
		menuData: {
			type: Object
		}
	})

	/*
		Unchanged from the previous implementation: an entry may declare a
		`minBreakpoint` and only appear from that width up. It lands on the Item
		wrapper (see the template note).
	*/
	const getBreakpointClass = (menu) => {
		const breakpoint = menu?.minBreakpoint
		if (!breakpoint) return ''

		const breakpoints = {
			sm: 'block',
			md: 'hidden md:block',
			lg: 'hidden lg:block',
			xl: 'hidden xl:block',
			'2xl': 'hidden 2xl:block'
		}

		return breakpoints[breakpoint] || ''
	}
</script>
