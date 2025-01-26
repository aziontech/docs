// import matter from 'gray-matter'
import { promises as fs } from 'fs';
import path from 'path'

import { read as readcsv } from './helpers/csv.js';
import { removeHostFromUrl, removeHostAndLangFromUrl, wwwazioncom, isFromRoot } from './helpers/url.js';

let counterFoundLinks = 0
let PATH = {
	csv: './www.azion.com_permanent_redirects_20241225.csv',
	docs: `${process.env.OLDPWD}/src/content/docs`
}

function findReplace(content, oldUrl, newUrl) {
	return content.replace(oldUrl, newUrl)
}

async function processFile(filePath, redirects) {
	try {
		let fileModified = false;

		const content = await fs.readFile(filePath, 'utf-8');
		let newContent = content;

		for (const item of redirects) {
			const pagePermalink = removeHostFromUrl(item.page)
			const url30x = isFromRoot(item.initialUrl) ? wwwazioncom() : removeHostFromUrl(item.initialUrl);
			const url200 = removeHostFromUrl(item.destinationUrl)
			const isRoot = isFromRoot(url30x)
			const rgx = new RegExp(`\\(${url30x}\\)`, 'g')
			const contentMatch = newContent.match(rgx)

			if(!contentMatch) continue
			
			counterFoundLinks++
			fileModified = true

			newContent = findReplace(newContent, isRoot ? /\\(https\:\/\/www\.azion\.com\/\\)/ : rgx, `(${url200})`)

			console.log(`{
			isRoot: ${isRoot},
			pagePermalink: ${pagePermalink},
			file: ${filePath},
			rgx: ${rgx},
			initialUrl: ${item.initialUrl},
			url30x: ${url30x},
			url200: ${url200},
			contentMatch: ${contentMatch},
			contentMatchCount: ${contentMatch.length},
			processedCount: ${counterFoundLinks}
			}`)
			
			if(fileModified){
				await fs.writeFile(filePath, newContent)
				console.log(`[OK] ${filePath} updated`);
			}
		}
	}
	catch (error) {
		console.error(`[ERROR] Processing file ${filePath}:`, error);
	}
}

async function processDirectory(directory, redirects) {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    const processingPromises = entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      
      if (entry.isDirectory()) {
        return processDirectory(fullPath, redirects);
      } else if (entry.isFile()) {
        return processFile(fullPath, redirects);
      } else {
        console.warn(`[WARN] ${fullPath} is not a file or directory`);
      }
    });

    await Promise.all(processingPromises);
  } catch (error) {
    console.error(`[ERROR] Processing directory ${directory}:`, error);
  }
}

async function main() {
	try {
		console.log('[INFO] Loading redirects...');
    const redirects = await readcsv(PATH.csv);
    console.log(`[INFO] Loaded ${redirects.length} redirects`);
    
    console.log('[INFO] Starting directory processing...');
		await processDirectory(PATH.docs, redirects)
		console.log(`[INFO] Processing complete. Found and replaced ${counterFoundLinks} links`);
	} catch (error) {
		console.error('[ERROR] Fatal error:', error);
		process.exit(1)
	}
}

main()
