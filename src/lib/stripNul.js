// React 18's streaming server renderer (the islands' HTML) can leave a NUL byte in the page when a
// multi-byte character (→, é) falls at the end of its 2 KB output buffer: the buffer is sent with
// the byte it couldn't fill. Browsers drop it, but crawlers and tools then treat the page as
// binary. Which page gets one moves with the content, so every built page is cleaned after the
// build. A 0x00 byte is always a NUL in UTF-8 (never part of another character).
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export function withoutNul(bytes) {
  return bytes.includes(0) ? Buffer.from(bytes.filter((b) => b !== 0)) : bytes;
}

// The Astro integration (astro.config.mjs).
export function stripNulBytes() {
  return {
    name: 'strip-nul-bytes',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        let fixed = 0;
        for (const name of await readdir(root, { recursive: true })) {
          if (!name.endsWith('.html')) continue;
          const file = join(root, name);
          const bytes = await readFile(file);
          const clean = withoutNul(bytes);
          if (clean !== bytes) {
            await writeFile(file, clean);
            fixed++;
          }
        }
        if (fixed) logger.info('removed NUL bytes from ' + fixed + ' page(s)');
      },
    },
  };
}
