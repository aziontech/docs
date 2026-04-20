import * as fs from 'fs';
import algoliasearch from 'algoliasearch';
import StreamArray from 'stream-json/streamers/StreamArray';

// Constants
const MAX_RECORD_SIZE_BYTES = 100_000; // Algolia's limit is 100KB per record
const BATCH_SIZE = 10_000;

// Types
interface AlgoliaConfig {
  app: string;
  api: string;
}

interface FilePathConfig {
  en: string;
  ptbr: string;
}

interface Config {
  key: AlgoliaConfig;
  filepath: FilePathConfig;
}

interface AlgoliaRecord {
  objectID?: string;
  [key: string]: unknown;
}

/**
 * Parse command line arguments to extract app ID and API key
 */
function parseArgs(): AlgoliaConfig {
  const args = process.argv;

  const appMatch = args.find((arg) => arg.startsWith('app='));
  const apiMatch = args.find((arg) => arg.startsWith('api='));

  return {
    app: appMatch?.replace('app=', '') || '',
    api: apiMatch?.replace('api=', '') || '',
  };
}

/**
 * Calculate the byte size of a record when serialized to JSON
 */
function getRecordSize(record: AlgoliaRecord): number {
  return Buffer.byteLength(JSON.stringify(record), 'utf-8');
}

/**
 * Validate a record against Algolia's size limit
 */
function validateRecord(
  record: AlgoliaRecord,
  maxSize: number = MAX_RECORD_SIZE_BYTES
): { valid: boolean; size: number } {
  const size = getRecordSize(record);
  return {
    valid: size <= maxSize,
    size,
  };
}

/**
 * Process and upload records to an Algolia index from a JSON file
 */
async function uploadBatches(
  index: ReturnType<ReturnType<typeof algoliasearch>['initIndex']>,
  filepath: string
): Promise<void> {
  // Validate file exists
  const stats = await fs.promises.stat(filepath);
  if (!stats.isFile()) {
    throw new Error(`[!] ${filepath} is not a file or does not exist.`);
  }

  if (!index) {
    throw new Error('[!] An Algolia Index should be configured.');
  }

  // Clear existing objects first
  await index.clearObjects();

  return new Promise((resolve, reject) => {
    const chunkList: AlgoliaRecord[] = [];
    let recordPosition = 0;
    let skippedCount = 0;

    const stream = fs
      .createReadStream(filepath)
      .pipe(StreamArray.withParser());

    stream.on('data', ({ value }: { value: AlgoliaRecord }) => {
      recordPosition++;
      const validation = validateRecord(value);

      if (!validation.valid) {
        console.warn(
          `[WARN] Skipping record at position ${recordPosition} ` +
            `(objectID: ${value.objectID || 'N/A'}, ` +
            `size: ${validation.size}/${MAX_RECORD_SIZE_BYTES} bytes)`
        );
        skippedCount++;
        return;
      }

      chunkList.push(value);

      if (chunkList.length === BATCH_SIZE) {
        stream.pause();

        index
          .saveObjects(chunkList, { autoGenerateObjectIDIfNotExist: true })
          .then(() => {
            chunkList.length = 0;
            stream.resume();
          })
          .catch((error) => {
            console.error('[ERROR] Failed to save batch:', error);
            reject(error);
          });
      }
    });

    stream.on('end', async () => {
      if (chunkList.length === 0) {
        console.log(
          `[INFO] Completed: ${filepath} - ` +
            `Processed: ${recordPosition}, Skipped: ${skippedCount}`
        );
        resolve();
        return;
      }

      try {
        await index.saveObjects(chunkList, {
          autoGenerateObjectIDIfNotExist: true,
        });
        console.log(
          `[SUCCESS] saveObjects: ${filepath} - ` +
            `Processed: ${recordPosition}, Skipped: ${skippedCount}`
        );
        resolve();
      } catch (error) {
        console.error('[ERROR] Failed to save final batch:', error);
        reject(error);
      }
    });

    stream.on('error', (error: Error) => {
      console.error(`[ERROR] Stream error for ${filepath}:`, error);
      reject(error);
    });
  });
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  const args = parseArgs();

  const config: Config = {
    key: {
      app: args.app,
      api: args.api,
    },
    filepath: {
      en: './dist/en/doc-all-data.json',
      ptbr: './dist/pt-br/doc-all-data.json',
    },
  };

  if (!config.key.app || !config.key.api) {
    throw new Error(
      '[!] Invalid arguments. Usage: tsx algolia-reindex.ts app=<APP_ID> api=<API_KEY>'
    );
  }

  const client = algoliasearch(config.key.app, config.key.api);

  // Process both indices in parallel
  await Promise.all([
    uploadBatches(client.initIndex('azion-doc-en'), config.filepath.en),
    uploadBatches(client.initIndex('azion-doc-ptbr'), config.filepath.ptbr),
  ]);

  console.log('[INFO] Algolia reindex completed successfully.');
}

// Execute
main().catch((error) => {
  console.error('[FATAL]', error.message || error);
  process.exit(1);
});
