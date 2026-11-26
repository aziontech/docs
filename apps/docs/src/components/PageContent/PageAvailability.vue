<template>
	<!-- Only on a page of a single version that is not the current one. The select, not this
	     note, is how the reader changes version. Anywhere else this renders nothing, so the
	     header has no gap; the stage sits beside the title and the version in the header's select.
	     The action takes the reader to the equivalent page in the current version. -->
	<Message
		v-if="notCurrent"
		severity="warning"
		size="medium"
		:closable="false"
		:action-label="actionLabel"
		@action="goToCounterpart"
	>
		{{ fill(labels.bannerMessage, { version: labelOf(notCurrent) }) }}
	</Message>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import Message from '@aziontech/webkit/message';

import {
	CURRENT_VERSION,
	PLATFORM_VERSIONS,
	pageVersionOf,
	type PageAvailability,
	type PlatformVersion,
} from '~/nav/versions';

export interface PageAvailabilityLabels {
	/** Template with `{version}`: what the page documents. */
	bannerMessage: string;
	/** Template with `{name}`: the action that opens the equivalent page in the current version. */
	bannerAction: string;
	/** Template with `{version}`: the same action when the equivalent page shares this page's title. */
	bannerActionVersion: string;
}

// Astro hands an island's `slot="details"` to the component as an attribute; it must not reach the root.
defineOptions({ name: 'PageAvailability', inheritAttrs: false });

const props = defineProps<{
	availability: PageAvailability;
	labels: PageAvailabilityLabels;
	/** The page's title: an equivalent page with the same one is named by its version instead. */
	title: string;
}>();

const labelOf = (id: PlatformVersion) =>
	PLATFORM_VERSIONS.find((item) => item.id === id)?.label ?? id;

const fill = (template: string, values: Record<string, string>) =>
	template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');

/** The single version the page documents, when it is not the current one. */
const notCurrent = computed(() => {
	const only = pageVersionOf(props.availability);
	return only && only !== CURRENT_VERSION ? only : undefined;
});
const counterpart = computed(() => props.availability.counterparts[CURRENT_VERSION]);

// "Go to Workloads" names a different product; "Go to How to provision files" would name this page.
const actionLabel = computed(() => {
	const target = counterpart.value;
	if (!target) return '';
	return target.label === props.title
		? fill(props.labels.bannerActionVersion, { version: labelOf(CURRENT_VERSION) })
		: fill(props.labels.bannerAction, { name: target.label });
});

function goToCounterpart() {
	if (counterpart.value) window.location.assign(counterpart.value.href);
}
</script>
