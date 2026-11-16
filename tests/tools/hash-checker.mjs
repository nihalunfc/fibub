// #T852 Hash checker
export const path = '/everyday/hash-checker/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/hash-checker/`); await page.waitForSelector('.hc li[data-a="MD5"] .hc-val');
  await page.waitForTimeout(200);
  const R = '.hc ', val = (a) => page.textContent(`${R}li[data-a="${a}"] .hc-val`);
  check((await val('SHA-256')) === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad', 'hash: SHA-256 of abc');
  check((await val('MD5')) === '900150983cd24fb0d6963f7d28e17f72' && (await val('SHA-1')) === 'a9993e364706816aba3e25717850c26c9cd0d89d', 'hash: MD5 and SHA-1 of abc');
  await page.fill(R + '.hc-exp', 'BA7816BF8F01CFEA414140DE5DAE2223B00361A396177A9CB410FF61F20015AD'); await page.waitForTimeout(80);
  check((await page.textContent(R + '.hc-cmp')).startsWith('Match: this is the SHA-256'), 'hash: compare matches, any case');
  await page.fill(R + '.hc-exp', '00'); await page.waitForTimeout(80);
  check((await page.textContent(R + '.hc-cmp')).startsWith('No match'), 'hash: compare no match');
  await page.click(R + '.hc-tabs button[data-m="file"]');
  await page.setInputFiles(R + '.hc-file', { name: 'a.txt', mimeType: 'text/plain', buffer: Buffer.from('abc') }); await page.waitForTimeout(300);
  check((await val('MD5')) === '900150983cd24fb0d6963f7d28e17f72' && (await page.textContent(R + '.hc-info')).includes('a.txt'), 'hash: file input works');
  await page.click(R + '.hc-tabs button[data-m="text"]');
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  await page.fill(R + '.hc-text', 'The quick brown fox jumps over the lazy dog'); await page.fill(R + '.hc-key', 'key'); await page.waitForTimeout(300);
  check((await val('HMAC-SHA-256')) === 'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8', 'hash: HMAC-SHA-256 known value');
  await page.selectOption(R + '.hc-fmt', 'HEX'); await page.waitForTimeout(100);
  check((await val('HMAC-SHA-256')) === 'F7BC83F430538424B13298E6AA6FB143EF4D59A14946175997479DBC2D1A3CD8', 'hash: upper-case format');
};
