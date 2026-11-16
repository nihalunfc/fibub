// #L381 Hang a picture or mirror (steps, hook height calculator from src/lib/learn/wall-fixings.ts, labels, order, quiz)
import { hookPosition } from '../../src/lib/learn/wall-fixings.ts';
export const path = '/learn/hang-picture-mirror/';
export default async ({ page, check, BASE }) => {
  const id = 'hang-picture-mirror';
  // Worked example from the guide: 60 cm frame, 10 cm drop, centre 145 cm -> top 175, hook 165, bottom 115;
  // D-rings 40 cm apart centred on a 300 cm wall -> hooks 130 and 170 cm from the left.
  { const r = hookPosition({ height: 60, drop: 10, centre: 145, spacing: 40, wall: 300 });
    check(r.top === 175 && r.hook === 165 && r.bottom === 115 && r.hooks[0] === 130 && r.hooks[1] === 170, `${id}: worked example maths`); }
  { const r = hookPosition({ height: 24, drop: 4, centre: 57 }); check(r.hook === 65 && r.hooks === undefined, `${id}: inches example (24 in, 4 in drop, 57 in) -> 65 in`); }

  await page.goto(`${BASE}/learn/hang-picture-mirror/`); await page.waitForTimeout(300);
  const R = '.hpm';
  check((await page.locator(`${R} .sk-step`).count()) === 7, `${id}: 7 steps`);
  await page.click(`${R} .sk-step:nth-child(2) .sk-done input`);
  check((await page.textContent(`${R} .sk-progress`)) === '1 of 7 steps done', `${id}: ticks count`);
  check((await page.textContent(`${R} .hc-out`)) === 'Hook at 165 cm from the floor' && (await page.textContent(`${R} .hc-top`)) === '175 cm', `${id}: calculator default gives 165 cm`);
  await page.selectOption(`${R} .hc-mode`, 'rings'); await page.fill(`${R} .hc-w`, '300');
  check((await page.textContent(`${R} .hc-side`)) === '130 cm and 170 cm', `${id}: two D-rings centred on a 300 cm wall`);
  await page.selectOption(`${R} .hc-unit`, 'in');
  check((await page.textContent(`${R} .hc-out`)) === 'Hooks at 65 in from the floor', `${id}: switching to inches converts (165 cm = 65 in)`);
  const tap = (p) => page.$eval(`${R} [data-part=${p}]`, (g) => g.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  await tap('cleat');
  check((await page.textContent(`${R} .sk-label-out`)).startsWith('French cleat'), `${id}: tap a part shows its name`);
  const right = ['Pick the centre height', 'Measure the drop to the wire', 'Work out the hook height', 'Mark it on masking tape', 'Scan for cables and pipes', 'Fit the hook', 'Hang it and level it'];
  for (let i = 0; i < right.length; i++) {
    for (;;) { const cur = await page.$$eval(`${R} .sk-order-t`, (xs) => xs.map((x) => x.textContent.replace(/ [✓✗]$/, ''))); const j = cur.indexOf(right[i]); if (j === i) break; await page.click(`${R} .sk-order-list li:nth-child(${j + 1}) .sk-up`); }
  }
  await page.click(`${R} .sk-check`);
  check((await page.textContent(`${R} .sk-order-out`)) === 'All 7 in the right order.', `${id}: order activity checks`);
  check((await page.locator(`${R} .lq-item`).count()) === 5, `${id}: quiz has 5 questions`);
  { const a = await page.getAttribute(`${R} .lq-item`, 'data-ans'); await page.click(`${R} .lq-item:first-child .lq-choice:nth-child(${+a + 1})`);
    check((await page.textContent(`${R} .lq-fb`)) === 'Right.', `${id}: quiz accepts the right answer`); }
};
