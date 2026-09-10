<template>
	<div class="docs-footer w-full border-t border-(--border-default)">
		<Footer aria-label="Footer">
			<Footer.Column v-for="column in listData" :key="column.title" :title="column.title">
				<Footer.Link v-for="item in column.list" :key="item.title" :href="item.link">
					{{ item.title }}
				</Footer.Link>
			</Footer.Column>

			<template #social>
				<a
					:href="`/${lang}/`"
					aria-label="Azion home"
					:class="BRAND_LINK_CLASS"
					class="mr-(--spacing-xs) hidden lg:inline-flex"
				>
					<Brand size="small" aria-hidden="true" />
				</a>

				<IconButton
					v-for="({ icon, link, title, target }, index) in socialButtons"
					:key="index"
					kind="transparent"
					:icon="icon"
					:aria-label="title"
					:href="link"
					:target="target || '_blank'"
				/>
			</template>

			<template #status>
				<slot name="system-status" />
			</template>

			<template #language>
				<slot name="action" />
				<slot name="theme-switch" />
			</template>
			<template #brand>
				<a
					:href="`/${lang}/`"
					aria-label="Azion home"
					:class="BRAND_LINK_CLASS"
					class="mx-auto inline-flex"
				>
					<Brand size="small" aria-hidden="true" />
				</a>
			</template>
		</Footer>
	</div>
</template>

<script setup>
import Brand from '@aziontech/webkit/brand';
import Footer from '@aziontech/webkit/footer';
import IconButton from '@aziontech/webkit/icon-button';

defineProps({
	lang: {
		type: String,
		required: true,
	},
	listData: {
		type: Array,
		required: true,
	},
	socialButtons: {
		type: Array,
		required: false,
	},
});

// The mark's treatment, in one place because it is rendered in two: the same one every
// other brand redirect carries — one opacity transition on hover, and a focus ring.
// DISPLAY IS NOT IN HERE, deliberately: the two placements need different ones (the
// social row's anchor is `hidden` below `lg`), and two display utilities on one element
// resolve by the order Tailwind emitted them, not by the order they are written.
const BRAND_LINK_CLASS =
	'w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)';
</script>

<style>
/* WHERE THE MARK SITS, by width — the `lg` half of the pair the `#social` and `#brand`
   slots set up above. It is a stylesheet rule rather than a utility class because the
   element it removes belongs to the DS Footer, not to this template: only the band's
   own `data-testid` (the hook webkit provides for it) reaches it from out here.

   `lg` = 1024px, Tailwind's own breakpoint, matching where the mark starts leading the
   social row: from `md` that row is only half the footer — it shares its grid row with
   the status pair — and is too narrow to hold the mark and the icon buttons on one
   line. */
@media (min-width: 1024px) {
	.docs-footer [data-testid='layout-footer__signature'] {
		display: none;
	}
}

/* THE STATUS BAND WRAPS HERE, which it does not in the DS. The band is built for the
   two controls the marketing footer puts in it — a status indicator and a language
   select — and docs puts a third one there, the theme switcher, which has nowhere else
   to live in this shell. At 375px those three overflow the band by ~95px, and because
   it is a `flex-row-reverse` row the overflow falls off the LEFT edge: the theme
   switcher was clipped and unreachable on a phone.

   One property, and only where it is needed — a row that fits does not wrap. */
.docs-footer [data-testid='layout-footer__status'] {
	flex-wrap: wrap;
}
</style>
