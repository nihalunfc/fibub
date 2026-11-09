// #935 Sellmeier fitter
export const path = '/science/sellmeier-fitter/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.slf ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(900);
  const big = () => page.textContent(R + '.sf-big'), facts = () => page.textContent(R + '.sf-facts'), wait = () => page.waitForTimeout(900);
  check((await big()) === 'Sellmeier, 3 terms: RMS residual 1.1 × 10⁻⁵, largest 1.6 × 10⁻⁵', `sell: example fit (${await big()})`);
  { const f = await facts(); check(f.includes('1.51038') && f.includes('1.53103') && f.includes('−15.80 fs²/mm') && f.includes('anomalous') && f.includes('1.52968') && f.includes('49.64'), `sell: example derived values ${f}`); }
  { const t = await page.textContent(R + '.sf-tab'); check((await page.$$(R + '.sf-tab tr')).length === 7 && t.includes('C3 (µm²)') && t.includes('±'), 'sell: coefficient table with standard errors'); }
  check((await page.textContent(R + '.sf-note')).includes('poorly fixed') && (await page.textContent(R + '.sf-note')).includes('14 points from 380 to 1600 nm'), 'sell: notes on the infrared term and data range');
  { const t = await page.textContent(R + '.sf-cmp'); check((await page.$$(R + '.sf-cmp tr')).length === 6 && t.includes('(shown)') && t.includes('9.8 × 10⁻⁵') && t.includes('0.0010'), `sell: all models compared ${t}`); }
  check(await page.isVisible(R + '.sf-fig') && await page.isVisible(R + '.sf-fig2'), 'sell: fit and residual charts');
  await page.selectOption(R + '.sf-m', 's2'); await wait();
  check((await big()).startsWith('Sellmeier, 2 terms: RMS residual 9.8 × 10⁻⁵'), 'sell: 2-term Sellmeier');
  await page.selectOption(R + '.sf-m', 's1'); await wait();
  check((await big()).startsWith('Sellmeier, 1 term'), 'sell: 1-term Sellmeier');
  await page.selectOption(R + '.sf-m', 'c3'); await wait();
  check((await big()).startsWith('Cauchy, 3 terms: RMS residual 0.0010') && (await page.textContent(R + '.sf-tab')).includes('C (µm⁴)'), 'sell: Cauchy 3 terms');
  await page.selectOption(R + '.sf-m', 'c2'); await wait();
  check((await big()).startsWith('Cauchy, 2 terms'), 'sell: Cauchy 2 terms');
  await page.selectOption(R + '.sf-m', 's3'); await page.fill(R + '.sf-at', '800'); await wait();
  check((await facts()).includes('61.33 fs²/mm') && (await facts()).includes('normal dispersion') && (await facts()).includes('interpolated'), 'sell: evaluate at 800 nm, normal dispersion');
  await page.fill(R + '.sf-at', '3000'); await wait();
  check((await facts()).includes('extrapolated'), 'sell: extrapolation is flagged');
  // µm data from a file.
  const um = 'lambda_um,n\n0.45,1.4650\n0.5,1.4625\n0.55,1.4605\n0.6,1.4590\n0.65,1.4578\n0.7,1.4568\n';
  writeFileSync(OUT + 'idx.csv', um);
  await page.selectOption(R + '.sf-m', 'c2'); await page.setInputFiles(R + '.dfb-in', OUT + 'idx.csv'); await wait();
  check((await page.textContent(R + '.sf-note')).includes('6 points from 450 to 700 nm') && (await page.textContent(R + '.dfb-note')).includes('Opened idx.csv'), 'sell: open a CSV file in µm');
  await page.selectOption(R + '.sf-m', 's3'); await wait();
  check((await page.textContent(R + '.sf-err')).includes('at least 7 data points') && await page.isHidden(R + '.sf-out'), 'sell: too few points message');
  await page.fill(R + '.sf-in', '500 1.5\n500 1.51\n600 1.49'); await wait();
  check((await page.textContent(R + '.sf-err')).includes('same wavelength'), 'sell: duplicate wavelength message');
  await page.fill(R + '.sf-in', 'n\n1.5\n1.6'); await wait();
  check((await page.textContent(R + '.sf-err')).includes('two columns'), 'sell: one column message');
  await page.click(R + '.sf-ex'); await page.fill(R + '.sf-at', '1550'); await wait();
  check(await page.isVisible(R + '.sf-out') && (await big()).includes('1.1 × 10⁻⁵'), 'sell: example button restores the data');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.sf-csv')]); const f = OUT + 'sell.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 302 && rows[0] === 'wavelength_nm,n_fit', 'sell: fitted curve CSV'); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl [data-f=${fmt}]`)]); check(d.suggestedFilename().endsWith('.' + fmt), `sell: ${fmt} download`); }
};
