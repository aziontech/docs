<template>
	<div class='mb-[28px]'>
		<AisIndex :index-name='props.indexName'>
			<div class='lg:flex items-center justify-between'>
				<h2 class='text-2xl font-medium capitalize'>
					{{ props.label }}
				</h2>
				<AisStats class='flex justify-end'>
					<template v-slot='{ nbPages, nbHits, page }'>
						<div
							v-if='nbPages'
							class='flex items-center gap-3'
						>
							<AisHitsPerPage
								class='hidden'
								:items='[
									{ label: "4 per page", value: 4, default: true },
									{ label: "12 per page", value: 12 },
									{ label: "24 per page", value: 24 }
								]'
							/>

							<div class='flex flex-row gap-3 items-center'>
								<p class='text-xs text-muted'>{{ nbHits }} results</p>
								<AisPagination />
								<p class='text-xs text-muted'>{{ page + 1 }} - {{ nbPages }}</p>
							</div>
						</div>
					</template>
				</AisStats>
			</div>

			<AisStats>
				<template v-slot='{ nbPages, query }'>
					<p
						v-show='nbPages === 0'
						class='py-4 text-muted text-sm'
					>
						No results found for the term
						<strong class='text-default font-normal'>"{{ query }}"</strong>.
					</p>

					<AisHits>
						<template v-slot:item='{ item }'>
							<a
								:href='item.url'
								:title='item.title'
								class='ais-Hits-item-card w-full no-underline flex cursor-pointer rounded-md'
							>
								<div class='flex h-full w-full flex-col gap-3 rounded-md border border-default bg-surface-raised p-4 transition-colors hover:border-[var(--text-default)]'>
									<div class='flex flex-col gap-3'>
										<h2 class='text-base font-normal text-default'>
											{{ item.title }}
										</h2>

										<ul class='flex items-center flex-wrap text-xs'>
											<li class='text-muted mr-0.5'>
												<small class='flex gap-0.5 capitalize items-center'>
													{{ props.label }} <i class='pi pi-angle-right text-[8px]'></i>
												</small>
											</li>
											<li class='text-muted'>
												<small class='flex gap-2'>
													{{ item.title }}
												</small>
											</li>
										</ul>
									</div>

									<p class='text-sm text-muted leading-relaxed'>
										<!--
											item.text used to site/blog/cases
											item.description used to documentation
										-->
										{{
											item.text && item.text.length > 160
												? `${item.text.slice(0, 160)}...`
												: item.text
													? item.text
													: item.description && item.description.length > 220
														? `${item.description.slice(0, 220)}...`
														: item.description
															? item.description
															: ''
										}}
									</p>
								</div>
							</a>
						</template>
					</AisHits>
				</template>
			</AisStats>
		</AisIndex>
	</div>
</template>

<script setup>
	import {
		AisIndex,
		AisStats,
		AisHits,
		AisHitsPerPage,
		AisPagination
	} from 'vue-instantsearch/vue3/es'

	const props = defineProps({
		indexName: {
			require: true,
			type: String
		},
		label: {
			require: false,
			type: String
		}
	})
</script>

<style lang="scss" rel="stylesheet/scss">
	.ais-Pagination-list {
		display: flex;
		gap: 1rem;
	}

	.ais-HitsPerPage-select {
		padding: 0.725rem;
		border-radius: 4px;
		font-size: 14px;

		&:hover {
			cursor: pointer;
		}
	}

	.ais-Pagination-list {
		gap: 0 !important;

		.ais-Pagination-item--page {
			display: none !important;
		}

		.ais-Pagination-item--previousPage {
			.ais-Pagination-link {
				border-top-left-radius: 4px;
				border-bottom-left-radius: 4px;
			}
		}
		.ais-Pagination-item--nextPage {
			.ais-Pagination-link {
				border-top-right-radius: 4px;
				border-bottom-right-radius: 4px;
			}
		}
		.ais-Pagination-item {
			.ais-Pagination-link {
				border: solid 1px var(--border-default);
				margin-left: -1px;
				width: 2rem;
				height: 2rem;
				display: flex;
				align-items: center;
				justify-content: center;

				&:hover {
					cursor: pointer;
				}
			}
		}

		.ais-Pagination-item--firstPage {
			display: none;
			.ais-Pagination-link {
				border-top-left-radius: 4px;
				border-bottom-left-radius: 4px;
			}
		}

		.ais-Pagination-item--lastPage {
			display: none;
			.ais-Pagination-link {
				border-top-right-radius: 4px;
				border-bottom-right-radius: 4px;
			}
		}
	}

	.ais-Hits {
		margin-top: 1rem;

		.ais-Hits-list {
			display: grid;
			grid-template-columns: 1fr;
			gap: 1rem;

			@media (min-width: 768px) {
				grid-template-columns: 1fr 1fr;
			}

			.ais-Hits-item {
				display: flex;
			}
		}
	}

	.ais-Stats-text {
		display: none;
	}
</style>
