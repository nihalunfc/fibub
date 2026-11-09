// #508 proxy record stacker
export const path = '/science/proxy-stacker/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.pxs ';
  const t = (s) => page.textContent(R + s);
  const wait = () => page.waitForTimeout(450);
  await page.goto(`${BASE}/science/proxy-stacker/`); await page.waitForTimeout(600);
  check((await t('.ps-big')) === 'Mean stack of 4 records, 500 to 5700 years BP', 'proxy: example stack');
  { const f = await t('.ps-facts'); check(f.includes('53 ages') && f.includes('500 to 5700, step 100') && f.includes('FlippedLake d18O'), 'proxy: auto grid and flip facts'); }
  { const c = await t('.ps-cor'); check(c.includes('Lake d18OCave d13C530.9260.730.7415.83.1e-72.9e-23') && c.includes('+100 (r 0.89)') && c.includes('Best lag (years)'), 'proxy: correlation table with n_eff (numpy/scipy values)'); }
  check(await page.isVisible(R + '.ps-fig1') && await page.isVisible(R + '.ps-fig2') && await page.isVisible(R + '.ps-fig3'), 'proxy: three figures');
  // Lag scan pair.
  await page.selectOption(R + '.ps-b', 'Marine SST'); await wait();
  check((await t('.ps-lagbig')) === 'Lake d18O vs Marine SST: highest r 0.89 at lag +100 years', 'proxy: lag scan finds the age offset');
  // Flip off: r turns negative.
  await page.click(R + 'input.ps-flip[data-n="Lake d18O"]'); await wait();
  check((await t('.ps-cor')).includes('Lake d18OCave d13C53-0.926') && (await t('.ps-facts')).includes('Flippednone'), 'proxy: flip off');
  await page.click(R + 'input.ps-flip[data-n="Lake d18O"]'); await wait();
  // Leave a record out.
  await page.click(R + 'input.ps-use[data-n="Pollen index"]'); await wait();
  check((await t('.ps-big')) === 'Mean stack of 3 records, 200 to 5700 years BP' && !(await t('.ps-cor')).includes('Pollen'), `proxy: untick a record (${await t('.ps-big')})`);
  await page.click(R + 'input.ps-use[data-n="Pollen index"]'); await wait();
  // Median and bootstrap.
  await page.selectOption(R + '.ps-meth', 'median'); await page.selectOption(R + '.ps-env', 'boot'); await wait();
  check((await t('.ps-big')).startsWith('Median stack of 4') && (await page.evaluate(() => document.querySelector('.pxs .ps-fig2').getAttribute('aria-label'))).includes('median'), 'proxy: median stack with bootstrap');
  // CSV of the stack.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ps-csv')]); const f = OUT + 'ps.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    const r3000 = rows.find((r) => r.startsWith('3000,')).split(',');
    check(rows.length === 54 && rows[0] === 'age,Lake d18O_z,Cave d13C_z,Marine SST_z,Pollen index_z,stack_median,envelope_low,envelope_high,n_records' && r3000[8] === '4', 'proxy: stack CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ps-ccsv')]); const f = OUT + 'psc.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 7 && rows[1].startsWith('Lake d18O,Cave d13C,53,0.92626'), 'proxy: correlations CSV'); }
  await page.selectOption(R + '.ps-meth', 'mean'); await page.selectOption(R + '.ps-env', 'sd');
  // z-score window, own grid, gap limit (example z-scores over 1000-4000 match numpy in the sci tests).
  await page.fill(R + '.ps-w0', '1000'); await page.fill(R + '.ps-w1', '4000'); await wait();
  check((await t('.ps-facts')).includes('z-score window1000 to 4000'), 'proxy: z-score window');
  await page.fill(R + '.ps-g0', '0'); await page.fill(R + '.ps-g1', '6000'); await page.fill(R + '.ps-gs', '200'); await page.fill(R + '.ps-minn', '3'); await wait();
  { const f = await t('.ps-facts'); check(f.includes('31 ages') && f.includes('0 to 6000, step 200') && (await t('.ps-big')).includes('200 to 5800'), `proxy: own grid and records needed (${await t('.ps-big')})`); }
  await page.fill(R + '.ps-gap', '1'); await wait();
  check((await t('.ps-err')).includes('fewer than 3 grid ages'), 'proxy: gap limit too tight leaves too little data');
  await page.fill(R + '.ps-gap', ''); await page.fill(R + '.ps-gs', '-5'); await wait();
  check((await t('.ps-err')).includes('step above 0') && await page.isHidden(R + '.ps-out'), 'proxy: bad grid message');
  await page.fill(R + '.ps-gs', ''); await page.fill(R + '.ps-g0', ''); await page.fill(R + '.ps-g1', ''); await page.fill(R + '.ps-w0', ''); await page.fill(R + '.ps-w1', ''); await page.fill(R + '.ps-minn', '2'); await wait();
  // Bad pasted data.
  await page.fill(R + '.ps-data', 'A,1,2\nA,2,3\nA,3,4'); await wait();
  check((await t('.ps-err')).includes('at least two records'), 'proxy: one record is not enough');
  await page.fill(R + '.ps-data', '1\t2\t3\n4\t5\t6'); await wait();
  check((await t('.ps-err')).includes('pairs'), 'proxy: odd wide table message');
  // Wide format.
  await page.fill(R + '.ps-data', 'age\tA\tage\tB\n' + Array.from({ length: 30 }, (_, i) => `${i * 10}\t${Math.sin(i / 3).toFixed(3)}\t${i * 10 + 5}\t${Math.sin((i + 0.5) / 3).toFixed(3)}`).join('\n')); await wait();
  check((await t('.ps-big')).startsWith('Mean stack of 2 records') && (await t('.ps-cor')).includes('AB'), 'proxy: wide format');
  // Two files, one record each.
  const mk = (n, ph) => { const f = OUT + n; writeFileSync(f, 'depth,age,d18O\n' + Array.from({ length: 40 }, (_, i) => `${i},${i * 25},${(Math.cos(i / 4 + ph) + 0.01 * i).toFixed(3)}`).join('\n')); return f; };
  await page.setInputFiles(R + '.ps-file', [mk('coreA.csv', 0), mk('coreB.csv', 0.2)]); await page.waitForTimeout(800);
  check((await t('.ps-note')).includes('coreA.csv: 1 record') && (await t('.ps-recs')).includes('coreB') && (await t('.ps-big')).startsWith('Mean stack of 2 records'), 'proxy: two files opened as two records');
  { const f = OUT + 'bad.csv'; writeFileSync(f, 'name\nx\ny'); await page.setInputFiles(R + '.ps-file', [f, mk('coreC.csv', 0)]); await page.waitForTimeout(500); check((await t('.ps-ferr')).includes('no age and value columns'), 'proxy: bad file message'); }
  await page.click(R + '.ps-ex'); await wait();
  check((await t('.ps-big')) === 'Mean stack of 4 records, 500 to 5700 years BP', 'proxy: example button restores');
};
