<template>
	<!-- Only on a page of a single version that is not the current one. The select, not this
	     note, is how the reader changes version. Anywhere else this renders nothing, so the
	     header has no gap; the versions and the stage live beside the title and in the rail.
	     The action takes the reader to the equivalent page in the current version. -->
	<Message
		v-if="notCurrent"
		severity="warning"
		size="medium"
		:closable="false"
		:action-label="counterpart ? fill(labels.bannerAction, { name: counterpart.label }) : ''"
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
}

// Astro hands an island's `slot="details"` to the component as an attribute; it must not reach the root.
defineOptions({ name: 'PageAvailability', inheritAttrs: false });

const props = defineProps<{
	availability: PageAvailability;
	labels: PageAvailabilityLabels;
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

function goToCounterpart() {
	if (counterpart.value) window.location.assign(counterpart.value.href);
}
</script>
