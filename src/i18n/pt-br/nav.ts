/**
 * Main sidebar — derived from src/i18n/nav.menu.json (hand-curated source of truth).
 * Edit the JSON, not this file. Validated by `npm run lint:navcheck`.
 * Entries without a pt-br slug in the JSON render as /en/ fallback links.
 */
import menu from '../nav.menu.json';
import { navFromJson, type NavMenuJson } from '../nav-transform';

export default navFromJson(menu as NavMenuJson, 'pt-br');
