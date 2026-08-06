# How-to

Gets a reader who already has a problem to a solved problem. They know what they want; you remove the obstacles.

## Shape

```
[One paragraph: the outcome. Start with the result, not the background.]

:::tip
[Prerequisites, if any. One aside, not a section.]
:::

## <Gerund phrase describing the task>
[Steps. Tabbed by interface if the task has more than one.]

## <Next task, if the page covers a sequence>

---

:::tip
[Where to go next. One or two links.]
:::
```

## Title and headings

Titles start with "How to": `How to create an Object Storage bucket`. This is house convention and 114 of the 206 pages in `guides/` already follow it.

Section headings are gerund phrases naming the task: `Creating a bucket`, `Setting a cache policy`, `Bypassing origin cache`. Not `Bucket creation`, not `Step 1`.

## The multi-interface pattern

Most Azion tasks can be done through the Console, the CLI, or the API. When that is true, use tabs rather than three separate pages or three sequential sections.

```mdx
import Tabs from '~/components/tabs/Tabs'
import Code from '~/components/Code/Code.astro'

<Tabs client:visible>
    <Fragment slot="tab.console">Console</Fragment>
    <Fragment slot="tab.cli">Azion CLI</Fragment>
    <Fragment slot="tab.api">API</Fragment>

<Fragment slot="panel.console">

1. In the side menu, click **Object Storage**.
2. Click the **+ Bucket** button.
3. Enter a name and select **Read-only**.
4. Click **Save**.

</Fragment>

<Fragment slot="panel.cli">

<Code lang="bash" code={`azion create bucket --name my-bucket --edge-access read_only`} />

</Fragment>

<Fragment slot="panel.api">

<Code lang="bash" code={`curl --location 'https://api.azion.com/v4/storage/buckets' \\
--header 'Authorization: Token [TOKEN VALUE]' \\
--data '{"name": "my-bucket", "edge_access": "read_only"}'`} />

</Fragment>

</Tabs>
```

Rules that will bite you:

- `client:visible` is mandatory. Without it the tabs render but do not switch.
- Slot keys pair up: every `tab.x` needs a `panel.x`.
- **Blank lines around markdown inside a `<Fragment>` are mandatory.** Without them, MDX renders your numbered list as a single paragraph.
- The first panel is the default. Put the interface most readers use first, which is usually Console.

## Rules

**Start with the outcome.** The first sentence says what the reader will have when they are done. Background, if any, comes second and briefly.

**Bold the UI, not the emphasis.** `Click the **Save** button` is house style. Bold is for interface labels and product names, not for making a sentence feel important.

**One task per heading.** If a heading covers two tasks, it is two headings.

**Do not teach.** The reader has a problem, not a curiosity. A sentence of context is fine; a paragraph is a sign the content belongs in an explanation page with a link to it.

**Steps are imperative and numbered.** "Click", "Enter", "Select". Not "You should click" or "The user clicks".

**Write the agent twin.** How-to pages are also served as markdown at `<permalink>.md`, and that version should read as a skill an agent can execute. See `agent-twin.md`.

**Separate major sections with `---`.** This is house style, roughly three per page. Do not put one immediately after the frontmatter.
