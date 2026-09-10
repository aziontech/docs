<template>
	<!-- The indicator is BARE — dot and label, no pill. It reads as a line of status
	     text in the footer's own status row, which is what the DS `Footer` and the
	     marketing site's footer both put there; a bordered chip made it look like a
	     button that could be pressed for something other than the status page.

	     It is still a link (the status page is what a reader wants next), so it keeps
	     the treatment every other quiet link in these shells carries: one opacity
	     transition on hover and a focus ring. -->
	<a
		href="https://status.azion.com/"
		:title="label"
		target="_blank"
		rel="noopener noreferrer"
		class="inline-flex w-fit items-center rounded-(--shape-elements) no-underline transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
	>
		<StatusIndicator :severity="severity" :label="capitalizeLetter(String(label).trim())" />
	</a>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

import StatusIndicator from '@aziontech/webkit/status-indicator';

interface Props {
	/** Language the status label is translated into. */
	lang: string;
}

const props = defineProps<Props>();

const { lang } = props;

const TRANSLATIONS = {
	'All Systems Operational': {
		es: 'Todos los sistemas operativos',
		'pt-br': 'Todos os sistemas operacionais',
	},
	'Service under Maintenance': {
		es: 'Servicio en mantenimiento',
		'pt-br': 'Serviço em Manutenção',
	},
	'Partially Degraded Service': {
		es: 'Servicio parcialmente degradado',
		'pt-br': 'Serviço Parcialmente Degradado',
	},
	'Minor Service Outage': {
		es: 'Interrupción Menor del Servicio',
		'pt-br': 'Interrupção Menor do Serviço',
	},
	'Partial System Outage': {
		es: 'Interrupción Parcial del Sistema',
		'pt-br': 'Interrupção Parcial do Sistema',
	},
	'Major System Outage': {
		es: 'Interrupción Grave del Sistema',
		'pt-br': 'Interrupção Grave do Sistema',
	},
};

const STATUS_PAGE_SEVERITIES = {
	none: 'success',
	minor: 'warning',
	major: 'warning',
	critical: 'danger',
	maintenance: 'info',
};

const OPERATIONAL_STATUS = {
	indicator: 'none',
	description: 'All Systems Operational',
};

const LABEL_INITIAL_VALUE =
	lang !== 'en'
		? TRANSLATIONS[OPERATIONAL_STATUS.description][lang]
		: OPERATIONAL_STATUS.description;

const label = ref(LABEL_INITIAL_VALUE);
const severity = ref(STATUS_PAGE_SEVERITIES[OPERATIONAL_STATUS.indicator]);

onBeforeMount(() => {
	checkComponentStatus();
});

async function checkComponentStatus() {
	try {
		const response = await fetch('https://status.azion.com/api/v2/components.json', {
			method: 'GET',
		});
		const { components } = await response.json();
		const checkComponents = (component) =>
			component.status !== 'operational' && component.status !== 'partial_outage';
		const hasImpactedComponent = components?.some(checkComponents);
		const currentStatus = await getStatus(hasImpactedComponent);
		const translatedStatus =
			lang == 'pt-br' || lang == 'es'
				? { ...currentStatus, description: TRANSLATIONS[currentStatus.description][lang] }
				: currentStatus;

		updateSystemStatus(translatedStatus);
	} catch (error) {
		console.error(error);
	}
}

async function getStatus(checkStatusPage) {
	let statusResult;

	if (checkStatusPage) {
		const response = await fetch('https://status.azion.com/api/v2/status.json', {
			method: 'GET',
		});

		const normalizedResponse = await response.json();
		statusResult = normalizedResponse.status;
	} else {
		statusResult = OPERATIONAL_STATUS;
	}

	return statusResult;
}

function updateSystemStatus({ indicator, description }) {
	severity.value = STATUS_PAGE_SEVERITIES[indicator];
	label.value = description;
}

function capitalizeLetter(word) {
	return word.replace(word[0], word.charAt(0).toUpperCase());
}
</script>
