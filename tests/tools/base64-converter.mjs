// #T877 Base64 converter
export const path = '/everyday/base64-converter/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/base64-converter/`); await page.waitForTimeout(300);
  const R = '.bc ';
  check((await page.inputValue(R + '.bc-b64')) === 'aMOpbGxv', 'base64: héllo -> aMOpbGxv on load');
  await page.fill(R + '.bc-b64', 'aMOpbGxv'); await page.waitForTimeout(80);
  check((await page.inputValue(R + '.bc-text')) === 'héllo' && (await page.isHidden(R + '.bc-err')), 'base64: decodes back to héllo');
  await page.fill(R + '.bc-text', '??>'); await page.waitForTimeout(80);
  const std = await page.inputValue(R + '.bc-b64');
  await page.check(R + '.bc-safe'); await page.waitForTimeout(80);
  check(std === 'Pz8+' && (await page.inputValue(R + '.bc-b64')) === 'Pz8-', 'base64: URL-safe swaps + for -');
  await page.fill(R + '.bc-text', 'ab'); await page.waitForTimeout(80);
  check((await page.inputValue(R + '.bc-b64')) === 'YWI', 'base64: URL-safe drops =');
  await page.fill(R + '.bc-b64', 'ab%cd'); await page.waitForTimeout(80);
  check(await page.isVisible(R + '.bc-err'), 'base64: invalid input shows an error');
  await page.setInputFiles(R + '.bc-file', { name: 'a.txt', mimeType: 'text/plain', buffer: Buffer.from('hi') });
  await page.check(R + '.bc-data'); await page.waitForTimeout(150);
  check((await page.inputValue(R + '.bc-fout')) === 'data:text/plain;base64,aGk=', 'base64: file to data: URL');
};
