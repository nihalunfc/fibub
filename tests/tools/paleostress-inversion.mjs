// #869 paleostress inversion
export const path = '/science/paleostress-inversion/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/paleostress-inversion/`); await page.waitForTimeout(1200);
  const t = (c) => page.textContent('.pst ' + c);
  check((await t('.ps-big')) === 'σ1 11° → 037, σ3 78° → 227, Φ = 0.44', 'paleostress: example axes and ratio');
  { const f = await t('.ps-facts'); check(f.includes('2° → 128') && f.includes('within 5.2°') && f.includes('range 0.37 to 0.49') && f.includes('0.562') && f.includes('reverse or thrust') && f.includes('mean 4.29°') && f.includes('1000 resamples'), `paleostress: facts with bootstrap (${f.slice(0, 80)})`); }
  check(await page.isVisible('.pst .ps-fig') && (await page.locator('.pst .ps-tab tbody tr').count()) === 24, 'paleostress: stereonet and a row per fault');
  await page.selectOption('.pst .ps-nb', '0'); await page.waitForTimeout(200);
  check(!(await t('.ps-facts')).includes('resamples') && await page.isDisabled('.pst .ps-bcsv'), 'paleostress: no bootstrap');
  await page.selectOption('.pst .ps-nb', '200'); await page.selectOption('.pst .ps-cl', '0.9'); await page.waitForTimeout(300);
  check((await t('.ps-facts')).includes('90 % of resamples') && (await t('.ps-facts')).includes('200 resamples'), 'paleostress: 200 resamples at 90 %');
  for (const c of ['.ps-pt', '.ps-gc', '.ps-sl', '.ps-bs']) { await page.locator('.pst ' + c).scrollIntoViewIfNeeded(); await page.click('.pst ' + c); }
  await page.selectOption('.pst .ps-net', 'equal-angle'); await page.waitForTimeout(200);
  check((await t('.ps-leg')).includes('P (open)') && !(await t('.ps-leg')).includes('fault planes'), 'paleostress: display options and Wulff net');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pst .ps-csv')]); const f = OUT + 'ps.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 25 && rows[0].startsWith('line,strike_dip,rake,misfit_deg') && rows[1].startsWith('1,225 / 30,128,'), 'paleostress: faults CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pst .ps-bcsv')]); const f = OUT + 'psb.csv'; await d.saveAs(f); check(readFileSync(f, 'utf8').trim().split('\n').length === 201, 'paleostress: bootstrap CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pst .ps-out > .dl:last-child [data-f=pdf]')]); const f = OUT + 'ps.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 5).toString() === '%PDF-', 'paleostress: PDF report'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pst .ps-out > .dl:last-child [data-f=png]')]); const f = OUT + 'ps.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'paleostress: image report'); }
  // Striae format, conjugate normal faults
  await page.selectOption('.pst .ps-fmt', 'striae');
  await page.fill('.pst .ps-in', '000 60 090 60 N\n180 60 270 60 N\n090 60 180 60 N\n270 60 000 60 N\n045 70 135 70 N\n000 60 090 59 X\n000 60 270 10 N'); await page.waitForTimeout(600);
  check((await t('.ps-big')).startsWith('σ1 87° → 315') && (await t('.ps-facts')).includes('normal faulting'), 'paleostress: striae of normal faults give σ1 near vertical');
  check((await t('.ps-warn')).includes('line 6 skipped: sense must be N, R, D or S') && (await t('.ps-warn')).includes('line 7 skipped: the striation is 70°'), 'paleostress: bad striae named');
  await page.selectOption('.pst .ps-pf', 'dd'); await page.fill('.pst .ps-in', '090 60 -90\n270 60 -90\n180 60 -90\n000 60 -90'); await page.selectOption('.pst .ps-fmt', 'rake'); await page.waitForTimeout(600);
  check((await t('.ps-big')).startsWith('σ1 90°'), 'paleostress: dip-direction format');
  await page.fill('.pst .ps-in', '000 60 -90\n180 60 -90'); await page.waitForTimeout(600);
  check((await t('.ps-err')).includes('at least 4 faults') && await page.isHidden('.pst .ps-out'), 'paleostress: too few faults');
  await page.fill('.pst .ps-in', '000 60 -90\n000 60 -90\n000 60 -90\n000 60 -90'); await page.waitForTimeout(600);
  check((await t('.ps-err')).includes('too alike'), 'paleostress: faults that do not fix a tensor');
};
