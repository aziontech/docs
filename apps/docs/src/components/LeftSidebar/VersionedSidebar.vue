<template>
	<DocsSidebar
		v-bind="rail"
		:version="version"
		:stage-labels="labels.stages"
		:version-labels="labels.short"
	/>
</template>

<script setup lang="ts">
import DocsSidebar from '~/components/webkit/DocsSidebar.vue';
import type { DocsSidebarProps } from '~/components/webkit/docs-sidebar-props';
import { usePlatformVersion } from '~/composables/use-platform-version';
import { pageVersionOf, type PageAvailability } from '~/nav/versions';

import type { VersionLabels } from './VersionSelect.vue';

/**
 * The rail with the platform version wired in. DocsSidebar is a wrapper and imports no state, so
 * this island owns the shared version and hands it down. The select lives in the page header.
 */
defineOptions({ name: 'VersionedSidebar', inheritAttrs: false });

/** The rail's own props: the version and its words come from this island. */
export type RailProps = Omit<DocsSidebarProps, 'version' | 'stageLabels' | 'versionLabels'>;

interface Props {
	/** The rail's menus and words. */
	rail: RailProps;
	/** What the page tells the rail about its versions. */
	availability: PageAvailability;
	/** Words for the stage and version tags. */
	labels: VersionLabels;
}

const props = defineProps<Props>();

// A single-version page defines the version, on the server and in the first client render.
const { version } = usePlatformVersion(pageVersionOf(props.availability));
</script>
