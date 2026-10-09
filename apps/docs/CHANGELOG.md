# Changelog

## [2.0.2](https://github.com/aziontech/docs/compare/docs-v2.0.1...docs-v2.0.2) (2026-10-09)


### Bug Fixes

* **nav:** serve the navigation JSON from under the docs scope ([#2451](https://github.com/aziontech/docs/issues/2451)) ([7544f59](https://github.com/aziontech/docs/commit/7544f592078b8e72b3ccdd132efa8c74fbb7faa2))


### Continuous Integration

* **release:** purge the www.azion.com docs cache after the production deploy ([#2454](https://github.com/aziontech/docs/issues/2454)) ([211d736](https://github.com/aziontech/docs/commit/211d7361a90b6042b233f25019cab4e085c11ccc))
* **release:** reindex Algolia at the end of the production deploy ([#2444](https://github.com/aziontech/docs/issues/2444)) ([8a0ac1d](https://github.com/aziontech/docs/commit/8a0ac1db7cc8b3ccbbb2198ce71721eba6170db5))

## [2.0.1](https://github.com/aziontech/docs/compare/docs-v2.0.0...docs-v2.0.1) (2026-10-08)


### Bug Fixes

* **nav:** point the logo and Reference links at the docs home ([#2445](https://github.com/aziontech/docs/issues/2445)) ([126cb85](https://github.com/aziontech/docs/commit/126cb855435afe953a3f4525abe3c121f3b2f320))
* **nav:** reshape the mobile menu around the docs tree ([#2448](https://github.com/aziontech/docs/issues/2448)) ([d026459](https://github.com/aziontech/docs/commit/d0264594f13164a6a91a13a710699b6baafb0cfa))

## [2.0.0](https://github.com/aziontech/docs/compare/docs-v1.0.0...docs-v2.0.0) (2026-10-08)


### Features

* **agent-setup:** point the setup prompts at generated prompt.md instructions ([#2433](https://github.com/aziontech/docs/issues/2433)) ([7ef0f9f](https://github.com/aziontech/docs/commit/7ef0f9f14b203cd36f331d2b3a894a045a5f6651))
* **markdown-twin:** open guide twins with a skill-style header ([#2431](https://github.com/aziontech/docs/issues/2431)) ([d34e5d1](https://github.com/aziontech/docs/commit/d34e5d174a02d93a1b374e3c86249f03ce061e1d))


### Bug Fixes

* **agent-setup:** install the Azion CLI with the official script ([#2438](https://github.com/aziontech/docs/issues/2438)) ([dcbe270](https://github.com/aziontech/docs/commit/dcbe270e16a855bbd9a3ee6de36f4e305d9f30ce))
* **links:** repair broken in-body links and anchors ([#2440](https://github.com/aziontech/docs/issues/2440)) ([430ce8f](https://github.com/aziontech/docs/commit/430ce8f90b6d84e236a545ba3b0d310fe767db59))
* **llms:** serve pt-br llms.txt as UTF-8 and translate its descriptions ([#2427](https://github.com/aziontech/docs/issues/2427)) ([dc3a8d2](https://github.com/aziontech/docs/commit/dc3a8d25562c0fff606462eece0b1cb0e1fdbfda))


### Documentation

* **agreements:** remove Console Kit reference from the Terms of Service ([#2441](https://github.com/aziontech/docs/issues/2441)) ([0a030ed](https://github.com/aziontech/docs/commit/0a030edfc7ff4839f07bd781ef8e631cb9c11dd2))
* drop quickstart stage numbers and render docs components as webkit designs them ([#2430](https://github.com/aziontech/docs/issues/2430)) ([4913955](https://github.com/aziontech/docs/commit/4913955b8e47192d8312fa65147a47f8091a11b0))
* **guides:** rewrite the 23 guides  ([#2437](https://github.com/aziontech/docs/issues/2437)) ([45eb95a](https://github.com/aziontech/docs/commit/45eb95ac6dcfcfb2073af75d360b674995fd1238))
* **hubs:** turn the Professional Services and Agreements overviews into card hubs ([#2436](https://github.com/aziontech/docs/issues/2436)) ([7df85ce](https://github.com/aziontech/docs/commit/7df85ce54ca6c3194c3aab884b48053028aa69c9))
* **marketplace:** rework the Marketplace section against the current Console ([#2434](https://github.com/aziontech/docs/issues/2434)) ([99669dd](https://github.com/aziontech/docs/commit/99669dd4234a6aa6266ca1e0f86b56d3c2ea42f7))
* **migration:** rewrite the provider migration guides against the platform ([#2435](https://github.com/aziontech/docs/issues/2435)) ([486e731](https://github.com/aziontech/docs/commit/486e731d00de8fbd005b7290759eb17c71d8e9f1))
* state behavior instead of narrating test runs, and neutralize test-account values ([#2439](https://github.com/aziontech/docs/issues/2439)) ([051525c](https://github.com/aziontech/docs/commit/051525cdf750e8de9d72b8e38c60903586ab135f))


### Code Refactoring

* **docs:** rebuild the docs on Astro 7, Tailwind 4 and @aziontech/webkit 4 ([#2328](https://github.com/aziontech/docs/issues/2328)) ([bd16afb](https://github.com/aziontech/docs/commit/bd16afb07e790174d719d2e2a162526f402046bd))


### Continuous Integration

* **release:** deploy the docs to Azion stage and production with the CLI ([#2432](https://github.com/aziontech/docs/issues/2432)) ([474edf9](https://github.com/aziontech/docs/commit/474edf998aaf2ba5c04b7635e0aaec17aeb0ff06))
