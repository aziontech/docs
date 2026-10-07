<template>
	<DocPageHeader
		v-bind="$attrs"
		:title="title"
		:description="description"
		:breadcrumb="breadcrumb"
		:markdown-href="markdownHref"
		:locale="locale"
		:labels="labels"
		:last-updated="lastUpdated"
	>
		<template #title>
			<div
				class="flex min-w-0 flex-col items-start gap-(--spacing-sm) sm:flex-1 sm:flex-row sm:items-center sm:gap-(--spacing-md)"
			>
				<span
					class="flex size-14 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised) sm:size-16 [&>svg]:size-7 sm:[&>svg]:size-8"
				>
					<AgentMark :name="mark" />
				</span>
				<div class="min-w-0 flex-1">
					<span class="block text-overline-sm uppercase text-(--primary)">{{ vendor }}</span>
					<h1 id="overview" class="m-0 text-heading-xl text-(--text-default)">
						{{ title }}
					</h1>
				</div>
			</div>
		</template>
		<template #details>
			<div class="flex flex-col gap-(--spacing-md)">
				<div class="flex flex-wrap items-center gap-(--spacing-xs)">
					<Tag
						v-for="tag in tags"
						:key="tag"
						:label="tag"
						severity="secondary"
						size="medium"
						rounded
					/>
				</div>
				<div class="flex flex-wrap items-center gap-x-(--spacing-xs) gap-y-(--spacing-xxs)">
					<template v-for="(link, index) in links" :key="link.href">
						<span v-if="index > 0" class="text-label-md text-(--text-muted)" aria-hidden="true"
							>·</span
						>
						<a
							:href="link.href"
							target="_blank"
							rel="noreferrer"
							class="group/link inline-flex items-center gap-(--spacing-xxs) rounded-(--shape-flat) text-label-md text-(--text-muted) no-underline hover:text-(--text-default)"
						>
							{{ link.label }}
							<i class="pi pi-arrow-up-right text-body-xs" aria-hidden="true" />
						</a>
					</template>
				</div>
			</div>
		</template>
	</DocPageHeader>
</template>

<script setup lang="ts">
import Tag from '@aziontech/webkit/tag';

import AgentMark, { type AgentName } from './AgentMark.vue';
import DocPageHeader, { type DocPageHeaderLabels } from './DocPageHeader.vue';

defineOptions({ name: 'AgentPageHeader', inheritAttrs: false });

interface Props {
	title: string;
	description?: string;
	breadcrumb?: { label: string; href?: string }[];
	markdownHref: string;
	locale: string;
	labels: DocPageHeaderLabels;
	lastUpdated?: string;
	mark: AgentName;
	vendor: string;
	tags?: string[];
	links?: { label: string; href: string }[];
}

withDefaults(defineProps<Props>(), {
	description: '',
	breadcrumb: () => [],
	lastUpdated: undefined,
	tags: () => [],
	links: () => [],
});
</script>
