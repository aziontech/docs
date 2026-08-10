<h1 align="center">Azion Docs</h1>

<p align="center">
  <b>The source for <a href="https://azion.com/en/documentation/">Azion's developer documentation</a>.</b>
  <br>
  Built with <a href="https://astro.build/">Astro</a> and <a href="https://mdxjs.com/">MDX</a>, in English and Portuguese.
</p>

<p align="center">
  <a href="https://github.com/aziontech/docs/actions/workflows/prod.yml"><img src="https://github.com/aziontech/docs/actions/workflows/prod.yml/badge.svg" alt="production build"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-orange" alt="MIT license"></a>
</p>

---

## Quick links

| If you want to | Go to |
| --- | --- |
| Read the documentation | [azion.com/en/documentation](https://azion.com/en/documentation/) |
| Report an error, request a page, or ask a question | [Issue forms](https://github.com/aziontech/docs/issues/new/choose) |
| Make a change | [CONTRIBUTING.md](.github/CONTRIBUTING.md) |
| Understand the rules | [GOVERNANCE.md](.github/GOVERNANCE.md) |
| Find out who reviews what | [CODEOWNERS](.github/CODEOWNERS) |
| Get help with an Azion product | [Azion Support](https://tickets.azion.com/en/support/login/new) |

## What's in here

Published content lives in `src/content/docs/`, split into `en` and `pt-br`. Pages are `.mdx`, so a page can pull in front-end components instead of being limited to prose. The site covers product reference, API reference, guides, use cases, and code samples.

English is the source of truth. Portuguese mirrors it, and divergence is tracked in an `i18n` issue rather than left silent.

We treat these pages as an API. People read them, but so do agents and crawlers through llms.txt, context7, and MCP. That makes frontmatter schema, heading structure, and working links contract requirements rather than style preferences.

## Run it locally

You need Node 20.13.1 or newer and pnpm.

```bash
git clone https://github.com/aziontech/docs.git
cd docs
nvm use
pnpm install --frozen-lockfile
pnpm dev
```

Before you open a pull request:

```bash
pnpm build:local     # build + frontmatter validation
pnpm lint:slugcheck  # permalink rules
```

pnpm is the package manager of record. Do not commit npm or yarn lockfiles.

## How changes get made

[GOVERNANCE.md](.github/GOVERNANCE.md) is the source of truth. If it contradicts any other document in this repository, including this one, it wins. The short version:

- `main` is the only long-lived branch. Work happens on short-lived branches that merge back within days.
- Merges are squash only, so the pull request title becomes permanent commit history. Titles follow `type(scope): summary` and never carry ticket codes.
- Technical content passes two gates. A subject matter expert confirms it is true, and a DevRel maintainer confirms it is well written and well placed.
- A permalink change without a redirect in the same pull request is a broken build.
- Expect a first response on any pull request within one business day.

[CONTRIBUTING.md](.github/CONTRIBUTING.md) walks through all of it step by step. Contributions from outside Azion are welcome and get credited: fork the repository, branch, and open a pull request against `main`.

## Community

- [Discord](https://discord.com/invite/Yp9N7RMVZy)
- [X](https://x.com/aziontech)
- [LinkedIn](https://www.linkedin.com/company/aziontech)
- [YouTube](https://www.youtube.com/aziontech)

Everyone taking part here follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

## License

Released under the [MIT License](LICENSE). Copyright (c) 2026 Azion Technologies.
