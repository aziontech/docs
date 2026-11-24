import type { useTranslations } from '~/i18n/util';

import type { PageVersionInfoLabels } from '~/components/RightSidebar/PageVersionInfo.vue';

/** The words of the versions and stage block, shared by the right rail and the narrow-screen header. */
export function buildPageVersionLabels(
	t: ReturnType<typeof useTranslations>
): PageVersionInfoLabels {
	return {
		groupLabel: t('pageAvailability.versionsLabel'),
		selected: t('pageAvailability.selected'),
		stageExperimental: t('pageAvailability.stage.experimental'),
		stagePreview: t('pageAvailability.stage.preview'),
		stageDeprecated: t('pageAvailability.stage.deprecated'),
		stageHelp: t('pageAvailability.stageHelp'),
		stageTipExperimental: t('pageAvailability.stageTip.experimental'),
		stageTipPreview: t('pageAvailability.stageTip.preview'),
		stageTipDeprecated: t('pageAvailability.stageTip.deprecated'),
		stageCta: t('pageAvailability.stageCta'),
		stageHref: t('pageAvailability.stageHref'),
		versionHelpHeadline: t('pageAvailability.versionHelp.headline'),
		versionHelpTip: t('pageAvailability.versionHelp.tip'),
		versionHelpCta: t('pageAvailability.versionHelp.cta'),
		versionHelpHref: t('pageAvailability.versionHelp.href'),
	};
}
