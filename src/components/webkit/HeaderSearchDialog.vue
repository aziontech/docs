<template>
	<HeaderSearch
		label="Search"
		@click="open = true"
	/>

	<CommandMenu
		v-model:open="open"
		shortcut="meta+k"
		@select="onSelect"
	>
		<div @input="onQueryInput">
			<CommandMenu.Input :placeholder="inputPlaceholder" />
		</div>

		<CommandMenu.List>
			<CommandMenu.Group
				v-for="section in sections"
				:key="section.name"
				:heading="section.heading"
			>
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

	import algoliasearch from 'algoliasearch/dist/algoliasearch-lite.esm.browser.js'

	import HeaderSearch from './HeaderSearch.vue'

	const props = defineProps({
		algoliaAppId: {
			type: String
		},
		algoliaApiKey: {
			type: String
		},
		algoliaIndex: {
			type: Array
		},
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
	const sections = ref([])

	const client = algoliasearch(props.algoliaAppId, props.algoliaApiKey)

	const SECTION_ICONS = {
		docs: 'pi pi-file',
		site: 'pi pi-globe',
		blog: 'pi pi-book',
		cases: 'pi pi-briefcase'
	}

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
			window.dispatchEvent(new CustomEvent('docs:palette-open'))
		} else {
			query.value = ''
			sections.value = []
		}
	})

	function onSelect(event, value) {
		const [, href] = String(value).split(/:(.*)/s)
		if (href) window.location.assign(href)
	}
</script>
