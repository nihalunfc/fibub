// #L378 Build a simple shelf (home skills engine: steps, labels, order, quiz)
export const path = '/learn/build-simple-shelf/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/build-simple-shelf/`); await page.waitForTimeout(300);
  const R = '.bss';
  check((await page.locator(`${R} .sk-step`).count()) === 9, 'build-simple-shelf: 9 steps');
  check((await page.textContent(`${R} .sk-progress`)) === '0 of 9 steps done', 'build-simple-shelf: progress starts at 0');
  for (let i = 1; i <= 9; i++) await page.click(`${R} .sk-step:nth-child(${i}) .sk-done input`);
  check((await page.textContent(`${R} .sk-progress`)) === 'All 9 steps done. Nice work.', 'build-simple-shelf: all ticks');
  check((await page.evaluate(() => localStorage.getItem('fibub-skill-build-simple-shelf-v1'))) === null, 'build-simple-shelf: nothing stored without Remember');
  check((await page.locator(`${R} a[href="/everyday/shelf-load/"]`).count()) >= 1, 'build-simple-shelf: links to the shelf load tool');
  const tap = (id) => page.$eval(`${R} [data-part=${id}]`, (g) => g.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  await tap('stud');
  check((await page.textContent(`${R} .sk-label-out`)).startsWith('Stud'), 'build-simple-shelf: tap a part shows its name');
  check((await page.locator(`${R} [data-part]`).count()) === 6, 'build-simple-shelf: 6 parts to label');
  await page.click(`${R} .sk-mode button:nth-child(2)`);
  { const t = await page.textContent(`${R} .sk-label-out strong`); const id = await page.evaluate((n) => [...document.querySelectorAll('.bss [data-part]')].find((g) => g.dataset.name === n).dataset.part, t);
    await tap(id); check((await page.textContent(`${R} .sk-label-out`)).startsWith('Yes'), 'build-simple-shelf: test mode accepts the right part'); }
  const right = ['Plan size and load', 'Make a cut list and buy', 'Cut the board to length', 'Sand along the grain', 'Screw brackets to the board', 'Oil, wax or paint it', 'Check the wall, mark level', 'Drill, plug and hang'];
  for (let i = 0; i < right.length; i++) {
    for (;;) { const cur = await page.$$eval(`${R} .sk-order-t`, (xs) => xs.map((x) => x.textContent.replace(/ [✓✗]$/, ''))); const j = cur.indexOf(right[i]); if (j === i) break; await page.click(`${R} .sk-order-list li:nth-child(${j + 1}) .sk-up`); }
  }
  await page.click(`${R} .sk-check`);
  check((await page.textContent(`${R} .sk-order-out`)) === 'All 8 in the right order.', 'build-simple-shelf: order activity checks');
  check((await page.locator(`${R} .lq-item`).count()) === 5, 'build-simple-shelf: quiz has 5 questions');
  { const a = await page.getAttribute(`${R} .lq-item`, 'data-ans'); await page.click(`${R} .lq-item:first-child .lq-choice:nth-child(${+a + 1})`);
    check((await page.textContent(`${R} .lq-fb`)) === 'Right.', 'build-simple-shelf: quiz accepts the right answer'); }
};
