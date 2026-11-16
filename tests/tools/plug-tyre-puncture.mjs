// #L371 Plug a tyre puncture (home skills engine: steps, labels, order, quiz, plus the "can this be plugged?" checker)
export const path = '/learn/plug-tyre-puncture/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/plug-tyre-puncture/`); await page.waitForTimeout(300);
  const R = '.ptp', ID = 'plug-tyre-puncture';
  check((await page.locator(`${R} .sk-step`).count()) === 8, `${ID}: 8 steps`);
  check((await page.textContent(`${R} .sk-progress`)) === '0 of 8 steps done', `${ID}: progress starts at 0`);
  await page.click(`${R} .sk-step:nth-child(1) .sk-done input`); await page.click(`${R} .sk-step:nth-child(3) .sk-done input`);
  check((await page.textContent(`${R} .sk-progress`)) === '2 of 8 steps done', `${ID}: ticks count`);
  check((await page.evaluate((k) => localStorage.getItem(k), `fibub-skill-${ID}-v1`)) === null, `${ID}: nothing stored without Remember`);
  // Checker
  const v = () => page.textContent(`${R} [data-o="verdict"]`);
  check((await v()).startsWith('Yes:'), `${ID}: 4 mm in the middle of the tread can be plugged`);
  await page.selectOption(`${R} [data-k="where"]`, 'sidewall');
  check((await v()).startsWith('No: never repair the sidewall'), `${ID}: sidewall cannot be plugged`);
  await page.selectOption(`${R} [data-k="where"]`, 'shoulder');
  check((await v()).startsWith('No: the shoulder'), `${ID}: shoulder cannot be plugged`);
  await page.selectOption(`${R} [data-k="where"]`, 'centre'); await page.fill(`${R} [data-k="mm"]`, '8');
  check((await v()).startsWith('No: 8 mm is bigger'), `${ID}: an 8 mm hole is too big`);
  await page.fill(`${R} [data-k="mm"]`, '5'); await page.check(`${R} [data-k="flat"]`);
  check((await v()).startsWith('Not at the roadside'), `${ID}: driven flat needs a tyre shop`);
  await page.uncheck(`${R} [data-k="flat"]`);
  // Labels
  const tap = (id) => page.$eval(`${R} [data-part=${id}]`, (g) => g.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  await tap('shoulder');
  check((await page.textContent(`${R} .sk-label-out`)).startsWith('Shoulder'), `${ID}: tap a part shows its name`);
  await page.click(`${R} .sk-mode button:nth-child(2)`);
  { const t = await page.textContent(`${R} .sk-label-out strong`); const id = await page.evaluate((n) => [...document.querySelectorAll('.ptp [data-part]')].find((g) => g.dataset.name === n).dataset.part, t);
    await tap(id); check((await page.textContent(`${R} .sk-label-out`)).startsWith('Yes'), `${ID}: test mode accepts the right part`); }
  const right = ['Find the hole, mark it', 'Check it can be plugged', 'Pull the object out', 'Ream the hole', 'Load a plug in the needle', 'Push in, pull the needle out', 'Trim the ends', 'Pump up, soapy-water check'];
  for (let i = 0; i < right.length; i++) {
    for (;;) { const cur = await page.$$eval(`${R} .sk-order-t`, (xs) => xs.map((x) => x.textContent.replace(/ [✓✗]$/, ''))); const j = cur.indexOf(right[i]); if (j === i) break; await page.click(`${R} .sk-order-list li:nth-child(${j + 1}) .sk-up`); }
  }
  await page.click(`${R} .sk-check`);
  check((await page.textContent(`${R} .sk-order-out`)) === 'All 8 in the right order.', `${ID}: order activity checks`);
  check((await page.locator(`${R} .lq-item`).count()) === 5, `${ID}: quiz has 5 questions`);
  { const a = await page.getAttribute(`${R} .lq-item`, 'data-ans'); await page.click(`${R} .lq-item:first-child .lq-choice:nth-child(${+a + 1})`);
    check((await page.textContent(`${R} .lq-fb`)) === 'Right.', `${ID}: quiz accepts the right answer`); }
};
