import { promises as fs } from 'fs';
import path from 'path';

import { wwwazioncom, removeHostAndLangFromUrl, isFromRoot } from './helpers/url.js';
import { read as readcsv } from './helpers/csv.js';

let counterFoundLinks = 0;
const PATH = {
  csv: './www.azion.com_permanent_redirects_20241225.csv',
  i18n: `${process.env.OLDPWD}/src/i18n`
};

async function processFile(filePath, redirects) {
  try {
    let newContent = await fs.readFile(filePath, 'utf-8');
    let fileModified = false;

    for (const item of redirects) {
      const url30x = isFromRoot(item.initialUrl) ? wwwazioncom() : removeHostAndLangFromUrl(item.initialUrl);
      const url200 = removeHostAndLangFromUrl(item.destinationUrl);
      const isRoot = isFromRoot(url30x);
      
			const rgx = new RegExp(`'${url30x}'`, 'g');
      const contentMatch = newContent.match(rgx);

			const rgxSingleQuote = new RegExp(`'${url30x}'`, 'g');
			const rgxDoubleQuote = new RegExp(`"${url30x}"`, 'g');
			
			const contentMatchSingleQuote = newContent.match(rgxSingleQuote);
			const contentMatchDoubleQuote = newContent.match(rgxDoubleQuote);

      if (!contentMatchSingleQuote || !contentMatchDoubleQuote) continue;

			counterFoundLinks++;
      fileModified = true;

      console.log({
        isRoot,
        file: filePath,
        rgx: rgx.toString(),
        url30x,
        url200,
        contentMatchCount: contentMatch.length,
        processedCount: counterFoundLinks
      });

			if(contentMatchSingleQuote.length) {
				newContent = newContent.replace(
					isRoot ? /'https\:\/\/www\.azion\.com\/'/ : rgx,
					`'${url200}'`
				);
			}

			if(contentMatchDoubleQuote.length) {
				newContent = newContent.replace(
					isRoot ? /"https\:\/\/www\.azion\.com\/"çççç/ : rgx,
					`'${url200}'`
				);
			}
    }

    if (fileModified) {
      await fs.writeFile(filePath, newContent);
      console.log(`[OK] ${filePath} updated`);
    }
  } catch (error) {
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
    await processDirectory(PATH.i18n, redirects);
    console.log(`[INFO] Processing complete. Found and replaced ${counterFoundLinks} links`);
  } catch (error) {
    console.error('[ERROR] Fatal error:', error);
    process.exit(1);
  }
}

main();
