<template>
	<div
		ref='rootRef'
		class='relative flex h-8'
	>
		<button
			type='button'
			class='text-sm min-w-32 group cursor-pointer bg-neutral-950 text-neutral-100 duration-300 px-3 transition ease-in-out rounded-l-md active:bg-neutral-900 border border-neutral-900 hover:bg-neutral-900 hover:text-orange-500'
			@click='getPageMarkdown'
		>
			{{ label }}
		</button>

		<button
			type='button'
			aria-haspopup='menu'
			:aria-expanded='isMenuOpen'
			aria-label='More options'
			class='group cursor-pointer bg-neutral-950 text-neutral-100 duration-300 transition px-3 rounded-r-md rounded-l-none active:bg-neutral-900 border border-l-0 border-neutral-900 hover:bg-neutral-900'
			@click='toggleMenu'
		>
			<i class='pi pi-chevron-down group-hover:text-orange-500 h-3 w-3 text-xs'></i>
		</button>

		<ul
			v-if='isMenuOpen'
			role='menu'
			class='absolute right-0 top-full z-50 mt-1 w-64 list-none p-3 m-0 rounded-md bg-neutral-950 border border-neutral-900'
		>
			<li
				v-for='(item, index) in menuItems[props.lang as keyof typeof menuItems]'
				:key='index'
				role='menuitem'
			>
				<div
					class='flex gap-2 hover:bg-neutral-900 p-1 rounded-md cursor-pointer'
					@click='runItemCommand(item)'
				>
					<i
						:class='item.icon'
						class='text-neutral-500 text-xs pt-0.5'
					/>
					<div class='flex flex-col gap-1'>
						<p class='text-neutral-100 text-sm'>
							{{ item.label }}
						</p>
						<p class='text-neutral-500 text-xs'>{{ item.description }}</p>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
	import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

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
	const isMenuOpen = ref(false)
	const rootRef = ref<HTMLElement | null>(null)

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

	const toggleMenu = () => {
		isMenuOpen.value = !isMenuOpen.value
	}

	const closeMenu = () => {
		isMenuOpen.value = false
	}

	const runItemCommand = (item: AskAISplitButtonMenuItem) => {
		item.command()
		closeMenu()
	}

	const onDocumentClick = (event: MouseEvent) => {
		if (!isMenuOpen.value) return
		if (rootRef.value && !rootRef.value.contains(event.target as Node)) closeMenu()
	}

	const onDocumentKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') closeMenu()
	}

	onMounted(() => {
		document.addEventListener('click', onDocumentClick)
		document.addEventListener('keydown', onDocumentKeydown)
	})

	onBeforeUnmount(() => {
		document.removeEventListener('click', onDocumentClick)
		document.removeEventListener('keydown', onDocumentKeydown)
	})

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
</script>
