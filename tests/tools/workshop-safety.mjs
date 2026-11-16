// #L374 Workshop safety (home skills engine: steps, spot-the-hazards labels, order, quiz)
export const path = '/learn/workshop-safety/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/workshop-safety/`); await page.waitForTimeout(300);
  const R = '.wks';
  check((await page.locator(`${R} .sk-step`).count()) === 9, 'workshop-safety: 9 steps');
  await page.click(`${R} .sk-step:nth-child(2) .sk-done input`);
  check((await page.textContent(`${R} .sk-progress`)) === '1 of 9 steps done', 'workshop-safety: ticks count');
  check((await page.evaluate(() => localStorage.getItem('fibub-skill-workshop-safety-v1'))) === null, 'workshop-safety: nothing stored without Remember');
  check((await page.locator(`${R} [data-part]`).count()) === 7, 'workshop-safety: 7 hazards in the picture');
  const tap = (id) => page.$eval(`${R} [data-part=${id}]`, (g) => g.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  await tap('ladder');
  check((await page.textContent(`${R} .sk-label-out`)).startsWith('Ladder too steep'), 'workshop-safety: tap a hazard explains it');
  await page.click(`${R} .sk-mode button:nth-child(2)`);
  { const t = await page.textContent(`${R} .sk-label-out strong`); const id = await page.evaluate((n) => [...document.querySelectorAll('.wks [data-part]')].find((g) => g.dataset.name === n).dataset.part, t);
    await tap(id); check((await page.textContent(`${R} .sk-label-out`)).startsWith('Yes'), 'workshop-safety: test mode accepts the right hazard'); }
  const right = ['Clear the floor and light the space', 'Check tools, leads and blades', 'Tie hair back, roll up sleeves', 'Put on glasses, ears and mask', 'Clamp the work', 'Make the cut, away from you', 'Unplug, then tidy up'];
  for (let i = 0; i < right.length; i++) {
    for (;;) { const cur = await page.$$eval(`${R} .sk-order-t`, (xs) => xs.map((x) => x.textContent.replace(/ [✓✗]$/, ''))); const j = cur.indexOf(right[i]); if (j === i) break; await page.click(`${R} .sk-order-list li:nth-child(${j + 1}) .sk-up`); }
  }
  await page.click(`${R} .sk-check`);
  check((await page.textContent(`${R} .sk-order-out`)) === 'All 7 in the right order.', 'workshop-safety: order activity checks');
  check((await page.locator(`${R} .lq-item`).count()) === 5, 'workshop-safety: quiz has 5 questions');
  { const a = await page.getAttribute(`${R} .lq-item`, 'data-ans'); await page.click(`${R} .lq-item:first-child .lq-choice:nth-child(${+a + 1})`);
    check((await page.textContent(`${R} .lq-fb`)) === 'Right.', 'workshop-safety: quiz accepts the right answer'); }
};
