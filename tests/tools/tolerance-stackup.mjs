// #646 tolerance stack-up
export const path = '/science/tolerance-stackup/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/tolerance-stackup/`); await page.waitForTimeout(800);
  const R = '.tsu', t = (c) => page.textContent(`${R} ${c}`);
  check((await t('.ts-big')) === 'Gap 0.26: worst case ±0.31, RSS ±0.1825', `stack: example (${await t('.ts-big')})`);
  { const f = await t('.ts-facts'); check(f.includes('−0.05 to 0.57') && f.includes('0.077517 to 0.44248') && f.includes('σ = √(Σ σᵢ²) = 0.06083') && f.includes('0.959 and 0.767') && f.includes('Worst case fits?no'), 'stack: worst case, RSS, Cp/Cpk'); }
  { const f = await t('.ts-facts'), m = f.match(/Out of limits \(simulated\)([\d.]+) %/); check(!!m && Math.abs(+m[1] - 0.93) < 0.12 && f.includes('100,000 assemblies, seed 1'), `stack: simulated fallout near NumPy's 0.94 % (${m && m[1]})`); }
  { const tab = await t('.ts-tab'); check(tab.includes('Bearing width') && tab.includes('14.88 to 15') && tab.includes('32.4 %') && tab.includes('uniform'), 'stack: contribution table'); }
  check(await page.isVisible(`${R} .ts-fig`), 'stack: histogram');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .ts-csv`)]); const f = OUT + 'stack.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 100001 && rows[0] === 'gap', 'stack: simulated gaps CSV'); }
  const first = await t('.ts-facts');
  await page.fill(`${R} .ts-seed`, '2'); await page.waitForTimeout(700);
  check((await t('.ts-facts')) !== first && (await t('.ts-facts')).includes('seed 2'), 'stack: new seed, new draw');
  await page.fill(`${R} .ts-seed`, '1'); await page.waitForTimeout(700);
  check((await t('.ts-facts')) === first, 'stack: same seed repeats exactly');
  await page.fill(`${R} .ts-usl`, ''); await page.fill(`${R} .ts-lsl`, ''); await page.waitForTimeout(500);
  check(!(await t('.ts-facts')).includes('Cp and Cpk'), 'stack: no limits, no fallout');
  await page.fill(`${R} .ts-k`, '4'); await page.waitForTimeout(500);
  check((await t('.ts-big')) !== 'Gap 0.26: worst case ±0.31, RSS ±0.1825' && (await t('.ts-big')).includes('worst case ±0.31'), 'stack: k changes RSS only');
  // Open a file: two normal parts, RSS ±0.5.
  writeFileSync(OUT + 'chain.csv', 'Part,Nominal,Plus,Minus,Direction,Distribution\nA,10,0.3,,+,normal\nB,5,0.4,,-,normal\n');
  await page.fill(`${R} .ts-k`, '3'); await page.setInputFiles(`${R} .dfb-in`, OUT + 'chain.csv'); await page.waitForTimeout(700);
  check((await t('.ts-big')) === 'Gap 5: worst case ±0.7, RSS ±0.5', `stack: opened CSV (${await t('.ts-big')})`);
  await page.selectOption(`${R} .ts-n`, '10000'); await page.waitForTimeout(500);
  check((await t('.ts-facts')).includes('10,000 assemblies'), 'stack: sample count');
  await page.fill(`${R} .ts-data`, 'A, 10, x'); await page.waitForTimeout(500);
  check((await t('.ts-err')).includes('Row 1: give the tolerance') && await page.isHidden(`${R} .ts-out`), 'stack: bad row message');
  await page.fill(`${R} .ts-data`, 'A, 10, 0.1, 0.1, up'); await page.waitForTimeout(500);
  check((await t('.ts-err')).includes('direction must be'), 'stack: bad direction');
  await page.fill(`${R} .ts-data`, 'A, 10, 0.1'); await page.fill(`${R} .ts-lsl`, '11'); await page.fill(`${R} .ts-usl`, '10'); await page.waitForTimeout(500);
  check((await t('.ts-err')).includes('lower limit must be below'), 'stack: limits reversed');
  await page.fill(`${R} .ts-usl`, '12'); await page.waitForTimeout(500);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .dl button[data-f=pdf]`)]); check((await d.suggestedFilename()) === 'tolerance-stackup.pdf', 'stack: PDF report'); }
};
