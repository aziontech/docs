# MDX components

Only what is live in this repository. Usage counts are from the content directory.

**`src/components/` contains a lot of dead code.** This site began as a fork of the Astro docs, and most of the inherited components have never been used in an Azion page. Emitting one produces a page that looks plausible in review and fails at build.

## Do not use

Zero usages across 1,484 pages. They exist in `src/components/` and they are not part of this site's vocabulary:

`Card` · `Badge` · `FileTree` · `Checklist` · `Spoiler` · `Since` · `Button` · `TabBox` · `Breadcrumb`

If you need what one of these would have done, use a table or an aside.

## Asides — no import needed

Auto-imported. Written as remark directives. Roughly 2,000 uses, the most common construct in the corpus after links.

```mdx
:::note
Bucket names must be unique across all existing buckets.
:::

:::tip
**Increase limits** <br></br>
Contact [technical support](/en/documentation/services/support/) to request a higher limit for your plan.
:::

:::caution[important]
You are viewing the latest version. If your account has not been migrated, see the [legacy reference](/en/documentation/products/build/edge-application/v3/).
:::
```

Valid types: `note`, `tip`, `caution`, `danger`.

**`:::warning` is not valid.** Fifteen pages use it anyway and it does not render as intended. Use `:::caution`.

The bracket text overrides the auto-translated title. In Portuguese pages, localize it: `:::note[nota]`, `:::tip[dica]`, `:::caution[Atenção]`.

## LinkButton — 1,573 uses

The house call to action.

```mdx
import LinkButton from 'azion-webkit/linkbutton'

<LinkButton severity="secondary" label="Learn more about Real-Time Purge" link="/en/documentation/products/build/applications/real-time-purge/" />
```

Props in use: `link`, `label`, `severity="secondary"`, `outlined`, `icon`, `iconPos`.

## Code — 926 uses

Wrapper around expressive-code. Gives a copy button.

```mdx
import Code from '~/components/Code/Code.astro'

<Code lang="bash" code={`azion deploy --local`} />
```

Accepts only `code` and `lang`.

**The value is a JavaScript template literal.** Backticks and `${` inside it must be escaped, and a line continuation needs a doubled backslash. When a snippet contains either, that is a reason to use `<Code>` rather than a fence, because you control the escaping.

Fenced blocks are also house style and appear more often in absolute terms. Use a fence for output the reader reads, and `<Code>` for input the reader copies.

Language tags in use: `bash`, `sh`, `json`, `javascript`, `js`, `typescript`, `ts`, `hcl`, `graphql`, `shell`, `text`, `plaintext`. Terraform is `hcl`, not `terraform`.

## Tabs and Fragment — 328 uses

The multi-interface pattern. Full example and rules in `.agents/skills/contributing/references/how-to.md`.

```mdx
import Tabs from '~/components/tabs/Tabs'

<Tabs client:visible>
    <Fragment slot="tab.console">Console</Fragment>
    <Fragment slot="tab.api">API</Fragment>

<Fragment slot="panel.console">

1. In the side menu, click **Object Storage**.

</Fragment>

<Fragment slot="panel.api">

<Code lang="bash" code={`curl ...`} />

</Fragment>

</Tabs>
```

- `client:visible` is mandatory
- Every `tab.x` needs a matching `panel.x`
- **Blank lines around markdown inside a Fragment are mandatory**, or the markdown does not render
- First panel is the default; put Console first unless there is a reason not to
- Canonical keys: `tab.console`, `tab.api`, `tab.cli`, plus `tab.apiv3` / `tab.apiv4` for versioned APIs
- Optional `sharedStore="package-managers"` syncs selection across tab groups on a page

## Tag — 395 uses

Status badges.

```mdx
import Tag from 'primevue/tag';

<Tag severity="info" client:only="vue" value="Preview" />
```

`client:only="vue"` is mandatory.

## Video — no import needed

Auto-imported. Emits the iframe plus schema.org `VideoObject` metadata.

```mdx
<Video
  src="https://www.youtube.com/embed/BV4jRPpADw8"
  title="Local development with Azion CLI"
  description="How the CLI supports local debugging and faster workflows."
  uploadDate="2023-10-17"
/>
```

`src` must be a YouTube **embed** URL. `src` and `title` are required.

## Shared snippets

Reusable blocks under `~/includes/snippets/`, each with an `en/` and a `pt/` variant. Note the Portuguese folder is `pt/`, not `pt-br/`.

```mdx
import Apiv4Rollout from '~/includes/snippets/apiv4Rollout/en/snippet.mdx'

<Apiv4Rollout />
```

Available: `apiv4Rollout` (56 uses), `JourneyAPI`, `InterfaceNote`, `LetsEncryptExpiration`, `RulesEngineExecution`.

## SectionBasicContent

Hero block, used on template showcase pages. Takes `description` and a `buttons` array, with content in a `<Fragment slot="content">`. Read an existing showcase page before using it.

## Tables and line breaks

Tables are plain GFM pipe tables. Horizontal scrolling is added automatically; do not wrap them yourself.

`<br />` or `<br></br>`. **Bare `<br>` breaks the build** — MDX requires every tag closed.

## MDX gotchas

- Bare `<` and `{` in prose are parsed as JSX. Escape them or use backticks.
- Every tag must be closed or self-closing.
- No H1 in the body; `title` renders it.
- `---` between major sections is house style, roughly three per page. Never immediately after the frontmatter block.
