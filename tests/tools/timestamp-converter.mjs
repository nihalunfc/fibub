// #T855 Timestamp converter
export const path = '/everyday/timestamp-converter/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/timestamp-converter/`); await page.waitForTimeout(300);
  const R = '.tc ';
  const cell = (tb, k) => page.evaluate(([tb, k]) => [...document.querySelectorAll(`.tc ${tb} tr`)].find((r) => r.querySelector('th').textContent === k)?.querySelector('td').textContent, [tb, k]);
  check((await cell('.tc-res', 'ISO 8601 (UTC)')) === '2023-11-14T22:13:20Z', 'timestamp-converter: 1700000000 is 2023-11-14T22:13:20Z');
  check((await cell('.tc-res', 'RFC 2822')) === 'Tue, 14 Nov 2023 22:13:20 +0000', `timestamp-converter: RFC 2822 (${await cell('.tc-res', 'RFC 2822')})`);
  await page.fill(R + '.tc-ts', '1700000000000'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.tc-note')).startsWith('Read as milliseconds') && (await cell('.tc-res', 'Unix seconds')) === '1700000000', 'timestamp-converter: 13 digits detected as ms');
  check((await cell('.tc-back', 'Unix seconds')) === '1700000000', 'timestamp-converter: 2023-11-14 22:13:20 UTC back to 1700000000');
  await page.selectOption(R + '.tc-zone', 'Asia/Kolkata'); await page.selectOption(R + '.tc-dzone', 'zone'); await page.waitForTimeout(100);
  check((await cell('.tc-back', 'Unix seconds')) === String(1700000000 - 19800) && (await cell('.tc-res', 'Asia/Kolkata')).includes('2023-11-15 03:43:20 (UTC+05:30)'), 'timestamp-converter: Kolkata zone both ways');
  await page.fill(R + '.tc-ts', 'abc'); await page.waitForTimeout(100);
  check((await page.$eval(R + '.tc-note', (e) => e.classList.contains('err'))), 'timestamp-converter: bad input shows error');
};
