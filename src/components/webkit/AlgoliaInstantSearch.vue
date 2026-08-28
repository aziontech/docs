<template>
	<div class='m-w-[768px]'>
		<AisInstantSearch
			:search-client='searchClient'
			index-name='azion-site-en'
		>
			<AisSearchBox
				:autofocus='true'
				:show-loading-indicator='false'
				:placeholder='inputPlaceholder'
				class='sticky top-0 z-10'
			/>
			<AisStats>
				<template v-slot='{ query }'>
					<div
						v-if='query.length'
						class='px-6 py-4 sticky top-[48px] bg-surface z-10'
					>
						<nav class='block mb-2 overflow-x-auto'>
							<ul class='flex list-none border-b border-default p-0 m-0'>
								<li
									v-for='(item, index) in algoliaModel'
									:key='index'
								>
									<button
										type='button'
										class='cursor-pointer whitespace-nowrap border-0 border-b-2 border-solid bg-transparent px-4 py-3 text-sm font-medium transition-colors'
										:class='
											activeIndex === index
												? "border-[var(--border-selected)] text-default"
												: "border-transparent text-muted hover:text-default"
										'
										:aria-pressed='activeIndex === index'
										@click='eventHandler(index)'
									>
										{{ item.label }}
									</button>
								</li>
							</ul>
						</nav>
					</div>

					<div
						v-if='query.length'
						class='px-6'
					>
						<div
							v-for='(indexData, index) in algoliaIndex'
							:key='index'
						>
							<AlgoliaIndexHit
								:label='indexData.label'
								:indexName='indexData.name'
								v-if='activeIndex === 0 || activeIndex === indexData.activeIndex'
							/>
						</div>
					</div>
				</template>
			</AisStats>
		</AisInstantSearch>
	</div>
</template>

<script setup>
	import { ref } from 'vue'
	// NOTE: algoliasearch@4 is CJS at its package root and its default import
	// breaks under Vite 8 dev interop. The package has no `liteClient` named
	// export (that is v5-only), so we import the pure-ESM browser build of the
	// lite client directly, which has a proper `export default`.
	import algoliasearch from 'algoliasearch/dist/algoliasearch-lite.esm.browser.js'
	import { AisInstantSearch, AisSearchBox, AisStats } from 'vue-instantsearch/vue3/es'
	import AlgoliaIndexHit from './AlgoliaIndexHit.vue'

	const props = defineProps({
		isDialogActive: Boolean,
		algoliaAppId: String,
		algoliaApiKey: String,
		algoliaIndex: Array,
		algoliaModel: Array,
		inputPlaceholder: {
			type: String,
			required: false,
			default: 'Search Azion'
		}
	})

	const { algoliaAppId, algoliaApiKey, algoliaModel, algoliaIndex } = props
	const searchClient = algoliasearch(algoliaAppId, algoliaApiKey)

	let activeIndex = ref(0)
	const eventHandler = (e) => {
		activeIndex.value = e
	}
</script>

<style lang="scss" rel="stylesheet/scss">
	.azion-dark {
		input[type='search'] {
			background-color: #292929;
			color: #f4f4f4;
		}
	}

	.azion-light {
		input[type='search'] {
			background-color: #f4f4f4;
			color: #1e1e1e;
		}
	}

	.ais-SearchBox-form {
		width: 100%;

		input[type='search'] {
			width: 100%;
			padding: 0.725rem 1.5rem;
			border: none;
			border-top-right-radius: 4px;
			border-top-left-radius: 4px;
			border-bottom: solid 1px var(--border-default);
			outline: none;
		}

		.ais-SearchBox-reset {
			position: absolute;
			right: 1.7rem;
			fill: white;
			top: 1.2rem;
			background: transparent;
			border: none;
			cursor: pointer;
		}

		.ais-SearchBox-submit {
			display: none;
		}
	}

	// pagination number
	.ais-Pagination-list {
		display: flex;
		gap: 1rem;
	}
</style>
