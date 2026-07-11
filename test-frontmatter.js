import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

function findFilesRecursively(directory) {
	let dir = [];
	let files = [];

	try {
		dir = fs.readdirSync(directory);
	} catch {
		dir = [];
	}

	dir.forEach((item) => {
		const fullPath = path.join(directory, item);
		const stat = fs.statSync(fullPath);

		if (stat.isDirectory()) {
			files = files.concat(findFilesRecursively(fullPath));
		} else if (item.endsWith('.md') || item.endsWith('.mdx') || item.endsWith('.json')) {
			files.push(fullPath);
		}
	});

	return files;
}

const validate = {
	namespace: {
		duplicated: function (contentDir) {
			const files = findFilesRecursively(contentDir);
			const namespaceMap = new Map();

			for (const filePath of files) {
				const fileContent = fs.readFileSync(filePath, 'utf-8');
				let namespace;

				if (filePath.endsWith('.json')) {
					try {
						const jsonData = JSON.parse(fileContent);
						namespace = jsonData.namespace;
					} catch (error) {
						console.error(`Error parsing JSON in file ${filePath}:`, error);
						continue;
					}
				} else {
					const { data } = matter(fileContent);
					namespace = data.namespace;
				}

				if (!namespace) {
					console.warn(`Warning: The file ${filePath} is missing a 'namespace' field.`);
					process.exit(1);
				}

				if (namespaceMap.has(namespace)) {
					console.error(
						`Duplicate namespace found: '${namespace}' in file ${filePath} (also in ${namespaceMap.get(
							namespace
						)})`
					);
					process.exit(1);
				} else {
					namespaceMap.set(namespace, filePath);
				}
			}
		},
	},
	permalink: {
		format: function (contentDir) {
			const slugRegex = /^[a-z-0-9-|\/]+$/;
			const files = findFilesRecursively(contentDir);

			for (const filePath of files) {
				const fileContent = fs.readFileSync(filePath, 'utf-8');
				let permalink;

				if (filePath.endsWith('.json')) {
					try {
						const jsonData = JSON.parse(fileContent);
						permalink = jsonData.permalink;
					} catch (error) {
						console.error(`Error parsing JSON in file ${filePath}:`, error);
						process.exit(1);
					}
				} else {
					const { data } = matter(fileContent);
					permalink = data.permalink;
				}

				if (!permalink) {
					console.warn(`Warning: The file ${filePath} is missing a 'permalink' field.`);
					process.exit(1);
				}

				if (!slugRegex.test(permalink)) {
					console.error(
						`Invalid characters found in permalink '${permalink}' in file ${filePath}. Only lower letters, numbers, and hyphens are allowed.`
					);
					process.exit(1);
				}
			}
		},
		duplicated: function (contentDir) {
			const files = findFilesRecursively(contentDir);
			const permalinkMap = new Map();

			for (const filePath of files) {
				const fileContent = fs.readFileSync(filePath, 'utf-8');
				let permalink;

				if (filePath.endsWith('.json')) {
					try {
						const jsonData = JSON.parse(fileContent);
						permalink = jsonData.permalink;
					} catch (error) {
						console.error(`Error parsing JSON in file ${filePath}:`, error);
						continue;
					}
				} else {
					const { data } = matter(fileContent);
					permalink = data.permalink;
				}

				if (!permalink) {
					console.warn(`Warning: The file ${filePath} is missing a 'permalink' field.`);
					process.exit(1);
				}

				if (permalinkMap.has(permalink)) {
					console.error(
						`Duplicate permalink found: '${permalink}' in file ${filePath} (also in ${permalinkMap.get(
							permalink
						)})`
					);
					process.exit(1);
				} else {
					permalinkMap.set(permalink, filePath);
				}
			}
		},
	},
};

function pathjoin(folder, dir) {
	return path.join(process.cwd(), folder, dir);
}

validate.permalink.format(pathjoin('src', 'content'));

validate.permalink.duplicated(pathjoin('src', 'content/docs/en'));
validate.permalink.duplicated(pathjoin('src', 'content/docs/pt-br'));

validate.namespace.duplicated(pathjoin('src', 'content/docs/en'));
validate.namespace.duplicated(pathjoin('src', 'content/docs/pt-br'));
