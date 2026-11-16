// #L376 Saw a straight cut (home skills engine: steps, labels, order, kerf sim, quiz)
import { keptLength, piecesFromBoard } from '../../src/lib/home/carpentry.ts';
export const path = '/learn/saw-straight/';
export default async ({ page, check, BASE }) => {
  // Hand-worked: mark 600, kerf 2. Waste side 600; on the line 599; keep side 598. 2400 board, 600 pieces, 3 mm kerf:
  // 3 pieces (4 would need 2409), offcut 2400 - 1800 - 3 x 3 = 591.
  check(keptLength(600, 2, 'waste') === 600 && keptLength(600, 2, 'centre') === 599 && keptLength(600, 2, 'keep') === 598, 'saw-straight: kept length by side');
  { const r = piecesFromBoard(2400, 600, 3), z = piecesFromBoard(2400, 600, 0); check(r.n === 3 && r.offcut === 591 && z.n === 4 && z.offcut === 0, `saw-straight: pieces from a board (${JSON.stringify(r)})`); }
  await page.goto(`${BASE}/learn/saw-straight/`); await page.waitForTimeout(300);
  const R = '.sws';
  check((await page.locator(`${R} .sk-step`).count()) === 8, 'saw-straight: 8 steps');
  check((await page.textContent(`${R} .sk-progress`)) === '0 of 8 steps done', 'saw-straight: progress starts at 0');
  await page.click(`${R} .sk-step:nth-child(1) .sk-done input`);
  check((await page.textContent(`${R} .sk-progress`)) === '1 of 8 steps done', 'saw-straight: ticks count');
  check((await page.evaluate(() => localStorage.getItem('fibub-skill-saw-straight-v1'))) === null, 'saw-straight: nothing stored without Remember');
  const out = () => page.textContent(`${R} .sws-out`);
  check((await out()) === 'Your piece: 599 mm, 1 mm short.', `saw-straight: on the line, 2 mm kerf -> 599 (${await out()})`);
  await page.click(`${R} .sws-side [data-side=keep]`);
  check((await out()) === 'Your piece: 598 mm, 2 mm short.', 'saw-straight: keep side -> 598');
  await page.click(`${R} .sws-side [data-side=waste]`);
  check((await out()) === 'Your piece: 600 mm. Right length.', 'saw-straight: waste side -> 600');
  await page.selectOption(`${R} [data-k=kerf]`, '3');
  check((await page.textContent(`${R} .sws-pieces`)).startsWith('3 pieces of 600 mm, offcut 591 mm.'), `saw-straight: board sum on page (${await page.textContent(`${R} .sws-pieces`)})`);
  const tap = (id) => page.$eval(`${R} [data-part=${id}]`, (g) => g.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  await tap('waste');
  check((await page.textContent(`${R} .sk-label-out`)).startsWith('Waste side'), 'saw-straight: tap a part shows its name');
  const right = ['Measure and make a V mark', 'Square a line across', 'Put a cross on the waste side', 'Clamp the wood', 'Start with short pull strokes', 'Saw with long, light strokes', 'Hold the offcut at the end', 'Check the end is square'];
  for (let i = 0; i < right.length; i++) {
    for (;;) { const cur = await page.$$eval(`${R} .sk-order-t`, (xs) => xs.map((x) => x.textContent.replace(/ [✓✗]$/, ''))); const j = cur.indexOf(right[i]); if (j === i) break; await page.click(`${R} .sk-order-list li:nth-child(${j + 1}) .sk-up`); }
  }
  await page.click(`${R} .sk-check`);
  check((await page.textContent(`${R} .sk-order-out`)) === 'All 8 in the right order.', 'saw-straight: order activity checks');
  check((await page.locator(`${R} .lq-item`).count()) === 5, 'saw-straight: quiz has 5 questions');
  { const a = await page.getAttribute(`${R} .lq-item`, 'data-ans'); await page.click(`${R} .lq-item:first-child .lq-choice:nth-child(${+a + 1})`);
    check((await page.textContent(`${R} .lq-fb`)) === 'Right.', 'saw-straight: quiz accepts the right answer'); }
};
