<template>
	<ul class="m-0 list-none p-0">
		<li
			v-for="item in items"
			:key="item.key"
		>
			<div :class="item.onlyMobile ? 'lg:hidden' : 'block'">
				<p
					v-if="item.hasLabel"
					class="cursor-text pl-4 mb-2 text-base"
					:class="item.index === 0 ? 'mt-2' : 'mt-5'"
				>
					<strong class="font-medium">
						{{ item.hasLabel }}
					</strong>
				</p>

				<div
					v-if="!item.slug && item.text"
					class="flex hover:bg-hover py-2 px-4 border-none cursor-pointer rounded-sm h-9"
					:style="{ paddingLeft: `${item.level * 16 + 16}px !important` }"
					@click="$emit('toggle', item)"
				>
					<p
						v-if="item.text"
						class="text-sm"
					>
						{{ item.text }}
					</p>
					<i
						v-if="item.items && item.items.length"
						class="pi pi-angle-right text-primary ml-auto pr-1"
						:class="{ 'rotate-90': expandedKeys[item.key] }"
					></i>
				</div>
				<a
					v-else-if="item.slug && item.text && item.items"
					:title="item.text"
					:href="isCurrent(item) ? '#' : modelSlug(item.slug, item.isFallback, lang)"
					:target="isURL(item.slug) ? '_blank' : '_self'"
					:class="isCurrent(item) ? 'bg-selected' : ''"
					class="text-sm h-9 flex justify-between items-center hover:bg-hover py-2 px-4 border-none cursor-pointer rounded-sm"
					:style="{ paddingLeft: `${item.level * 16 + 16}px !important` }"
					@click="$emit('itemClick', item, $event)"
				>
					{{ item.text }}
					<i
						v-if="isURL(item.slug)"
						class="text-base pi pi-external-link text-primary mr-1"
					></i>

					<span @click="$emit('itemClick', item, $event)">
						<i class="pi pi-angle-right text-primary ml-auto pr-1"></i>
					</span>
				</a>
				<a
					v-else-if="item.slug"
					:title="item.text"
					:href="modelSlug(item.slug, item.isFallback, lang)"
					:target="isURL(item.slug) ? '_blank' : '_self'"
					:class="isCurrent(item) ? 'bg-selected' : ''"
					class="text-sm h-9 flex justify-between items-center hover:bg-hover py-2 px-4 border-none cursor-pointer rounded-sm"
					:style="{ paddingLeft: `${item.level * 16 + 16}px !important` }"
					@click="$emit('trackClick', item, modelSlug(item.slug, item.isFallback, lang))"
				>
					{{ item.text }}
					<i
						v-if="isURL(item.slug)"
						class="text-base pi pi-external-link text-primary mr-1"
					></i>
				</a>
			</div>

			<PanelMenuTree
				v-if="item.items && item.items.length"
				v-show="expandedKeys[item.key]"
				:items="item.items"
				:expanded-keys="expandedKeys"
				:lang="lang"
				:is-current="isCurrent"
				@toggle="(child) => $emit('toggle', child)"
				@item-click="(child, event) => $emit('itemClick', child, event)"
				@track-click="(child, href) => $emit('trackClick', child, href)"
			/>
		</li>
	</ul>
</template>

<script setup>
	import { modelSlug, isURL } from '~/util';

	defineProps({
		items: { type: Array, required: true },
		expandedKeys: { type: Object, required: true },
		lang: { type: String, required: true },
		// Shared with the root SidebarPanelMenu instance: besides matching the
		// current page, calling this also auto-expands the matched item's
		// ancestors, so it must stay a single function reused across every
		// recursion level rather than reimplemented per-level.
		isCurrent: { type: Function, required: true }
	});

	defineEmits(['toggle', 'itemClick', 'trackClick']);
</script>
