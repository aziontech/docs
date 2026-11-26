import type { useTranslations } from '~/i18n/util';

/** The words of the release stage beside the page title, and of its help panel. */
export interface PageStageLabels {
	stageExperimental: string;
	stagePreview: string;
	stageDeprecated: string;
	/** Read to assistive technology as the name of the stage help icon. */
	stageHelp: string;
	stageTipExperimental: string;
	stageTipPreview: string;
	stageTipDeprecated: string;
	/** Label of the link in the stage panel. */
	stageCta: string;
	stageHref: string;
}

export function buildPageStageLabels(t: ReturnType<typeof useTranslations>): PageStageLabels {
	return {
		stageExperimental: t('pageAvailability.stage.experimental'),
		stagePreview: t('pageAvailability.stage.preview'),
		stageDeprecated: t('pageAvailability.stage.deprecated'),
		stageHelp: t('pageAvailability.stageHelp'),
		stageTipExperimental: t('pageAvailability.stageTip.experimental'),
		stageTipPreview: t('pageAvailability.stageTip.preview'),
		stageTipDeprecated: t('pageAvailability.stageTip.deprecated'),
		stageCta: t('pageAvailability.stageCta'),
		stageHref: t('pageAvailability.stageHref'),
	};
}
