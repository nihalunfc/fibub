// #T879 Health insurance waiting period timeline
export const path = '/money/waiting-periods/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/money/waiting-periods/?today=2026-06-01`); await page.waitForTimeout(300);
  const set = async (sel, v) => { await page.fill(`.wtp ${sel}`, v); await page.waitForTimeout(80); };
  const dates = async () => page.$$eval('.wtp .wtp-list li', (l) => l.map((e) => e.dataset.date));
  await set('[data-k="start"]', '2026-01-01');
  let d = await dates();
  check(d[0] === '2026-01-31', 'waiting-periods: 30-day row ends 2026-01-31 (' + d[0] + ')');
  check(d[1] === '2029-01-01', 'waiting-periods: 36-month row ends 2029-01-01 (' + d[1] + ')');
  check(d[4] === '2031-01-01', 'waiting-periods: moratorium after 60 months ends 2031-01-01 (' + d[4] + ')');
  check((await page.textContent('.wtp .wtp-list li')).includes('Covered now'), 'waiting-periods: 30-day wait shows covered now');
  check((await page.$$('.wtp .wtp-svg svg')).length === 1, 'waiting-periods: timeline drawn');
  await page.check('.wtp [data-k="port"]'); await page.waitForTimeout(80);
  d = await dates();
  check(d[1] === '2028-01-01', 'waiting-periods: ported 12 months moves the 36-month row to 2028-01-01 (' + d[1] + ')');
  await page.selectOption('.wtp [data-k="mode"]', 'dental'); await page.waitForTimeout(100);
  check((await page.$$('.wtp .wtp-list li')).length === 3, 'waiting-periods: dental mode has three rows');
  await set('[data-k="start"]', '');
  check(await page.isVisible('.wtp .wtp-err'), 'waiting-periods: missing date shows a message');
};
