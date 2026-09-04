<template>
	<!--
		Adapter over @aziontech/webkit's DocPageHeader. The masthead itself
		(breadcrumb, title line, deck, meta line, closing rule) is the design
		system's; what this wrapper adds is the docs site's own behavior:

		- the `h1` keeps `id="overview"` (the "On this page" TOC anchors to it)
		  and renders the title as HTML, which frontmatter titles may carry;
		- the meta-line actions are wired: "Copy as Markdown" fetches the
		  page's `.md` twin and puts it on the clipboard (with a transient
		  "Copied!" label), "View as Markdown" is a plain link the built-in
		  renders as a real anchor.
	-->
	<WkDocPageHeader
		:breadcrumb='breadcrumb'
		:description='description'
		:meta-actions='metaActions'
		@meta-action='onMetaAction'
	>
		<template #title>
			<h1
				id='overview'
				class='m-0 w-full min-w-0 text-heading-2xl text-[var(--text-default)] sm:w-auto sm:flex-1 sm:text-heading-xl'
				v-html='title'
			/>
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
		/** The page's markdown twin, e.g. `/en/documentation/.../cache.md`. */
		markdownHref: string
		lang: string
	}>()

	const isCopied = ref(false)

	const labels: Record<DocPageHeaderLang, { copy: string; copied: string; copyTip: string; view: string; viewTip: string }> = {
		en: {
			copy: 'Copy as Markdown',
			copied: 'Copied!',
			copyTip: 'Copy this page as Markdown, ready to paste into an assistant.',
			view: 'View as Markdown',
			viewTip: 'Open this page as plain Markdown in a new tab.'
		},
		'pt-br': {
			copy: 'Copiar como Markdown',
			copied: 'Copiado!',
			copyTip: 'Copie esta página como Markdown, pronta para colar em um assistente.',
			view: 'Ver como Markdown',
			viewTip: 'Abra esta página como Markdown puro em uma nova aba.'
		},
		es: {
			copy: 'Copiar como Markdown',
			copied: '¡Copiado!',
			copyTip: 'Copie esta página como Markdown, lista para pegar en un asistente.',
			view: 'Ver como Markdown',
			viewTip: 'Abra esta página como Markdown puro en una nueva pestaña.'
		}
	}

	const t = computed(() => labels[props.lang as DocPageHeaderLang] ?? labels.en)

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
		}
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
