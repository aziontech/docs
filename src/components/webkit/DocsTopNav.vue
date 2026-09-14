<template>
	<!-- The bar only exists from `lg` up — the header owns that, so the box carries
	     the visibility and the menu stays untouched. -->
	<div class="hidden lg:block">
		<NavigationMenu :aria-label="ariaLabel">
			<!-- eslint-disable webkit/no-style-override -- design-system gap: the List has
		     no density/alignment props for a horizontal header row (`items-center` +
		     the xxs pitch). Remove when NavigationMenu.List grows that seam. -->
			<NavigationMenu.List class="items-center gap-(--spacing-xxs)">
				<!-- eslint-enable webkit/no-style-override -->
				<template v-for="item in items" :key="item.value">
					<NavigationMenu.Item v-if="item.columns" :value="item.value">
						<NavigationMenu.Trigger>
							{{ item.label }}
							<NavigationMenu.Icon>
								<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
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
						<!-- eslint-disable webkit/no-style-override -- design-system gap: Content
					     has no `inset="none"`/fit-width seam, and the panel must size to its
					     grid and hand the padding inward. Remove when it ships. -->
						<NavigationMenu.Content class="w-max p-0">
							<!-- eslint-enable webkit/no-style-override -->
							<div
								class="grid gap-(--spacing-lg) p-(--spacing-md)"
								:style="{ gridTemplateColumns: `repeat(${item.columns.length}, 18rem)` }"
							>
								<NavigationMenu.List
									v-for="column in item.columns"
									:key="column.label"
									:label="column.label"
								>
									<NavigationMenu.Item
										v-for="entry in column.items"
										:key="entry.href"
										layout="entry"
										:href="entry.href"
										:description="entry.description"
										close-on-click
									>
										{{ entry.label }}
									</NavigationMenu.Item>
								</NavigationMenu.List>
							</div>
						</NavigationMenu.Content>
					</NavigationMenu.Item>

					<NavigationMenu.Item v-else>
						<NavigationMenu.Trigger :href="item.href">{{ item.label }}</NavigationMenu.Trigger>
					</NavigationMenu.Item>
				</template>
			</NavigationMenu.List>

			<NavigationMenu.Portal v-if="isMounted">
				<NavigationMenu.Positioner side="bottom" align="start" :side-offset="12">
					<NavigationMenu.Popup>
						<NavigationMenu.Arrow />
						<NavigationMenu.Viewport />
					</NavigationMenu.Popup>
				</NavigationMenu.Positioner>
			</NavigationMenu.Portal>
		</NavigationMenu>
	</div>
</template>

<script setup lang="ts">
import NavigationMenu from '@aziontech/webkit/navigation-menu';
import { computed, onMounted, ref } from 'vue';

interface Entry {
	label: string;
	href?: string;
	description?: string;
}

interface Column {
	label: string;
	items: Entry[];
}

type Item =
	| { value: string; label: string; columns: Column[]; href?: never }
	| { value: string; label: string; href?: string; columns?: never };

const props = withDefaults(
	defineProps<{
		products?: Column[];
		devtools?: Column[];
		guides?: Entry | null;
		labels?: { products: string; guides: string; devtools: string };
		ariaLabel?: string;
	}>(),
	{
		products: () => [],
		devtools: () => [],
		guides: null,
		labels: () => ({ products: 'Products', guides: 'Guides', devtools: 'Developer tools' }),
		ariaLabel: 'Documentation',
	}
);

const items = computed<Item[]>(() => [
	...(props.products.length
		? [{ value: 'products', label: props.labels.products, columns: props.products }]
		: []),
	...(props.guides
		? [{ value: 'guides', label: props.labels.guides, href: props.guides.href }]
		: []),
	...(props.devtools.length
		? [{ value: 'devtools', label: props.labels.devtools, columns: props.devtools }]
		: []),
]);

// `NavigationMenu.Portal` may only mount client-side; webkit publishes no
// `use-mounted` composable, so guard it with the plain Vue equivalent.
const isMounted = ref(false);
onMounted(() => {
	isMounted.value = true;
});
</script>
