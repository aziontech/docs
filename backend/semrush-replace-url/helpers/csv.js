import { parse } from 'csv-parse';
import { createReadStream } from 'fs';

export async function read(filepath) {
  const redirects = [];
  const parser = createReadStream(filepath).pipe(
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
