import fs from 'node:fs';
import glob from 'fast-glob';
import matter from 'gray-matter';
import kleur from 'kleur';

/**
 * Makes sure that every translation has an English counterpart.
 *
 * Translations are paired with English pages by the frontmatter `namespace`, not by file
 * path: translated pages carry translated file names and `permalink`s on purpose.
 */
class SlugChecker {
	async run() {
		const errors = await this.#findOrphanTranslations();
		this.#outputResult(errors);
	}

	/** Load all Markdown pages and check non-English pages have a counterpart in `en/`. */
	async #findOrphanTranslations() {
		const files = (await glob('./src/content/docs/**/*.{md,mdx}')).sort().map((file) => {
			const [, lang, slug] = file.replace('./src/content/docs/', '').match(/^([^/]+)\/(.+)$/);
			const namespace = matter(fs.readFileSync(file, 'utf8')).data.namespace;
			return { lang, slug, namespace };
		});

		const enNamespaces = new Set(
			files.filter(({ lang }) => lang === 'en').map(({ namespace }) => namespace)
		);

		/** @type {Record<string, string[]>} */
		const errorMap = {};
		for (const { lang, slug, namespace } of files) {
			if (lang === 'en' || (namespace && enNamespaces.has(namespace))) continue;
			(errorMap[lang] ??= []).push(slug);
		}
		return Object.entries(errorMap);
	}

	/**
	 * Print the result of the slug check to the console.
	 * @param {[lang: string, slugs: string[]][]} errors
	 */
	#outputResult(errors) {
		if (errors.length === 0) {
			console.log(kleur.green().bold(`\n*** Found no translations with mismatched slugs\n`));
			return;
		}
		const prefix = kleur.gray(`  [${kleur.red().bold(' ✖ ')}] `);
		let errorCount = 0;
		for (const [lang, slugs] of errors) {
			errorCount += slugs.length;
			const summary = [`\n/${lang}/`, ...slugs.map((slug) => prefix + slug)];
			console.error(summary.join('\n'));
		}
		console.error(kleur.red().bold(`\n*** Found ${errorCount} translations with mismatched slugs`));
		console.error(
			'    Each file listed has no English page with the same `namespace` frontmatter\n'
		);
		process.exit(1);
	}
}

const checker = new SlugChecker();
checker.run();
