<script lang="ts">
import type { PlatformVersion, Stage } from '~/nav/versions';

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
	/** Short names for the version tags in the menu (`v3.x`, `v4.x`). */
	short: Record<PlatformVersion, string>;
}
</script>

<template>
	<!-- Inline: the trigger takes the width of its value, beside the header's other controls.
	     A Dropdown, not a Select: the list is a menu of versions to switch to. -->
	<Dropdown :placement="placement" @select="onDropdownSelect">
		<Dropdown.Trigger>
			<template #default="{ isOpen }">
				<!-- Drawn like the Select field: the Dropdown leaves the trigger's look to its content. -->
				<span
					ref="triggerRef"
					:data-state="isOpen ? 'open' : 'closed'"
					:data-size="size"
					class="group inline-flex items-center data-[size=medium]:h-8 data-[size=small]:h-7 gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-label-sm text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none hover:border-(--border-strong) data-[state=open]:border-(--border-strong)"
				>
					<i class="ai ai-azion-api text-(--text-muted)" aria-hidden="true" />
					<span class="sr-only">{{ labels.label }}:</span>
					<span>{{ shortOf(version) }}</span>
					<i
						class="pi pi-chevron-down text-(--text-muted) transition-transform duration-150 ease-out motion-reduce:transition-none group-data-[state=open]:rotate-180"
						aria-hidden="true"
					/>
				</span>
			</template>
		</Dropdown.Trigger>

		<Dropdown.Group>
			<Dropdown.Option
				v-for="option in options"
				:key="option.id"
				:value="option.id"
				:selected="option.id === version"
			>
				{{ option.short }}
				<template v-if="option.status" #right>
					<Tag :label="option.status.label" :severity="option.status.severity" size="small" />
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
					:label="labels.helpCta"
					:href="labels.helpHref"
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
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import { usePlatformVersion } from '~/composables/use-platform-version';
import {
	CURRENT_VERSION,
	PLATFORM_VERSIONS,
	isPlatformVersion,
	pageVersionOf,
	type PageAvailability,
} from '~/nav/versions';

// Astro passes the `slot` attribute through; it never belongs on the root.
defineOptions({ name: 'VersionSelect', inheritAttrs: false });

/** Trigger height: `medium` sits with the header's controls, `small` with the theme switcher. */
export type VersionSelectSize = 'small' | 'medium';
/** Where the list opens: below in the header, `auto` at the foot of the drawer. */
export type VersionSelectPlacement = 'auto' | 'bottom-end';

interface Props {
	/** What the current page tells the select. */
	availability: PageAvailability;
	/** Accessible name and stage words. */
	labels: VersionLabels;
	/** Trigger height. */
	size?: VersionSelectSize;
	/** Where the list opens relative to the trigger. */
	placement?: VersionSelectPlacement;
}

const props = withDefaults(defineProps<Props>(), {
	size: 'medium',
	placement: 'bottom-end',
});

// The page defines the context: on a single-version page the select shows that version.
const { version, setVersion } = usePlatformVersion(pageVersionOf(props.availability));

const triggerRef = ref<HTMLElement | null>(null);

const STAGE_SEVERITY = {
	experimental: 'info',
	preview: 'info',
	deprecated: 'warning',
} as const;

// Each version with the tag beside it in the list: its stage, or the word for the current version.
const options = computed(() =>
	PLATFORM_VERSIONS.map((option) => {
		const stage = 'stage' in option ? option.stage : undefined;
		const status = stage
			? { label: props.labels.stages[stage], severity: STAGE_SEVERITY[stage] }
			: option.id === CURRENT_VERSION
				? { label: props.labels.current, severity: 'secondary' as const }
				: null;
		return { id: option.id, short: option.short, status };
	})
);

onMounted(() => document.body.addEventListener('keydown', onBodyKeydown));
onBeforeUnmount(() => document.body.removeEventListener('keydown', onBodyKeydown));

// The list is teleported to the body. An Esc that closes it would bubble on to the document,
// where the navigation drawer listens, and close the drawer too: it stops at the body instead.
function onBodyKeydown(event: KeyboardEvent) {
	if (event.key !== 'Escape' || !(event.target instanceof Element)) return;
	const menu = event.target.closest('[role="menu"]');
	const owner = menu && document.getElementById(menu.getAttribute('aria-labelledby') ?? '');
	if (owner && triggerRef.value && owner.contains(triggerRef.value)) event.stopPropagation();
}

// The trigger shows the chosen release line (`v4.x`, `v3.x`); the icon says it is the API version.
function shortOf(id: PlatformVersion): string {
	return PLATFORM_VERSIONS.find((entry) => entry.id === id)?.short ?? id;
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
	const page = props.availability;
	if (page.versions.includes(next)) return;
	const target = page.counterparts[next]?.href ?? page.homes[next];
	if (target) window.location.assign(target);
}
</script>
