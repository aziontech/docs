<template>
	<!--
		Docs-side wrapper around @aziontech/webkit's Button.

		DocProse styles every `a` in the article body as a prose link (link ink,
		underline, flat radius) and only steps aside for `[data-doc-chrome]`.
		A Button rendered with `href` is such an `a`, so it would come out
		underlined, blue and square. The webkit Button sets `inheritAttrs:
		false` and forwards only `class`, so `data-doc-chrome` cannot be put on
		the button itself — it goes on this span, whose subtree the contract
		also excludes. `data-doc-block` gives it the standard block spacing.
	-->
	<span data-doc-chrome data-doc-block class="inline-block">
		<Button v-bind="$attrs" @click="$emit('click', $event)" />
	</span>
</template>

<script setup>
import Button from '@aziontech/webkit/button';

defineOptions({ inheritAttrs: false });
defineEmits(['click']);
</script>
