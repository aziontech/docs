/**
 * Platform versions a docs page can be compatible with, and the release stage it carries.
 * No Astro dependency: the client (the version select, the page header) imports it too.
 */
export const PLATFORM_VERSIONS = [
	// The interface names a version by its release line: `label` in sentences (the banner, the
	// agent outputs), `short` in the select and the menu's tags. Authored prose keeps "API v4".
	{ id: 'v4', label: 'API v4.x', short: 'v4.x', current: true },
	{ id: 'v3', label: 'API v3.x', short: 'v3.x', stage: 'deprecated' },
] as const;

export type PlatformVersion = 'v3' | 'v4';

/** A page with no stage is generally available. */
export type Stage = 'experimental' | 'preview' | 'deprecated';

export const CURRENT_VERSION: PlatformVersion = 'v4';
export const VERSION_STORAGE_KEY = 'docs-platform-version';
/** The query parameter that carries the version: `?api=v3`. */
export const VERSION_PARAM = 'api';

/** Every version id, in the order of PLATFORM_VERSIONS. */
export const VERSION_IDS: PlatformVersion[] = PLATFORM_VERSIONS.map((version) => version.id);

export const STAGES: Stage[] = ['experimental', 'preview', 'deprecated'];

/** What a page tells the version select and the page header. */
export interface PageAvailability {
	/** Every compatible version, in the order of PLATFORM_VERSIONS. */
	versions: PlatformVersion[];
	/** The page's own stage, else its tree's. */
	stage?: Stage;
	/** The equivalent page in each version where this page does NOT apply. */
	counterparts: Partial<Record<PlatformVersion, { href: string; label: string }>>;
	/** The docs entry page per version (for now, the home of the language). */
	homes: Record<PlatformVersion, string>;
}

export function isPlatformVersion(value: unknown): value is PlatformVersion {
	return typeof value === 'string' && (VERSION_IDS as string[]).includes(value);
}

/** Order a list of versions as PLATFORM_VERSIONS does, without duplicates. */
export function sortVersions(versions: readonly PlatformVersion[]): PlatformVersion[] {
	return VERSION_IDS.filter((id) => versions.includes(id));
}

/** Whether a row or page with this restriction shows for the chosen version (no restriction = all). */
export function matchesVersion(
	versions: readonly PlatformVersion[] | undefined,
	version: PlatformVersion
): boolean {
	return !versions || versions.length === 0 || versions.includes(version);
}

/** The one version a page covers, or undefined when it covers several: such a page defines the context. */
export function pageVersionOf(
	availability: { versions: readonly PlatformVersion[] } | null | undefined
): PlatformVersion | undefined {
	return availability?.versions.length === 1 ? availability.versions[0] : undefined;
}

/** The `<html>` attribute the pre-paint script sets when the page covers a single version. */
export const PAGE_VERSION_ATTR = 'data-page-version';
