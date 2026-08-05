# Worked example

Input the user might give (raw, informal changelog dump for one date):

```
July 10, 2026
- marketplace: removed Saffe Liveness Detection, Saffe Face Detection, Saffe ID Matching integrations,
  they're deprecated, existing installs keep working, just no new installs
- Bot Manager 1.3.0 / Bot Manager Lite 0.2.0 released. 9 new static rules, new good_fingerprint_list arg
  (bypass validation for listed fingerprints), new block_ai_bots arg (auto-block known AI user agents).
  Lite available via marketplace console link, standard version on request via Service Delivery
```

## Expected English output block

```mdx
---
## July 10, 2026

### Marketplace

#### Solution deprecations

<Tag severity="info" client:only="vue">Deprecated</Tag>

The following integrations have been deprecated and removed from Azion Marketplace:

- Saffe Liveness Detection
- Saffe Face Detection
- Saffe ID Matching

These integrations are being retired because they no longer integrate with the platform as well as they used to. If you already have any of them installed, they'll continue working as expected — only new installations are blocked.

#### Bot Manager 1.3.0 and Bot Manager Lite 0.2.0

New versions of **Bot Manager** are available for both the Lite and standard (formerly "Advanced") plans. Highlights include:

- Nine new static rules.
- A new `good_fingerprint_list` argument, which allows listed fingerprints to bypass Bot Manager validation.
- A new `block_ai_bots` argument, which blocks known AI user agents automatically.

To get the new Lite version, launch it through the [Marketplace](https://console.azion.com/marketplace/solution/azion/bot-manager-lite). The standard version remains available on demand, upon request to the Service Delivery team.

```

## Expected pt-br output block

```mdx
---
## 10 de julho, 2026

### Marketplace

#### Descontinuação de soluções

<Tag severity="info" client:only="vue">Descontinuado</Tag>

As seguintes integrações foram descontinuadas e removidas do Marketplace da Azion:

- Saffe Liveness Detection
- Saffe Face Detection
- Saffe ID Matching

Essas integrações estão sendo desativadas porque não se integram mais à plataforma tão bem quanto antes. Se você já utiliza alguma delas, ela continuará funcionando normalmente — apenas novas instalações estão bloqueadas.

#### Bot Manager 1.3.0 e Bot Manager Lite 0.2.0

Novas versões do **Bot Manager** estão disponíveis tanto para o plano Lite quanto para o padrão (antigo "Advanced"). Os destaques incluem:

- Nove novas regras estáticas.
- Um novo argumento `good_fingerprint_list`, que permite que fingerprints listados sejam ignorados na validação do Bot Manager.
- Um novo argumento `block_ai_bots`, que bloqueia automaticamente User-Agents conhecidos de IA.

Para obter a nova versão Lite, basta ativá-la pelo [Marketplace](https://console.azion.com/marketplace/solution/azion/bot-manager-lite). A versão padrão continua disponível sob demanda, mediante solicitação à equipe de Service Delivery.

```

Notes on what to observe here:
- Free-form H4 (`Solution deprecations` / product+version name) translated as normal prose.
- Product name `Bot Manager`, arg names in backticks, and the URL are untouched in pt-br.
- `<Tag>` label translates (`Deprecated` → `Descontinuado`); props don't.
- Both blocks open with a `---` and a blank line before the closing of the block (matching the separator that will sit between this new entry and the next-older one already in the file).

## Multi-product, multi-category example (versioned product + package list)

Raw input:

```
June 15
- terraform provider 2.7.0: improved http3/quic_ports handling, improved retry for 500 errors
- CLI 4.22.1: updated support for latest devtools/integrations improvements
- devtools packages shipped: @aziontech/unenv-preset 1.0.1, @aziontech/presets 1.1.0,
  @aziontech/builder 1.0.2, @aziontech/bundler 1.1.0. also added Nitro dev preset + typescript
  package updates to support it
```

Expected English shape (shows H3 → optional version line → H4 category grouping, repeated per product):

```mdx
### Terraform Provider

**Version 2.7.0**

#### Improvements

- **Workloads**: Improved management of `http3` and `quic_ports`.
- **Retry Handling**: Improved retry functionality with retry options for `500` errors.

### Azion CLI

**Version 4.22.1**

#### Improvements

- Updated CLI support for the latest DevTools and integrations improvements.

### DevTools & Integrations

#### Versions shipped

- **@aziontech/unenv-preset**: 1.0.1
- **@aziontech/presets**: 1.1.0
- **@aziontech/builder**: 1.0.2
- **@aziontech/bundler**: 1.1.0

#### Features

- **Nitro preset**: Added a development preset for Nitro, enabling builds for applications and frameworks that run on the Nitro server.
- **TypeScript packages**: Published updates across multiple TypeScript packages to support the new Nitro preset.
```

pt-br mirrors this exactly, translating only prose and the `Improvements`/`Features`/`Versions shipped` headings — product names, package names, and version numbers stay identical.
