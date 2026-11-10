// #T930 Countdown timer
export const path = '/everyday/classroom-timer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/classroom-timer/`); await page.waitForTimeout(300);
  const R = '.ct ';
  const big = () => page.textContent(R + '.ct-big');
  check((await big()) === '5:00', `classroom-timer: starts at 5:00 (${await big()})`);
  await page.fill(R + '[data-k="m"]', '1'); await page.fill(R + '[data-k="s"]', '30'); await page.waitForTimeout(100);
  check((await big()) === '1:30', `classroom-timer: custom 1:30 shows 1:30 (${await big()})`);
  await page.click(R + '.ct-go'); await page.waitForTimeout(1300);
  const t = await big(); await page.click(R + '.ct-reset'); await page.waitForTimeout(100);
  check(/^1:2[89]$/.test(t) && (await big()) === '1:30', `classroom-timer: counts down (${t}) and Reset goes back to 1:30`);
  check(await page.isVisible(R + '.ct-full'), 'classroom-timer: full-screen button present');
  await page.fill(R + '[data-k="m"]', '0'); await page.fill(R + '[data-k="s"]', '2'); await page.click(R + '.ct-go'); await page.waitForTimeout(2400);
  check((await page.getAttribute(R + '.ct-stage', 'data-state')) === 'up' && (await big()) === '0:00' && (await page.textContent(R + '.ct-msg')) === 'Time is up', 'classroom-timer: reaches 0:00 and says Time is up');
  await page.click(R + '.ct-tabs [data-m="sw"]'); await page.click(R + '.ct-go'); await page.waitForTimeout(300);
  await page.click(R + '.ct-lap'); await page.waitForTimeout(300); await page.click(R + '.ct-lap');
  const rows = await page.$$eval(R + '.ct-laps tbody tr', (r) => r.map((x) => x.textContent));
  await page.click(R + '.ct-go'); await page.click(R + '.ct-reset'); await page.waitForTimeout(100);
  check(rows.length === 2 && (await big()) === '0:00.00' && (await page.$$(R + '.ct-laps tbody tr')).length === 0, `classroom-timer: stopwatch laps listed, then reset (${rows.join(' / ')})`);
};
