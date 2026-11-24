<script lang="ts">
import type { PageAvailability, PlatformVersion, Stage } from '~/nav/versions';

/** Words the select and the stage tags read, in the language of the page. */
export interface VersionLabels {
	/** Accessible name of the select. */
	label: string;
	/** Help panel beside the select: how to find the version of the account. */
	helpHeadline: string;
	helpTip: string;
	helpCta: string;
	helpHref: string;
	stages: Record<Stage, string>;
	/** Word that marks the current platform version in the select. */
	current: string;
	/** Short names for the version tags in the menu (`v3`, `v4`). */
	short: Record<PlatformVersion, string>;
}

export interface VersionPayload {
	availability: PageAvailability;
	labels: VersionLabels;
}

/** Id of the JSON the rail's server render leaves for islands that mount elsewhere (the mobile drawer). */
export const VERSION_PAYLOAD_ID = 'docs-page-availability';

export const DEFAULT_VERSION_LABELS: VersionLabels = {
	label: 'Platform version',
	helpHeadline: 'Which version does my account run?',
	helpTip:
		'If the Azion Console menu lists Workloads, your account runs API v4. If it does not, it runs API v3.',
	helpCta: "Find your account's API version",
	helpHref: '/en/documentation/fundamentals/account-api-version/',
	stages: { experimental: 'Experimental', preview: 'Preview', deprecated: 'Deprecated' },
	current: 'Latest',
	short: { v3: 'v3', v4: 'v4' },
};

/** Client only: the page's availability and labels, or null when the page has no rail. */
export function readVersionPayload(): VersionPayload | null {
	try {
		const raw = document.getElementById(VERSION_PAYLOAD_ID)?.textContent;
		return raw ? (JSON.parse(raw) as VersionPayload) : null;
	} catch {
		return null;
	}
}
</script>

<template>
	<div v-if="resolved" class="flex w-full items-center gap-(--spacing-xs)">
		<div class="min-w-0 flex-1">
			<Select :model-value="version" :display-value="displayValue" @update:model-value="onSelect">
				<Select.Trigger :aria-label="resolvedLabels.label">
					<template #iconLeft>
						<i class="pi pi-sitemap text-(--text-muted)" aria-hidden="true" />
					</template>
				</Select.Trigger>

				<!-- Mounted only on the client: Select.Content teleports to body, and Astro does not re-emit
				     the teleport payload, so rendering it during hydration mismatches. -->
				<Select.Content v-if="mounted">
					<Select.Option v-for="option in PLATFORM_VERSIONS" :key="option.id" :value="option.id">
						{{ optionLabel(option.id) }}
					</Select.Option>
				</Select.Content>
			</Select>
		</div>
		<!-- Rendered after mount in a box of the same size: DocTooltip teleports its panel to body. -->
		<DocTooltip
			v-if="mounted"
			:headline="resolvedLabels.helpHeadline"
			:tip="resolvedLabels.helpTip"
			:cta="resolvedLabels.helpCta"
			:href="resolvedLabels.helpHref"
			placement="bottom"
		>
			<span
				class="float-left flex size-(--spacing-md) items-center justify-center text-(--text-muted)"
			>
				<i class="pi pi-question-circle" aria-hidden="true" />
				<span class="sr-only">{{ resolvedLabels.helpHeadline }}</span>
			</span>
		</DocTooltip>
		<span v-else class="block size-(--spacing-md) shrink-0" aria-hidden="true" />
	</div>
</template>

<script setup lang="ts">
import DocTooltip from '@aziontech/webkit/doc-tooltip';
import Select from '@aziontech/webkit/select';
import { onMounted, ref, computed } from 'vue';

import { usePlatformVersion } from '~/composables/use-platform-version';
import {
	CURRENT_VERSION,
	PLATFORM_VERSIONS,
	isPlatformVersion,
	pageVersionOf,
} from '~/nav/versions';

defineOptions({ name: 'VersionSelect' });

interface Props {
	/** What the current page tells the select; read from the page's JSON when absent. */
	availability?: PageAvailability | null;
	/** Accessible name and stage words; read from the page's JSON when absent. */
	labels?: VersionLabels | null;
}

const props = withDefaults(defineProps<Props>(), {
	availability: null,
	labels: null,
});

// The page defines the context: on a single-version page the select shows that version.
const { version, setVersion } = usePlatformVersion(pageVersionOf(props.availability));

// A host that mounts away from the rail (the drawer) has no props: it reads the same payload on mount.
const fromPage = ref<VersionPayload | null>(null);
const mounted = ref(false);
onMounted(() => {
	mounted.value = true;
	if (!props.availability) fromPage.value = readVersionPayload();
});

const resolved = computed(() => props.availability ?? fromPage.value?.availability ?? null);
const resolvedLabels = computed(
	() => props.labels ?? fromPage.value?.labels ?? DEFAULT_VERSION_LABELS
);

function optionLabel(id: PlatformVersion): string {
	const option = PLATFORM_VERSIONS.find((entry) => entry.id === id);
	if (!option) return id;
	const stage = 'stage' in option ? option.stage : undefined;
	if (stage) return `${option.label} · ${resolvedLabels.value.stages[stage]}`;
	// Labels cached by an older page payload may lack the word: fall back to the bare name.
	const current = id === CURRENT_VERSION ? resolvedLabels.value.current : '';
	return current ? `${option.label} · ${current}` : option.label;
}

const displayValue = (value: unknown) => (isPlatformVersion(value) ? optionLabel(value) : '');

/**
 * Switching keeps the page when it applies to the chosen version. Otherwise it goes to the page's
 * equivalent in that version, or to the version's home when there is none. The choice is stored
 * first, so the page it lands on opens in the version just picked.
 */
function onSelect(next: unknown) {
	if (!isPlatformVersion(next) || next === version.value) return;
	setVersion(next);
	const page = resolved.value;
	if (!page || page.versions.includes(next)) return;
	const target = page.counterparts[next]?.href ?? page.homes[next];
	if (target) window.location.assign(target);
}
</script>
