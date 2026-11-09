// #810 scientific notation formatter
export const path = '/science/scientific-notation-formatter/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/scientific-notation-formatter/`); await page.waitForTimeout(500);
  const big = () => page.textContent('.snf .snf-big');
  const form = (k) => page.textContent(`.snf .snf-forms code[data-k=${k}]`);
  check((await big()) === '(1.2 ± 0.4) × 10⁻⁴ m', 'scinote: example first line');
  check((await form('latex')) === '$(1.2 \\pm 0.4) \\times 10^{-4}\\,\\mathrm{m}$' && (await form('siunitx')) === '\\qty{1.2(4)e-4}{m}' && (await form('plain')) === '(1.2 +/- 0.4)e-4 m' && (await form('concise')) === '1.2(4) × 10⁻⁴ m', 'scinote: every output form');
  { const t = await page.textContent('.snf .snf-tab'); check(await page.locator('.snf .snf-tab tbody tr').count() === 6 && t.includes('9.81 ± 0.10') && t.includes('6.02 × 10²³') && t.includes('(1.234 ± 0.012) × 10⁻³ s') && t.includes('3.00 × 10⁸ m/s'), 'scinote: table of all lines'); }
  await page.selectOption('.snf .snf-not', 'si'); await page.waitForTimeout(150);
  check((await big()) === '(120 ± 40) µm' && (await form('siunitx')) === '\\qty{120(40)}{\\micro m}', 'scinote: SI prefix');
  await page.selectOption('.snf .snf-not', 'eng'); await page.waitForTimeout(150);
  check((await page.textContent('.snf .snf-tab')).includes('−457 × 10⁻⁶'), 'scinote: engineering');
  await page.selectOption('.snf .snf-not', 'plain'); await page.waitForTimeout(150);
  check((await big()) === '(0.00012 ± 0.00004) m', 'scinote: plain decimal');
  await page.selectOption('.snf .snf-not', 'sci');
  await page.selectOption('.snf .snf-rule', 'two'); await page.waitForTimeout(150);
  check((await big()) === '(1.23 ± 0.36) × 10⁻⁴ m', 'scinote: always two figures');
  await page.selectOption('.snf .snf-rule', 'one'); await page.waitForTimeout(150);
  check((await page.textContent('.snf .snf-tab')).includes('9.8 ± 0.1'), 'scinote: always one figure');
  await page.selectOption('.snf .snf-rule', 'lead12'); await page.selectOption('.snf .snf-rule', 'pdg');
  await page.fill('.snf .snf-sig', '5'); await page.waitForTimeout(300);
  check((await page.textContent('.snf .snf-tab')).includes('6.0221 × 10²³'), 'scinote: significant figures');
  await page.fill('.snf .snf-unit', 'g'); await page.waitForTimeout(300);
  check((await big()) === '(1.2 ± 0.4) × 10⁻⁴ g', 'scinote: unit box overrides');
  await page.fill('.snf .snf-unit', ''); await page.waitForTimeout(400);
  // Downloads and copying.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.snf .snf-csv')]); const f = OUT + 'sn.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').replace(/^﻿/, '').trim().split('\n'); check(rows.length === 7 && rows[0] === 'input,value,uncertainty,unicode,plain,latex,siunitx,concise,note' && rows[3].startsWith('9.80665 ± 0.0951,9.81,0.10,'), 'scinote: CSV download'); }
  await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (t) => { window.__clip = t; } } }); });
  await page.selectOption('.snf .snf-col', 'e'); await page.click('.snf .snf-copycol'); await page.waitForTimeout(150);
  check((await page.textContent('.snf .snf-done')) === 'Copied 6 lines.' && (await page.evaluate(() => window.__clip)).split('\n')[0] === '1.2e-4\t0.4e-4', 'scinote: copy a column for Excel');
  // A two-column file with a header.
  writeFileSync(OUT + 'sn.csv', 'value,uncertainty\n0.0123456,0.00078\n1500,25\n');
  await page.setInputFiles('.snf .dfb-in', OUT + 'sn.csv'); await page.waitForTimeout(500);
  check((await big()) === '(1.23 ± 0.08) × 10⁻²' && (await page.textContent('.snf .snf-tab')).includes('(1.500 ± 0.025) × 10³') && await page.isHidden('.snf .snf-err'), 'scinote: two-column CSV with a header');
  // Bad input.
  await page.fill('.snf .snf-in', '12.5\nabc\n3 ± 0'); await page.waitForTimeout(300);
  check((await page.textContent('.snf .snf-err')) === '2 of 3 lines could not be read; they are marked in the table.' && (await page.textContent('.snf .snf-tab')).includes('"abc" is not a number.') && (await page.textContent('.snf .snf-tab')).includes('The uncertainty is zero'), 'scinote: bad lines marked');
  await page.fill('.snf .snf-sig', '25'); await page.waitForTimeout(300);
  check((await page.textContent('.snf .snf-err')).startsWith('Give 1 to 20 significant figures') && await page.isHidden('.snf .snf-out'), 'scinote: bad significant figures');
  await page.fill('.snf .snf-sig', '3'); await page.click('.snf .snf-clear'); await page.waitForTimeout(200);
  check((await page.textContent('.snf .snf-err')) === 'Type a number first.', 'scinote: empty box');
  await page.click('.snf .snf-ex'); await page.waitForTimeout(200);
  check((await big()) === '(1.2 ± 0.4) × 10⁻⁴ m', 'scinote: example again');
};
