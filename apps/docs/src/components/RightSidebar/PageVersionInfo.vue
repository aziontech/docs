<template>
	<div
		role="group"
		:aria-labelledby="labelId"
		:data-variant="variant"
		class="flex w-full flex-col gap-(--spacing-xs) data-[variant=inline]:flex-row data-[variant=inline]:flex-wrap data-[variant=inline]:items-center data-[variant=inline]:gap-x-(--spacing-sm)"
	>
		<!-- The label wears the rail's group overline; the help icon glosses the versions. -->
		<div class="flex items-center gap-(--spacing-xxs)">
			<p :id="labelId" class="m-0 text-overline-xs text-(--text-muted)">{{ labels.groupLabel }}</p>
			<!-- DocTooltip teleports its panel to body, which Astro does not re-emit; it renders after mount,
			     in a box of the same size, so nothing shifts. `bottom` flips when short of room and the
			     panel is clamped to the viewport, so it never leaves the screen at the rail's right edge. -->
			<DocTooltip
				v-if="mounted"
				:headline="labels.versionHelpHeadline"
				:tip="labels.versionHelpTip"
				:cta="labels.versionHelpCta"
				:href="labels.versionHelpHref"
				placement="bottom"
			>
				<span
					class="float-left flex size-(--spacing-md) items-center justify-center text-(--text-muted)"
				>
					<i class="pi pi-question-circle" aria-hidden="true" />
					<span class="sr-only">{{ labels.versionHelpHeadline }}</span>
				</span>
			</DocTooltip>
			<span v-else class="block size-(--spacing-md)" aria-hidden="true" />
		</div>

		<ul
			class="m-0 flex list-none flex-col p-0 data-[variant=inline]:flex-row data-[variant=inline]:flex-wrap data-[variant=inline]:gap-(--spacing-sm)"
			:data-variant="variant"
		>
			<li
				v-for="item in listed"
				:key="item.id"
				class="m-0 flex items-center gap-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-muted) data-[browsing]:text-(--text-default) data-[variant=rail]:px-(--spacing-xs)"
				:data-variant="variant"
				:data-browsing="item.browsing || null"
				:aria-current="item.browsing ? 'true' : undefined"
			>
				<i class="pi pi-sitemap shrink-0" aria-hidden="true" />
				{{ item.label }}
				<span v-if="item.browsing" class="sr-only">({{ labels.selected }})</span>
			</li>
		</ul>

		<div
			v-if="availability.stage"
			:data-variant="variant"
			class="flex items-center gap-(--spacing-xs) data-[variant=rail]:px-(--spacing-xs) data-[variant=rail]:pt-(--spacing-xxs)"
		>
			<Tag :value="stageLabel" :severity="stageSeverity" />
			<DocTooltip
				v-if="mounted"
				:headline="stageLabel"
				:tip="stageTip"
				:cta="labels.stageCta"
				:href="labels.stageHref"
				placement="bottom"
			>
				<span
					class="float-left flex size-(--spacing-md) items-center justify-center text-(--text-muted)"
				>
					<i class="pi pi-question-circle" aria-hidden="true" />
					<span class="sr-only">{{ labels.stageHelp }}</span>
				</span>
			</DocTooltip>
			<span v-else class="block size-(--spacing-md)" aria-hidden="true" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useId } from 'vue';

import DocTooltip from '@aziontech/webkit/doc-tooltip';

import Tag, { type TagSeverity } from '~/components/webkit/Tag.vue';
import { usePlatformVersion } from '~/composables/use-platform-version';
import {
	PLATFORM_VERSIONS,
	pageVersionOf,
	type PageAvailability,
	type PlatformVersion,
} from '~/nav/versions';

export interface PageVersionInfoLabels {
	/** Overline of the group. */
	groupLabel: string;
	/** Read to assistive technology next to the version being browsed. */
	selected: string;
	stageExperimental: string;
	stagePreview: string;
	stageDeprecated: string;
	/** Read to assistive technology as the name of the stage help icon. */
	stageHelp: string;
	stageTipExperimental: string;
	stageTipPreview: string;
	stageTipDeprecated: string;
	/** Label of the link in the stage panel. */
	stageCta: string;
	stageHref: string;
	/** The help panel beside the versions: headline, one sentence, and the link to the page. */
	versionHelpHeadline: string;
	versionHelpTip: string;
	versionHelpCta: string;
	versionHelpHref: string;
}

/** `rail` stacks the rows in the right sidebar; `inline` is one wrapping line under the page title. */
export type PageVersionInfoVariant = 'rail' | 'inline';

// Astro hands an island's `slot` to the component as an attribute; it must not reach the root.
defineOptions({ name: 'PageVersionInfo', inheritAttrs: false });

const props = withDefaults(
	defineProps<{
		availability: PageAvailability;
		labels: PageVersionInfoLabels;
		variant?: PageVersionInfoVariant;
	}>(),
	{ variant: 'rail' }
);

const labelId = useId();

// DocTooltip teleports its panel; render it only once mounted so the server render and first client agree.
const mounted = ref(false);
onMounted(() => {
	mounted.value = true;
});

// A single-version page defines the version, so server and first client render agree on it.
// The rail and the header each hydrate their own copy; both read the same module-level state.
const { version } = usePlatformVersion(pageVersionOf(props.availability));

const labelOf = (id: PlatformVersion) =>
	PLATFORM_VERSIONS.find((item) => item.id === id)?.label ?? id;

// Marking the version being browsed only tells apart the versions of a page that covers several.
const listed = computed(() =>
	props.availability.versions.map((id) => ({
		id,
		label: labelOf(id),
		browsing: props.availability.versions.length > 1 && id === version.value,
	}))
);

const stageLabel = computed(
	() =>
		({
			experimental: props.labels.stageExperimental,
			preview: props.labels.stagePreview,
			deprecated: props.labels.stageDeprecated,
		})[props.availability.stage ?? 'preview']
);

const stageTip = computed(
	() =>
		({
			experimental: props.labels.stageTipExperimental,
			preview: props.labels.stageTipPreview,
			deprecated: props.labels.stageTipDeprecated,
		})[props.availability.stage ?? 'preview']
);

const stageSeverity = computed<TagSeverity>(
	() =>
		(({ experimental: 'warning', preview: 'info', deprecated: 'warning' }) as const)[
			props.availability.stage ?? 'preview'
		]
);
</script>
