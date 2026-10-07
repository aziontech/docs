# Docs Help Center
This repository contains all Help Center documentation and recommended articles lists. This information is used by the [Help Center widget project](https://github.com/aziontech/help-center-widget) to render the necessary content.

See below a list of how to create/edit new documentation and a table mapping the available markups to write documentation.

**Note**: Markdown linter on VSCode will request you to add blank lines between each line. In the specific `index.md` file which uses front matter, you *can’t* add blank lines. Keep all lines directly one after the other, *exactly* as shown in the example. Otherwise, the converter won’t be able to recognize the file and update the documentation for use with Help Center.

# How to create a new documentation

To create new documentation you'll first need to look at the current location on RTM where the documentation should be available. For example:

If you need to create a documentation related to the following URL: https://stage-console.azion.com/marketplace, then follow the process below:

- Get only the important path from the URL — in this case, `/marketplace`. The excluded path is the base URL, and it'll change depending on the environment (stage or production).
- With the /marketplace path in mind, create at the root of this project a new folder called `/marketplace` — only if hasn't been created already.
- Inside the folder, add a file named `index.md` and fill it with all related links inside the `docs:[]`.<br>
You should keep the `front-matter` wrapping notation, represented with the three dashes `---`:

    ```
    ---

    docs: [
    'Some marketplace doc',
    'Another marketplace doc',
    'A thrid marketplace doc',
    ]

    ---
    ```
- Using the example above, you'll need to add to the `/marketplace` folder the following sub-folders and files:
    <br>
    You'll notice that we need to create names, <b>replace spaces for dashes, and put all letters in lowercase</b>.
    See the full folder with the files structure:<br>
    ```
    📂marketplace
    ┗ 📄index.md
    ┣ 📂a-third-marketplace-doc
    ┃ ┗ 📄index.md
    ┣ 📂another-marketplace-doc
    ┃ ┗ 📄index.md
    ┗ 📂some-marketplace-doc
    ┃ ┗ 📄index.md
    ```
    <br>
Inside each index.md, you can add the documentation markdown content that will be rendered when the user clicks on one of the related links. You can see this behavior using the help-center-widget on stage or by the handoff file [help-center-widget handoff](https://www.figma.com/proto/ezVVnK0zecaNUytfnG3dXV/%5BINI-36%5D-Promote-Customer-Education-in-RTM?page-id=0%3A1&node-id=826%3A143924&viewport=5829%2C4709%2C0.35&scaling=min-zoom&starting-point-node-id=822%3A139652).

## Available CSS selectors to customize content 
If you need to use a selector that isn't described below, the `help-center-widget` project needs to be updated to support more selectors before you can use it here to write a documentation.

| Selector | Description |
| :--: | :-- |
| `h2` | Used for titles with more relevance, it's bigger than `h3`. |
| `h3` | Used for titles with less relevance, it's smaller than `h2`.|
| `p` | Use it for common paragraphs. |
| `ul` and `ol` | Used for wrap lists. |
| `li` | Used for list items. When used inside a `ul` it has a disc marker for each item, when used inside a `ol` it has a decimal marker. |
| `a` | Used for links inside the documentation. |
| `blockquote` | Used for a content inside a styled colored box. Most common use is to highlight a section, creating a visual block between paragraphs.  |

You'll also need to add `{: target=“_blank”}` after each link used in .md files in order to have them open in another tab:
[text with link](link){: target=“_blank”}

#### How can I validate a new documentation?

When creating or editing a documentation you can push the changes to the `dev` branch in order to publish them to RTM-stage and validate it with you peers.
Once the content is validated, you can create a pull request from the `dev` branch to the `main` branch in order to publish all changes to production.

Example of an ideal process flow:<br>
my-new-branch-with-new-docs > push to -> dev<br>
(after merging into dev, docs available in stage)<br><br>
dev > push to -> main<br>
(after merging into main, docs available in production) <br>

## Maintainers
- [**Education Team**](mailto:education@azion.com)
- [**Hannah Kahn**](mailto:hannah.kahn@azion.com)

<!-- Add your name here 😉 -->

If you run into any questions, feel free to drop us a line.
# How to integrate documentation for AZION site

<p align="center">
    <img src ="https://assets.azion.com/static/images/v3/open-graph/og-about-us.png" />
</p>

- [How does it work?](#how-is-it-working)
- [Architecture](#architecture)
    - [Azion Website](#azion-website)
        - [Pipeline files](#pipeline-files)
- [Important](#important-notes)


## Azion Site Deploy Status

![Production](https://github.com/aziontech/azion-site/workflows/PRODUCTION%20DELIVERY/badge.svg)
![Stage](https://github.com/aziontech/azion-site/workflows/STAGE%20DELIVERY/badge.svg)

The repositories shared between [azion-site](https://github.com/aziontech/azion-site/) and [Real Time Manager](https://console.azion.com)!


## How does it work?

The first use case is the markdown files converted to HTML and uploaded to a bucket on the Google Cloud Platform. This respective HTML files will be called by an API inside Azion Real-Time Manager. The second use case is when the markdown files are imported into some documentation files. Here is the [docs_en](https://github.com/aziontech/docs_en/) project link.

> EG: https://github.com/aziontech/docs_en/blob/f4bd620874740c432a1ec88daff706d16b5c160b/getting-started/2021-01-14-index.md

``` markdown
{% include docs_help_center/en/build-application/build/build-from-scratch/build-with-edge-application/index.md %}
{% include docs_help_center/en/build-application/build/build-from-scratch/select-the-setup-option/index.md %}
{% include docs_help_center/en/build-application/build/build-from-scratch/select-a-function/index.md %}
``` 

## Arichitecture

### Azion Website

This is how to publish and import the content into website:

![Azion website pipeline architecture](.github/docs/img/architecture.png)
https://drive.google.com/file/d/15GK9UGtWNAf83FVpLs9zO9-0V0J6_Kha/view?usp=sharing

- push/merge trigger an action into [azion-site](https://github.com/aziontech/azion-site/) repository
- [azion-site](https://github.com/aziontech/azion-site/) repository makes checkout of [docs_en](https://github.com/aziontech/docs_en/)
- [azion-site](https://github.com/aziontech/azion-site/)repository makes checkout of [docs_help_center](https://github.com/aziontech/docs_help_center/)
- [azion-site](https://github.com/aziontech/azion-site/) compiles the pages containing [docs_en](https://github.com/aziontech/docs_en/) including import of[docs_help_center](https://github.com/aziontech/docs_help_center/)
- publish to storage
- purge docs cache

#### Pipeline Files

Into `.github/workflows` we have two files used to dispatch [azion-site](https://github.com/aziontech/azion-site/) actions event:

- [trigger-azion-site.prod.yml](https://github.com/aziontech/docs_help_center/blob/main/.github/workflows/trigger-azion-site.prod.yml)
- [trigger-azion-site.stage.yml](https://github.com/aziontech/docs_help_center/blob/main/.github/workflows/trigger-azion-site.stage.yml)

This files perform a `curl` to [azion-site](https://github.com/aziontech/azion-site/) repository to start the build process.


## IMPORTANT NOTES

- The name of files can't contain special characters, accents, or space. Use only letters, numbers, - or _
- [docs_en](https://github.com/aziontech/docs_en/) the path should start with `docs_help_center/en/`.

> EG: {% include docs_help_center/en/[path]/[filename].[extension] %}
