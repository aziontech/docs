# MDX components

The live component set. This is the whole vocabulary: a component that is not on this page is not available, and emitting one produces a page that looks plausible in review and fails at build.

Which component fits which data is in the contributing skill's `choosing-components.md`.

## Do not use

These exist in the codebase and are not part of this site's vocabulary. Importing one fails the build or renders nothing:

`Card` · `Badge` · `FileTree` · `Checklist` · `Spoiler` · `Since` · `Button` · `TabBox` · `Breadcrumb`

If you need what one of these would have done, use a table or an aside.

## Asides — no import needed

Written as remark directives. The most common construct after links.

```mdx
:::note
Bucket names must be unique across all existing buckets.
:::

:::tip
**Increase limits** <br></br>
Contact [technical support](/en/documentation/services/support/) to request a higher limit for your plan.
:::

:::caution[important]
You are viewing the latest version. For accounts that are not migrated, refer to the [legacy reference](/en/documentation/products/build/edge-application/v3/).
:::
```

Valid types: `note`, `tip`, `caution`, `danger`.

**`:::warning` is not valid** and does not render as intended. Use `:::caution`.

The bracket text overrides the auto-translated title. In Portuguese pages, localize it: `:::note[nota]`, `:::tip[dica]`, `:::caution[Atenção]`.

## LinkButton

The house call to action.

```mdx
import LinkButton from 'azion-webkit/linkbutton'

<LinkButton severity="secondary" label="Real-Time Purge reference" link="/en/documentation/products/build/applications/real-time-purge/" />
```

Props in use: `link`, `label`, `severity="secondary"`, `outlined`, `icon`, `iconPos`.

## Code

Wrapper around expressive-code. Gives a copy button.

```mdx
import Code from '~/components/Code/Code.astro'

<Code lang="bash" code={`azion deploy --local`} />
```

Accepts only `code` and `lang`.

**The value is a JavaScript template literal.** Backticks and `${` inside it must be escaped, and a line continuation needs a doubled backslash. When a snippet contains either, that is a reason to use `<Code>` rather than a fence, because you control the escaping.

Fenced blocks are also house style. Use a fence for output the reader reads, and `<Code>` for input the reader copies.

Language tags in use: `bash`, `sh`, `json`, `javascript`, `js`, `typescript`, `ts`, `hcl`, `graphql`, `shell`, `text`, `plaintext`. Terraform is `hcl`, not `terraform`.

## Tabs and Fragment

The multi-interface pattern: one task, one panel per interface.

```mdx
import Tabs from '~/components/tabs/Tabs'
import Code from '~/components/Code/Code.astro'

<Tabs client:visible>
    <Fragment slot="tab.console">Console</Fragment>
    <Fragment slot="tab.api">API</Fragment>

<Fragment slot="panel.console">

1. Access [Azion Console](https://console.azion.com/) > **Object Storage**.
2. Select **+ Bucket**.

</Fragment>

<Fragment slot="panel.api">

<Code lang="bash" code={`curl ...`} />

</Fragment>

</Tabs>
```

- `client:visible` is mandatory. Without it the tabs render and do not switch.
- Every `tab.x` needs a matching `panel.x`.
- **Blank lines around markdown inside a Fragment are mandatory**, or the markdown renders as one literal paragraph.
- First panel is the default; put Console first unless there is a reason not to.
- Canonical keys: `tab.console`, `tab.api`, `tab.cli`, plus `tab.apiv3` / `tab.apiv4` for versioned APIs.
- Optional `sharedStore="package-managers"` syncs selection across tab groups on a page.

## Tag

Status badges.

```mdx
import Tag from 'primevue/tag';

<Tag severity="info" client:only="vue" value="Preview" />
```

`client:only="vue"` is mandatory. Without it the badge renders and does not hydrate.

## Video — no import needed

Emits the iframe plus schema.org `VideoObject` metadata.

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

Available: `apiv4Rollout`, `JourneyAPI`, `InterfaceNote`, `LetsEncryptExpiration`, `RulesEngineExecution`.

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
- Imports go directly after the frontmatter block, before any prose.
