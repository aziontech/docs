<template>
	<div class="flex flex-col lg:flex-row gap-5 md:gap-10 items-stretch">
		<div
			:class="Object.keys(cards).length > 1 && 'basis-1/2'"
			v-for="item in Object.keys(cards)"
			:key="item"
		>
			<!--
			  Inlined from azion-webkit@1 CardBaseClickable > CardBase (PrimeVue Card),
			  fixed at the variant ArticleNavigation always used: grid, spacing="compact",
			  hover="outlined", backgroundColor="default", disableAction.
			-->
			<a
				v-if="cards[item]"
				:href="cards[item].link"
				:rel="item"
				class="no-underline flex border-radius cursor-pointer h-full w-full"
				:class="item === 'next' ? 'text-right items-end' : 'text-left'"
			>
				<div
					class="w-full shadow-none rounded-[var(--shape-card)] border group text-default bg-transparent border-default hover:bg-[var(--bg-hover)] hover:border-[var(--border-strong)] focus:outline-[var(--border-selected)] flex flex-col h-full"
				>
					<div class="flex flex-col grow">
						<div class="flex flex-col grow">
							<div class="flex flex-col gap-8 justify-between grow p-4 md:p-6">
								<div class="flex flex-col gap-3 grow">
									<div
										class="flex gap-4 md:gap-8"
										:class="item === 'next' && 'justify-end w-full'"
									>
										<div
											v-if="item === 'prev'"
											class="min-w-fit"
										>
											<div
												class="rounded flex justify-center items-center h-6 w-6 bg-(--surface-400) text-muted"
											>
												<p class="text-sm flex justify-center items-center">
													<i class="text-xs pi pi-arrow-left" />
												</p>
											</div>
										</div>
										<div class="flex flex-col gap-3">
											<span
												class="text-[.625rem] sm:text-xs uppercase tracking-widest font-mono text-muted text-balance"
											>
												{{ overline[item] }}
											</span>
											<p class="text-base sm:text-lg lg:text-xl font-medium text-pretty max-w-lg">
												{{ cards[item].text }}
											</p>
										</div>
										<div
											v-if="item === 'next'"
											class="min-w-fit"
										>
											<div
												class="rounded flex justify-center items-center h-6 w-6 bg-(--surface-400) text-muted"
											>
												<p class="text-sm flex justify-center items-center">
													<i class="text-xs pi pi-arrow-right"></i>
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</a>
		</div>
	</div>
</template>

<script setup>
	defineProps({
		cards: {
			type: Object,
			required: true
		},
		overline: {
			type: Object,
			required: false,
			default: () => ({
				prev: 'Previous article',
				next: 'Next article'
			})
		}
	})
</script>
