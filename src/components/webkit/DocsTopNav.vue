<template>
	<!-- The section links, hoisted into their own island. NavigationMenu's
	     sliding hover highlight (the pill behind the pointed-at link) is a
	     client-only feature — it lives on `pointerenter` handlers and a
	     provide/inject context that only exist once Vue mounts, so it stayed
	     dead inside the server-only Header.vue. This island hydrates just the
	     nav (`client:idle` in BaseLayout.astro), the same way the drawer
	     trigger and the search dialog already do, while the rest of the bar
	     (brand, GitHub, Console) stays plain SSR markup with nothing to
	     hydrate. -->
	<NavigationMenu
		aria-label="Documentation sections"
		class="hidden lg:flex"
	>
		<NavigationMenu.List class="items-center gap-(--spacing-xxs)">
			<NavigationMenu.Item
				v-for="link in topLinks"
				:key="link.href"
			>
				<NavigationMenu.Trigger :href="link.href">{{ link.label }}</NavigationMenu.Trigger>
			</NavigationMenu.Item>
		</NavigationMenu.List>
	</NavigationMenu>
</template>

<script setup>
	import NavigationMenu from '@aziontech/webkit/navigation-menu'

	// Docs top-bar links, verbatim from the webkit docs sample.
	const topLinks = [
		{ label: 'Directory', href: '#directory' },
		{ label: 'API', href: '#api' },
		{ label: 'SDKs', href: '#sdks' },
		{ label: 'Changelog', href: '#changelog' }
	]
</script>
