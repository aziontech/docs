<template>
	<Tooltip
		:text="tooltip"
		placement="top"
	>
		<button
			type="button"
			:data-state="copied ? 'copied' : 'default'"
			class="group/highlight relative isolate inline-flex h-10 max-w-full items-center justify-center overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-default) p-px transition-colors duration-fast-02 ease-productive-entrance focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
			@click="copy"
		>
			<span
				aria-hidden="true"
				class="pointer-events-none absolute inset-0 animate-spin [animation-duration:8s] [animation-timing-function:linear] [background:linear-gradient(90deg,var(--color-base-white),var(--color-blue-500),var(--color-brand-primary-500))] filter-[blur(12px)] motion-reduce:animate-none"
			/>
			<span
				aria-hidden="true"
				class="pointer-events-none absolute inset-px rounded-[inherit] bg-[linear-gradient(120deg,var(--color-brand-accent-900)_17%,var(--color-brand-accent-100)_53%,var(--color-brand-accent-600)_96%)] transition-opacity duration-300 ease-out group-hover/highlight:opacity-25 motion-reduce:transition-none"
			/>
			<span
				aria-hidden="true"
				class="pointer-events-none absolute inset-px rounded-[inherit] bg-(--bg-backdrop) transition-opacity duration-300 ease-out group-hover/highlight:opacity-25 motion-reduce:transition-none"
			/>
			<span class="relative z-1 flex h-full w-full min-w-0 items-center justify-center gap-(--spacing-xs) px-(--spacing-md) text-label-md text-(--color-base-white) sm:gap-(--spacing-sm)">
				<span
					aria-live="polite"
					class="min-w-0 truncate sm:whitespace-nowrap"
				>
					{{ copied ? copiedLabel : label }}
				</span>
				<span
					aria-hidden="true"
					class="ml-(--spacing-xxs) flex shrink-0 items-center gap-(--spacing-xxs) sm:gap-(--spacing-xs)"
				>
					<AgentMark
						v-for="agent in agents"
						:key="agent"
						:name="agent"
						class="size-(--size-5)"
					/>
				</span>
			</span>
		</button>
	</Tooltip>
</template>

<script setup lang="ts">
	import Tooltip from '@aziontech/webkit/tooltip'
	import { onBeforeUnmount, ref } from 'vue'

	import AgentMark, { type AgentName } from './AgentMark.vue'

	const props = withDefaults(
		defineProps<{
			prompt: string
			label?: string
			copiedLabel?: string
			tooltip?: string
			agents?: AgentName[]
		}>(),
		{
			label: 'Copy prompt',
			copiedLabel: 'Prompt copied!',
			tooltip: 'Copies a setup prompt for your AI coding tool',
			agents: () => ['claude', 'codex', 'gemini', 'cursor']
		}
	)

	const copied = ref(false)
	let timer: ReturnType<typeof setTimeout> | null = null

	async function copy() {
		try {
			await navigator.clipboard.writeText(props.prompt)
		} catch {
			return
		}
		copied.value = true
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			copied.value = false
			timer = null
		}, 2000)
	}

	onBeforeUnmount(() => {
		if (timer) clearTimeout(timer)
	})
</script>
