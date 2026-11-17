// #1122 Photosynthesis lab
export const path = '/learn/photosynthesis-lab/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.phl ';
  await page.goto(`${BASE}/learn/photosynthesis-lab/`); await page.waitForTimeout(800);
  const big = () => page.textContent(R + '.phl-big'), facts = () => page.textContent(R + '.phl-facts');
  const tap = async (sel) => { await page.locator(R + sel).scrollIntoViewIfNeeded(); await page.click(R + sel); await page.waitForTimeout(250); };
  const slide = async (sel, v) => { await page.$eval(R + sel, (el, v) => { el.value = String(v); el.dispatchEvent(new Event('input', { bubbles: true })); }, v); await page.waitForTimeout(250); };
  check((await big()) === '13.0 bubbles a minute: light is the limiting factor', `photo: example (${await big()})`);
  check((await facts()).includes('25.0 units') && (await page.textContent(R + '.phl-formula')).includes('(10 ÷ 20)² × 100 = 25.0 units'), 'photo: light from distance, Class 10 formula');
  // bubbles really rise: canvas changes between frames
  const snap = () => page.$eval(R + '.phl-fig', (c) => c.toDataURL());
  await page.waitForTimeout(1500); const a = await snap(); await page.waitForTimeout(700); const b = await snap();
  check(a !== b && a.length > 3000, 'photo: picture drawn and moving');
  await slide('.phl-d', 10);
  check((await big()) === '22.0 bubbles a minute: carbon dioxide is the limiting factor' && (await page.textContent(R + '.phl-say')).includes('Add baking soda'), `photo: close lamp, CO2 limits (${await big()})`);
  await slide('.phl-c', 1);
  check((await big()).includes('temperature is the limiting factor') && (await page.textContent(R + '.phl-say')).includes('cool'), `photo: then temperature limits (${await big()})`);
  await slide('.phl-t', 40);
  check((await big()) === '11.0 bubbles a minute: temperature is the limiting factor' && (await page.textContent(R + '.phl-say')).includes('too warm'), `photo: too warm (${await big()})`);
  await slide('.phl-t', 25); await slide('.phl-c', 0.25); await slide('.phl-d', 100);
  check((await big()).startsWith('0.0 bubbles') && (await page.textContent(R + '.phl-say')).includes('uses up all the oxygen'), `photo: far lamp, below compensation (${await big()})`);
  await slide('.phl-d', 20);
  // Class 11 detail
  await tap('.phl-level button[data-v="11"]');
  { const f = await facts(); check(f.includes('gross 15.0 − respiration 2.0') && f.includes('Light could allow15.0 /min') && f.includes('CO₂ could allow24.0 /min') && f.includes('Enzymes could allow35.4 /min') && f.includes('3.3 light units'), `photo: Class 11 facts (${f.slice(0, 200)})`); }
  check((await page.textContent(R + '.phl-formula')).includes('smallest of (15.0, 24.0, 35.4) = 15.0; minus respiration 2.0 = 13.0'), 'photo: Class 11 formula');
  // Graph axis switch
  const g0 = await page.$eval(R + '.phl-graph', (c) => c.toDataURL());
  await tap('.phl-axis button[data-v=co2]');
  check((await page.textContent(R + '.phl-gnote')).startsWith('More carbon dioxide') && g0 !== await page.$eval(R + '.phl-graph', (c) => c.toDataURL()), 'photo: CO2 graph');
  await tap('.phl-axis button[data-v=temperature]');
  check((await page.textContent(R + '.phl-gnote')).includes('30 °C'), 'photo: temperature graph');
  // Counting
  check(await page.isDisabled(R + '.phl-csv'), 'photo: CSV waits for a count');
  await tap('.phl-count'); await tap('.phl-count'); await slide('.phl-d', 10); await tap('.phl-count');
  const rows = await page.$$eval(R + '.phl-tab tbody tr', (t) => t.map((r) => r.textContent));
  check(rows.length === 3 && rows[2].startsWith('10100.0'), `photo: counts table (${rows[2]})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.phl-csv')]); const f = OUT + 'photo.csv'; await d.saveAs(f); const l = readFileSync(f, 'utf8').trim().split('\n');
    check(l[0] === 'lamp_cm,light_units,co2_percent,temperature_C,bubbles_per_min' && l.length === 4 && l[1].startsWith('20,25,0.25,25,'), `photo: CSV (${l[1]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); const f = OUT + 'photo.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'photo: image report'); }
  await tap('.phl-clear');
  check((await page.$$eval(R + '.phl-tab tr', (t) => t.length)) === 0 && await page.isDisabled(R + '.phl-csv'), 'photo: clear counts');
  // Check yourself at both levels
  for (const lv of ['11', '10']) {
    await tap(`.phl-level button[data-v="${lv}"]`);
    await tap('.phl-check');
    check((await page.textContent(R + '.phl-score')) === '0 of 4 right.', `photo: Class ${lv} quiz blanks are wrong`);
    await page.$$eval(R + '.phl-qs li', (lis) => lis.forEach((li) => { li.querySelector('.phl-ans').value = li.dataset.a; }));
    await tap('.phl-check');
    check((await page.textContent(R + '.phl-score')) === '4 of 4 right.' && (await page.$$eval(R + '.phl-worked', (w) => w.every((e) => e.textContent.startsWith('✓')))), `photo: Class ${lv} quiz right answers`);
  }
  await tap('.phl-new');
  check((await page.textContent(R + '.phl-score')) === '', 'photo: new questions');

  // ---- Solve my numbers (phys-e.ts) ----
  const PS = '.ps-host ';
  const psAns = () => page.textContent(PS + '.ps-ans'), psWork = () => page.textContent(PS + '.ps-work');
  const psSolve = async (prob, vals, units = {}) => {
    await page.selectOption(PS + '[data-k="prob"]', prob);
    await page.$$eval(PS + `label[data-p="${prob}"] select`, (ss, u) => ss.forEach((s) => { const k = s.dataset.k; const want = u[k]; s.value = want ?? s.options[0].value; }), Object.fromEntries(Object.entries(units).map(([k, v]) => [`${prob}-${k}-u`, v])));
    for (const [k, v] of Object.entries(vals)) await page.fill(PS + `[data-k="${prob}-${k}"]`, v);
    await page.waitForTimeout(80);
  };
  const psCase = async (name, prob, vals, ans, work, units) => {
    await psSolve(prob, vals, units);
    const a = await psAns(), w = await psWork();
    check(a === ans && (!work || w.includes(work)) && !/NaN|Infinity/.test(a + w), `solve ${name}: ${a}${work && !w.includes(work) ? ' / working: ' + w : ''}`);
  };
  check((await page.getAttribute(PS + '.ps-out', 'aria-live')) === 'polite', 'solve: answer is a polite live region');

  await psCase('bubbles', 'bub', { n: '24', t: '2' }, 'The rate is 12 bubbles per minute.', 'rate = 24 ÷ 2 min');
  await psCase('bubbles with seconds', 'bub', { n: '24', t: '120' }, 'The rate is 12 bubbles per minute.', 'Convert to base units', { t: 's' });
  await psCase('gas volume', 'vol', { v: '0.6', t: '10' }, 'The rate is 0.06 mL per minute (3.6 mL per hour).', 'rate = 0.06 mL/min = 3.6 mL/h');
  await psCase('lamp moved', 'light', { d1: '10', d2: '20' }, 'The light is 0.25 times as bright (25 % of the first). It is dimmer.', 'I₂ / I₁ = (10 ÷ 20)² = 0.25');
  await psCase('Q10', 'q10', { r1: '12', r2: '24', t1: '20', t2: '30' }, 'Q₁₀ is 2.', 'Q₁₀ = (24 ÷ 12)^(10 ÷ 10)');
  await psCase('same temperatures', 'q10', { r1: '12', r2: '24', t1: '20', t2: '20' }, 'The two temperatures must be different.', null);
  await psCase('gross', 'gross', { net: '8', resp: '2' }, 'The gross rate of photosynthesis is 10, in the same units as you typed.', 'gross = 8 + 2 = 10');
  await psCase('compensation point', 'gross', { net: '0', resp: '2' }, 'The gross rate of photosynthesis is 2, in the same units as you typed.', 'compensation point');
  await psCase('percentage change', 'pct', { a: '12', b: '30' }, 'An increase of 150 %.', null);
  await psSolve('bub', { n: '24', t: '0' }); check((await psAns()).includes('must be more than 0') && !/NaN|Infinity/.test(await psAns()), 'solve: zero time gives a friendly message');
  await page.click(PS + '.ps-pre button:has-text("Gas syringe")'); await page.waitForTimeout(80);
  check((await psAns()).startsWith('The rate is 0.06 mL per minute') && (await page.textContent(PS + '.ps-tip')).includes('Common mistake'), 'solve: preset Gas syringe and tip');
};
