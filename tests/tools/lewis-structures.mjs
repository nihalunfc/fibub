// #1102 Lewis structures and formal charge
import { EXAMPLES, solve, totalValence } from '../../src/lib/sci/lewis.ts';
export const path = '/learn/lewis-structures/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/lewis-structures/`); await page.waitForTimeout(1200);
  const t = (s) => page.textContent('.lws ' + s);
  check((await t('.lw-count')) === 'Valence electrons in NO₃⁻: N 5 + O 6 × 3 + 1 (charge 1−) = 24', 'lewis: nitrate count with live numbers');
  check((await t('.lw-status')) === 'Best structure (resonance form 1 of 3)', 'lewis: nitrate best structure');
  check((await t('.lw-used')) === 'Placed: 8 in bonds + 16 in lone pairs = 24 of 24 electrons.', 'lewis: electrons placed');
  { const f = await t('.lw-facts'); check(f.includes('N +1') && f.includes('O −1') && f.includes('3 forms') && f.includes('bond order 1.33'), 'lewis: formal charges and resonance'); }
  check((await page.$$('.lws .lw-svg .dot')).length === 16 && (await page.$$('.lws .lw-svg .bond')).length === 4 && (await page.$$('.lws .lw-svg .fcc')).length === 3, 'lewis: picture has 16 dots, 4 bond lines, 3 charges');
  await page.click('.lws .lw-next'); await page.waitForTimeout(100);
  check((await t('.lw-status')) === 'Best structure (resonance form 2 of 3)', 'lewis: next resonance form');
  // Tap bonds.
  await page.click('.lws .lw-single'); await page.waitForTimeout(100);
  check((await t('.lw-status')) === 'Not a valid structure yet' && (await t('.lw-probs')).includes('N (atom 1) has only 6 electrons') && (await page.$$('.lws .lw-svg .ring')).length === 1, 'lewis: all single bonds leaves N short');
  await page.$eval('.lws .lw-svg', (s) => s.scrollIntoView({ block: 'center' }));
  await page.click('.lws .lw-svg .hit[data-k="2"]', { force: true }); await page.waitForTimeout(100);
  check((await t('.lw-status')) === 'Best structure (resonance form 3 of 3)', 'lewis: tapping a bond makes it double');
  await page.click('.lws .lw-svg .hit[data-k="2"]', { force: true }); await page.waitForTimeout(100);
  check((await t('.lw-probs')).includes('more than 8 is impossible'), 'lewis: triple bond overfills N');
  await page.click('.lws .lw-best'); await page.waitForTimeout(100);
  check((await t('.lw-status')).startsWith('Best structure'), 'lewis: best button');
  // Examples.
  await page.selectOption('.lws .lw-ex', 'co'); await page.waitForTimeout(150);
  check((await t('.lw-facts')).includes('C −1, O +1') && (await page.$$('.lws .lw-svg .bond')).length === 3 && await page.isDisabled('.lws .lw-next'), 'lewis: CO triple bond, C −1');
  await page.selectOption('.lws .lw-ex', 'bf3'); await page.waitForTimeout(150);
  check((await t('.lw-status')) === 'Best structure' && (await t('.lw-facts')).includes('fewer than 8') && (await t('.lw-note')).includes('Boron'), 'lewis: BF3 incomplete octet');
  await page.selectOption('.lws .lw-ex', 'so4'); await page.waitForTimeout(150);
  check((await t('.lw-facts')).includes('S +2'), 'lewis: sulfate octet form S +2');
  await page.check('.lws .lw-exp'); await page.waitForTimeout(150);
  check((await t('.lw-facts')).includes('S 0') && (await t('.lw-status')) === 'Best structure (resonance form 1 of 6)' && (await t('.lw-facts')).includes('expanded octet'), 'lewis: expanded octet sulfate');
  await page.uncheck('.lws .lw-exp');
  await page.selectOption('.lws .lw-ex', 'n2o'); await page.waitForTimeout(150);
  check((await t('.lw-note')).includes('N=N=O is a minor'), 'lewis: N2O minor form note');
  await page.selectOption('.lws .lw-ex', 'o2'); await page.waitForTimeout(150);
  check((await t('.lw-note')).includes('magnet'), 'lewis: O2 note');
  // Level switch.
  await page.click('.lws .lw-level button[data-l="10"]'); await page.waitForTimeout(150);
  check(await page.isHidden('.lws .lw-exp') && await page.isHidden('.lws .lw-next') && !(await t('.lw-facts')).includes('Formal'), 'lewis: Class 10 hides formal charges');
  await page.selectOption('.lws .lw-ex', 'co'); await page.waitForTimeout(150);
  check((await page.$$('.lws .lw-svg .fcc')).length === 0, 'lewis: Class 10 shows no charge circles');
  await page.click('.lws .lw-level button[data-l="11"]'); await page.waitForTimeout(150);
  // Build your own.
  await page.selectOption('.lws .lw-ex', 'own'); await page.waitForTimeout(150);
  check((await t('.lw-count')).includes('CCl₄') && (await t('.lw-count')).endsWith('= 32') && (await t('.lw-status')) === 'Best structure', 'lewis: own CCl4');
  await page.selectOption('.lws .lw-c', 'N'); await page.fill('.lws .lw-o', 'h h h h'); await page.selectOption('.lws .lw-q', '1'); await page.waitForTimeout(150);
  check((await t('.lw-count')).includes('NH₄⁺') && (await t('.lw-facts')).includes('N +1'), 'lewis: own NH4+');
  await page.fill('.lws .lw-o', 'Zz'); await page.waitForTimeout(100);
  check((await t('.lw-err')).includes('"Zz" is not in the list'), 'lewis: bad outer atom');
  await page.fill('.lws .lw-o', ''); await page.waitForTimeout(100);
  check((await t('.lw-err')).includes('at least one'), 'lewis: empty outer atoms');
  await page.selectOption('.lws .lw-c', 'C'); await page.selectOption('.lws .lw-q', '0'); await page.fill('.lws .lw-o', 'H H H H H'); await page.waitForTimeout(100);
  check((await t('.lw-err')).includes('No Lewis structure fits CH₅'), 'lewis: impossible formula');
  // Check yourself.
  const qs = await page.$$eval('.lws .lw-q1 label', (l) => l.map((x) => x.firstChild.textContent));
  check(qs.length === 4, 'lewis: 4 questions');
  const ans = qs.map((s) => {
    const m = EXAMPLES.find((e) => s.includes(` ${e.name}?`) || s.includes(` ${e.name} `) || s.endsWith(`${e.name}? (type −1 as -1)`));
    const f = solve(m).forms[0];
    if (s.includes('valence electrons')) return totalValence(m);
    if (s.includes('lone pairs')) return f.lone[0] / 2;
    if (s.includes('formal charge')) return f.fc[0];
    return f.orders.reduce((a, b) => a + b, 0);
  });
  const ins = await page.$$('.lws .lw-qa');
  for (let i = 0; i < 4; i++) await ins[i].fill(String(ans[i]));
  await page.click('.lws .lw-check'); await page.waitForTimeout(100);
  check((await t('.lw-score')) === '4 of 4 right', `lewis: quiz all right (${await t('.lw-score')})`);
  await ins[0].fill(String(ans[0] + 1)); await page.click('.lws .lw-check');
  check((await t('.lw-score')) === '3 of 4 right' && (await t('.lw-qs')).includes('✗ The answer is'), 'lewis: wrong answer shows working');
  await page.click('.lws .lw-new');
  check((await t('.lw-score')) === '', 'lewis: new questions');
};
