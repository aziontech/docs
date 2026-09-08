<template>
	<WkDocPageHeader
		:breadcrumb='breadcrumb'
		:description='description'
		:last-updated='lastUpdated'
		:last-updated-label='t.updated'
		:locale='locale'
		:meta-actions='metaActions'
		@meta-action='onMetaAction'
	>
		<template #title>
			<slot name='title'>
				<h1
					id='overview'
					class='m-0 w-full min-w-0 text-heading-2xl text-[var(--text-default)] sm:w-auto sm:flex-1 sm:text-heading-xl'
					v-html='title'
				/>
			</slot>
		</template>
		<template
			v-if='$slots.details'
			#details
		>
			<slot name='details' />
		</template>
	</WkDocPageHeader>
</template>

<script setup lang="ts">
	import { computed, ref } from 'vue'

	import WkDocPageHeader, {
		type DocCrumb,
		type DocPageAction
	} from '@aziontech/webkit/doc-page-header'

	type DocPageHeaderLang = 'en' | 'pt-br' | 'es'

	const props = defineProps<{
		title: string
		description?: string
		breadcrumb?: DocCrumb[]
		markdownHref: string
		lang: string
		lastUpdated?: string
		agentSetupHref?: string
	}>()

	const isCopied = ref(false)

	type Labels = {
		updated: string
		copy: string
		copied: string
		copyTip: string
		view: string
		viewTip: string
		agents: string
		agentsTip: string
	}

	const labels: Record<DocPageHeaderLang, Labels> = {
		en: {
			updated: 'Last updated',
			copy: 'Copy as Markdown',
			copied: 'Copied!',
			copyTip: 'Copy this page as Markdown, ready to paste into an assistant.',
			view: 'View as Markdown',
			viewTip: 'Open this page as plain Markdown in a new tab.',
			agents: 'Agent setup',
			agentsTip: 'Connect your AI coding agent to Azion: CLI, MCP server and prompts.'
		},
		'pt-br': {
			updated: 'Última atualização',
			copy: 'Copiar como Markdown',
			copied: 'Copiado!',
			copyTip: 'Copie esta página como Markdown, pronta para colar em um assistente.',
			view: 'Ver como Markdown',
			viewTip: 'Abra esta página como Markdown puro em uma nova aba.',
			agents: 'Configurar agente',
			agentsTip: 'Conecte seu agente de código à Azion: CLI, servidor MCP e prompts.'
		},
		es: {
			updated: 'Última actualización',
			copy: 'Copiar como Markdown',
			copied: '¡Copiado!',
			copyTip: 'Copie esta página como Markdown, lista para pegar en un asistente.',
			view: 'Ver como Markdown',
			viewTip: 'Abra esta página como Markdown puro en una nueva pestaña.',
			agents: 'Configurar agente',
			agentsTip: 'Conecte su agente de código a Azion: CLI, servidor MCP y prompts.'
		}
	}

	const locales: Record<DocPageHeaderLang, string> = { en: 'en-US', 'pt-br': 'pt-BR', es: 'es' }

	const t = computed(() => labels[props.lang as DocPageHeaderLang] ?? labels.en)
	const locale = computed(() => locales[props.lang as DocPageHeaderLang] ?? locales.en)

	const metaActions = computed<DocPageAction[]>(() => [
		{
			value: 'copy',
			label: isCopied.value ? t.value.copied : t.value.copy,
			icon: 'pi pi-copy',
			tip: t.value.copyTip
		},
		{
			value: 'markdown',
			label: t.value.view,
			icon: 'pi pi-eye',
			href: props.markdownHref,
			target: '_blank',
			tip: t.value.viewTip
		},
		...(props.agentSetupHref
			? [{
				value: 'agents',
				label: t.value.agents,
				icon: 'pi pi-microchip-ai',
				href: props.agentSetupHref,
				tip: t.value.agentsTip
			}]
			: [])
	])

	const pageMarkdown = ref<string | null>(null)

	const onMetaAction = async (_event: MouseEvent, item: DocPageAction) => {
		if (item.value !== 'copy') return

		try {
			if (!pageMarkdown.value) {
				const response = await fetch(props.markdownHref)
				pageMarkdown.value = await response.text()
			}
			if (typeof navigator !== 'undefined' && navigator.clipboard) {
				await navigator.clipboard.writeText(pageMarkdown.value)
			}
			isCopied.value = true
			setTimeout(() => {
				isCopied.value = false
			}, 2000)
		} catch (error) {
			console.error(error)
		}
	}
</script>
