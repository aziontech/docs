<template>
	<!-- The bar's search control: the sample's HeaderSearch (wide field-shaped
	     button that collapses to an IconButton via container query on the bar). -->
	<HeaderSearch
		label="Search"
		@click="open = true"
	/>

	<!-- The palette. CommandMenu owns the dialog (portal, overlay, scroll lock,
	     focus return), the ⌘K/Ctrl+K shortcut and the roving keyboard model —
	     everything the old AlgoliaDialog + window listeners did by hand. -->
	<CommandMenu
		v-model:open="open"
		shortcut="meta+k"
		@select="onSelect"
	>
		<!-- CommandMenu keeps its query in its own context; the native `input`
		     event bubbling out of CommandMenu.Input is the supported way to read
		     it from outside, and it is what drives Algolia. -->
		<div @input="onQueryInput">
			<CommandMenu.Input :placeholder="inputPlaceholder" />
		</div>

		<CommandMenu.List>
			<CommandMenu.Group
				v-for="section in sections"
				:key="section.name"
				:heading="section.heading"
			>
				<!--
					Two workarounds for CommandMenu's built-in filter (an item is
					visible when its text contains the query — right for the static
					lists it was built for, wrong for Algolia hits, which are already
					the result of a typo-tolerant query and need no second filter):

					· the hidden span puts the CURRENT query inside every item's
					  label, so the containment check always passes;
					· the query in `:key` remounts the item on every keystroke,
					  because the item snapshots its label text once, on mount.
				-->
				<CommandMenu.Item
					v-for="hit in section.hits"
					:key="`${query}:${hit.objectID}`"
					:value="`doc:${hit.url}`"
				>
					<template #prefix>
						<i
							:class="section.icon"
							aria-hidden="true"
						/>
					</template>
					<span class="truncate">{{ hit.title }}</span>
					<span class="hidden">{{ query }}</span>
				</CommandMenu.Item>
			</CommandMenu.Group>

			<CommandMenu.Empty>
				{{ query.trim() ? noResultsText : typeToSearchText }}
			</CommandMenu.Empty>
		</CommandMenu.List>
	</CommandMenu>
</template>

<script setup>
	import { ref, watch } from 'vue'

	import CommandMenu from '@aziontech/webkit/command-menu'

	// The package root of algoliasearch@4 is CJS and trips Vite's ESM interop;
	// the browser lite build is the ESM entry that works everywhere.
	import algoliasearch from 'algoliasearch/dist/algoliasearch-lite.esm.browser.js'

	import HeaderSearch from './HeaderSearch.vue'

	const props = defineProps({
		algoliaAppId: {
			type: String
		},
		algoliaApiKey: {
			type: String
		},
		/** [{ name: 'azion-doc-en', label: 'docs', activeIndex: 1 }, …] from i18n. */
		algoliaIndex: {
			type: Array
		},
		/** Section labels from i18n; entry 0 is the old "All" tab, 1..n match activeIndex. */
		algoliaModel: {
			type: Array
		},
		inputPlaceholder: {
			type: String,
			required: false,
			default: 'Search Azion'
		}
	})

	const open = ref(false)
	const query = ref('')
	/** [{ name, heading, icon, hits: [] }] in the i18n index order. */
	const sections = ref([])

	const client = algoliasearch(props.algoliaAppId, props.algoliaApiKey)

	const SECTION_ICONS = {
		docs: 'pi pi-file',
		site: 'pi pi-globe',
		blog: 'pi pi-book',
		cases: 'pi pi-briefcase'
	}

	// Palette copy stays in the component: the i18n header model predates the
	// palette and only carries the tab labels and the input placeholder.
	const isPt = typeof document !== 'undefined' && document.documentElement.lang === 'pt-br'
	const noResultsText = isPt ? 'Nenhum resultado encontrado.' : 'No results found.'
	const typeToSearchText = isPt ? 'Digite para buscar.' : 'Type to search.'

	function sectionHeading(indexEntry) {
		return props.algoliaModel?.[indexEntry.activeIndex]?.label ?? indexEntry.label
	}

	let debounceTimer = null
	let lastRequestId = 0

	function onQueryInput(event) {
		query.value = event.target?.value ?? ''

		clearTimeout(debounceTimer)
		debounceTimer = setTimeout(runSearch, 200)
	}

	async function runSearch() {
		const term = query.value.trim()

		if (!term) {
			sections.value = []
			return
		}

		const requestId = ++lastRequestId
		const { results } = await client.search(
			props.algoliaIndex.map((indexEntry) => ({
				indexName: indexEntry.name,
				query: term,
				params: { hitsPerPage: 5 }
			}))
		)

		// A slower response for an older query must not overwrite the newer one.
		if (requestId !== lastRequestId) return

		sections.value = props.algoliaIndex
			.map((indexEntry, position) => ({
				name: indexEntry.name,
				heading: sectionHeading(indexEntry),
				icon: SECTION_ICONS[indexEntry.label] ?? 'pi pi-file',
				hits: results[position]?.hits ?? []
			}))
			.filter((section) => section.hits.length)
	}

	watch(open, (isOpen) => {
		if (isOpen) {
			// The navigation drawer is a separate island; two stacked overlays
			// would trap focus in the bottom one, so it listens for this and
			// closes (the sample does the same with a watch inside one SPA).
			window.dispatchEvent(new CustomEvent('docs:palette-open'))
		} else {
			// CommandMenu resets its own query on open; mirror that here so the
			// stale result list never flashes on the next open.
			query.value = ''
			sections.value = []
		}
	})

	function onSelect(event, value) {
		const [, href] = String(value).split(/:(.*)/s)
		if (href) window.location.assign(href)
	}
</script>
