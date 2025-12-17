import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the Service Worker file
const swPath = join(__dirname, '../public/sw.js');

// Read the SW file content
const swContent = readFileSync(swPath, 'utf8');

// Extract the `shouldCache` function using regex
// We match the function definition block.
const shouldCacheMatch = swContent.match(/function shouldCache\(url\) \{([\s\S]*?)\n\}/);

if (!shouldCacheMatch) {
  throw new Error("Could not find 'function shouldCache(url)' in public/sw.js");
}

const shouldCacheBody = shouldCacheMatch[1];

// Create a new function from the extracted body
const shouldCache = new Function('url', shouldCacheBody);

test('Service Worker Caching Logic', async (t) => {
  
  await t.test('should cache root URL', () => {
    const url = new URL('http://localhost:3000/');
    assert.strictEqual(shouldCache(url), true);
  });

  await t.test('should NOT cache Next.js internal resources', () => {
    const url = new URL('http://localhost:3000/_next/static/chunks/main.js');
    assert.strictEqual(shouldCache(url), false);
  });

  await t.test('should NOT cache API routes', () => {
    const url = new URL('http://localhost:3000/api/hello');
    assert.strictEqual(shouldCache(url), false);
  });

  await t.test('should NOT cache RSC requests (with _rsc param)', () => {
    const url = new URL('http://localhost:3000/today?_rsc=12345');
    assert.strictEqual(shouldCache(url), false);
  });

  await t.test('should cache standard navigation', () => {
    const url = new URL('http://localhost:3000/today');
    assert.strictEqual(shouldCache(url), true);
  });

  await t.test('should cache assets', () => {
    const url = new URL('http://localhost:3000/icons/icon.png');
    assert.strictEqual(shouldCache(url), true);
  });
});
