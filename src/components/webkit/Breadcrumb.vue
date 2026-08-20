<template>
	<div class="h-[24px] -ml-2">
		<nav class="wk-breadcrumb overflow-x-auto p-1">
			<ol class="flex items-center flex-nowrap list-none m-0 p-0">
				<template
					v-for="(item, index) in props.data"
					:key="`${item.label}_${index}`"
				>
					<li
						v-if="index !== 0"
						class="flex items-center mx-2 text-muted"
					>
						<svg
							class="w-4 h-4"
							aria-hidden="true"
							width="14"
							height="14"
							viewBox="0 0 14 14"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M4.38708 13C4.28408 13.0005 4.18203 12.9804 4.08691 12.9409C3.99178 12.9014 3.9055 12.8433 3.83313 12.7701C3.68634 12.6231 3.60388 12.4238 3.60388 12.2161C3.60388 12.0084 3.68634 11.8091 3.83313 11.6622L8.50507 6.99022L3.83313 2.31827C3.69467 2.16968 3.61928 1.97313 3.62287 1.77005C3.62645 1.56698 3.70872 1.37322 3.85234 1.22959C3.99596 1.08597 4.18972 1.00371 4.3928 1.00012C4.59588 0.996539 4.79242 1.07192 4.94102 1.21039L10.1669 6.43628C10.3137 6.58325 10.3962 6.78249 10.3962 6.99022C10.3962 7.19795 10.3137 7.39718 10.1669 7.54416L4.94102 12.7701C4.86865 12.8433 4.78237 12.9014 4.68724 12.9409C4.59212 12.9804 4.49007 13.0005 4.38708 13Z"
								fill="currentColor"
							/>
						</svg>
					</li>
					<li class="flex items-center">
						<a
							v-if="item.url"
							:href="item.url"
							:target="item.target"
							:aria-current="isCurrentUrl(item)"
							class="flex items-center no-underline leading-none rounded-[var(--shape-elements)] text-muted hover:text-[var(--text-default)] aria-[current=page]:text-[var(--text-default)]"
						>
							<span>
								{{ item.label }}
							</span>
						</a>
						<p
							v-else
							class="flex items-center m-0 leading-none text-default"
						>
							<span>
								{{ item.label }}
							</span>
						</p>
					</li>
				</template>
			</ol>
		</nav>
	</div>
</template>

<script setup>
	const props = defineProps({
		data: { type: Array }
	})

	const isCurrentUrl = (item) => {
		const lastPath = typeof window !== 'undefined' ? window.location.pathname : ''
		return item.url === lastPath ? 'page' : undefined
	}
</script>

<style scoped>
	/*
		Layout/colors are utilities on the elements themselves (ported from
		PrimeVue's Breadcrumb CSS + azion-theme's breadcrumb variables onto
		@aziontech/theme v4 tokens). Only the scrollbar-hiding rule has no
		utility equivalent.
	*/
	.wk-breadcrumb::-webkit-scrollbar {
		display: none;
	}
</style>
