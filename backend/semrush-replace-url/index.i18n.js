import { parse } from 'csv-parse';
import { promises as fs } from 'fs';
import { createReadStream } from 'fs';
import path from 'path';

let counterFoundLinks = 0;
const PATH = {
  csv: './www.azion.com_permanent_redirects_20241225.csv',
  i18n: `${process.env.OLDPWD}/src/i18n`
};
const wwwazioncom = 'https://www.azion.com';
const removeLangFromUrl = (url) => url.replace('/pt-br', '').replace('/en', '');
const removeHostFromUrl = (url) => url.replace(wwwazioncom, '');
const removeHostAndLangFromUrl = (url) => removeLangFromUrl(removeHostFromUrl(url));
const isFromRoot = (url) => url === wwwazioncom;

async function loadRedirects() {
  const redirects = [];
  const parser = createReadStream(PATH.csv).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
    })
  );

  try {
    for await (const record of parser) {
      redirects.push({
        page: record.page,
        initialUrl: record.initial_url,
        destinationUrl: record.destination_url,
        statusCode: record.status,
        discovered: record.discovered
      });
    }
    return redirects;
  } catch (error) {
    throw new Error(`Error loading redirects: ${error.message}`);
  }
}

async function processFile(filePath, redirects) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    let newContent = content;
    let fileModified = false;

    for (const item of redirects) {
      const url30x = isFromRoot(item.initialUrl) ? wwwazioncom : removeHostAndLangFromUrl(item.initialUrl);
      const url200 = removeHostAndLangFromUrl(item.destinationUrl);
      const isRoot = isFromRoot(url30x);
      const rgx = new RegExp(`'${url30x}'`, 'g');
      const contentMatch = newContent.match(rgx);

      if (!contentMatch) continue;

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

      newContent = newContent.replace(
        isRoot ? /'https\:\/\/www\.azion\.com\/'/ : rgx,
        `'${url200}'`
      );
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
    const redirects = await loadRedirects();
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
