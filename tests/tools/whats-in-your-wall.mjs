// #L379 What's in your wall (home skills engine: steps, safe/danger drill spots, quiz)
export const path = '/learn/whats-in-your-wall/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/whats-in-your-wall/`); await page.waitForTimeout(300);
  const R = '.wiw', id = 'whats-in-your-wall';
  check((await page.locator(`${R} .sk-step`).count()) === 7, `${id}: 7 steps`);
  check((await page.textContent(`${R} .sk-progress`)) === '0 of 7 steps done', `${id}: progress starts at 0`);
  await page.click(`${R} .sk-step:nth-child(1) .sk-done input`); await page.click(`${R} .sk-step:nth-child(3) .sk-done input`);
  check((await page.textContent(`${R} .sk-progress`)) === '2 of 7 steps done', `${id}: ticks count`);
  check((await page.evaluate(() => localStorage.getItem('fibub-skill-whats-in-your-wall-v1'))) === null, `${id}: nothing stored without Remember`);
  const tap = (p) => page.$eval(`${R} [data-part=${p}]`, (g) => g.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  await tap('above-switch');
  check((await page.textContent(`${R} .sk-label-out`)).startsWith('Danger: straight above the switch'), `${id}: spot above the switch is a danger`);
  await tap('between-studs');
  check((await page.textContent(`${R} .sk-label-out`)).startsWith('Safe spot'), `${id}: spot between studs is safe`);
  const names = await page.$$eval(`${R} [data-part]`, (gs) => gs.map((g) => g.dataset.name));
  check(names.length === 6 && names.filter((n) => n.startsWith('Danger')).length === 4, `${id}: 6 spots, 4 dangers`);
  await page.click(`${R} .sk-mode button:nth-child(2)`);
  { const t = await page.textContent(`${R} .sk-label-out strong`); const p = await page.evaluate((n) => [...document.querySelectorAll('.wiw [data-part]')].find((g) => g.dataset.name === n).dataset.part, t);
    await tap(p); check((await page.textContent(`${R} .sk-label-out`)).startsWith('Yes'), `${id}: test mode accepts the right spot`); }
  check((await page.locator(`${R} .lq-item`).count()) === 5, `${id}: quiz has 5 questions`);
  { const a = await page.getAttribute(`${R} .lq-item`, 'data-ans'); await page.click(`${R} .lq-item:first-child .lq-choice:nth-child(${+a + 1})`);
    check((await page.textContent(`${R} .lq-fb`)) === 'Right.', `${id}: quiz accepts the right answer`); }
};
