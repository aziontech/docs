<template>
	<!--
		Composed exactly the way @aziontech/webkit builds its own SplitButton --
		Button + IconButton joined inside a Dropdown -- rather than the two
		hand-painted <button>s (and hand-written outside-click / Escape
		handling) this component used to carry. SplitButton itself is not used
		directly because its `model` renders label-only rows, and these actions
		each carry a description line; Dropdown.Option's default slot keeps
		them.
	-->
	<Dropdown
		placement='bottom-end'
		@select='onSelect'
	>
		<div class='inline-flex w-fit items-stretch'>
			<Button
				:label='label'
				kind='secondary'
				size='medium'
				class='min-w-32 rounded-r-none! focus-visible:z-[1]'
				@click='getPageMarkdown'
			/>

			<Dropdown.Trigger>
				<IconButton
					icon='pi pi-chevron-down'
					:ariaLabel='toggleAriaLabel'
					kind='secondary'
					size='medium'
					class='rounded-l-none! -ml-px border-l border-[var(--border-default)] focus-visible:z-[1]'
				/>
			</Dropdown.Trigger>
		</div>

		<Dropdown.Group>
			<!--
				Dropdown.Option is a single-line row (`h-8 min-h-8`, and it puts
				`whitespace-nowrap` on its content). These actions each carry a
				description line, so the row is relaxed to grow with its content
				and the text is allowed to wrap -- otherwise the two lines
				overlap and long labels get clipped by the panel's
				`overflow-hidden`.
			-->
			<Dropdown.Option
				v-for='(item, index) in items'
				:key='index'
				:value='String(index)'
				class='h-auto py-[var(--spacing-xs)]'
			>
				<template #left>
					<i
						:class='item.icon'
						class='text-[length:inherit] leading-none'
						aria-hidden='true'
					/>
				</template>

				<span class='flex min-w-0 flex-col gap-1 whitespace-normal'>
					<span>{{ item.label }}</span>
					<span class='text-xs text-muted'>{{ item.description }}</span>
				</span>
			</Dropdown.Option>
		</Dropdown.Group>
	</Dropdown>
</template>

<script setup lang="ts">
	import { computed, ref } from 'vue'

	import Button from '@aziontech/webkit/button'
	import IconButton from '@aziontech/webkit/icon-button'
	import Dropdown from '@aziontech/webkit/dropdown'

	interface AskAISplitButtonMenuItem {
		label: string
		description: string
		icon: string
		command: () => void | Promise<void> | string
	}

	type AskAISplitButtonLang = 'en' | 'pt-br' | 'es'

	const props = defineProps({
		lang: {
			type: String,
			required: true,
			default: 'en'
		}
	})

	const isCopied = ref(false)

	const label = computed(() => {
		const lang = props.lang as AskAISplitButtonLang
		if (isCopied.value) {
			return {
				en: 'Copied!',
				'pt-br': 'Copiado!',
				es: '¡Copiado!'
			}[lang]
		}
		return {
			en: 'Copy page',
			'pt-br': 'Copiar página',
			es: 'Copiar página'
		}[lang]
	})

	const toggleAriaLabel = computed(() => `${label.value} \u2014 more actions`)

	// Dropdown owns open state, outside-click and Escape now; it hands back the
	// activated option's value, which is the item's index in `items`.
	const onSelect = (_event: MouseEvent | KeyboardEvent, value: string | number) => {
		items.value[Number(value)]?.command()
	}

	const pageMarkdown = ref<string | null>(null)

	const getPageMarkdown = async () => {
		if (pageMarkdown.value) {
			await copyToClipboard(pageMarkdown.value)
			showCopiedFeedback()
			return
		}

		try {
			const pageLink = getPageLink().replace(/\/$/, '')
			const response = await fetch(`${pageLink}.md`)
			const markdownText = await response.text()
			await copyToClipboard(markdownText)
			pageMarkdown.value = markdownText
			showCopiedFeedback()

			return
		} catch (error) {
			console.error(error)
		}
	}

	const showCopiedFeedback = () => {
		isCopied.value = true
		setTimeout(() => {
			isCopied.value = false
		}, 2000)
	}

	const copyToClipboard = async (text: string) => {
		if (typeof navigator !== 'undefined' && navigator.clipboard) {
			await navigator.clipboard.writeText(text)
		}
	}

	const getPageLink = () => {
		return window.location.href
	}

	const copyPageLink = async () => {
		const pageLink = getPageLink()
		await copyToClipboard(pageLink)
	}

	const getAIMessage = (): string => {
		const pageLink = getPageLink()

		const messages = {
			en: `Read this page from Azion: ${pageLink} and answer questions about the content.`,
			'pt-br': `Leia esta página da Azion: ${pageLink} e responda perguntas sobre o conteúdo.`,
			es: `Lea esta página de Azion: ${pageLink} y responda preguntas sobre el contenido.`
		}
		return messages[props.lang as keyof typeof messages]
	}

	const openAILink = (url: string) => {
		if (typeof window === 'undefined') return
		const message = encodeURIComponent(getAIMessage())
		window.open(`${url}${message}`, '_blank')
	}

	const openPageAsMarkdown = () => {
		const pageLink = getPageLink().replace(/\/$/, '')
		window.open(`${pageLink}.md`, '_blank')
	}

	const openInGoogleAI = () => {
		openAILink('https://www.google.com/search?udm=50&aep=11&q=')
	}

	const openInPerplexity = () => {
		openAILink('https://www.perplexity.ai/search?q=')
	}

	const openInClaude = () => {
		openAILink('https://claude.ai/new?q=')
	}

	const openInChatGPT = () => {
		openAILink('https://chat.openai.com/?q=')
	}

	const openInGrok = () => {
		openAILink('https://x.com/i/grok?text=')
	}

	const menuItems: Record<AskAISplitButtonLang, AskAISplitButtonMenuItem[]> = {
		en: [
			{
				label: 'Get page link',
				description: 'Get the URL of this page',
				icon: 'pi pi-clipboard',
				command: copyPageLink
			},
			{
				label: 'View page as markdown',
				description: 'Open the markdown file of this page',
				icon: 'pi pi-arrow-up-right',
				command: openPageAsMarkdown
			},
			{
				label: 'Open in Google AI',
				description: 'Ask Google AI about this page',
				icon: 'pi pi-arrow-up-right',
				command: openInGoogleAI
			},
			{
				label: 'Open in Perplexity',
				description: 'Ask Perplexity about this page',
				icon: 'pi pi-arrow-up-right',
				command: openInPerplexity
			},
			{
				label: 'Open in Claude',
				description: 'Ask Claude about this page',
				icon: 'pi pi-arrow-up-right',
				command: openInClaude
			},
			{
				label: 'Open in ChatGPT',
				description: 'Ask ChatGPT about this page',
				icon: 'pi pi-arrow-up-right',
				command: openInChatGPT
			},
			{
				label: 'Open in Grok',
				description: 'Ask Grok about this page',
				icon: 'pi pi-arrow-up-right',
				command: openInGrok
			}
		],
		'pt-br': [
			{
				label: 'Obter link da página',
				description: 'Obter o URL da página',
				icon: 'pi pi-clipboard',
				command: copyPageLink
			},
			{
				label: 'Visualizar página como markdown',
				description: 'Abrir o arquivo markdown da página',
				icon: 'pi pi-arrow-up-right',
				command: openPageAsMarkdown
			},
			{
				label: 'Abrir no Google AI',
				description: 'Pergunte ao Google AI sobre esta página',
				icon: 'pi pi-arrow-up-right',
				command: openInGoogleAI
			},
			{
				label: 'Abrir no Perplexity',
				description: 'Pergunte ao Perplexity sobre esta página',
				icon: 'pi pi-arrow-up-right',
				command: openInPerplexity
			},
			{
				label: 'Abrir no Claude',
				description: 'Pergunte ao Claude sobre esta página',
				icon: 'pi pi-arrow-up-right',
				command: openInClaude
			},
			{
				label: 'Abrir no ChatGPT',
				description: 'Pergunte ao ChatGPT sobre esta página',
				icon: 'pi pi-arrow-up-right',
				command: openInChatGPT
			},
			{
				label: 'Abrir no Grok',
				description: 'Pergunte ao Grok sobre esta página',
				icon: 'pi pi-arrow-up-right',
				command: openInGrok
			}
		],
		es: [
			{
				label: 'Obtener link de la página',
				description: 'Obtener el URL de la página',
				icon: 'pi pi-clipboard',
				command: copyPageLink
			},
			{
				label: 'Visualizar página como markdown',
				description: 'Abrir el archivo markdown de la página',
				icon: 'pi pi-arrow-up-right',
				command: openPageAsMarkdown
			},
			{
				label: 'Abrir en Google AI',
				description: 'Pregunte al Google AI sobre esta página',
				icon: 'pi pi-arrow-up-right',
				command: openInGoogleAI
			},
			{
				label: 'Abrir en Perplexity',
				description: 'Pregunte al Perplexity sobre esta página',
				icon: 'pi pi-arrow-up-right',
				command: openInPerplexity
			},
			{
				label: 'Abrir en Claude',
				description: 'Pregunte al Claude sobre esta página',
				icon: 'pi pi-arrow-up-right',
				command: openInClaude
			},
			{
				label: 'Abrir en ChatGPT',
				description: 'Pregunte al ChatGPT sobre esta página',
				icon: 'pi pi-arrow-up-right',
				command: openInChatGPT
			},
			{
				label: 'Abrir en Grok',
				description: 'Pregunte al Grok sobre esta página',
				icon: 'pi pi-arrow-up-right',
				command: openInGrok
			}
		]
	}

	const items = computed(
		() => menuItems[props.lang as AskAISplitButtonLang] ?? menuItems.en
	)
</script>
