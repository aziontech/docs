import algoliasearch from 'algoliasearch';
import { InstantSearch, SearchBox, Hits, Highlight, Configure, useInstantSearch } from 'react-instantsearch-hooks-web';
import { useLayoutEffect } from 'react'
import './AlgoliaTheme.css'
import './AlgoliaSearch.scss'

const searchClient = algoliasearch(
	'PYJUZH6VNQ',
	'7c1795c333053265edd2aeb199745797'
);

const searchFunction = ({ uiState, setUiState }) => {
	setUiState(uiState);
}

const closeModal = () => {
	const searchModal = document.getElementById('azalgoliasearch');

	searchModal.classList.toggle('enabled-search');
	document.body.classList.toggle('overflow-none');
}

const closeModalByDiv = (event) => {
	if (event.target.nodeName === 'DIV' && event.target.dataset.search) closeModal()
}

function debounce(func, wait) {
	let timeout;
	return function () {
		const context = this;
		const args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			func.apply(context, args);
		}, wait);
	};
}

function googleAnalyticsMiddleware(e) {
	const sendEventDebounced = debounce(() => {
			window.dataLayer = window.dataLayer || [];
			dataLayer.push({
					event: 'user_search',
					page_location: window.location.pathname,
					query: e.instantSearchInstance.helper.lastResults.query
			});
	}, 3000);

	return {
			onStateChange() {
			sendEventDebounced();
			},
			subscribe() {},
			unsubscribe() {},
	};
}

function Middleware() {
  const { addMiddlewares } = useInstantSearch();

  useLayoutEffect(() => {
    return addMiddlewares(googleAnalyticsMiddleware);
  }, []);

  return null;
}

function NoResultsBoundary({ children, fallback }) {
	const { results } = useInstantSearch();

	if (!results.__isArtificial && results.nbHits === 0) {
		return (
			<>
				{fallback}
				<div hidden>{children}</div>
			</>
		);
	}

	return children;
}

function NoResults() {
	const { indexUiState } = useInstantSearch();

	return (
		<div>
			<p>
				No results for <q>{indexUiState.query}</q>.
			</p>
		</div>
	);
}


function AlgoliaSearch({ lang = 'en' }) {
	const indexName = `azion-doc-${lang === 'pt-br' ? 'ptbr' : lang}`
	return (
		<div onClick={closeModalByDiv} data-search="algolia-search" id="azalgoliasearch" class="azalgoliasearch">
			<div data-search="box" class="box">
				<div data-search="box-content" class="box-content">
					<div class="search-content no-db-label">
						<InstantSearch searchClient={searchClient} indexName={indexName} onStateChange={searchFunction}>
							<Configure hitsPerPage={8} />
							<div data-search="searchbox-content" class="searchbox-content">
								<div class="search-box-content">
									<div id="searchbox">
										<button onClick={closeModal} id="CloseSearchBTN"
											class="btn btn-tertiary-light btn-algolia-close">
											{lang == 'en' ? 'close' : lang == 'es' ? 'cerrar' : 'fechar'}
										</button>
										<SearchBox />
									</div>
								</div>
							</div>
							<Middleware />
							<div class="hits">
								<p class="overline">DOC</p>
								<NoResultsBoundary fallback={<NoResults />}>
									<Hits
										hitComponent={({ hit }) => {
											return (
												<a href={hit.url} title={hit.title} className="hit">
													<p>
														<strong>
															<Highlight hit={hit} attribute="title" />
														</strong>
														<br />
														<small>
															<Highlight hit={hit} attribute="url" />
														</small>
													</p>
													<p>
														<small>
															<Highlight hit={hit} attribute="text" />
														</small>
													</p>
												</a>
											)
										}}
									/>
								</NoResultsBoundary>
							</div>
						</InstantSearch >
					</div>
				</div>
			</div>
		</div>
	)
};

export default AlgoliaSearch
