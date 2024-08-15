#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import process from 'process';

const cwd = process.cwd();


//////////////
// utils.js //
//////////////

function readFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content;
}

function readJsonFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(content);

  return json;
}

function jsonToFile(jsonObj, filePath) {
  const jsonString = JSON.stringify(jsonObj, null, 2);

  fs.writeFile(filePath, jsonString, 'utf8', (err) => {
    if (err) {
      console.error('An error occurred while writing JSON to file:', err);
    } else {
      console.log('JSON has been written successfully to', filePath);
    }
  });
};

async function touchJsonFileResult(data, fileDist) {
  await jsonToFile(data, fileDist);
};

//////////////////
// end utils.js //
//////////////////

const massiveRedirect = {
	'pt-br': readJsonFile(`${cwd}/cicd/azion-massive-redirect-ptbr.json`),
	en: readJsonFile(`${cwd}/cicd/azion-massive-redirect-en.json`)
};


//////////////
// METHODS //
////////////

function rewriteRedirects(content, lang) {
	const redirectList = massiveRedirect[lang];

	for (const redirect of redirectList) {
		redirect.from = redirect.from.
			replace('https://www.azion.com', '').
			replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		redirect.moved = redirect.moved.replace('https://www.azion.com', '');

		let rgx = new RegExp(`\\(${redirect.from}\\)`, 'gm');
		content = content.replace(rgx, `(${redirect.moved})`);
	}

	return content;
};


async function touchFileResult(content, filePath) {
	fs.writeFile(filePath, content, 'utf8', (err) => {
		if (err) {
			return console.error(`Error writing file ${filePath}: ${err}`);
		}

		console.log(`File ${filePath} updated successfully.`);
	});
};


async function processDirectory(directory, lang) {
	fs.readdir(directory, { withFileTypes: true }, async (err, entries) => {
		if (err) {
			console.error('Error reading directory:', err);
			return;
		}

		for (const entry of entries) {
			const fullPath = path.join(directory, entry.name);

			if (entry.isDirectory()) {
				await processDirectory(fullPath, lang);
			} else if (entry.isFile()) {
				const markdown = readFile(fullPath);
				const parsed = matter(markdown);
				parsed.content = rewriteRedirects(parsed.content, lang);

				const updatedContent = matter.stringify(parsed.content, parsed.data);
				touchFileResult(updatedContent, fullPath);
			}
		};
	});
}

async function processFiles() {
	// await processDirectory('src/content/docs', 'pt-br');
	await processDirectory(`${cwd}/src/content/docs`, 'en');
};


///////////////////////
// PLAY IN THE GAME //
/////////////////////

await processFiles();

