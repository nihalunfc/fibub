// #L325 Log explorer
export const path = '/learn/log-exp-explorer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/log-exp-explorer/`); await page.waitForTimeout(300);
  const out = async () => (await page.textContent('.lgx .lgx-out')).trim();
  check((await out()) === '2^3 = 8, so log base 2 of 8 = 3', 'log-exp-explorer: 2^3 = 8 ' + await out());
  await page.fill('.lgx .lgx-b', '5');
  check((await out()).startsWith('5^3 = 125'), 'log-exp-explorer: base 5 gives 125');
  await page.click('.lgx [data-level="12"]');
  check(await page.isVisible('.lgx .lgx-laws'), 'log-exp-explorer: Grade 12 shows the laws');
  const t = (await page.textContent('.lgx .lgx-laws')).replace(/\s+/g, ' ');
  check(t.includes('2.408'), 'log-exp-explorer: log 8 + log 32 = log 256 = 2.408 ' + t);
  { const a = await page.getAttribute('.lgx .lq-item', 'data-ans'); await page.fill('.lgx .lq-in', a); await page.click('.lgx .lq-check');
    check((await page.textContent('.lgx .lq-fb')) === 'Right.', 'log-exp-explorer: quiz accepts the right answer'); }
};
