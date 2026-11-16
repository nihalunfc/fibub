// #L370 Change a flat tyre (home skills engine: steps, labels, order, quiz)
export const path = '/learn/change-flat-tyre/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/change-flat-tyre/`); await page.waitForTimeout(300);
  const R = '.cft';
  check((await page.locator(`${R} .sk-step`).count()) === 8, 'change-flat-tyre: 8 steps');
  check((await page.textContent(`${R} .sk-progress`)) === '0 of 8 steps done', 'change-flat-tyre: progress starts at 0');
  await page.click(`${R} .sk-step:nth-child(1) .sk-done input`); await page.click(`${R} .sk-step:nth-child(2) .sk-done input`);
  check((await page.textContent(`${R} .sk-progress`)) === '2 of 8 steps done', 'change-flat-tyre: ticks count');
  check((await page.evaluate(() => localStorage.getItem('fibub-skill-change-flat-tyre-v1'))) === null, 'change-flat-tyre: nothing stored without Remember');
  await page.check(`${R} .sk-remember input`);
  check((await page.evaluate(() => localStorage.getItem('fibub-skill-change-flat-tyre-v1')))?.startsWith('[true,true,false'), 'change-flat-tyre: Remember stores ticks');
  await page.click(`${R} .sk-clear`);
  check((await page.evaluate(() => localStorage.getItem('fibub-skill-change-flat-tyre-v1'))) === null && (await page.textContent(`${R} .sk-progress`)) === '0 of 8 steps done', 'change-flat-tyre: Clear removes ticks');
  const tap = (id) => page.$eval(`${R} [data-part=${id}]`, (g) => g.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  await tap('jack');
  check((await page.textContent(`${R} .sk-label-out`)).startsWith('Jack'), 'change-flat-tyre: tap a part shows its name');
  await page.click(`${R} .sk-mode button:nth-child(2)`);
  { const t = (await page.textContent(`${R} .sk-label-out strong`)); const id = await page.evaluate((n) => [...document.querySelectorAll('.cft [data-part]')].find((g) => g.dataset.name === n).dataset.part, t);
    await tap(id); check((await page.textContent(`${R} .sk-label-out`)).startsWith('Yes'), 'change-flat-tyre: test mode accepts the right part'); }
  const right = ['Hazard lights, brake, chock', 'Get the spare and tools out', 'Loosen nuts on the ground', 'Jack at the jacking point', 'Take the flat wheel off', 'Fit the spare, nuts by hand', 'Lower, tighten in a star', 'Check pressure and nuts later'];
  for (let i = 0; i < right.length; i++) { // move each right step up into place
    for (;;) { const cur = await page.$$eval(`${R} .sk-order-t`, (xs) => xs.map((x) => x.textContent.replace(/ [✓✗]$/, ''))); const j = cur.indexOf(right[i]); if (j === i) break; await page.click(`${R} .sk-order-list li:nth-child(${j + 1}) .sk-up`); }
  }
  await page.click(`${R} .sk-check`);
  check((await page.textContent(`${R} .sk-order-out`)) === 'All 8 in the right order.', 'change-flat-tyre: order activity checks');
  check((await page.locator(`${R} .lq-item`).count()) === 5, 'change-flat-tyre: quiz has 5 questions');
  { const a = await page.getAttribute(`${R} .lq-item`, 'data-ans'); await page.click(`${R} .lq-item:first-child .lq-choice:nth-child(${+a + 1})`);
    check((await page.textContent(`${R} .lq-fb`)) === 'Right.', 'change-flat-tyre: quiz accepts the right answer'); }
};
