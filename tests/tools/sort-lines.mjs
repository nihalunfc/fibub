// #T856 Sort lines
export const path = '/everyday/sort-lines/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/sort-lines/`); await page.waitForTimeout(300);
  const R = '.sl ';
  const out = () => page.inputValue(R + '.sl-out');
  const cnt = () => page.textContent(R + '.sl-count');
  check((await out()).split('\n')[0] === 'apple' && (await out()).includes('item 9\nitem 10'), 'sort-lines: example sorts naturally');
  await page.fill(R + '.sl-in', 'b\na\nB\n10\n9'); await page.waitForTimeout(100);
  check((await out()) === '9\n10\na\nb\nB', `sort-lines: natural sort gives 9,10,a,b,B (${JSON.stringify(await out())})`);
  await page.selectOption(R + '[data-k="order"]', 'az'); await page.waitForTimeout(100);
  check((await out()) === '10\n9\na\nb\nB', 'sort-lines: A to Z compares digits as text');
  await page.check(R + '[data-k="dedupe"]'); await page.check(R + '[data-k="nocase"]'); await page.waitForTimeout(100);
  check((await out()).split('\n').length === 4 && (await cnt()).includes('1 duplicate removed'), `sort-lines: case-insensitive dedupe leaves 4 (${await cnt()})`);
  await page.fill(R + '.sl-in', 'x\n\n  \ny\n'); await page.waitForTimeout(100);
  check((await cnt()).startsWith('4 lines in, 2 lines out: 2 blank lines removed'), `sort-lines: blank lines counted (${await cnt()})`);
  await page.check(R + '[data-k="num"]'); await page.waitForTimeout(100);
  check((await out()) === '1. x\n2. y', 'sort-lines: line numbers');
};
