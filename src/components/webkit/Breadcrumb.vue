<template>
	<div class="h-[24px] -ml-2">
		<nav class="p-breadcrumb p-component">
			<ol class="p-breadcrumb-list">
				<template
					v-for="(item, index) in props.data"
					:key="`${item.label}_${index}`"
				>
					<li
						v-if="index !== 0"
						class="p-menuitem-separator"
					>
						<svg
							class="p-icon"
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
					<li class="p-menuitem">
						<a
							v-if="item.url"
							:href="item.url"
							:target="item.target"
							:aria-current="isCurrentUrl(item)"
							class="p-menuitem-link"
						>
							<span class="text-color-secondary">
								{{ item.label }}
							</span>
						</a>
						<p
							v-else
							class="p-menuitem-link"
						>
							<span class="text-color-secondary">
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
	  Base layout rules vendored from PrimeVue's Breadcrumb component CSS
	  (also shipped as azion-webkit/src/assets/styles/breadcrumb.css). Theme
	  colors/spacing (.p-breadcrumb, .p-menuitem-link, .p-menuitem-separator)
	  still come from the globally imported azion-theme.
	*/
	.p-breadcrumb {
		overflow-x: auto;
	}

	.p-breadcrumb .p-breadcrumb-list {
		margin: 0;
		padding: 0;
		list-style-type: none;
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
	}

	.p-breadcrumb .p-menuitem-text {
		line-height: 1;
	}

	.p-breadcrumb .p-menuitem-link {
		text-decoration: none;
		display: flex;
		align-items: center;
	}

	.p-breadcrumb .p-menuitem-separator {
		display: flex;
		align-items: center;
	}

	.p-breadcrumb::-webkit-scrollbar {
		display: none;
	}

	.p-icon {
		width: 1rem;
		height: 1rem;
	}
</style>
