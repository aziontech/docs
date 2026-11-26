import type { UIDictionaryKeys } from '~/i18n/translation-checkers';
import { PLATFORM_VERSIONS } from '~/nav/versions';

import type { VersionLabels } from './VersionSelect.vue';

/** The words of the version select and the menu's version tags, in the language of the page. */
export function versionLabels(t: (key: UIDictionaryKeys) => string): VersionLabels {
	return {
		label: t('versionSelect.label'),
		helpCta: t('versionSelect.helpCta'),
		helpHref: t('versionSelect.helpHref'),
		current: t('versionSelect.current'),
		short: Object.fromEntries(
			PLATFORM_VERSIONS.map((entry) => [entry.id, entry.short])
		) as VersionLabels['short'],
		stages: {
			experimental: t('versionSelect.stage.experimental'),
			preview: t('versionSelect.stage.preview'),
			deprecated: t('versionSelect.stage.deprecated'),
		},
	};
}
