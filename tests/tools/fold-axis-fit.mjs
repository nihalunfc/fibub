// #207 fold axis and cylindrical best fit
export const path = '/science/fold-axis-fit/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/fold-axis-fit/`); await page.waitForTimeout(1200);
  const t = (c) => page.textContent('.fax ' + c);
  check((await t('.fx-big')) === 'Fold axis 18° → 062, open fold (interlimb 87°)', `fold-axis: example axis and fold class (${await t('.fx-big')})`);
  { const f = await t('.fx-facts'); check(f.includes('152/72') && f.includes('0.547, 0.451, 0.002') && f.includes('0.03') && f.includes('5.74') && f.includes('RMS 2.4° off the girdle') && f.includes('very nearly cylindrical') && f.includes('largest 7.9°') && f.includes('38.7° radius') && f.includes('σ = 2.34'), `fold-axis: example facts (${f.slice(0, 120)})`); }
  { const f = await t('.fx-limbs'); check(f.includes('052/60') && f.includes('265/38') && f.includes('86.6°') && f.includes('open') && f.includes('246/78') && f.includes('17° → 062') && f.includes('0.8° from the π-axis') && f.includes('14 planes') && f.includes('13 planes'), `fold-axis: limbs (${f.slice(0, 120)})`); }
  check(await page.isHidden('.fax .fx-nolimb') && await page.isHidden('.fax .fx-err') && await page.isHidden('.fax .fx-warn'), 'fold-axis: no errors or warnings on the example');
  check(await page.isVisible('.fax .fx-fig') && (await page.locator('.fax .fx-tab tbody tr').count()) === 32, 'fold-axis: net and a row per plane');
  // The net is drawn: some pixels differ from the background.
  { await page.waitForFunction(() => { const c = document.querySelector('.fax .fx-fig'); return c && c.width > 100; }); const n = await page.evaluate(() => { const c = document.querySelector('.fax .fx-fig'), x = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let k = 0; for (let i = 0; i < x.length; i += 4) if (x[i] < 128) k++; return k; }); check(n > 2000, `fold-axis: net drawn (${n} dark pixels)`); }
  { const l = await t('.fx-leg'); check(l.includes('poles, limb A') && l.includes('poles, limb B') && l.includes('girdle') && l.includes('density, every 2σ') && l.includes('axial plane') && !l.includes('limb mean planes'), 'fold-axis: legend for the default view'); }
  // Overturned limb gives the supplement.
  await page.selectOption('.fax .fx-ov', 'over'); await page.waitForTimeout(250);
  check((await t('.fx-limbs')).includes('93.4°') && (await t('.fx-big')).includes('open fold (interlimb 93°)'), 'fold-axis: one limb overturned');
  await page.selectOption('.fax .fx-ov', 'up');
  // Display options
  for (const c of ['.fx-sp', '.fx-sg', '.fx-sk', '.fx-sl', '.fx-sa']) { await page.locator('.fax ' + c).scrollIntoViewIfNeeded(); await page.click('.fax ' + c); }
  await page.waitForTimeout(250);
  { const l = await t('.fx-leg'); check(!l.includes('poles') && !l.includes('girdle') && !l.includes('density') && !l.includes('axial plane') && l.includes('limb mean planes') && l.includes('fold axis'), 'fold-axis: display options'); }
  for (const c of ['.fx-sp', '.fx-sg', '.fx-sk', '.fx-sl', '.fx-sa']) { await page.locator('.fax ' + c).scrollIntoViewIfNeeded(); await page.click('.fax ' + c); }
  // Downloads
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.fax .fx-csv')]); const f = OUT + 'fx.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 33 && rows[0] === 'line,strike_dip_rhr,pole_plunge_trend,off_girdle_deg,limb' && rows[1].startsWith('1,050/50,') && rows[1].endsWith(',A') && rows[4].endsWith(','), 'fold-axis: poles CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.fax .fx-rcsv')]); const f = OUT + 'fxr.csv'; await d.saveAs(f); const s = readFileSync(f, 'utf8'); check(s.startsWith('quantity,value\n') && s.includes('fold_axis_plunge,17.81') && s.includes('fold_axis_trend,62.12') && s.includes('interlimb_deg,86.64') && s.includes('tightness,open') && s.includes('n_planes,32'), 'fold-axis: results CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.fax .fx-out > .dl:last-child [data-f=pdf]')]); const f = OUT + 'fx.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 5).toString() === '%PDF-', 'fold-axis: PDF report'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.fax .fx-out > .dl:last-child [data-f=png]')]); const f = OUT + 'fx.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'fold-axis: image report'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.fax .fx-out > .dl:last-child [data-f=docx]')]); const f = OUT + 'fx.docx'; await d.saveAs(f); check(readFileSync(f).subarray(0, 2).toString() === 'PK', 'fold-axis: Word report'); }
  // Dip-direction input: an upright anticline with limbs dipping 30° east and west, axis horizontal north-south.
  await page.selectOption('.fax .fx-pf', 'dd');
  await page.fill('.fax .fx-in', '090 30 L1\n270 30 L2\n090 30 L1\n270 30 L2\n000 0'); await page.waitForTimeout(600);
  check((await t('.fx-big')).startsWith('Fold axis 0° → ') && (await t('.fx-big')).includes('gentle fold (interlimb 120°)') && (await t('.fx-limbs')).includes('090/30') && (await t('.fx-limbs')).includes('Limb L1 mean plane'), `fold-axis: dip-direction input (${await t('.fx-big')})`);
  // Unlabelled data: no limb results, a note on how to get them.
  await page.selectOption('.fax .fx-pf', 'rhr');
  await page.fill('.fax .fx-in', '000 30\n180 30\n090 10\n000 50\n180 45'); await page.waitForTimeout(600);
  check(await page.isVisible('.fax .fx-nolimb') && (await t('.fx-limbs')) === '' && !(await t('.fx-big')).includes('interlimb'), 'fold-axis: no labels, no limb results');
  // Bad lines and warnings
  await page.fill('.fax .fx-in', '030 40 SE\n400 20\n030 95\n000 30 A\n180 30 B\n090 10 C\n000 50 A'); await page.waitForTimeout(600);
  { const w = await t('.fx-warn'); check(w.includes('line 1 skipped') && w.includes('compass') && w.includes('line 2 skipped: strike must be 0 to 360') && w.includes('line 3 skipped: dip must be 0 to 90') && w.includes('3 labels found'), `fold-axis: bad lines named (${w.slice(0, 100)})`); }
  await page.fill('.fax .fx-in', '000 30\n000 34\n004 32\n356 32\n000 32'); await page.waitForTimeout(600);
  check((await t('.fx-warn')).includes('poorly fixed'), 'fold-axis: a cluster warns that the axis is poorly fixed');
  await page.fill('.fax .fx-in', '000 30\n180 30'); await page.waitForTimeout(600);
  check((await t('.fx-err')).includes('at least 3 planes') && await page.isHidden('.fax .fx-out'), 'fold-axis: too few planes');
};
