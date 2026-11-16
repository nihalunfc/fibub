// #L380 Pick the right wall plug (steps, fixing picker from src/lib/learn/wall-fixings.ts, labels, order, quiz)
import { pickFixing, load } from '../../src/lib/learn/wall-fixings.ts';
export const path = '/learn/pick-wall-plug/';
export default async ({ page, check, BASE }) => {
  const id = 'pick-wall-plug';
  // The rules, worked by hand
  check(pickFixing('drywall', 2, 'flat').kind === 'pin-hook', `${id}: 2 kg frame on drywall -> picture hook`);
  check(pickFixing('drywall', 8, 'flat').kind === 'self-drill', `${id}: 8 kg mirror on drywall -> self-drill anchor`);
  check(load(8, 'shelf') === 16 && pickFixing('drywall', 8, 'shelf').kind === 'metal-anchor', `${id}: 8 kg shelf counts as 16 kg -> metal hollow-wall anchor`);
  check(pickFixing('drywall', 35, 'flat').kind === 'snap-toggle' && pickFixing('drywall', 45, 'flat').kind === 'into-studs', `${id}: drywall 35 kg -> snap toggle, 45 kg -> studs`);
  check(pickFixing('stud', 30, 'shelf').kind === 'stud-screw', `${id}: over a stud -> wood screw`);
  { const b = pickFixing('brick', 8, 'flat'); check(b.kind === 'plastic-plug' && b.bit.startsWith('6 mm masonry'), `${id}: brick 8 kg -> plastic plug, 6 mm masonry bit`); }
  check(pickFixing('concrete', 40, 'flat').kind === 'masonry-screw' && pickFixing('concrete', 40, 'shelf').kind === 'resin', `${id}: concrete 40 kg flat -> masonry screw, as shelf -> resin`);
  check(pickFixing('aircrete', 10, 'flat').kind === 'aircrete-plug' && pickFixing('lath', 10, 'flat').kind === 'spring-toggle', `${id}: aircrete and lath picks`);
  check(pickFixing('drywall', 5, 'grab').kind === 'into-studs', `${id}: grab rail on hollow wall -> studs, never anchors`);
  check(pickFixing('brick', 5, 'flat', true).notes.some((n) => n.startsWith('Tiles')) && pickFixing('brick', 5, 'flat').notes.at(-1).includes('packet wins'), `${id}: tile note and packet rule`);

  await page.goto(`${BASE}/learn/pick-wall-plug/`); await page.waitForTimeout(300);
  const R = '.pwp';
  check((await page.locator(`${R} .sk-step`).count()) === 7, `${id}: 7 steps`);
  await page.click(`${R} .sk-step:nth-child(1) .sk-done input`);
  check((await page.textContent(`${R} .sk-progress`)) === '1 of 7 steps done', `${id}: ticks count`);
  check((await page.textContent(`${R} .pw-fix`)).startsWith('Self-drill drywall anchor'), `${id}: picker default (8 kg, drywall) -> self-drill`);
  await page.selectOption(`${R} .pw-wall`, 'brick');
  check((await page.textContent(`${R} .pw-fix`)).startsWith('Plastic wall plug') && (await page.textContent(`${R} .pw-bit`)).startsWith('6 mm'), `${id}: picker brick -> plastic plug`);
  await page.fill(`${R} .pw-kg`, '100'); await page.selectOption(`${R} .pw-unit`, 'lb');
  check((await page.getAttribute(R, 'data-kind')) === 'masonry-screw', `${id}: 100 lb (45 kg) in brick -> masonry screw`);
  const tap = (p) => page.$eval(`${R} [data-part=${p}]`, (g) => g.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  await tap('snap');
  check((await page.textContent(`${R} .sk-label-out`)).startsWith('Snap toggle'), `${id}: tap a fixing shows its name`);
  const right = ['Check for cables and pipes', 'Mark the spot on masking tape', 'Drill with the bit on the packet', 'Clear the dust out of the hole', 'Tap the plug in flush', 'Screw through the item until snug'];
  for (let i = 0; i < right.length; i++) {
    for (;;) { const cur = await page.$$eval(`${R} .sk-order-t`, (xs) => xs.map((x) => x.textContent.replace(/ [✓✗]$/, ''))); const j = cur.indexOf(right[i]); if (j === i) break; await page.click(`${R} .sk-order-list li:nth-child(${j + 1}) .sk-up`); }
  }
  await page.click(`${R} .sk-check`);
  check((await page.textContent(`${R} .sk-order-out`)) === 'All 6 in the right order.', `${id}: order activity checks`);
  check((await page.locator(`${R} .lq-item`).count()) === 5, `${id}: quiz has 5 questions`);
  { const a = await page.getAttribute(`${R} .lq-item`, 'data-ans'); await page.click(`${R} .lq-item:first-child .lq-choice:nth-child(${+a + 1})`);
    check((await page.textContent(`${R} .lq-fb`)) === 'Right.', `${id}: quiz accepts the right answer`); }
};
