<template>
	<!--
		The whole hero is webkit's HeroTitle now. It owns the `h1`, the
		supporting paragraph and the actions row -- including the row's
		stack-and-go-fluid behaviour below `sm` -- so the four components this
		replaces (HeroBase, HeroButton, ContentLogo, Banner) are gone rather
		than adapted.

		`data-doc-chrome` sits on the component root instead of on the actions
		wrapper the old hero marked. HeroTitle binds `$attrs` to its `<header>`,
		and DocProse's rules all read `:not([data-doc-chrome], [data-doc-chrome]
		*)`, so one marker covers the headline and the copy too -- and it has to,
		because these homes render inside ReadableContent and DocProse would
		otherwise repaint the component's own typography as article prose.

		The vertical rhythm is the old hero's, in theme tokens: `--spacing-xl`
		above and `--spacing-xxl` below. Deliberately not SectionGap, even
		though it is the design system's spacer: SectionGap is a FrameBox with
		`borders="y"` and corner marks, i.e. it draws the rules of a framed
		page. These homes are not framed, so it would add two hairlines that
		nothing else on the page answers to.

		One loss, and it is a loss rather than a choice: both homes write their
		accent at the *end* of the headline ("Welcome to <span>Azion
		Docs</span>"), while HeroTitle's `highlight` is documented and built as
		the *opening* phrase and there is no slot for the title. Passing "Azion
		Docs" as `highlight` would print it before "Welcome to". So the headline
		goes through unaccented and the gap is filed against the design system.
		What leaves with that span is a hardcoded `#F3652B !important` that
		never followed the theme in the first place.
	-->
	<HeroTitle
		data-doc-chrome
		centered
		:title="title"
		:description="description"
		class="mt-(--spacing-xl) mb-(--spacing-xxl)"
	>
		<template
			v-if="buttons.length"
			#actions
		>
			<Button
				v-for="button in buttons"
				:key="button.label || button.link"
				:label="button.label"
				:icon="button.icon"
				:kind="buttonKind(button)"
				:size="buttonSize(button)"
				:href="button.link"
			/>
		</template>
	</HeroTitle>
</template>

<script setup>
	import Button from '@aziontech/webkit/button';
	import HeroTitle from '@aziontech/webkit/hero-title';

	/*
		Maps a content-authored button object onto webkit's `kind`, keeping the
		precedence the deleted HeroButton used: an explicit variant wins, then
		`severity`, then `outlined`. The authored objects speak the older
		`outlined` / `severity` shape, which is why the mapping stays -- the two
		homes pass `outlined: false` and `severity: 'secondary'`, so the pair
		reads as a primary and a secondary action.

		`secondary` maps straight through on purpose: the same authored value
		reaches DocButton as webkit's `secondary` in body copy, and having the
		hero send it to `outlined` instead is what used to make one prop render
		as two different buttons depending on where it sat.
	*/
	function buttonKind(button) {
		if (button.kind) return button.kind;
		if (button.type) return button.type === 'tertiary' ? 'text' : button.type;
		if (button.severity === 'secondary') return 'secondary';
		if (button.outlined) return 'outlined';

		return 'primary';
	}

	/*
		Hero actions are the page's largest call to action, so `large` is the
		default and `small` has to be asked for.
	*/
	function buttonSize(button) {
		return button.size === 'small' ? 'small' : 'large';
	}

	defineProps({
		title: {
			type: String,
			default: () => ''
		},
		description: {
			type: String,
			default: () => ''
		},
		buttons: {
			type: Array,
			default: () => []
		}
	});
</script>
