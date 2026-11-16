// #L377 Drill and screw wood (home skills engine: steps, labels, order, screw picker, quiz)
import { pickScrew } from '../../src/lib/home/carpentry.ts';
export const path = '/learn/drill-and-screw/';
export default async ({ page, check, BASE }) => {
  // Hand-worked: 18 mm board on a 45 mm batten. Aim 2.5 x 18 = 45; max 18 + 45 - 5 = 58; stock 45 mm -> 4.0 mm (#8),
  // clearance 4.5, pilot 2.5 soft / 3.0 hard, bite 27 mm = 60%. 18 on 18: max 31 -> 30 mm, bite 12 = 40% (weak).
  { const r = pickScrew(18, 45); check(r.len === 45 && r.d === 4 && r.gauge === '#8' && r.clear === 4.5 && r.pilot === 2.5 && r.bite === 27 && !r.weak, `drill-and-screw: 18 on 45 -> 45 x 4.0 (${JSON.stringify(r)})`); }
  check(pickScrew(18, 45, 'hard').pilot === 3, 'drill-and-screw: hardwood pilot 3.0');
  { const r = pickScrew(18, 18); check(r.len === 30 && r.d === 3.5 && r.weak, `drill-and-screw: 18 on 18 -> 30 mm, weak (${r.len})`); }
  check(pickScrew(12, 3).len === 0, 'drill-and-screw: base too thin -> no screw');
  await page.goto(`${BASE}/learn/drill-and-screw/`); await page.waitForTimeout(300);
  const R = '.dsw';
  check((await page.locator(`${R} .sk-step`).count()) === 8, 'drill-and-screw: 8 steps');
  await page.click(`${R} .sk-step:nth-child(2) .sk-done input`);
  check((await page.textContent(`${R} .sk-progress`)) === '1 of 8 steps done', 'drill-and-screw: ticks count');
  check((await page.evaluate(() => localStorage.getItem('fibub-skill-drill-and-screw-v1'))) === null, 'drill-and-screw: nothing stored without Remember');
  const out = () => page.textContent(`${R} .dsw-out`);
  check((await out()) === '45 × 4 mm screw (#8, about 1¾ in)', `drill-and-screw: picker default (${await out()})`);
  check((await page.textContent(`${R} .dsw-lines`)).includes('Pilot hole in the base (softwood): 2.5 mm'), 'drill-and-screw: picker pilot size');
  await page.fill(`${R} [data-k=base]`, '18');
  check((await out()).startsWith('30 × 3.5 mm') && (await page.textContent(`${R} .dsw-lines`)).includes('under half'), `drill-and-screw: 18 on 18 warns (${await out()})`);
  const tap = (id) => page.$eval(`${R} [data-part=${id}]`, (g) => g.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  await tap('pilot');
  check((await page.textContent(`${R} .sk-label-out`)).startsWith('Pilot hole'), 'drill-and-screw: tap a part shows its name');
  const right = ['Pick the screw length', 'Mark, then clamp the pieces', 'Drill the clearance hole', 'Drill the pilot hole', 'Countersink the top', 'Fit the right bit, set clutch', 'Drive the screw in straight'];
  for (let i = 0; i < right.length; i++) {
    for (;;) { const cur = await page.$$eval(`${R} .sk-order-t`, (xs) => xs.map((x) => x.textContent.replace(/ [✓✗]$/, ''))); const j = cur.indexOf(right[i]); if (j === i) break; await page.click(`${R} .sk-order-list li:nth-child(${j + 1}) .sk-up`); }
  }
  await page.click(`${R} .sk-check`);
  check((await page.textContent(`${R} .sk-order-out`)) === 'All 7 in the right order.', 'drill-and-screw: order activity checks');
  check((await page.locator(`${R} .lq-item`).count()) === 5, 'drill-and-screw: quiz has 5 questions');
  { const a = await page.getAttribute(`${R} .lq-item`, 'data-ans'); await page.click(`${R} .lq-item:first-child .lq-choice:nth-child(${+a + 1})`);
    check((await page.textContent(`${R} .lq-fb`)) === 'Right.', 'drill-and-screw: quiz accepts the right answer'); }
};
