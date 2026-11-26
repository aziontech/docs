<script lang="ts">
import type { PageAvailability, PlatformVersion, Stage } from '~/nav/versions';

/** Words the select and the stage tags read, in the language of the page. */
export interface VersionLabels {
	/** Accessible name of the select. */
	label: string;
	/** The link at the foot of the list, to the page on finding the account's version. */
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

/** Id of the JSON the rail's server render leaves for islands that mount without props (the mobile drawer). */
export const VERSION_PAYLOAD_ID = 'docs-page-availability';

export const DEFAULT_VERSION_LABELS: VersionLabels = {
	label: 'Platform version',
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
	<!-- Inline: the trigger takes the width of its value, beside the header's other controls.
	     A Dropdown, not a Select: the list is a menu of versions to switch to. -->
	<Dropdown v-if="resolved" :placement="placement" @select="onDropdownSelect">
		<Dropdown.Trigger>
			<template #default="{ isOpen }">
				<!-- Drawn like the Select field: the Dropdown leaves the trigger's look to its content. -->
				<span
					:data-state="isOpen ? 'open' : 'closed'"
					:data-size="size"
					class="group inline-flex items-center data-[size=medium]:h-8 data-[size=small]:h-7 gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-label-sm text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none hover:border-(--border-strong) data-[state=open]:border-(--border-strong)"
				>
					<i class="ai ai-azion-api text-(--text-muted)" aria-hidden="true" />
					<span class="sr-only">{{ resolvedLabels.label }}:</span>
					<span>{{ releaseOf(version) }}</span>
					<i
						class="pi pi-chevron-down text-(--text-muted) transition-transform duration-150 ease-out motion-reduce:transition-none group-data-[state=open]:rotate-180"
						aria-hidden="true"
					/>
				</span>
			</template>
		</Dropdown.Trigger>

		<Dropdown.Group>
			<Dropdown.Option
				v-for="option in PLATFORM_VERSIONS"
				:key="option.id"
				:value="option.id"
				:selected="option.id === version"
			>
				{{ option.release }}
				<template v-if="statusOf(option.id)" #right>
					<Tag
						:label="statusOf(option.id)?.label"
						:severity="statusOf(option.id)?.severity"
						size="small"
					/>
				</template>
			</Dropdown.Option>
		</Dropdown.Group>

		<template #bottom>
			<!-- A column stretches its child, so the button spans the panel without a class of its own.
			     The rule runs the panel's full width, like the divider between two Dropdown groups:
			     the negative inset undoes the footer's padding, the padding puts the button back. -->
			<div
				class="-mx-(--spacing-xxs) mt-(--spacing-xs) flex flex-col border-t border-(--border-default) px-(--spacing-xxs) pt-(--spacing-xs)"
			>
				<Button
					:label="resolvedLabels.helpCta"
					:href="resolvedLabels.helpHref"
					icon="pi pi-question-circle"
					kind="outlined"
					size="small"
				/>
			</div>
		</template>
	</Dropdown>
</template>

<script setup lang="ts">
import Button from '@aziontech/webkit/button';
import Dropdown from '@aziontech/webkit/dropdown';
import Tag from '@aziontech/webkit/tag';
import { onMounted, ref, computed } from 'vue';

import { usePlatformVersion } from '~/composables/use-platform-version';
import {
	CURRENT_VERSION,
	PLATFORM_VERSIONS,
	isPlatformVersion,
	pageVersionOf,
} from '~/nav/versions';

// Astro passes the `slot` attribute through; it never belongs on the root.
defineOptions({ name: 'VersionSelect', inheritAttrs: false });

/** Trigger height: `medium` sits with the header's controls, `small` with the theme switcher. */
export type VersionSelectSize = 'small' | 'medium';
/** Where the list opens: below in the header, `auto` at the foot of the drawer. */
export type VersionSelectPlacement = 'auto' | 'bottom-end';

interface Props {
	/** What the current page tells the select; read from the page's JSON when absent. */
	availability?: PageAvailability | null;
	/** Accessible name and stage words; read from the page's JSON when absent. */
	labels?: VersionLabels | null;
	/** Trigger height. */
	size?: VersionSelectSize;
	/** Where the list opens relative to the trigger. */
	placement?: VersionSelectPlacement;
}

const props = withDefaults(defineProps<Props>(), {
	availability: null,
	labels: null,
	size: 'medium',
	placement: 'bottom-end',
});

// The page defines the context: on a single-version page the select shows that version.
const { version, setVersion } = usePlatformVersion(pageVersionOf(props.availability));

// A host that mounts away from the rail (the drawer) has no props: it reads the same payload on mount.
const fromPage = ref<VersionPayload | null>(null);
onMounted(() => {
	if (!props.availability) fromPage.value = readVersionPayload();
});

const resolved = computed(() => props.availability ?? fromPage.value?.availability ?? null);
const resolvedLabels = computed(
	() => props.labels ?? fromPage.value?.labels ?? DEFAULT_VERSION_LABELS
);

const STAGE_SEVERITY = {
	experimental: 'info',
	preview: 'info',
	deprecated: 'warning',
} as const;

/** The tag beside a version in the list: its stage, or the word for the current version. */
function statusOf(id: PlatformVersion) {
	const option = PLATFORM_VERSIONS.find((entry) => entry.id === id);
	const stage = option && 'stage' in option ? option.stage : undefined;
	if (stage) return { label: resolvedLabels.value.stages[stage], severity: STAGE_SEVERITY[stage] };
	// Labels cached by an older page payload may lack the word: then the current version has no tag.
	const current = id === CURRENT_VERSION ? resolvedLabels.value.current : '';
	return current ? { label: current, severity: 'secondary' as const } : null;
}

// The trigger shows the chosen release line (`v4.x`, `v3.x`); the icon says it is the API version.
function releaseOf(id: PlatformVersion): string {
	return PLATFORM_VERSIONS.find((entry) => entry.id === id)?.release ?? id;
}

function onDropdownSelect(_event: MouseEvent | KeyboardEvent, value: string | number) {
	onSelect(value);
}

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
