<template>
	<!--
		The dot and its label come from @aziontech/webkit's StatusIndicator, so
		the severity colors are theme tokens instead of the inline hex this
		component used to paint the dot with.

		The clickable pill around it stays a plain anchor: the webkit Button
		takes its content through a `label` string prop and exposes no default
		slot, so wrapping the indicator in one is not possible — it would render
		the text and drop the dot. The classes below are only the outlined-button
		surface, all of it from the same tokens Button uses.
	-->
	<a
		href="https://status.azion.com/"
		:title="label"
		target="_blank"
		rel="noopener noreferrer"
		class="flex h-8 w-fit items-center whitespace-nowrap rounded-[var(--shape-button)] border border-default bg-surface px-4 no-underline transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring-color)]"
	>
		<StatusIndicator :severity="severity" :label="capitalizeLetter(String(label).trim())" />
	</a>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';

import StatusIndicator from '@aziontech/webkit/status-indicator';

const props = defineProps({
	lang: {
		type: String,
		required: true,
	},
});

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

// statuspage.io's five indicators, mapped onto the design system's severity
// scale. `minor` and `major` share `warning` because the DS offers a single
// degraded step between healthy and down.
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
