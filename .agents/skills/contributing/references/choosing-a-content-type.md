# Choosing a content type

Four types, from Diátaxis. Pick by what the reader is trying to do, not by what you want to write about.

## The table

| The reader wants to | Write a | Read |
| --- | --- | --- |
| Learn the product by doing something that works | **Tutorial** | `tutorial.md` |
| Accomplish a specific task they already have in mind | **How-to** | `how-to.md` |
| Look up a fact: a limit, a field, a flag, a response code | **Reference** | `reference.md` |
| Understand why something works the way it does | **Explanation** | `explanation.md` |

## The distinction that matters most

**Tutorial and how-to both contain steps. They serve opposite readers.**

A tutorial reader does not yet know what they want. They are learning, and you are teaching. You choose the goal, you guarantee it works, and you keep decisions away from them. "Deploy your first application" is a tutorial: the reader has no application in mind, and any application will do.

A how-to reader already knows what they want. They arrived with a problem. You are removing obstacles, not teaching. "How to configure cache policies" is a how-to: the reader has a cache problem and wants it gone.

If you find yourself writing "you can also" or "depending on your setup", you are writing a how-to. Tutorials do not branch. If you find yourself explaining what a bucket is, you are writing a tutorial or an explanation, not a how-to.

**Reference and explanation both describe rather than instruct.**

Reference is a map. It is complete, consistent, and boring on purpose. Someone consults it, they do not read it. If a sentence would be skipped by someone scanning for a limit value, it does not belong.

Explanation is a discussion. It provides context, alternatives, and reasons. It is the only type where "why" and "instead of" belong.

## Do not mix types on one page

This is the most common structural defect in this repository. A reference page that stops to walk through the Console, a how-to that pauses to explain architecture, a tutorial that turns into a parameter table halfway down.

When you find a mixed page, split it. See `splitting-a-page.md`.

The test: read the page as each of the four readers above. If two of them would each want a different half, it is two pages.

## When the answer is none of them

Some pages are navigation, not content: hubs, index pages, card grids. They collect links and carry no prose beyond a sentence of orientation. They are not a Diátaxis type and do not need to pretend to be one. Keep them short and make every link earn its place.
