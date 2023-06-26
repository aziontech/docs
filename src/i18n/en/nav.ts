/**
 * This configures the navigation sidebar.
 * All other languages follow this ordering/structure and will fall back to
 * English for any entries they haven’t translated.
 *
 * - All entries MUST include `text` and `key`
 * - Heading entries MUST include `header: true` and `type`
 * - Link entries MUST include `slug` (which excludes the language code)
 */
export default [
	{ text: 'Documentation', header: true, slug: 'documentation', type: 'learn', key: 'documentation' },
	{ text: 'Home', slug: 'documentation', key: 'documentation' },
	{ text: 'Guides', slug: 'guides', key: 'guides' },
	{ text: 'Dev Tools', slug: 'devTools', key: 'devTools' },
	{ text: 'Learn', slug: 'Learn', key: 'Learn' },

	{ text: 'Start Here', header: true, type: 'learn', key: 'startHere' },
	{ text: 'Getting Started', slug: 'astro/getting-started', key: 'getting-started' },
	{ text: 'Installation', slug: 'astro/install/auto', key: 'install' },
	{ text: 'Editor Setup', slug: 'astro/editor-setup', key: 'editor-setup' },
	{ text: 'Upgrade to v2', slug: 'astro/guides/upgrade-to/v2', key: 'guides/upgrade-to/v2' },

	{ text: 'Core Concepts', header: true, type: 'learn', key: 'coreConcepts' },
	{ text: 'Why Astro', slug: 'astro/concepts/why-astro', key: 'concepts/why-astro' },
	{ text: 'MPA vs. SPA', slug: 'astro/concepts/mpa-vs-spa', key: 'concepts/mpa-vs-spa' },
	{ text: 'Astro Islands', slug: 'astro/concepts/islands', key: 'concepts/islands' },

	{ text: 'Tutorials', header: true, type: 'learn', key: 'tutorials' },
	{ text: 'Build a Blog', slug: 'astro/tutorial/0-introduction', key: 'blog-tutorial' },
	// { text: 'Thinking with Islands', slug: 'astro/tutorial/0-introduction', key: 'island-tutorial' },

	{ text: 'Basics', header: true, type: 'learn', key: 'basics' },

	{
		text: 'Project Structure',
		slug: 'astro/core-concepts/project-structure',
		key: 'core-concepts/project-structure',
	},
	{
		text: 'Components',
		slug: 'astro/core-concepts/astro-components',
		key: 'core-concepts/astro-components',
	},
	{ text: 'Pages', slug: 'astro/core-concepts/astro-pages', key: 'core-concepts/astro-pages' },
	{ text: 'Layouts', slug: 'astro/core-concepts/layouts', key: 'core-concepts/layouts' },

	{ text: 'Recipes', header: true, type: 'learn', key: 'examples' },
	{ text: 'Migrate to Astro', slug: 'astro/guides/migrate-to-astro', key: 'guides/migrate-to-astro' },
	{ text: 'Connect a CMS', slug: 'astro/guides/cms', key: 'guides/cms' },
	{ text: 'Add backend services', slug: 'astro/guides/backend', key: 'guides/backend' },
	{ text: 'Add integrations', slug: 'astro/guides/integrations-guide', key: 'guides/integrations-guide' },
	{ text: 'Deploy your site', slug: 'astro/guides/deploy', key: 'guides/deploy' },
	{ text: 'More recipes', slug: 'astro/recipes', key: 'guides/recipes' },

	{ text: 'Guides', header: true, type: 'learn', key: 'features' },
	{
		text: 'Astro Template Syntax',
		slug: 'astro/core-concepts/astro-syntax',
		key: 'core-concepts/astro-syntax',
	},
	{
		text: 'UI Frameworks',
		slug: 'astro/core-concepts/framework-components',
		key: 'core-concepts/framework-components',
	},
	{ text: 'Routing', slug: 'astro/core-concepts/routing', key: 'core-concepts/routing' },
	{ text: 'Markdown & MDX', slug: 'astro/guides/markdown-content', key: 'guides/markdown-content' },
	{
		text: 'Content Collections',
		slug: 'astro/guides/content-collections',
		key: 'guides/content-collections',
	},
	{
		text: 'Scripts & Event Handling',
		slug: 'astro/guides/client-side-scripts',
		key: 'guides/client-side-scripts',
	},
	{ text: 'CSS & Styling', slug: 'astro/guides/styling', key: 'guides/styling' },
	{ text: 'Assets (Experimental)', slug: 'astro/guides/assets', key: 'guides/assets' },
	{ text: 'Images', slug: 'astro/guides/images', key: 'guides/images' },
	{ text: 'Fonts', slug: 'astro/guides/fonts', key: 'guides/fonts' },
	{ text: 'Imports', slug: 'astro/guides/imports', key: 'guides/imports' },
	{
		text: 'Server-side Rendering (SSR)',
		slug: 'astro/guides/server-side-rendering',
		key: 'guides/server-side-rendering',
	},
	{ text: 'Endpoints', slug: 'astro/core-concepts/endpoints', key: 'core-concepts/endpoints' },
	{ text: 'Data Fetching', slug: 'astro/guides/data-fetching', key: 'guides/data-fetching' },
	{ text: 'Middleware (experimental)', slug: 'astro/guides/middleware', key: 'guides/middleware' },
	{ text: 'Testing', slug: 'astro/guides/testing', key: 'guides/testing' },
	{ text: 'Troubleshooting', slug: 'astro/guides/troubleshooting', key: 'guides/troubleshooting' },

	{ text: 'Configuration', header: true, type: 'learn', key: 'configuration' },
	{
		text: 'The Astro Config File',
		slug: 'astro/guides/configuring-astro',
		key: 'guides/configuring-astro',
	},
	{ text: 'TypeScript', slug: 'astro/guides/typescript', key: 'guides/typescript' },
	{ text: 'Import Aliases', slug: 'astro/guides/aliases', key: 'guides/aliases' },
	{
		text: 'Environment Variables',
		slug: 'astro/guides/environment-variables',
		key: 'guides/environment-variables',
	},

	{ text: 'Reference', header: true, type: 'api', key: 'reference' },
	{
		text: 'Configuration',
		slug: 'astro/reference/configuration-reference',
		key: 'reference/configuration-reference',
	},
	{ text: 'Runtime API', slug: 'astro/reference/api-reference', key: 'reference/api-reference' },
	{
		text: 'Integrations API',
		slug: 'astro/reference/integrations-reference',
		key: 'reference/integrations-reference',
	},
	{ text: 'Adapter API', slug: 'astro/reference/adapter-reference', key: 'reference/adapter-reference' },
	{
		text: 'Image Service API',
		slug: 'astro/reference/image-service-reference',
		key: 'reference/image-service-reference',
	},
	{
		text: 'Template Directives',
		slug: 'astro/reference/directives-reference',
		key: 'reference/directives-reference',
	},
	{ text: 'The Astro CLI', slug: 'astro/reference/cli-reference', key: 'reference/cli-reference' },
	{
		text: 'Error Reference',
		slug: 'astro/reference/error-reference',
		key: 'reference/error-reference',
	},
	{ text: 'NPM Package Format', slug: 'astro/reference/publish-to-npm', key: 'guides/publish-to-npm' },

] as const;
