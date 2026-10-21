import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export const en = { '00': require('./en/00.json'), '01': require('./en/01.json') };
export const pt = { '00': require('./pt-br/00.json'), '01': require('./pt-br/01.json') };
