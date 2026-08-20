<template>
	<a
		:href="href"
		:title="hrefTitle"
		:target="target"
		aria-label="Azion Logo"
		class="flex gap-[7px]"
	>
		<div class="flex flex-col gap-[2.68px]">
			<svg
				width="126"
				height="26"
				fill="currentColor"
				viewBox="0 0 126 26"
			>
				<path
					fill="#F3652B"
					d="m120.989.228-2.085 10.793 3.794 4.678L125.685.23h-4.696Zm-19.729 0-4.697 24.33h4.699l3.219-16.68 13.57 16.68h2.938l.579-2.979L104.197.23h-2.937Zm-29.122 0-4.697 24.33h24.425L96.563.228H72.138Zm3.816 4.597h15.013l-2.922 15.136H73.03l2.922-15.136ZM62.843.228l-4.6 24.33h4.599L67.44.228h-4.597Zm-29.023 0-.888 4.597h16.22l-19.335 16.15-.695 3.582h24.425l.888-4.596h-16.22L57.554 3.807l.69-3.579H33.82Zm-8.282 0L.686 20.985 0 24.558h3.58l19.251-16.07-3.102 16.07h4.695L29.122.228h-3.584Z"
				/>
			</svg>
			<div class="flex gap-[1px] justify-end w-full items-start text-default titillium-web">
				<div class="text-[12.88px]">technologies</div>
				<div class="text-[8.4px]">®</div>
			</div>
		</div>
		<div
			class="h-[24px] flex items-center tracking-[0.6px] text-default text-[15.96px] roboto-condensed italic font-normal"
		>
			move to the edge
		</div>
	</a>
</template>

<script setup>
	defineProps({
		href: {
			type: String
		},
		hrefTitle: {
			type: String
		},
		target: {
			type: String,
			default: '_self'
		},
		version: {
			type: String,
			default: () => 'default'
		}
	});
</script>
