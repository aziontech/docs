<template>
	<div class="flex flex-col gap-2">
		<p class="font-medium text-base">{{ setTranslations.title }}</p>
		<ul class="flex flex-col gap-2">
			<li
				v-for="({ label, icon, href }, index) in setTranslations.communities"
				:key="index"
				class="hover:underline"
			>
				<a
					:href="href"
					class="text-muted text-sm"
				>
					<i
						:class="icon"
						class="mr-1"
					/>
					{{ label }}
				</a>
			</li>
		</ul>
	</div>
</template>

<script setup>
	/*
		Hand-written for the same reason as EditButton.astro: every row here is
		icon-first (`pi pi-discord`, `pi pi-comment`, `ai ai-x`) and
		webkit's Link puts its icon after the label with no way to move it. The
		component also sits in `src/components/webkit/` without importing
		anything from webkit -- the directory name is about where the docs keep
		their design-system adapters, not a claim about this file.
	*/
	const props = defineProps({
		lang: {
			type: String,
			required: false,
			default: 'en'
		}
	})

	const TRANSLATIONS = {
		en: {
			title: 'Community',
			communities: [
				{
					label: 'Join us on Discord',
					icon: 'pi pi-discord',
					href: 'https://discord.com/invite/Yp9N7RMVZy'
				},
				{
					label: 'Read our blog posts',
					icon: 'pi pi-comment',
					href: 'https://www.azion.com/en/blog/'
				},
				{
					label: 'Follow us on X',
					icon: 'ai ai-x',
					href: 'https://twitter.com/aziontech'
				}
			]
		},
		'pt-br': {
			title: 'Comunidade',
			communities: [
				{
					label: 'Junte-se a nós no Discord',
					icon: 'pi pi-discord',
					href: 'https://discord.com/invite/Yp9N7RMVZy'
				},
				{
					label: 'Leia nossas postagens no blog',
					icon: 'pi pi-comment',
					href: 'https://www.azion.com/pt-br/blog/'
				},
				{
					label: 'Junte-se a nós no X',
					icon: 'ai ai-x',
					href: 'https://twitter.com/aziontech'
				}
			]
		},
		es: {
			title: 'Comunidad',
			communities: [
				{
					label: 'Únete a nosotros en Discord',
					icon: 'pi pi-discord',
					href: 'https://discord.com/invite/Yp9N7RMVZy'
				},
				{
					label: 'Lee nuestras publicaciones en el blog',
					icon: 'pi pi-comment',
					href: 'https://www.azion.com/es/blog/'
				},
				{
					label: 'Síguenos en X',
					icon: 'ai ai-x',
					href: 'https://twitter.com/aziontech'
				}
			]
		}
	}

	const setTranslations = TRANSLATIONS[props.lang] ? TRANSLATIONS[props.lang] : TRANSLATIONS['en']
</script>
