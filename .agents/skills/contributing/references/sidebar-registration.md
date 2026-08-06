# Sidebar registration

**A new page does not appear in any sidebar on its own.** Nothing scans the content directory. Menus are hand-maintained TypeScript arrays, and forgetting this step ships a page that exists at its URL and is reachable from nowhere.

## The two halves

**1. Point the page at a menu** with `menu_namespace` in its frontmatter:

```yaml
menu_namespace: storeMenu
```

Omit the field and the page falls back to `nav`, the main sidebar. Set it to a name that is not registered and it silently falls back to `nav` as well, which looks like the field being ignored.

Registered menus, from `src/data/availableMenu.ts`:

`nav`, `buildMenu`, `secureMenu`, `observeMenu`, `deployMenu`, `storeMenu`, `cliMenu`, `cliMenuAlpha`, `runtimeMenu`, `graphqlMenu`, `devtoolsMenu`, `libMenu`, `mcpMenu`

**2. Add the entry to the menu file**, in both languages:

```
src/i18n/en/storeMenu.ts
src/i18n/pt-br/storeMenu.ts
```

## The entry format

From the header comment the menu files carry:

- Every entry needs `text` and `key`
- Heading entries need `header: true` and `type`
- Link entries need `slug`, **which excludes the language code**

A real entry:

```ts
{
    text: 'Create a bucket',
    header: true,
    anchor: true,
    type: 'learn',
    slug: '/documentation/products/store/storage/create-bucket/',
    key: 'createBucket',
},
```

**`slug` equals the page's `permalink` exactly.** Same value, no language prefix, trailing slash. If they disagree, the sidebar link 404s.

`key` is camelCase and unique within the menu. `text` is the label, and it *is* translated in the pt-br file while `slug` becomes the Portuguese permalink.

## Both languages, or neither

The Portuguese menu file is a separate array. Adding the English entry alone gives Portuguese readers a page with no way to reach it.

```ts
// src/i18n/en/storeMenu.ts
{ text: 'Create a bucket', slug: '/documentation/products/store/storage/create-bucket/', key: 'createBucket', ... }

// src/i18n/pt-br/storeMenu.ts
{ text: 'Criar um bucket', slug: '/documentacao/produtos/store/storage/criar-bucket/', key: 'createBucket', ... }
```

Same `key`, translated `text`, translated `slug`.

## Checklist

- [ ] `menu_namespace` set, and the value is in `availableMenus`
- [ ] Entry added to `src/i18n/en/<menu>.ts`
- [ ] Entry added to `src/i18n/pt-br/<menu>.ts`
- [ ] `slug` matches the page's `permalink` character for character, in each language
- [ ] `key` is unique within the menu and identical across the two languages
- [ ] Position in the array puts the page where a reader would look for it
