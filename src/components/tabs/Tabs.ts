/**
 * The 178 `.mdx` files that use the tab view import it extensionless, as
 * `~/components/tabs/Tabs`, and Vite's default resolution does not try `.vue`.
 * This shim is what keeps that import — and therefore every content file —
 * working now that the component is a Vue SFC instead of a `.tsx`.
 */
export { default } from './Tabs.vue';
