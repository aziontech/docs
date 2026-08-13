# Commercial framing

What makes a use case different from a guide, and the traps that come with it.

A guide assumes the reader already decided what to do. A use case reaches someone who has a business problem and does not yet know which products solve it. So the page carries a commercial frame. The frame is context, never salesmanship, and the line between them is thinner here than anywhere else in the documentation.

## The reader

A technical lead who can run every command on the page and will not accept a claim without a check. They are deciding whether this setup fits their problem, and they are reading the docs rather than the marketing site because they want the configuration.

They do not need to be persuaded. They already navigated here.

## The scenario paragraph

The only place on the page where a business term leads. It states constraints, and constraints are facts.

**In:** what the team runs, what breaks under load, which parts of the system behave differently from each other, what has to keep working.

**Out:** adjectives about the platform, market context, anything about revenue, and any sentence that would sit unchanged in a brochure.

- Not: `In today's competitive e-commerce landscape, delivering fast, seamless experiences is critical to conversion.`
- Instead: `A storefront serves a product catalogue that changes hourly and a cart that is different for every visitor. Both live under one domain. Cache helps the first and corrupts the second.`

The second one names the constraint that decides the whole configuration. The first one says nothing a reader can act on.

The test: delete any sentence that does not change what the reader configures. If the paragraph survives intact, it was doing work.

## Say what it does not cover

One line, directly under the scenario. A commercial reader assumes anything unmentioned is included, and the assumption is expensive when it reaches production.

```
This use case covers catalogue caching, cart bypass, and checkout protection. It does not cover payment processing or inventory synchronization.
```

## Vertical words to technical needs

Business terms have to be translated before they can be configured. Translate to a technical need, then find the product in your evidence. Never skip to a product from memory.

| The reader says | The technical need |
| --- | --- |
| Flash sale, Black Friday | Traffic multiplies on a subset of paths |
| Product catalogue | Content that is identical for every visitor, changes on a schedule |
| Cart, wishlist, account area | Content that is different per visitor and must never be shared |
| Checkout | A path carrying card data, needs TLS and request filtering |
| Live event | A manifest that revalidates often, segments that do not change |
| Personalization | A decision made per request, before the response is built |
| Onboarding a tenant | A configuration created per customer, repeatedly |
| Audit, incident review | Request-level records shipped somewhere they are kept |

The product column is deliberately absent. It is filled per page from the evidence table in `intake.md`, because a product mapping written from memory is the exact failure this skill exists to prevent.

## Numbers

**An example figure belongs in the scenario paragraph, labeled as an example, and nowhere else.**

Next to a product name a reader reads any number as a platform limit, and there is nothing on the rendered page to tell them otherwise.

- Not: `Applications handles 50,000 requests per second during a sale.`
- Instead: `A catalogue of around 50,000 products, as an example.`

A number inside a `## Configure` section is a value the reader will set, so it must come from a documented default or a decision you explain in that section. See `page-shape.md`.

## Compliance

**Never assert that a configuration makes anyone compliant.** That is a legal claim, the page cannot support it, and a reader will act on it.

State what the configuration does. Link the compliance page and let it speak for itself.

- Not: `These rules make your checkout PCI DSS compliant.`
- Instead: `The firewall filters requests to the checkout path. For Azion's own certification, refer to [PCI compliance](/en/documentation/platform/compliance/pci-dss-certification/).`

The same applies to LGPD, GDPR, SOC 2, and any certification named in a requirement.

## Never in a use case

| Not this | Because |
| --- | --- |
| A percentage improvement | The page cannot support it and nobody will re-measure it |
| A cost saving, a price, a plan name | Pricing changes and the page does not |
| A customer name, a logo, a case study | Documentation is public, and docs are not references |
| A comparison with another platform | A use case is not a migration guide |
| An industry statistic | It ages, it is unsourceable here, and it changes nothing |
| `powerful`, `seamless`, `robust`, `enterprise-grade` | Quality claims. `.agents/references/style-guide.md` |
| A closing paragraph that restates the page | End on the last check, then `## Next steps` |

Naming another platform is legitimate in a migration guide, which exists to move a reader off that platform. The exemption does not extend to a use case.

## Where commercial value goes instead

It does not get deleted. It gets converted into something checkable.

| The claim you want to make | What goes on the page |
| --- | --- |
| Faster for shoppers | The catalogue is served from cache; the check in `## Verify the setup` shows the cache hit |
| Safer checkout | The firewall rule and the path it matches |
| Handles peak traffic | Which paths are cached and which are not |
| Less work for the team | The configuration is four steps, and they are on the page |

The reader draws the conclusion. That is stronger than asserting it, and it is the only version the docs can stand behind.

## Checklist

- [ ] The scenario names constraints, not market context
- [ ] One line says what the use case does not cover
- [ ] Every business term was translated to a technical need before a product was chosen
- [ ] Every product came from the evidence table, not from memory
- [ ] No example figure appears outside the scenario paragraph
- [ ] No compliance claim; the compliance page is linked instead
- [ ] No percentage, price, customer, platform comparison, or industry statistic
- [ ] No adjective makes a quality claim about an Azion product
- [ ] Every check in `## Verify the setup` tests an outcome, not a step
