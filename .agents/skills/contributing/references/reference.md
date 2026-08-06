# Reference

Look-up material. Someone consults it; nobody reads it start to finish. It is complete, consistent, and deliberately boring.

## Shape

```
[Lead paragraph: **Product name** is ... , plus what you can do with it.]

<LinkButton ... />

You can create and manage <Product> using:
- [Azion Console](...)
- [API](...)
- [Azion CLI](...)
- [Terraform](...)

---

## Implementation
| Scope | Resource |
| --- | --- |

---

## Modules
| Module | Description |
| --- | --- |

---

## Advanced settings
| Setting | Description |
| --- | --- |

---

## Limits
:::tip
Limits can be raised. Contact [support](...).
:::

| Scope | Limit |
| --- | --- |
```

Not every reference page needs every section. A CLI command page is a different shape: a one-line summary, `## Usage` with a shell block, then `## Optional flags` with one `####` per flag.

## Rules

**Describe, do not instruct.** Reference says what a thing is and what values it accepts. The moment you write a numbered click-through, you have written a how-to and filed it in the wrong place.

If a reference page needs to show how to do something, link to the how-to. Do not inline it.

**Tables carry the information.** Anything enumerable is a table: fields, limits, modules, flags, status codes, defaults. Prose between tables should be one or two sentences of orientation, not exposition.

**Be complete before you are interesting.** A reference page missing three of twelve fields is broken. A reference page with dull descriptions of all twelve is doing its job.

**Consistent phrasing across rows.** If one row says "Maximum number of buckets per account", the next says "Maximum number of objects per bucket", not "How many objects you can put in a bucket". Reference readers scan; inconsistent phrasing forces them to actually read.

**State the units and the defaults.** A limit without a unit is not a fact. A setting without a default is a question.

**No marketing.** Not "powerful caching capabilities". Just what it does and what its limits are. `terminology.md` has the banned expressions.

## Components

`<LinkButton>` for the primary call to action, once, near the top:

```mdx
import LinkButton from 'azion-webkit/linkbutton'

<LinkButton severity="secondary" label="Learn more about Real-Time Purge" link="/en/documentation/products/build/applications/real-time-purge/" />
```

Plain GFM pipe tables. They are wrapped for horizontal scrolling automatically; do not build your own scroll container.

`:::tip` for the limits-can-be-raised note. `:::caution[important]` for version or migration warnings. Nothing else, and not many of them.
