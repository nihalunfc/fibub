// #T854 UUID generator
export const path = '/everyday/uuid-generator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/uuid-generator/`); await page.waitForTimeout(300);
  const R = '.ug ';
  const lines = async () => (await page.inputValue(R + '.ug-out')).split('\n').filter(Boolean);
  await page.fill(R + '[data-k="count"]', '10'); await page.waitForTimeout(100);
  let l = await lines();
  const V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  check(l.length === 10 && new Set(l).size === 10 && l.every((u) => V4.test(u)), `uuid-generator: 10 unique v4 UUIDs (${l.length})`);
  await page.selectOption(R + '[data-k="ver"]', '7'); await page.waitForTimeout(100);
  l = await lines();
  check(l.every((u) => u[14] === '7' && /[89ab]/.test(u[19])) && [...l].sort().join() === l.join(), 'uuid-generator: v7 version digit is 7 and list is in order');
  await page.check(R + '[data-k="upper"]'); await page.check(R + '[data-k="nohyphen"]'); await page.waitForTimeout(100);
  l = await lines();
  check(l.every((u) => /^[0-9A-F]{32}$/.test(u)), 'uuid-generator: upper case without hyphens');
  check((await page.textContent(R + '.ug-verdict')).includes('version 4'), 'uuid-generator: example validates as version 4');
  await page.fill(R + '.ug-check', 'not-a-uuid'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ug-verdict')).startsWith('Not a UUID'), 'uuid-generator: rejects a bad UUID');
};
