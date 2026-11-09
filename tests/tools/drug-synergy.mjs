// #472 drug combination synergy
export const path = '/science/drug-synergy/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/drug-synergy/`); await page.waitForTimeout(700);
  const big = () => page.textContent('.syn .syn-big'), facts = () => page.textContent('.syn .syn-facts'), hillT = () => page.textContent('.syn .syn-hill');
  check((await page.textContent('.syn .syn-med')).includes('For study and teaching, not medical advice. Check with a qualified professional.'), 'synergy: medical note shown');
  check((await big()) === 'Mean excess over Bliss +2.31, combination index 0.64', `synergy: example headline (${await big()})`);
  { const f = await facts(); check(f.includes('+6.23at Drug A 0.3 µM, Drug B 1 nM') && f.includes('+9.20') && f.includes('+5.28') && f.includes('0.643') && f.includes('22 below 0.9, 2 from 0.9 to 1.1, 0 above 1.1'), 'synergy: example scores match the guide'); }
  { const h = await hillT(); check(h.includes('0.8164 µM') && h.includes('Hill slope 1.20') && h.includes('13.34 nM') && h.includes('Hill slope 0.884'), 'synergy: single-drug Hill fits'); }
  check(await page.isVisible('.syn .syn-heat') && await page.isVisible('.syn .syn-fig'), 'synergy: heatmap and curves drawn');
  for (const v of ['hsaEx', 'loeweEx', 'ci', 'obs']) {
    await page.locator(`.syn .syn-view button[data-v=${v}]`).scrollIntoViewIfNeeded(); await page.click(`.syn .syn-view button[data-v=${v}]`); await page.waitForTimeout(100);
    check((await page.getAttribute(`.syn .syn-view button[data-v=${v}]`, 'aria-pressed')) === 'true' && (await page.getAttribute('.syn .syn-heat', 'aria-label')).includes('6 by 6'), `synergy: heatmap view ${v}`);
  }
  check((await page.textContent('.syn .syn-vhelp')).includes('measured responses'), 'synergy: view help text follows');
  await page.selectOption('.syn .syn-top', ''); await page.waitForTimeout(200);
  check((await hillT()).includes('top 99.73 %') && (await hillT()).includes('11.27 nM') && (await facts()).includes('0.656') && (await facts()).includes('geometric mean of 18 wells'), 'synergy: fitted top');
  await page.selectOption('.syn .syn-top', '100');
  await page.fill('.syn .syn-na', 'Inhibitor X'); await page.fill('.syn .syn-ua', 'mg/L'); await page.waitForTimeout(400);
  check((await hillT()).includes('Inhibitor X EC50') && (await facts()).includes('at Inhibitor X 0.3 mg/L'), 'synergy: drug names and units');
  // CSV of every well.
  { await page.locator('.syn .syn-csv').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click('.syn .syn-csv')]); const f = OUT + 'syn.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 37 && rows[0].startsWith('dose_a,dose_b,observed,bliss_expected') && rows.some((r) => r.startsWith('0.3,3,43.8,39.486,4.314,23.4,20.4,36.61010')), `synergy: wells CSV (${rows.length} rows)`); }
  { await page.locator('.syn .dl button[data-f=pdf]').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click('.syn .dl button[data-f=pdf]')]); check(d.suggestedFilename() === 'drug-synergy.pdf', 'synergy: PDF report'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.syn .dl button[data-f=png]')]); check(d.suggestedFilename() === 'drug-synergy.png', 'synergy: PNG report'); }
  // Bad input.
  await page.fill('.syn .syn-data', 'x\t1\t2\t3\n1\t10\t20\t30\n2\t20\t30\t40\n3\t30\t40\t50'); await page.waitForTimeout(400);
  check((await page.textContent('.syn .syn-err')).includes('needs a dose of 0') && await page.isHidden('.syn .syn-out'), 'synergy: missing zero row message');
  await page.fill('.syn .syn-data', 'x\t0\t1\t2\n0\t0\t20\t4000\n1\t20\t30\t40\n2\t20\t30\t40'); await page.waitForTimeout(400);
  check((await page.textContent('.syn .syn-err')).includes('% inhibition'), 'synergy: raw signal message');
  await page.fill('.syn .syn-data', 'x\t0\t1\t2\n0\t0\t20\t40\n1\t20\t30\t40\n2\t20\t30\t40'); await page.waitForTimeout(400);
  check((await page.textContent('.syn .syn-err')).includes('at least 3 doses above 0'), 'synergy: too few single-drug doses message');
};
