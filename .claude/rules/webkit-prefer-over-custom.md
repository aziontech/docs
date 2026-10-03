# Rule: use the webkit component before building your own

Before you write UI, check whether the design system already has it. It almost always does — and its version is themed, accessible, and consistent with the rest of the product.

## Do this first

1. Check the catalog: the webkit MCP (`suggest_component` with a plain description of what you need) or `node_modules/@aziontech/webkit/catalog.json` (the `imports` object lists every component).
2. If a component exists, use it. Compose it, pass its props, fill its slots.
3. If it almost fits, prefer configuring/composing the webkit component over forking it.

## Do not

- Do not hand-roll a button, input, modal, table, tooltip, badge, or any common UI when webkit already ships one.
- Do not pull in another component library (PrimeVue, a headless UI kit, a random npm widget) for something webkit covers.
- Do not copy a component's markup into your own file to tweak it — use the real component so it stays themed and accessible.

## When webkit genuinely lacks it

- Build the smallest custom piece you need, using `@aziontech/theme` tokens for all color/spacing/typography (see the tokens rule).
- Keep it composable with webkit components rather than reinventing their look.
- Consider raising the gap with the design-system team so it can be added once for everyone.

The goal: your UI looks and behaves like the rest of the product because it is built from the same parts.
