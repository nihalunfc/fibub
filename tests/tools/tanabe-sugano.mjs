// #837 Tanabe–Sugano diagram
export const path = '/science/tanabe-sugano/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.tsd ';
  await page.goto(`${BASE}/science/tanabe-sugano/`); await page.waitForTimeout(1000);
  const big = () => page.textContent(R + '.tsd-big'), table = () => page.textContent(R + '.tsd-read tbody'), ffacts = () => page.textContent(R + '.tsd-ffacts');
  const row = async (label) => (await page.$$eval(R + '.tsd-read tbody tr', (trs) => trs.map((tr) => [...tr.querySelectorAll('td')].map((td) => td.textContent)))).find((r) => r[0].startsWith(label));
  check((await page.textContent(R + '.tsd-h')).includes('d³') && (await big()).includes('⁴A₂g at every Δ/B'), `ts: d3 example headline (${await big()})`);
  { const r = await row('⁴T₂g(F)'), s = await row('⁴T₁g(F)'), e = await row('²Eg(G)');
    check(r && r[1] === '20.00' && r[2] === '14000' && r[3] === '714' && s[1] === '29.36' && s[2] === '20552' && e[1] === '20.71', `ts: d3 at Δ/B = 20 matches the closed forms (${r} | ${s})`); }
  check((await table()).includes('✓'), 'ts: spin-allowed states are ticked');
  // Fit.
  { const t = await ffacts(); check(t.includes('17000 cm⁻¹') && t.includes('707.1 cm⁻¹') && t.includes('24.04') && t.includes('37606 cm⁻¹'), `ts: d3 fit matches the closed-form B (${t})`); }
  await page.fill(R + '.tsd-bf', '900'); await page.waitForTimeout(200);
  check((await ffacts()).includes('0.786'), 'ts: nephelauxetic ratio');
  await page.click(R + '.tsd-use'); await page.waitForTimeout(300);
  check((await page.inputValue(R + '.tsd-x')) === '24.04' && (await page.inputValue(R + '.tsd-b')) === '707.1', 'ts: use the fit sets Δ/B and B');
  check((await row('⁴T₂g(F)'))[2] === '17000' || (await row('⁴T₂g(F)'))[2] === '16999', `ts: the fitted point reads ν1 back (${await row('⁴T₂g(F)')})`);
  check(['24000', '23999', '24001'].includes((await row('⁴T₁g(F)'))[2]), `ts: and ν2 (${await row('⁴T₁g(F)')})`);
  await page.fill(R + '.tsd-n2', '16000'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.tsd-ferr')).includes('higher than ν1'), 'ts: ν2 below ν1 message');
  await page.fill(R + '.tsd-n2', '40000'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.tsd-ferr')).includes('between'), 'ts: ν2 out of range message');
  await page.fill(R + '.tsd-n2', '24000'); await page.fill(R + '.tsd-x', '20'); await page.fill(R + '.tsd-b', '700');
  // Free-ion terms of d3: 4F 0, 4P 15B, 2G 17.5, 2H and 2P 22.5, 2D 24.89 and 60.11, 2F 37.5 (A − 15B reference).
  { const t = await page.textContent(R + '.tsd-terms tbody'); check(['⁴F0.00', '⁴P15.00', '²G17.50', '²H22.50', '²P22.50', '²D24.89', '²F37.50', '²D60.11'].every((s) => t.includes(s)), `ts: d3 free-ion terms (${t.slice(0, 80)})`); }
  // d8: fit with the closed form.
  await page.selectOption(R + '.tsd-n', '8'); await page.waitForTimeout(500);
  await page.fill(R + '.tsd-n1', '8500'); await page.fill(R + '.tsd-n2', '13800'); await page.waitForTimeout(300);
  check((await ffacts()).includes('753.8 cm⁻¹') && (await ffacts()).includes('23007 cm⁻¹') && (await ffacts()).includes('³T₁g(P)'), `ts: d8 fit (${await ffacts()})`);
  // d5 and d6: spin crossover.
  await page.selectOption(R + '.tsd-n', '5'); await page.waitForTimeout(800);
  check((await big()).includes('⁶A₁g changes to ²T₂g at Δ/B = 28.41') && await page.isHidden(R + '.tsd-fitcard'), `ts: d5 crossover (${await big()})`);
  await page.selectOption(R + '.tsd-n', '6'); await page.waitForTimeout(800);
  check((await big()).includes('⁵T₂g changes to ¹A₁g at Δ/B = 18.90'), `ts: d6 crossover (${await big()})`);
  await page.fill(R + '.tsd-x', '25'); await page.waitForTimeout(200);
  check((await page.$$eval(R + '.tsd-read tbody tr', (t) => t[0].textContent)).startsWith('¹A₁g'), 'ts: low-spin ground state above the crossover');
  await page.fill(R + '.tsd-g', '4.8'); await page.waitForTimeout(800);
  check((await big()).includes('Δ/B = 20.02'), `ts: C/B = 4.8 moves the d6 crossover near 20 (${await big()})`);
  await page.fill(R + '.tsd-g', '4.5'); await page.waitForTimeout(500);
  // Show all states.
  const nShort = (await page.$$(R + '.tsd-read tbody tr')).length;
  await page.click(R + '.tsd-more'); await page.waitForTimeout(200);
  const nAll = (await page.$$(R + '.tsd-read tbody tr')).length;
  check(nAll === 43 && nShort < nAll, `ts: show all lists every d6 state (${nShort} → ${nAll})`);
  await page.click(R + '.tsd-more');
  // Spin-allowed only and the plot click.
  await page.selectOption(R + '.tsd-show', 'allowed'); await page.waitForTimeout(300);
  check(await page.isVisible(R + '.tsd-fig'), 'ts: spin-allowed view drawn');
  await page.selectOption(R + '.tsd-show', 'all');
  const box = await page.$(R + '.tsd-fig'); await box.scrollIntoViewIfNeeded(); const bb = await box.boundingBox();
  await page.mouse.click(bb.x + bb.width * 0.4, bb.y + bb.height * 0.4); await page.waitForTimeout(300);
  { const x = Number(await page.inputValue(R + '.tsd-x')); check(x > 5 && x < 40 && x !== 25, `ts: click reads at a new Δ/B (${x})`); }
  // CSV.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.tsd-csv')]); const f = OUT + 'ts.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'state,spin_multiplicity,ground_state_side,delta_over_B,E_over_B' && rows.some((r) => r.startsWith('¹A₁g(I),1,strong field,40,0')), `ts: diagram CSV (${rows.length} rows)`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'tanabe-sugano-d6.pdf', 'ts: PDF report'); }
  // Bad input.
  await page.fill(R + '.tsd-g', 'x'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.tsd-err')).includes('C/B') && await page.isHidden(R + '.tsd-out'), 'ts: bad C/B message');
  await page.fill(R + '.tsd-g', '4.5'); await page.fill(R + '.tsd-xmax', '1'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.tsd-err')).includes('Δ/B up to'), 'ts: bad range message');
  await page.fill(R + '.tsd-xmax', '40'); await page.fill(R + '.tsd-x', '-3'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.tsd-conv')).includes('between 0 and 200'), 'ts: bad read-at message');
  await page.fill(R + '.tsd-x', '20'); await page.selectOption(R + '.tsd-n', '3'); await page.waitForTimeout(500);
};
