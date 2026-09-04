<template>
	<div class="flex flex-col gap-(--spacing-xl)">
		<section
			v-if="featured.length && !selected"
			class="flex flex-col gap-(--spacing-sm)"
		>
			<h2 class="text-heading-sm text-(--text-default)">{{ labels.featured }}</h2>
			<DocCardGroup>
				<DocCard
					v-for="guide in featured"
					:key="guide.href"
					:title="guide.label"
					:href="guide.href"
				/>
			</DocCardGroup>
		</section>

		<section
			v-if="products.length"
			class="flex flex-col gap-(--spacing-sm)"
		>
			<h2 class="text-heading-sm text-(--text-default)">{{ labels.filter }}</h2>
			<div class="flex flex-wrap items-center gap-(--spacing-xxs)">
				<Chip
					:kind="selected ? 'outlined' : 'filled'"
					size="small"
					clickable
					@click="select('')"
				>
					{{ labels.allProducts }}
				</Chip>
				<Chip
					v-for="product in products"
					:key="product.id"
					:kind="selected === product.id ? 'filled' : 'outlined'"
					size="small"
					clickable
					@click="select(product.id)"
				>
					{{ product.label }}
				</Chip>
			</div>
			<p
				class="text-body-sm text-(--text-muted)"
				aria-live="polite"
			>
				{{ countLabel }}
			</p>
		</section>

		<section
			v-for="area in visibleAreas"
			:key="area.label"
			class="flex flex-col gap-(--spacing-sm)"
		>
			<h2 class="text-heading-sm text-(--text-default)">{{ area.label }}</h2>
			<div class="flex flex-col gap-(--spacing-md)">
				<div
					v-for="sub in area.subs"
					:key="sub.label"
					class="flex flex-col gap-(--spacing-xxs)"
				>
					<h3 class="text-label-md text-(--text-muted)">{{ sub.label }}</h3>
					<FrameBox borders="all">
						<ItemList>
							<DocItem
								v-for="guide in sub.items"
								:key="guide.href"
								:title="guide.label"
								:href="guide.href"
							/>
						</ItemList>
					</FrameBox>
				</div>
			</div>
		</section>

		<p
			v-if="!visibleAreas.length"
			class="text-body-sm text-(--text-muted)"
		>
			{{ labels.empty }}
		</p>
	</div>
</template>

<script setup lang="ts">
	/*
		The hub the guides tree cannot be: seventeen sub-areas deep, the reader
		who thinks "Cache" rather than "Application Performance" needs a filter,
		not a third level of folds. The product chips are that filter, and they
		are deep-linkable so a product section can point straight at its own
		slice (`?product=cache`).
	*/
	import Chip from '@aziontech/webkit/chip'
	import DocCard from '@aziontech/webkit/doc-card'
	import DocCardGroup from '@aziontech/webkit/doc-card-group'
	import DocItem from '@aziontech/webkit/doc-item'
	import FrameBox from '@aziontech/webkit/frame-box'
	import ItemList from '@aziontech/webkit/item-list'
	import { computed, onMounted, ref } from 'vue'

	interface GuideLink {
		label: string
		href: string
		description?: string
		products: string[]
	}

	interface Area {
		label: string
		subs: { label: string; items: GuideLink[] }[]
	}

	const props = withDefaults(
		defineProps<{
			featured?: GuideLink[]
			areas?: Area[]
			products?: { id: string; label: string }[]
			labels?: {
				featured: string
				filter: string
				allProducts: string
				empty: string
				count: string
			}
		}>(),
		{
			featured: () => [],
			areas: () => [],
			products: () => [],
			labels: () => ({
				featured: 'Most read',
				filter: 'Filter by product',
				allProducts: 'All products',
				empty: 'No guide matches this product yet.',
				count: '{count} guides'
			})
		}
	)

	const selected = ref('')

	const visibleAreas = computed(() =>
		props.areas
			.map((area) => ({
				label: area.label,
				subs: area.subs
					.map((sub) => ({
						label: sub.label,
						items: selected.value
							? sub.items.filter((guide) => guide.products.includes(selected.value))
							: sub.items
					}))
					.filter((sub) => sub.items.length > 0)
			}))
			.filter((area) => area.subs.length > 0)
	)

	const count = computed(() =>
		visibleAreas.value.reduce((total, area) => total + area.subs.reduce((n, sub) => n + sub.items.length, 0), 0)
	)

	const countLabel = computed(() => props.labels.count.replace('{count}', String(count.value)))

	/* The filter is part of the address, so a filtered list can be linked and shared. */
	function select(product: string) {
		selected.value = product
		if (typeof window === 'undefined') return
		const url = new URL(window.location.href)
		if (product) url.searchParams.set('product', product)
		else url.searchParams.delete('product')
		window.history.replaceState({}, '', url)
	}

	onMounted(() => {
		const requested = new URLSearchParams(window.location.search).get('product') ?? ''
		if (requested && props.products.some((product) => product.id === requested)) {
			selected.value = requested
		}
	})
</script>
