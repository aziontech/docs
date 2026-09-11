<template>
	<div class="grid items-start gap-(--spacing-lg) lg:grid-cols-[15rem_1fr]">
		<aside
			:aria-label="labels.filters"
			class="flex flex-col gap-(--spacing-md) lg:sticky lg:top-18 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto lg:[scrollbar-width:thin] lg:[scrollbar-color:var(--border-muted)_transparent]"
		>
			<InputText
				v-model="query"
				type="search"
				size="medium"
				:placeholder="labels.search"
				:aria-label="labels.search"
			>
				<template #iconLeft>
					<i class="pi pi-search text-body-sm" aria-hidden="true" />
				</template>
			</InputText>

			<fieldset class="m-0 flex flex-col gap-(--spacing-xs) border-0 p-0">
				<legend class="mb-(--spacing-xs) p-0 text-overline-sm text-(--text-muted)">
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
					<span>{{ labels.kinds[kind] ?? kind }}</span>
					<span class="text-body-xs text-(--text-muted)">{{ totals.kinds[kind] ?? 0 }}</span>
				</label>
			</fieldset>

			<fieldset v-if="products.length" class="m-0 flex flex-col gap-(--spacing-xs) border-0 p-0">
				<legend class="mb-(--spacing-xs) p-0 text-overline-sm text-(--text-muted)">
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
					<span>{{ product.label }}</span>
					<span class="text-body-xs text-(--text-muted)">{{
						totals.products[product.id] ?? 0
					}}</span>
				</label>
			</fieldset>
		</aside>

		<section class="flex min-w-0 flex-col gap-(--spacing-sm)">
			<div class="flex items-center justify-between gap-(--spacing-sm)">
				<p class="text-body-sm text-(--text-muted)" aria-live="polite">
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

			<div v-if="visible.length" ref="results" class="flex flex-col gap-(--spacing-md)">
				<DocCardGroup :cols="2">
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
					<Paginator.Button
						v-for="item in pageItems"
						:key="item.key"
						:kind="item.type === 'page' ? 'number' : 'more'"
						:selected="item.type === 'page' && item.value === page"
						:disabled="item.type === 'more'"
						@click="item.type === 'page' && goTo(item.value)"
					>
						{{ item.type === 'page' ? item.value : '' }}
					</Paginator.Button>
					<Paginator.Button
						kind="next"
						:aria-label="labels.next"
						:disabled="page >= pageCount"
						@click="goTo(page + 1)"
					/>
				</Paginator>
			</div>
			<EmptyState v-else :title="labels.empty" icon="pi pi-search" size="small" bordered />
		</section>
	</div>
</template>

<script lang="ts">
export const PAGE_SIZE = 24;
</script>

<script setup lang="ts">
import Button from '@aziontech/webkit/button';
import Checkbox from '@aziontech/webkit/checkbox';
import DocCard from '@aziontech/webkit/doc-card';
import DocCardGroup from '@aziontech/webkit/doc-card-group';
import EmptyState from '@aziontech/webkit/empty-state';
import InputText from '@aziontech/webkit/input-text';
import Paginator from '@aziontech/webkit/paginator';
import { computed, onMounted, ref, watch } from 'vue';

type Kind = 'learning-path' | 'tutorial' | 'reference-architecture' | 'video';

interface Entry {
	label: string;
	href: string;
	description?: string;
	kind: Kind;
	products: string[];
	topic: string;
	external?: boolean;
}

const props = withDefaults(
	defineProps<{
		/** The first page, rendered on the server; the rest of the catalog is fetched from `catalogHref` after mount. */
		initial?: Entry[];
		total?: number;
		totals?: { kinds: Partial<Record<Kind, number>>; products: Record<string, number> };
		catalogHref?: string;
		kinds?: Kind[];
		products?: { id: string; label: string }[];
		labels?: {
			search: string;
			filters: string;
			contentType: string;
			topics: string;
			kinds: Partial<Record<Kind, string>>;
			countOne: string;
			countMany: string;
			clear: string;
			empty: string;
			pagination: string;
			previous: string;
			next: string;
			range: string;
		};
	}>(),
	{
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
			pagination: 'Pagination',
			previous: 'Previous page',
			next: 'Next page',
			range: 'Showing {start} to {end} of {total}',
		}),
	}
);

const query = ref('');
const kindsOn = ref<Kind[]>([...props.kinds]);
const productsOn = ref<string[]>([]);
const page = ref(1);
const results = ref<HTMLElement | null>(null);

const catalog = ref<Entry[] | null>(null);
let loading: Promise<void> | null = null;

function loadCatalog(): Promise<void> {
	loading ??= fetch(props.catalogHref)
		.then((response) => response.json())
		.then((rows: Entry[]) => {
			catalog.value = rows;
		})
		.catch(() => {
			loading = null;
		});
	return loading;
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

// Until the catalog arrives only the first page is here, so an unfiltered count comes from the server.
const resultCount = computed(() =>
	catalog.value || filtered.value ? visible.value.length : props.total
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
	await loadCatalog();
	page.value = Math.min(Math.max(1, next), pageCount.value);
	const top = results.value?.getBoundingClientRect().top;
	if (top !== undefined) window.scrollTo({ top: top + window.scrollY - 80, behavior: 'smooth' });
}

function overline(entry: Entry) {
	return [props.labels.kinds[entry.kind] ?? entry.kind, entry.topic].filter(Boolean).join(' · ');
}

function toggleKind(kind: Kind, on: boolean) {
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
	const load = loadCatalog();
	if (window.location.search) await load;
	readUrl();
	watch([query, kindsOn, productsOn], () => {
		page.value = 1;
	});
	watch([query, kindsOn, productsOn, page], writeUrl);
});
</script>
