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
		Not webkit's Link, same reason as EditButton.astro: it puts the icon
		after the label and these rows are icon-first.
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
