# Changelog

## [2.5.0](https://github.com/aziontech/docs/compare/docs-v2.4.4...docs-v2.5.0) (2026-11-13)


### Features

* **nav:** give every breadcrumb crumb a page and make CLI commands runnable ([#2636](https://github.com/aziontech/docs/issues/2636)) ([155d22d](https://github.com/aziontech/docs/commit/155d22d90c32fb2c707c07e8a98b693c38326b51))


### Bug Fixes

* **accounts:** hyphenate Real-Time Purge and name the Bills tab in the permissions table ([#2581](https://github.com/aziontech/docs/issues/2581)) ([8d81564](https://github.com/aziontech/docs/commit/8d8156460bf846b9884fc9929d3f7b5e6add6133))
* **ai-inference:** review the AI Inference section and correct it from live tests ([#2641](https://github.com/aziontech/docs/issues/2641)) ([30a54ec](https://github.com/aziontech/docs/commit/30a54ec147d582582156d04b3907c8fdea9542ba))
* **cli:** drop azion update workload-deployment, which the CLI does not expose ([#2639](https://github.com/aziontech/docs/issues/2639)) ([f8d8333](https://github.com/aziontech/docs/commit/f8d83332f9410f20c15740e466a699786d059910))
* **compliance:** correct the SOC report cadence and PCI DSS version ([#2585](https://github.com/aziontech/docs/issues/2585)) ([6a4a60d](https://github.com/aziontech/docs/commit/6a4a60d6c3b683e5e1861c0c7f3463bdff801689))
* **firewall:** correct the CLI binding, the WAF config sample, and the JWT paywall steps ([#2565](https://github.com/aziontech/docs/issues/2565)) ([1cac328](https://github.com/aziontech/docs/commit/1cac3285850ff40941d62d8144781198789dd6be))
* **functions:** state that the Response Phase runs only Lua functions ([#2650](https://github.com/aziontech/docs/issues/2650)) ([bf4069c](https://github.com/aziontech/docs/commit/bf4069ceda54011bb6711ad61efd75fddbd592a4))
* **fundamentals:** rewrite the Load Balancer steps in minimize-downtime from the reference ([#2578](https://github.com/aziontech/docs/issues/2578)) ([95f9997](https://github.com/aziontech/docs/commit/95f9997be976d5cf9decb1ab0b0cfe1bd532a417))
* **guides:** match the QStash variable and the Functions usage response to the code ([#2571](https://github.com/aziontech/docs/issues/2571)) ([e343d1c](https://github.com/aziontech/docs/commit/e343d1cba96c4306a855ca70611f88dbcdf3365c))
* **links:** point pt-br links to their existing pt-br pages ([#2620](https://github.com/aziontech/docs/issues/2620)) ([57c8125](https://github.com/aziontech/docs/commit/57c8125badaee0fbdac0506d006bc63c72b1a1f0))
* **links:** point the v3 Applications reference and the guides at the current pages ([#2646](https://github.com/aziontech/docs/issues/2646)) ([81f80bf](https://github.com/aziontech/docs/commit/81f80bf7c2ac4047dce788a5e9f4edd5e36c2f0a))
* **marketplace:** drop the Azion CLI prerequisite from firewall integration guides ([#2612](https://github.com/aziontech/docs/issues/2612)) ([ae7bf16](https://github.com/aziontech/docs/commit/ae7bf16a41e22add1035e6b4cdceef9206b4841c))
* **observe:** name the query editor list instead of its position in the Grafana guides ([#2643](https://github.com/aziontech/docs/issues/2643)) ([b386f31](https://github.com/aziontech/docs/commit/b386f3124a6f89f3ff81bbdd9a5dc75303ccc0c7))
* **orchestrator:** fix broken bind and create-service API samples ([#2574](https://github.com/aziontech/docs/issues/2574)) ([9490e5f](https://github.com/aziontech/docs/commit/9490e5f01752cf32edf45038da7e1645f10ada16))
* **runtime:** clean up unused imports and JSDoc in the Node.js API samples ([#2649](https://github.com/aziontech/docs/issues/2649)) ([f541482](https://github.com/aziontech/docs/commit/f5414820cececfc99a7272ddad797a7cecba5a27))
* **structure:** tag bare code fences, fix heading skips, add pt-br meta_tags ([#2629](https://github.com/aziontech/docs/issues/2629)) ([be433a0](https://github.com/aziontech/docs/commit/be433a00ccb141e7ac85f03eb6ba58545316e729))
* **terminology:** replace desempenho and aplicativo in pt-br pages ([#2621](https://github.com/aziontech/docs/issues/2621)) ([9859029](https://github.com/aziontech/docs/commit/9859029e4701dc077dc3f41536fbf9902fde6eb6))


### Documentation

* **applications:** Run Function needs only Functions; fix WEBP and CORS prerequisites ([#2580](https://github.com/aziontech/docs/issues/2580)) ([41dbced](https://github.com/aziontech/docs/commit/41dbced3ace3880763d02fb9bde2b5c6b2cd879e))
* **architectures:** keep security-modernization and bot-management as API v3 versions ([#2589](https://github.com/aziontech/docs/issues/2589)) ([fc25bf7](https://github.com/aziontech/docs/commit/fc25bf7ba2448e0f19ccd14fd89653d2d5f5cf7e))
* **cli:** document azion workload-deployment and fix pages that say the CLI cannot bind a deployment ([#2567](https://github.com/aziontech/docs/issues/2567)) ([b596a5c](https://github.com/aziontech/docs/commit/b596a5c2d581a143a400448c0199000debd0f732))
* **console:** apply the review of the Console path convention ([#2644](https://github.com/aziontech/docs/issues/2644)) ([e84b283](https://github.com/aziontech/docs/commit/e84b283608aecc805a308b5d405b62f0ab270c6e))
* **fundamentals:** apply the reader review and the style guide to the Fundamentals pages ([#2558](https://github.com/aziontech/docs/issues/2558)) ([c9b16ab](https://github.com/aziontech/docs/commit/c9b16ab55089b6c5d388d05784ca842b9c8d8d28))
* **guides:** make the auth layer and vector search tutorials runnable ([#2566](https://github.com/aziontech/docs/issues/2566)) ([43199bf](https://github.com/aziontech/docs/commit/43199bf5cadc19297534434c0a59d36eebf44b60))
* **guides:** replace the residual "These checks confirm" lines with use-case expect blocks ([#2611](https://github.com/aziontech/docs/issues/2611)) ([ee0f695](https://github.com/aziontech/docs/commit/ee0f695448c3b43a9cd3497c2f673252573284b8))
* **migration:** share the repeated migration-guide procedures as partials ([#2619](https://github.com/aziontech/docs/issues/2619)) ([f1d2162](https://github.com/aziontech/docs/commit/f1d21621bbb9c470a205a32fd25e525a5ded9e5f))
* **nav:** triage the pages outside the navigation ([#2593](https://github.com/aziontech/docs/issues/2593)) ([cf7f0d2](https://github.com/aziontech/docs/commit/cf7f0d2b7310b9e51322088c57e4ccc62f0969cd))
* **observe:** fix dataset name, Data Stream filter, and Grafana Data path ([#2573](https://github.com/aziontech/docs/issues/2573)) ([e302ed0](https://github.com/aziontech/docs/commit/e302ed01fd906b6b84c2f2d11d2b3c95dead1edb))
* **observe:** use the current GraphQL dataset names across Observe and guides ([#2579](https://github.com/aziontech/docs/issues/2579)) ([92d9535](https://github.com/aziontech/docs/commit/92d95353f5be18e23e806cec28de6a8a3c7b3aa1))
* **orchestrator:** consolidate duplicate guides and write How it works ([#2588](https://github.com/aziontech/docs/issues/2588)) ([bf03fc7](https://github.com/aziontech/docs/commit/bf03fc7d7d89d1fd7b4e5a163d45b7f3499a7a3a))
* **orchestrator:** split how-tos into API v4 and API v3 pages ([#2584](https://github.com/aziontech/docs/issues/2584)) ([d480006](https://github.com/aziontech/docs/commit/d480006020a22912b34e0cc88f0650dce7625d65))
* **platform:** retire the v3 build and deploy journey pages ([#2587](https://github.com/aziontech/docs/issues/2587)) ([a1c2299](https://github.com/aziontech/docs/commit/a1c22997ddfc2ccf64bb792ceee1325c0e557842))
* **readability:** split the long sentences in the Runtime, CLI, Reference, and KV Store pages ([#2635](https://github.com/aziontech/docs/issues/2635)) ([90443af](https://github.com/aziontech/docs/commit/90443af8f3b1c5e92cffbab97999be6981cb7535))
* **release-notes:** fix the October 14 anchor and merge the duplicate February 24 entry ([#2572](https://github.com/aziontech/docs/issues/2572)) ([ae576e5](https://github.com/aziontech/docs/commit/ae576e58b061beb2798e5a8c7c7f6ae810a7b0b1))
* **runtime:** fix the azion dev port and the function size limit ([#2583](https://github.com/aziontech/docs/issues/2583)) ([48db006](https://github.com/aziontech/docs/commit/48db00651d31f646ebc8bccdf3b5e47ebe8a2a53))
* **runtime:** migrate Node.js API samples to the ES Modules handler (MM-16245) ([#2592](https://github.com/aziontech/docs/issues/2592)) ([f6f95a4](https://github.com/aziontech/docs/commit/f6f95a43f0e2aa43a3dcab85c528d820c6bf9e59))
* **secure:** retire the pre-Workloads security journey and guide pages ([#2586](https://github.com/aziontech/docs/issues/2586)) ([6ddf7ba](https://github.com/aziontech/docs/commit/6ddf7bab87f3510d56d4fb1a893897f0be366fe1))
* **store:** name the SQL and Storage libraries by their scoped packages ([#2575](https://github.com/aziontech/docs/issues/2575)) ([af6a369](https://github.com/aziontech/docs/commit/af6a3697c841b96b33cade50a58867eb2418d19e))
* **style-guide:** adopt the jsonl tag for JSON Lines samples ([#2642](https://github.com/aziontech/docs/issues/2642)) ([fea46fb](https://github.com/aziontech/docs/commit/fea46fb51b6de53a115e01172bd377d67946fcf3))
* **style-guide:** drop the nonexistent GlossaryFilter from the glossary template ([#2577](https://github.com/aziontech/docs/issues/2577)) ([e65be43](https://github.com/aziontech/docs/commit/e65be431a3e23c9c08774610f5a4c359a2ca78e4))
* **style-guide:** standardize Azion Console click paths ([#2596](https://github.com/aziontech/docs/issues/2596)) ([5a7ecbc](https://github.com/aziontech/docs/commit/5a7ecbc2c10801da31532246e3799e79b943dd3b))
* **templates:** apply the review of the migrated template guides ([#2645](https://github.com/aziontech/docs/issues/2645)) ([fd09000](https://github.com/aziontech/docs/commit/fd09000a3162f69832fd3198d508ac995c93d81d))
* **templates:** list the Astro templates that only the showcase covered ([#2595](https://github.com/aziontech/docs/issues/2595)) ([c64fc19](https://github.com/aziontech/docs/commit/c64fc19c556fed414e9c90ff92ed0413d7e20d16))
* **templates:** migrate the legacy template guides to the current guide pattern ([#2597](https://github.com/aziontech/docs/issues/2597)) ([6b4bb55](https://github.com/aziontech/docs/commit/6b4bb5550f49a38882e629bd9adc86f9507bc4bf))
* **templates:** point Deploy links to the current Marketplace catalog (MM-16236) ([#2582](https://github.com/aziontech/docs/issues/2582)) ([269601c](https://github.com/aziontech/docs/commit/269601cc4b45096c40a1debe6abd4cf31d374f94))
* **terminology:** retire Edge Node, module, and add-on from current pages ([#2618](https://github.com/aziontech/docs/issues/2618)) ([5fcd8da](https://github.com/aziontech/docs/commit/5fcd8daca3b95a2737c9e815ad78951635c9ae98))
* **terraform:** rewrite the samples for provider v2.10.0 ([#2557](https://github.com/aziontech/docs/issues/2557)) ([c1871a9](https://github.com/aziontech/docs/commit/c1871a90a6ef6eecb03c253a3c452941a4600b9d))
* **workloads:** review the Workloads section with the style guide and correct it from live tests ([#2570](https://github.com/aziontech/docs/issues/2570)) ([d132e62](https://github.com/aziontech/docs/commit/d132e622006273cbe97c051776b9cfd1c7d28e40))

## [2.4.4](https://github.com/aziontech/docs/compare/docs-v2.4.3...docs-v2.4.4) (2026-11-10)


### Bug Fixes

* **applications:** apply live test results and define each resource by its role ([#2626](https://github.com/aziontech/docs/issues/2626)) ([1f841e4](https://github.com/aziontech/docs/commit/1f841e408508ef9bf9f5be03f32d17416477199e))

## [2.4.3](https://github.com/aziontech/docs/compare/docs-v2.4.2...docs-v2.4.3) (2026-11-09)


### Documentation

* **applications:** review the Applications section and apply the updated writing rules ([#2615](https://github.com/aziontech/docs/issues/2615)) ([c1df92f](https://github.com/aziontech/docs/commit/c1df92f2885e5a4a17ded9eb44186a12203ebf35))

## [2.4.2](https://github.com/aziontech/docs/compare/docs-v2.4.1...docs-v2.4.2) (2026-11-09)


### Documentation

* **style-guide:** align the guide with the shipped sections and settle its open rules ([#2600](https://github.com/aziontech/docs/issues/2600)) ([5ea57c0](https://github.com/aziontech/docs/commit/5ea57c0202d2d0023f288462a5c87fd1b453c5d4))

## [2.4.1](https://github.com/aziontech/docs/compare/docs-v2.4.0...docs-v2.4.1) (2026-11-04)


### Documentation

* **applications:** fix rewrite argument, certificate API, workload domains, and connector CLI ([#2562](https://github.com/aziontech/docs/issues/2562)) ([4c1f835](https://github.com/aziontech/docs/commit/4c1f835e8c1488f12a02946006597f373b955368))
* **firewall:** add the Execution Environment step to the firewall function guides ([#2543](https://github.com/aziontech/docs/issues/2543)) ([a1d5d4e](https://github.com/aziontech/docs/commit/a1d5d4ec5c1e7618276825f27e227cdecc8058bb))
* **functions:** end every firewall handler path with one finishing action ([#2542](https://github.com/aziontech/docs/issues/2542)) ([ac062f6](https://github.com/aziontech/docs/commit/ac062f670961b05af423a3876fef0bda75d57dea))
* **marketplace:** fix invalid Arguments JSON in 7 integration guides ([#2559](https://github.com/aziontech/docs/issues/2559)) ([dd8b4f5](https://github.com/aziontech/docs/commit/dd8b4f5fd98fddd7d632d3b774413d02f1d92d77))
* **runtime:** fix broken example code in the Runtime reference ([#2556](https://github.com/aziontech/docs/issues/2556)) ([d19f105](https://github.com/aziontech/docs/commit/d19f1053c13cff2fd62bbd28c015fa57e641530f))
* **style-guide:** review the EN style guide against the naming catalog (MM-16284) ([#2561](https://github.com/aziontech/docs/issues/2561)) ([7660311](https://github.com/aziontech/docs/commit/7660311425581a257c1186cd0b7cd73f570ab7f9))
* **templates:** reconcile Console Deploy links with the current catalog ([#2563](https://github.com/aziontech/docs/issues/2563)) ([25df790](https://github.com/aziontech/docs/commit/25df790aaf4b31b216ec5d64be2ca7d83b27e844))
* **workloads:** document custom page assignment with azion workload-deployment ([#2564](https://github.com/aziontech/docs/issues/2564)) ([b75477a](https://github.com/aziontech/docs/commit/b75477ac5c0b726ae9f084cd5f9aeba96eb89620))

## [2.4.0](https://github.com/aziontech/docs/compare/docs-v2.3.4...docs-v2.4.0) (2026-11-03)


### Features

* **platform:** add Overview pages for the nested Products ([#2536](https://github.com/aziontech/docs/issues/2536)) ([3d7b2d0](https://github.com/aziontech/docs/commit/3d7b2d0ac3344acd68b226e6470578bdcf507782))


### Documentation

* **plans:** stop tying features and quotas to support tiers and legacy plans ([#2541](https://github.com/aziontech/docs/issues/2541)) ([9acd12c](https://github.com/aziontech/docs/commit/9acd12c1ae5e66d064e735894af3694b1d1cc1bc))
* **release-notes:** add release notes for Sep 3 and Sep 19, 2026 ([#2385](https://github.com/aziontech/docs/issues/2385)) ([39103de](https://github.com/aziontech/docs/commit/39103de6545c3197a4b03f6e14a025d1c25fe6e2))

## [2.3.4](https://github.com/aziontech/docs/compare/docs-v2.3.3...docs-v2.3.4) (2026-10-29)


### Documentation

* **services:** describe Security Response Team from the Terms of Service scope ([#2463](https://github.com/aziontech/docs/issues/2463)) ([e5f916a](https://github.com/aziontech/docs/commit/e5f916a49eaf763d872fcdab619eb7af54a7136b))

## [2.3.3](https://github.com/aziontech/docs/compare/docs-v2.3.2...docs-v2.3.3) (2026-10-29)


### Bug Fixes

* **platform:** correct the glossary facts and the scripted deploy path ([#2515](https://github.com/aziontech/docs/issues/2515)) ([deceb97](https://github.com/aziontech/docs/commit/deceb977cd7a67da0772a96976019910b449a95d))

## [2.3.2](https://github.com/aziontech/docs/compare/docs-v2.3.1...docs-v2.3.2) (2026-10-24)


### Documentation

* **diagrams:** redraw every other diagram in the use-case diagram style ([#2513](https://github.com/aziontech/docs/issues/2513)) ([799d807](https://github.com/aziontech/docs/commit/799d80745b396b3b0af0fce1a7c945f85c090efc))
* **examples:** regionalism cleanup ([#2512](https://github.com/aziontech/docs/issues/2512)) ([d4f67f3](https://github.com/aziontech/docs/commit/d4f67f32cb213ce9778f8b23e860ee096faad88a))
* **use-cases:** redraw the use-case diagrams with the way back and check their claims ([#2509](https://github.com/aziontech/docs/issues/2509)) ([907138c](https://github.com/aziontech/docs/commit/907138c1f5cb1379c32527a7e89354de66d963c8))
* **version:** take the v3 pages out of the side menu and standardize the version notices ([#2511](https://github.com/aziontech/docs/issues/2511)) ([c2ca59d](https://github.com/aziontech/docs/commit/c2ca59d77dd92b5387995337833f8625102048e0))

## [2.3.1](https://github.com/aziontech/docs/compare/docs-v2.3.0...docs-v2.3.1) (2026-10-22)


### Documentation

* **devtools:** document Azion CLI 4.24.0, Bundler 1.2.0, and config 1.1.0 ([#2505](https://github.com/aziontech/docs/issues/2505)) ([f3003af](https://github.com/aziontech/docs/commit/f3003afc019f36495d26593492d0c91100117d6d))
* **terraform:** document Terraform Provider 2.10.0 and fix the Edge DNS schema ([#2507](https://github.com/aziontech/docs/issues/2507)) ([a36bc2c](https://github.com/aziontech/docs/commit/a36bc2cb904d211eeda5ce31e882ed1e435d3bb4))

## [2.3.0](https://github.com/aziontech/docs/compare/docs-v2.2.1...docs-v2.3.0) (2026-10-21)


### Features

* **redirects:** publish the docs Massive Redirect args on production deploy ([#2500](https://github.com/aziontech/docs/issues/2500)) ([99114ba](https://github.com/aziontech/docs/commit/99114baf5c874c9786e388056d44a308020748db))


### Documentation

* **accounts:** document the MFA reset from MFA Management ([#2502](https://github.com/aziontech/docs/issues/2502)) ([b809d01](https://github.com/aziontech/docs/commit/b809d013aa7d57d55c99902cfe89e7dad6e17b9e))

## [2.2.1](https://github.com/aziontech/docs/compare/docs-v2.2.0...docs-v2.2.1) (2026-10-21)


### Documentation

* **use-cases:** name the Reference Architecture pages after the use-case catalog ([#2497](https://github.com/aziontech/docs/issues/2497)) ([fabebad](https://github.com/aziontech/docs/commit/fabebad72ae41ecf8071a95d4e749b065e27ac65))

## [2.2.0](https://github.com/aziontech/docs/compare/docs-v2.1.4...docs-v2.2.0) (2026-10-15)


### Features

* tell agents when to use Azion, and give doc pages structured data ([#2493](https://github.com/aziontech/docs/issues/2493)) ([2d87045](https://github.com/aziontech/docs/commit/2d87045be3bfb292b5623a2b0392263b9bdd0879))

## [2.1.4](https://github.com/aziontech/docs/compare/docs-v2.1.3...docs-v2.1.4) (2026-10-15)


### Documentation

* stop documenting workload deployment, and break up the Azion Lib Applications page ([#2490](https://github.com/aziontech/docs/issues/2490)) ([f1f6dcc](https://github.com/aziontech/docs/commit/f1f6dccdda6372764fc1002c7975f64f75cd1da5))

## [2.1.3](https://github.com/aziontech/docs/compare/docs-v2.1.2...docs-v2.1.3) (2026-10-15)


### Bug Fixes

* **seo:** stop minting parameter URLs, break a redirect loop, and repair the edit links ([#2487](https://github.com/aziontech/docs/issues/2487)) ([5a71d66](https://github.com/aziontech/docs/commit/5a71d66c1ad8903c4745940c48a8f8fd08818d14))

## [2.1.2](https://github.com/aziontech/docs/compare/docs-v2.1.1...docs-v2.1.2) (2026-10-15)


### Bug Fixes

* **docs:** give the v3 reader a path through the guides that lost one ([#2483](https://github.com/aziontech/docs/issues/2483)) ([81f1fe9](https://github.com/aziontech/docs/commit/81f1fe902c0f4db34ee9d711a90133921bc31731))
* **docs:** name the WAF exception reference page for the settings it holds ([#2485](https://github.com/aziontech/docs/issues/2485)) ([170a295](https://github.com/aziontech/docs/commit/170a2957d3786222bab45f0c6263bc927054249a))

## [2.1.1](https://github.com/aziontech/docs/compare/docs-v2.1.0...docs-v2.1.1) (2026-10-14)


### Bug Fixes

* **docs:** general semrush issues ([#2480](https://github.com/aziontech/docs/issues/2480)) ([089aa13](https://github.com/aziontech/docs/commit/089aa13c8b03f85d6ef53f21978678d7ddbfb6a8))

## [2.1.0](https://github.com/aziontech/docs/compare/docs-v2.0.7...docs-v2.1.0) (2026-10-14)


### Features

* **changelog:** announce the Azion MCP Servers GA ([#2461](https://github.com/aziontech/docs/issues/2461)) ([37379da](https://github.com/aziontech/docs/commit/37379daa432d8df4151fda8362dae0c43e08d31d))


### Bug Fixes

* **docs:** general support fixes ([#2478](https://github.com/aziontech/docs/issues/2478)) ([c4aeb57](https://github.com/aziontech/docs/commit/c4aeb5767bb0e93b5f712deb9e100cdaf63a87f3))

## [2.0.7](https://github.com/aziontech/docs/compare/docs-v2.0.6...docs-v2.0.7) (2026-10-14)


### Bug Fixes

* **docs:** restore the cross-firewall Set WAF warning ([#2474](https://github.com/aziontech/docs/issues/2474)) ([1db1047](https://github.com/aziontech/docs/commit/1db1047ffc79293f05e95bb3c6022b6803de3efa))

## [2.0.6](https://github.com/aziontech/docs/compare/docs-v2.0.5...docs-v2.0.6) (2026-10-14)


### Bug Fixes

* **tabs:** hold the clicked section still and give every interface strip one order ([#2471](https://github.com/aziontech/docs/issues/2471)) ([e88da04](https://github.com/aziontech/docs/commit/e88da04a29abcc91d40d3ae3be35e7785f1e4d41))

## [2.0.5](https://github.com/aziontech/docs/compare/docs-v2.0.4...docs-v2.0.5) (2026-10-14)


### Bug Fixes

* **docs:** general technical fixes ([#2469](https://github.com/aziontech/docs/issues/2469)) ([49068c0](https://github.com/aziontech/docs/commit/49068c079e60293e46d38ab92d9a0f3200dc9ca1))


### Documentation

* **tabs:** name the interface in every panel and give each page one strip ([#2467](https://github.com/aziontech/docs/issues/2467)) ([2a54903](https://github.com/aziontech/docs/commit/2a5490339370f0e5c9ebe63cc0781743bc28244e))

## [2.0.4](https://github.com/aziontech/docs/compare/docs-v2.0.3...docs-v2.0.4) (2026-10-13)


### Bug Fixes

* **docs:** drop the accepted-value rows from the WAF limits table ([#2464](https://github.com/aziontech/docs/issues/2464)) ([bf3819e](https://github.com/aziontech/docs/commit/bf3819e2f926aa4da41ddeb3e969f01c9143d6b0))

## [2.0.3](https://github.com/aziontech/docs/compare/docs-v2.0.2...docs-v2.0.3) (2026-10-09)


### Documentation

* **use-cases:** explain each use case as a design and move values and checks into the guides ([#2457](https://github.com/aziontech/docs/issues/2457)) ([4f05338](https://github.com/aziontech/docs/commit/4f053388c890966b5c11778cf20f9de462cb2181))

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
