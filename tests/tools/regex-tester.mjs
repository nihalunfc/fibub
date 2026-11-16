// #T853 Regex tester
export const path = '/everyday/regex-tester/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/regex-tester/`); await page.waitForTimeout(300);
  const R = '.rt ';
  const out = () => page.textContent(R + '.rt-out');
  check((await out()).startsWith('2 matches'), `regex-tester: example finds 2 matches (${await out()})`);
  const cell = await page.textContent(R + '.rt-list tbody tr:first-child td:nth-child(4)');
  check(cell.includes('$1 = "555"'), `regex-tester: group 1 is 555 (${cell})`);
  check((await page.textContent(R + '.rt-repout')) === 'call 1234 or 9876', 'regex-tester: replace $2 gives "call 1234 or 9876"');
  check((await page.locator(R + '.rt-hl mark').count()) === 2, 'regex-tester: 2 highlights');
  await page.fill(R + '.rt-in', '(?<area>\\d{3})-'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rt-list tbody tr:first-child td:nth-child(4)')).includes('<area> = "555"'), 'regex-tester: named group shown');
  await page.fill(R + '.rt-in', '('); await page.waitForTimeout(100);
  check((await out()).startsWith('That pattern is not valid'), `regex-tester: bad pattern shows error (${await out()})`);
  await page.selectOption(R + '.rt-preset', { label: 'Whole numbers' }); await page.waitForTimeout(100);
  check((await out()).startsWith('3 matches'), `regex-tester: preset whole numbers finds 3 (${await out()})`);
  await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => (d.open = true)));
  check((await page.textContent(R + '.rt-explain')).includes('1 or more times') && (await page.textContent(R + '.rt-explain')).includes('a digit'), 'regex-tester: explanation of -?\\d+');
  await page.fill(R + '.rt-in', ','); await page.fill(R + '.rt-text', 'a,b'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.rt-split')) === '1: "a"\n2: "b"', 'regex-tester: split preview');
};
