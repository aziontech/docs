# Azion Docs contributing guide

Thank you for taking the time to contribute to the Azion documentation! :orange_heart:

Your contributions will help us maintain the [Azion Docs](https://docs.azion.com) portal.

In this guide you'll get an overview of the contribution workflow from opening an issue, creating a PR, reviewing, and merging the PR.

> :wave: **New to contributions?** To get an overview of the project, read the [README](README.md) file. Here are some resources to help you get started with open source contributions:
> - [Finding ways to contribute to open source on GitHub](https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github)
> - [Set up Git](https://docs.github.com/en/get-started/quickstart/set-up-git)
> - [GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow)
> - [Collaborating with pull requests](https://docs.github.com/en/github/collaborating-with-pull-requests)


## Important

- On Azion **docs** repository, you can open a issue without opening a PR after, but you can't open a PR without opening an issue.
- PRs submitted by code owners (internal) have priority over PRs submitted by external users (external).
- For significant changes on docs, we recommend you open an issue and wait for one of our code owners to respond so we can find the best approach.

## Code owners

aziontech/docs has two teams as code owners:

- Product Content Experience (PCX), the gatekeepers of all content.

  - [@hannah-sk](https://github.com/hannah-sk) :rabbit:
  - [@MarianaAguilera](https://github.com/MarianaAguilera) :panda_face:
  - [@gabriel-azion](https://github.com/gabriel-azion) :dog:
  - [@bru-andrade](https://github.com/bru-andrade) :pig:
  - [@GabrielAzion](https://github.com/GabrielAzion) :owl:

- UX Engineering (UXE), the gatekeepers of all structure code.

  - [@robsongajunior](https://github.com/robsongajunior)
  - [@lfsigreja](https://github.com/lfsigreja )

---

## Getting started

### :grey_exclamation: Open a new issue

If you spot a problem with the docs, first [search if an issue already exists](https://docs.github.com/en/github/searching-for-information-on-github/searching-on-github/searching-issues-and-pull-requests#search-by-the-title-body-or-comments) in the Azion Docs repository.

If a related issue doesn't exist, you can open a new issue using one of the [issue forms](https://github.com/aziontech/docs/issues/new/choose).

There are 4 types of contribution to the Azion Docs repository:

- **Add**: addition of new content.
- **Upkeep**: update of existing content.
- **Fix**: correction of content errors.
- **Questions**: doubts.

### :pencil2: Make changes

After you open an issue, you can either start making changes yourself or wait for one of our tech writers to address your issue.

Only code owners from the [Azion organization](https://github.com/aziontech/) can directly create branches and open pull requests on the docs repository. If you aren't part of the Azion organization but want to contribute, [fork the repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo) first.

In your fork, make the necessary modifications to the files. The directory path `src/content/docs` holds all of the content in the Azion Docs portal, divided by language.

If you feel confident writing in both English and Portuguese, don't forget to make the changes to both English and Portuguese versions of the documentation. Otherwise, one of our team members will open a PR for the other language on your behalf.

Azion Docs uses the [Astro framework](https://docs.astro.build/en/guides/markdown-content/), allowing you to write content in `.mdx` format. Take a look at [some of our existing content](https://github.com/aziontech/docs/tree/community-guidelines/src/content/docs) to get a sense of how our documentation is structured.

If you want to propose a new page:

1. Find the appropriate directory.
2. Create a new `.mdx` file.
3. Add a [front matter YAML](https://docs.github.com/en/github-ae@latest/contributing/syntax-and-versioning-for-github-docs/using-yaml-frontmatter) to the top of the `.mdx` file to fill out titles and metadata as shown below:

```md
---
title: <Insert page title>
description: <Insert page description>
meta_tags: <Insert tags>
namespace: <Insert namespace following the structure: documentation_type_product_module_feature>
permalink: <Insert a permalink for the page following the structure: /en/documentation/type/product/module/feature>
---
```

5. Write the content below the front matter in Markdown format.

You can branch out from main or commit the changes directly once you're pleased with them.

### :speech_balloon: Create a Pull Request

When you're finished with the changes, create a pull request (PR).

1. [Open a new PR](https://github.com/aziontech/docs/compare) by selecting your forked repository and the branch in which you commited your changes.
2. Fill in the PR title and description according to the template so that we can review your PR. 
  - The description template helps reviewers understand your changes as well as the purpose of your PR.
3. Don't forget to [link the PR to the issue you opened](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue).
4. Enable the checkbox to [allow maintainer edits](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/allowing-changes-to-a-pull-request-branch-created-from-a-fork) so the branch can be updated for a merge.
5. Once you submit your PR, our code owners will review your contributions. We may ask questions or request additional context. 
  - Reviewers will test your changes locally to make sure your modifications don't break the application's build process.
6. After testing, we may ask for changes to be made before a PR can be merged, either using [suggested changes](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/incorporating-feedback-in-your-pull-request) or pull request comments. 
  - You can apply suggested changes directly through the UI. You can make any other changes in your fork, then commit them to your branch.
7. As you update your PR and apply changes, mark each conversation as [resolved](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/commenting-on-a-pull-request#resolving-conversations).

Now you'll need the approval from at least two code owners before you can merge your changes.

#### :memo: Review by code owners

When the repository's code owners review your PR, they may make suggestions, request changes, or even reject your PR. Possibilities that lead to a PR rejection:

- PR based on the wrong branch (not main).
- PR attempts to merge changes into the wrong branch.
- Contribution was already addressed in another PR.
- Contribution has wrong technical information. Address the responsible Technical Writer (TW) and a Subject Matter Expert (SME), if needed.
- Contribution is already being worked on by a TW (if it’s a product/feature launch and the TW is already working on the content on a branch, the TW’s contribution has priority. Community contribution can be incorporated into the TW’s PR).
- Contributor opened a PR without a GitHub issue.
- Contributor didn’t describe what they were changing/adding/fixing on the PR description.
- Contributor didn’t add a descriptive title/label.

### :thumbsup: Merge changes

Once you have at least two approvals from code owners, you can merge your PR. 🥳 

Check the [GitHub Actions tab](https://github.com/aziontech/docs/actions) to see the status of your modifications. If you run into any merge issues, check this [git tutorial](https://github.com/skills/resolve-merge-conflicts) to help you resolve merge conflicts and other issues.

Once your PR is merged successfully, you can review your contribution on the [Azion Docs](https://docs.azion.com) portal. 📙

### :white_check_mark: Close the issue

Congratulations, your PR has been merged! :tada: The issue you created can now be updated and closed once the merge has been made.

> Don't forget to [keep your forked repository up-to-date with the Azion docs repository](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork) if you wish to make more contributions in the future.
