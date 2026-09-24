<template>
	<div
		v-bind="$attrs"
		:data-testid="testId"
		class="grid items-start gap-(--spacing-xl) lg:grid-cols-[var(--container-3xs)_1fr]"
	>
		<!-- The page's only navigation — DocsDirectoryLayout drops the docs rail for it. Sticky
		     and internally scrolled, which clips a focus ring (3px outside its checkbox) and
		     squeezes a count against the scrollbar: the `-m`/`p` pair buys that clearance
		     without moving the content off the page's left boundary, and `top` matches it. -->
		<aside
			:aria-label="labels.filters"
			class="flex flex-col gap-(--spacing-lg) lg:sticky lg:top-[calc(var(--spacing-14)+var(--spacing-xs))] lg:-m-(--spacing-xs) lg:max-h-[calc(100dvh-var(--spacing-14))] lg:overflow-y-auto lg:overscroll-contain lg:p-(--spacing-xs) lg:pb-(--spacing-xl) lg:[scrollbar-color:var(--border-muted)_transparent] lg:[scrollbar-width:thin]"
		>
			<InputText
				v-model="query"
				size="medium"
				:placeholder="labels.search"
				:aria-label="labels.search"
			>
				<!-- The slot wrapper already carries `aria-hidden` and the muted token, and
				     `type="search"` is not one of InputText's declared values — the field is a
				     plain text input and `Clear filters` is the way back to everything. -->
				<template #iconLeft>
					<i class="pi pi-search" />
				</template>
			</InputText>

			<!-- Below `lg` the facets are a disclosure: stacked open on a phone, thirty-odd
			     checkboxes sit between the reader and the first guide. The toggle exists only
			     there (`lg:hidden` on the wrapper, never on the Button), and `wide` starts true
			     so the server — and a browser with no JS — keeps the open shape. -->
			<div ref="facetsToggle" class="lg:hidden">
				<Button
					kind="secondary"
					size="medium"
					icon="pi pi-filter"
					:label="labels.filters"
					@click="facetsOpen = !facetsOpen"
				/>
			</div>

			<!-- `v-if`, not `v-show`: Tailwind is imported in `important` mode here, so the
			     `flex` utility on this element wins over the inline `display: none` that
			     `v-show` writes and the panel never actually hides. -->
			<Transition
				enter-active-class="animate-slide-down motion-reduce:animate-none"
				leave-active-class="animate-fade-out motion-reduce:animate-none"
			>
				<div v-if="facetsVisible" :id="facetsId" class="flex flex-col gap-(--spacing-lg)">
					<!-- One content column: legend, checkbox and count start on the same x. No
					     optical inset — no card sits below these titles to line up with. -->
					<fieldset class="m-0 flex flex-col gap-(--spacing-xs) border-0 p-0">
						<legend class="mb-(--spacing-xs) p-0 text-heading-xxs text-(--text-default)">
							{{ labels.contentType }}
						</legend>
						<label
							v-for="kind in kinds"
							:key="kind"
							class="flex cursor-pointer items-center gap-(--spacing-xs) text-label-sm text-(--text-default)"
						>
							<Checkbox
								binary
								:model-value="kindsOn.includes(kind)"
								@update:model-value="toggleKind(kind, Boolean($event))"
							/>
							<span class="min-w-0 flex-1 truncate">{{ labels.kinds[kind] ?? kind }}</span>
							<span class="shrink-0 text-body-xs tabular-nums text-(--text-muted)">{{
								totals.kinds[kind] ?? 0
							}}</span>
						</label>
					</fieldset>

					<fieldset
						v-if="products.length"
						class="m-0 flex flex-col gap-(--spacing-xs) border-0 p-0"
					>
						<legend class="mb-(--spacing-xs) p-0 text-heading-xxs text-(--text-default)">
							{{ labels.topics }}
						</legend>
						<label
							v-for="product in products"
							:key="product.id"
							class="flex cursor-pointer items-center gap-(--spacing-xs) text-label-sm text-(--text-default)"
						>
							<Checkbox
								binary
								:model-value="productsOn.includes(product.id)"
								@update:model-value="toggleProduct(product.id, Boolean($event))"
							/>
							<span class="min-w-0 flex-1 truncate">{{ product.label }}</span>
							<span class="shrink-0 text-body-xs tabular-nums text-(--text-muted)">
								{{ totals.products[product.id] ?? 0 }}
							</span>
						</label>
					</fieldset>
				</div>
			</Transition>
		</aside>

		<!-- One band, joined by the GROUP step: the count row, the grid and the paginator are
		     a set and two readings of it, not three stacked blocks. -->
		<section
			ref="results"
			:data-loading="pending || null"
			class="flex min-w-0 scroll-mt-(--spacing-14) flex-col gap-(--layout-group-gap)"
		>
			<div class="flex min-h-(--size-8) items-center justify-between gap-(--spacing-sm)">
				<!-- While the catalog is in flight the only rows here are the first page, so a
				     count would be a number the page cannot yet stand behind. It waits. -->
				<Skeleton v-if="pending" width="var(--container-3xs)" height="0.875rem" />
				<p v-else class="text-body-sm text-(--text-muted)" aria-live="polite">
					{{ countLabel }}
				</p>
				<Button
					kind="text"
					size="small"
					:label="labels.clear"
					:disabled="!filtered"
					@click="clear"
				/>
			</div>

			<!-- A banner, not a replacement: the first page came down with the document and is
			     still worth reading — only the rest of the catalog is missing. -->
			<Message
				v-if="failed"
				severity="error"
				:label="labels.error"
				:action-label="labels.retry"
				@action="retry"
			/>

			<!-- Until the catalog lands only the first page is in the browser, so a filter
			     typed early could narrow 24 of 351 rows. The skeleton is what stops the page
			     from answering that question wrongly. -->
			<DocCardGroup v-if="pending" :cols="3" :aria-busy="true" :aria-label="labels.loading">
				<DocCard v-for="index in SKELETONS" :key="index">
					<div class="flex flex-col gap-(--spacing-sm)">
						<Skeleton width="40%" height="0.75rem" />
						<Skeleton width="80%" height="1.25rem" />
						<Skeleton height="0.875rem" />
					</div>
				</DocCard>
			</DocCardGroup>

			<template v-else-if="paged.length">
				<DocCardGroup :cols="3">
					<DocCard
						v-for="entry in paged"
						:key="entry.href"
						:overline="overline(entry)"
						:title="entry.label"
						:label="entry.description"
						:href="entry.href"
						:target="entry.external ? '_blank' : '_self'"
					/>
				</DocCardGroup>
				<Paginator v-if="pageCount > 1" :aria-label="labels.pagination">
					<template #info>{{ rangeLabel }}</template>
					<Paginator.Button
						kind="previous"
						:aria-label="labels.previous"
						:disabled="page <= 1"
						@click="goTo(page - 1)"
					/>
					<template v-for="item in pageItems" :key="item.key">
						<Paginator.Button
							v-if="item.type === 'page'"
							kind="number"
							:selected="item.value === page"
							@click="goTo(item.value)"
						>
							{{ item.value }}
						</Paginator.Button>
						<!-- A separator, not a control: webkit's `kind="more"` button renders only an
						     `aria-hidden` glyph, which is a button with no accessible name. Sized to
						     the buttons beside it with the component's own `h-7`/`w-10`. -->
						<span
							v-else
							class="inline-flex h-7 w-10 items-center justify-center text-(--text-muted)"
							aria-hidden="true"
						>
							<i class="pi pi-ellipsis-h text-[length:inherit] leading-none" />
						</span>
					</template>
					<Paginator.Button
						kind="next"
						:aria-label="labels.next"
						:disabled="page >= pageCount"
						@click="goTo(page + 1)"
					/>
				</Paginator>
			</template>

			<EmptyState
				v-else
				bordered
				size="small"
				icon="pi pi-search"
				:title="labels.empty"
				:description="labels.emptyHint"
			>
				<template #actions>
					<Button kind="secondary" size="medium" :label="labels.clear" @click="clear" />
				</template>
			</EmptyState>
		</section>
	</div>
</template>

<script lang="ts">
export const PAGE_SIZE = 24;

/** The five content types the guides tree tags a page with. */
export type GuideKind =
	| 'learning-path'
	| 'tutorial'
	| 'how-to-guide'
	| 'reference-architecture'
	| 'video';

/** One catalogued page: what it takes to filter it and to draw its card. */
export interface GuidesEntry {
	label: string;
	href: string;
	description?: string;
	kind: GuideKind;
	products: string[];
	topic: string;
	external?: boolean;
}

/** Every string the surface renders, resolved on the server. */
export interface GuidesLabels {
	search: string;
	filters: string;
	contentType: string;
	topics: string;
	kinds: Partial<Record<GuideKind, string>>;
	countOne: string;
	countMany: string;
	clear: string;
	empty: string;
	emptyHint: string;
	error: string;
	retry: string;
	loading: string;
	pagination: string;
	previous: string;
	next: string;
	range: string;
}
</script>

<script setup lang="ts">
import Button from '@aziontech/webkit/button';
import Checkbox from '@aziontech/webkit/checkbox';
import DocCard from '@aziontech/webkit/doc-card';
import DocCardGroup from '@aziontech/webkit/doc-card-group';
import EmptyState from '@aziontech/webkit/empty-state';
import InputText from '@aziontech/webkit/input-text';
import Message from '@aziontech/webkit/message';
import Paginator from '@aziontech/webkit/paginator';
import Skeleton from '@aziontech/webkit/skeleton';
import { computed, onMounted, onScopeDispose, ref, useAttrs, useId, watch, watchEffect } from 'vue';

defineOptions({ name: 'GuidesHome', inheritAttrs: false });

/** Placeholder cards drawn while the catalog is in flight — two rows of three is
 *  enough to read as "loading" without standing in for a screenful of content. */
const SKELETONS = 6;

interface Props {
	/** The first page, rendered on the server; the rest of the catalog is fetched from `catalogHref` after mount. */
	initial?: GuidesEntry[];
	/** The unfiltered size of the catalog, known on the server before the fetch lands. */
	total?: number;
	/** Catalog-wide counts per filter value, so a facet can show its size without the catalog. */
	totals?: { kinds: Partial<Record<GuideKind, number>>; products: Record<string, number> };
	/** Where the full catalog is fetched from. */
	catalogHref?: string;
	/** Content types present in the catalog, in display order. */
	kinds?: GuideKind[];
	/** Topics present in the catalog, in display order. */
	products?: { id: string; label: string }[];
	/** Every string the surface renders. */
	labels?: GuidesLabels;
}

const props = withDefaults(defineProps<Props>(), {
	initial: () => [],
	total: 0,
	totals: () => ({ kinds: {}, products: {} }),
	catalogHref: '',
	kinds: () => [],
	products: () => [],
	labels: () => ({
		search: 'Search by name or description',
		filters: 'Filters',
		contentType: 'Content type',
		topics: 'Topics',
		kinds: {},
		countOne: '{count} page',
		countMany: '{count} pages',
		clear: 'Clear filters',
		empty: 'No pages match your filters.',
		emptyHint: 'Try another term, or clear the filters to browse every page.',
		error: 'The guides catalog could not be loaded.',
		retry: 'Try again',
		loading: 'Loading guides',
		pagination: 'Pagination',
		previous: 'Previous page',
		next: 'Next page',
		range: 'Showing {start} to {end} of {total}',
	}),
});

const attrs = useAttrs();
const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-guides-home');

// `lg` — the width at which the rail becomes a column beside the grid instead of a
// block above it. It starts true so the server renders the open shape: a desktop reader
// (and anyone without JS) never sees the facets collapse.
const facetsId = useId();
const wide = ref(true);
const facetsOpen = ref(false);
const facetsVisible = computed(() => wide.value || facetsOpen.value);
const facetsToggle = ref<HTMLElement | null>(null);

// webkit's Button declares no ARIA props and does not forward attributes, so the
// disclosure relationship is written onto the control it renders. A toggle that does not
// say what it controls, or whether that thing is open, is a button with no state to a
// screen reader. Drop this the day Button carries the attributes itself.
watchEffect(() => {
	const control = facetsToggle.value?.querySelector('button');
	if (!control) return;
	control.setAttribute('aria-expanded', String(facetsOpen.value));
	control.setAttribute('aria-controls', facetsId);
});

const query = ref('');
const kindsOn = ref<GuideKind[]>([...props.kinds]);
const productsOn = ref<string[]>([]);
const page = ref(1);
const results = ref<HTMLElement | null>(null);

const catalog = ref<GuidesEntry[] | null>(null);
const failed = ref(false);
let loading: Promise<void> | null = null;

function loadCatalog(): Promise<void> {
	loading ??= fetch(props.catalogHref)
		.then((response) => {
			if (!response.ok) throw new Error(String(response.status));
			return response.json();
		})
		.then((rows: GuidesEntry[]) => {
			catalog.value = rows;
			failed.value = false;
		})
		.catch(() => {
			failed.value = true;
			loading = null;
		});
	return loading;
}

function retry() {
	failed.value = false;
	void loadCatalog();
}

const entries = computed(() => catalog.value ?? props.initial);
const totals = computed(() => props.totals);

const fold = (value: string) =>
	value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
const haystacks = computed(() =>
	entries.value.map((entry) => fold(`${entry.label} ${entry.description ?? ''}`))
);

const visible = computed(() => {
	const needle = fold(query.value.trim());
	return entries.value.filter(
		(entry, index) =>
			kindsOn.value.includes(entry.kind) &&
			(!productsOn.value.length ||
				entry.products.some((product) => productsOn.value.includes(product))) &&
			(!needle || haystacks.value[index].includes(needle))
	);
});

const filtered = computed(
	() =>
		query.value !== '' || productsOn.value.length > 0 || kindsOn.value.length !== props.kinds.length
);

// Only the first page is in the browser until the catalog lands, so ANY question the
// first page cannot answer — a filter, or a page past the first — is pending, not empty.
const pending = computed(
	() => !catalog.value && !failed.value && (filtered.value || page.value > 1)
);

// Until the catalog arrives only the first page is here, so an unfiltered count comes
// from the server — unless it never will arrive, in which case the honest count is the
// one the page can actually show, and the banner above says why it is short.
const resultCount = computed(() =>
	catalog.value || filtered.value || failed.value ? visible.value.length : props.total
);

const countLabel = computed(() =>
	(resultCount.value === 1 ? props.labels.countOne : props.labels.countMany).replace(
		'{count}',
		String(resultCount.value)
	)
);

const pageCount = computed(() => Math.max(1, Math.ceil(resultCount.value / PAGE_SIZE)));

const paged = computed(() =>
	visible.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE)
);

const rangeLabel = computed(() =>
	props.labels.range
		.replace('{start}', String((page.value - 1) * PAGE_SIZE + 1))
		.replace('{end}', String(Math.min(page.value * PAGE_SIZE, resultCount.value)))
		.replace('{total}', String(resultCount.value))
);

type PageItem = { type: 'page'; value: number; key: string } | { type: 'more'; key: string };

const pageItems = computed<PageItem[]>(() => {
	const count = pageCount.value;
	const current = page.value;
	const pages = (from: number, to: number): PageItem[] =>
		Array.from({ length: to - from + 1 }, (_, i) => ({
			type: 'page',
			value: from + i,
			key: `page-${from + i}`,
		}));
	if (count <= 7) return pages(1, count);
	const nearStart = current <= 3;
	const nearEnd = current >= count - 2;
	if (nearStart)
		return [...pages(1, 5), { type: 'more', key: 'more-right' }, ...pages(count, count)];
	if (nearEnd)
		return [...pages(1, 1), { type: 'more', key: 'more-left' }, ...pages(count - 4, count)];
	return [
		...pages(1, 1),
		{ type: 'more', key: 'more-left' },
		...pages(current - 1, current + 1),
		{ type: 'more', key: 'more-right' },
		...pages(count, count),
	];
});

async function goTo(next: number) {
	page.value = Math.min(Math.max(1, next), pageCount.value);
	await loadCatalog();
	results.value?.scrollIntoView({
		block: 'start',
		behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
	});
}

// The content type, alone. Pairing it with the topic ran to two uppercase lines above
// most titles, and the topic is already a facet in the rail and usually in the title.
function overline(entry: GuidesEntry) {
	return props.labels.kinds[entry.kind] ?? entry.kind;
}

function toggleKind(kind: GuideKind, on: boolean) {
	kindsOn.value = props.kinds.filter((each) => (each === kind ? on : kindsOn.value.includes(each)));
}

function toggleProduct(id: string, on: boolean) {
	productsOn.value = props.products
		.map((product) => product.id)
		.filter((each) => (each === id ? on : productsOn.value.includes(each)));
}

function clear() {
	query.value = '';
	kindsOn.value = [...props.kinds];
	productsOn.value = [];
	page.value = 1;
}

function readUrl() {
	const params = new URLSearchParams(window.location.search);
	query.value = params.get('q') ?? '';
	const kind = params.get('kind')?.split(',');
	kindsOn.value = kind ? props.kinds.filter((each) => kind.includes(each)) : [...props.kinds];
	const product = params.get('product')?.split(',');
	productsOn.value = product
		? props.products.map((each) => each.id).filter((id) => product.includes(id))
		: [];
	page.value = Math.min(Math.max(1, Number(params.get('page')) || 1), pageCount.value);
}

function writeUrl() {
	const url = new URL(window.location.href);
	if (query.value) url.searchParams.set('q', query.value);
	else url.searchParams.delete('q');
	if (kindsOn.value.length === props.kinds.length) url.searchParams.delete('kind');
	else url.searchParams.set('kind', kindsOn.value.join(','));
	if (productsOn.value.length) url.searchParams.set('product', productsOn.value.join(','));
	else url.searchParams.delete('product');
	if (page.value > 1) url.searchParams.set('page', String(page.value));
	else url.searchParams.delete('page');
	window.history.replaceState({}, '', url);
}

onMounted(async () => {
	// NOT named `query` — that is the search model this file already owns, and shadowing
	// it here would hand the watchers below a MediaQueryList instead of the search term.
	const columnWidth = window.matchMedia('(min-width: 64rem)');
	const syncWidth = () => {
		wide.value = columnWidth.matches;
	};
	syncWidth();
	columnWidth.addEventListener('change', syncWidth);
	onScopeDispose(() => columnWidth.removeEventListener('change', syncWidth));

	const load = loadCatalog();
	if (window.location.search) await load;
	readUrl();
	watch([query, kindsOn, productsOn], () => {
		page.value = 1;
		void loadCatalog();
	});
	watch([query, kindsOn, productsOn, page], writeUrl);
});
</script>
