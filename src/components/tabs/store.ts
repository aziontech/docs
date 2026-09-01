import { map } from 'nanostores';

type TabStore = {
	[key: string]: {
		curr: string;
	};
};

/**
 * The tab choice shared by every tab view that declares the same `sharedStore`
 * key (`package-managers`, `Databases`, `pricing-tabs` are the three in use).
 *
 * Plain nanostores, not a framework binding: the subscription in
 * `useTabState` is five lines, and keeping the store framework-agnostic is
 * what let the tab view move from Preact to Vue without the store moving too.
 */
export const tabStore = map<TabStore>({});
