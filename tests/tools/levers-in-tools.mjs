// #L382 Levers in everyday tools (How machines work): maths, idea cards, lever sim, labels, class sorter, quiz.
import { leverEffort, leverMA, braceForce, LEVER_TOOLS } from '../../src/lib/sci/millwright.ts';
export const path = '/learn/levers-in-tools/';
const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
export default async ({ page, check, BASE }) => {
  // Hand-worked: 1,200 N nail 4 cm from the fulcrum, hand at 30 cm: 1200 × 4 ÷ 30 = 160 N, MA 7.5.
  check(near(leverEffort(1200, 0.04, 0.3), 160) && near(leverMA(4, 30), 7.5), 'levers-in-tools: claw hammer moments 160 N, MA 7.5');
  check(near(braceForce(110, 0.4), 275) && near(braceForce(110, 0.25), 440), 'levers-in-tools: wheel brace 110 N·m needs 275 N at 40 cm, 440 N at 25 cm');
  check(near(leverEffort(80 * 9.8, 0.35, 1.2), 228.6666667), 'levers-in-tools: wheelbarrow 80 kg at 35 cm, hands 1.2 m: 228.7 N');
  check(LEVER_TOOLS.filter((t) => t.cls === 1).length >= 3 && LEVER_TOOLS.some((t) => t.cls === 2) && LEVER_TOOLS.some((t) => t.cls === 3), 'levers-in-tools: tools of all three classes');
  await page.goto(`${BASE}/learn/levers-in-tools/`); await page.waitForTimeout(300);
  const R = '.lvt';
  check((await page.locator(`${R} .sk-step`).count()) === 6, 'levers-in-tools: 6 idea cards');
  await page.click(`${R} .sk-step:nth-child(1) .sk-done input`);
  check((await page.textContent(`${R} .sk-progress`)) === '1 of 6 steps done', 'levers-in-tools: ticks count');
  check((await page.evaluate(() => localStorage.getItem('fibub-skill-levers-in-tools-v1'))) === null, 'levers-in-tools: nothing stored without Remember');
  const eff = async () => +(await page.getAttribute(`${R} .lvt-out`, 'data-effort'));
  check(near(await eff(), 160), 'levers-in-tools: sim hammer default 160 N');
  await page.$eval(`${R} .lvt-hand`, (e) => { e.value = '0.15'; e.dispatchEvent(new Event('input')); });
  check(near(await eff(), 320), 'levers-in-tools: hand halfway (15 cm) doubles the push to 320 N');
  await page.click(`${R} .lvt-tool button[data-t=brace]`);
  check(near(await eff(), 275), 'levers-in-tools: sim wheel brace 110 N·m at 40 cm = 275 N');
  await page.click(`${R} .lvt-tool button[data-t=barrow]`);
  check(near(await eff(), 228.6666667), 'levers-in-tools: sim wheelbarrow 228.7 N');
  const tap = (id) => page.$eval(`${R} [data-part=${id}]`, (g) => g.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  await tap('fulcrum');
  check((await page.textContent(`${R} .sk-label-out`)).startsWith('Fulcrum'), 'levers-in-tools: tap a part shows its name');
  await page.click(`${R} .lvt-sort-list li[data-id=barrow] button[data-c="2"]`);
  await page.click(`${R} .lvt-sort-list li[data-id=tweezers] button[data-c="1"]`);
  check((await page.getAttribute(`${R} .lvt-sort-list li[data-id=barrow]`, 'class')) === 'sk-right' && (await page.getAttribute(`${R} .lvt-sort-list li[data-id=tweezers]`, 'class')) === 'sk-wrong', 'levers-in-tools: class sorter marks right and wrong');
  check((await page.textContent(`${R} .lvt-sort-out`)).startsWith('1 of'), 'levers-in-tools: class sorter scores first tries');
  check((await page.locator(`${R} .lq-item`).count()) === 6, 'levers-in-tools: quiz has 6 questions');
  { const a = await page.getAttribute(`${R} .lq-item`, 'data-ans'); await page.click(`${R} .lq-item:first-child .lq-choice:nth-child(${+a + 1})`);
    check((await page.textContent(`${R} .lq-item:first-child .lq-fb`)) === 'Right.', 'levers-in-tools: quiz accepts the right choice'); }
  { const a = await page.getAttribute(`${R} .lq-item:last-child`, 'data-ans'); await page.fill(`${R} .lq-item:last-child .lq-in`, String(a)); await page.click(`${R} .lq-item:last-child .lq-check`);
    check((await page.textContent(`${R} .lq-item:last-child .lq-fb`)) === 'Right.', 'levers-in-tools: quiz accepts the right number'); }
};
