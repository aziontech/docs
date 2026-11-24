<template>
	<DocsSidebar
		v-bind="$attrs"
		:version="version"
		:stage-labels="labels.stages"
		:version-labels="labels.short"
	>
		<template #version-select>
			<VersionSelect :availability="availability" :labels="labels" />
		</template>
	</DocsSidebar>
</template>

<script setup lang="ts">
import DocsSidebar from '~/components/webkit/DocsSidebar.vue';
import { usePlatformVersion } from '~/composables/use-platform-version';
import { pageVersionOf, type PageAvailability } from '~/nav/versions';

import VersionSelect, { type VersionLabels } from './VersionSelect.vue';

/**
 * The rail with the platform version wired in. DocsSidebar is a wrapper and imports no state, so
 * this island owns the shared version and hands it down, with the select in its header slot.
 */
defineOptions({ name: 'VersionedSidebar' });

interface Props {
	/** What the page tells the version select. */
	availability: PageAvailability;
	/** Words for the select and the stage tags. */
	labels: VersionLabels;
}

const props = defineProps<Props>();

// A single-version page defines the version, on the server and in the first client render.
const { version } = usePlatformVersion(pageVersionOf(props.availability));
</script>
