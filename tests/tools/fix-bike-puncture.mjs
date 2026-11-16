// #L372 Fix a bike puncture (home skills engine: steps, labels, order, quiz)
export const path = '/learn/fix-bike-puncture/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/fix-bike-puncture/`); await page.waitForTimeout(300);
  const R = '.fbp', ID = 'fix-bike-puncture';
  check((await page.locator(`${R} .sk-step`).count()) === 9, `${ID}: 9 steps`);
  check((await page.textContent(`${R} .sk-progress`)) === '0 of 9 steps done', `${ID}: progress starts at 0`);
  await page.click(`${R} .sk-step:nth-child(1) .sk-done input`); await page.click(`${R} .sk-step:nth-child(3) .sk-done input`);
  check((await page.textContent(`${R} .sk-progress`)) === '2 of 9 steps done', `${ID}: ticks count`);
  check((await page.evaluate((k) => localStorage.getItem(k), `fibub-skill-${ID}-v1`)) === null, `${ID}: nothing stored without Remember`);
  // Labels
  const tap = (id) => page.$eval(`${R} [data-part=${id}]`, (g) => g.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  await tap('valve');
  check((await page.textContent(`${R} .sk-label-out`)).startsWith('Valve'), `${ID}: tap a part shows its name`);
  await page.click(`${R} .sk-mode button:nth-child(2)`);
  { const t = await page.textContent(`${R} .sk-label-out strong`); const id = await page.evaluate((n) => [...document.querySelectorAll('.fbp [data-part]')].find((g) => g.dataset.name === n).dataset.part, t);
    await tap(id); check((await page.textContent(`${R} .sk-label-out`)).startsWith('Yes'), `${ID}: test mode accepts the right part`); }
  const right = ['Take the wheel off', 'Let the air out', 'Lever one side of the tyre off', 'Find the hole in the tube', 'Find the thorn in the tyre', 'Roughen, glue, wait until tacky', 'Press the patch on', 'Refit without pinching, pump up'];
  for (let i = 0; i < right.length; i++) {
    for (;;) { const cur = await page.$$eval(`${R} .sk-order-t`, (xs) => xs.map((x) => x.textContent.replace(/ [✓✗]$/, ''))); const j = cur.indexOf(right[i]); if (j === i) break; await page.click(`${R} .sk-order-list li:nth-child(${j + 1}) .sk-up`); }
  }
  await page.click(`${R} .sk-check`);
  check((await page.textContent(`${R} .sk-order-out`)) === 'All 8 in the right order.', `${ID}: order activity checks`);
  check((await page.locator(`${R} .lq-item`).count()) === 5, `${ID}: quiz has 5 questions`);
  { const a = await page.getAttribute(`${R} .lq-item`, 'data-ans'); await page.click(`${R} .lq-item:first-child .lq-choice:nth-child(${+a + 1})`);
    check((await page.textContent(`${R} .lq-fb`)) === 'Right.', `${ID}: quiz accepts the right answer`); }
};
