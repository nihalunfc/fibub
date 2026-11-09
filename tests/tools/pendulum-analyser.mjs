// #902 pendulum lab analyser
export const path = '/science/pendulum-analyser/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/pendulum-analyser/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.pna .pn-big'), facts = () => page.textContent('.pna .pn-facts');
  check((await big()) === 'g = 9.825 ± 0.017 m/s²', 'pendulum: example g through the origin');
  { const f = await facts(); check(f.includes('9.7819 to 9.8685') && f.includes('+0.15 %') && f.includes('within 2 uncertainties') && f.includes('9.7411 without it') && f.includes('0.86 %') && f.includes('R² = 0.999924') && f.includes('5.3 ms'), 'pendulum: example facts (interval, comparison, correction, fit quality)'); }
  { const t = await page.textContent('.pna .pn-tab'); check(t.includes('Residual') && (await page.$$('.pna .pn-tab tr')).length === 7, 'pendulum: table of 6 rows'); }
  check(await page.isVisible('.pna .pn-fig') && await page.isVisible('.pna .pn-fig2'), 'pendulum: fit and residual charts');
  await page.selectOption('.pna .pn-fit', 'offset'); await page.waitForTimeout(150);
  check((await big()) === 'g = 9.827 ± 0.043 m/s²' && (await facts()).includes('0.157 ± 3.4 mm'), 'pendulum: offset fit gives g and δ');
  await page.selectOption('.pna .pn-fit', 'origin');
  await page.fill('.pna .pn-data', '20 9.09\n40 12.64\n60 15.62\n80 18.00\n100 20.13\n120 22.06'); await page.selectOption('.pna .pn-u', '0.01'); await page.fill('.pna .pn-n', '10'); await page.fill('.pna .pn-amp', '15'); await page.waitForTimeout(200);
  check((await big()) === 'g = 9.825 ± 0.017 m/s²', 'pendulum: centimetres, 10 swings and one amplitude for all rows give the same g');
  await page.fill('.pna .pn-amp', '0'); await page.waitForTimeout(150);
  check((await big()).startsWith('g = 9.74') && (await facts()).includes('none applied'), 'pendulum: no amplitude correction');
  await page.fill('.pna .pn-gx', '9.6'); await page.waitForTimeout(150);
  check((await facts()).includes('more than 2 uncertainties'), 'pendulum: far from the expected g is flagged');
  await page.fill('.pna .pn-data', '0.5, 1.4\n0.5, abc\n1, 2'); await page.waitForTimeout(150);
  check((await page.textContent('.pna .pn-err')).includes('Row 2') && await page.isHidden('.pna .pn-out'), 'pendulum: bad row message');
  await page.fill('.pna .pn-data', '0.5, 1.4\n1, 2'); await page.waitForTimeout(150);
  check((await page.textContent('.pna .pn-err')).includes('at least 3'), 'pendulum: too few rows message');
  await page.fill('.pna .pn-data', '1, 2\n1, 2.01\n1, 1.99'); await page.waitForTimeout(150);
  check((await page.textContent('.pna .pn-err')).includes('different lengths'), 'pendulum: same length message');
  writeFileSync(OUT + 'pend.csv', 'L,T,amp\n0.2,0.909,15\n0.4,1.264,15\n0.6,1.562,15\n0.8,1.800,15\n1.0,2.013,15\n1.2,2.206,15\n');
  await page.selectOption('.pna .pn-u', '1'); await page.fill('.pna .pn-n', '1'); await page.fill('.pna .pn-gx', '9.81');
  await page.setInputFiles('.pna .dfb-in', OUT + 'pend.csv'); await page.waitForTimeout(400);
  check((await big()) === 'g = 9.825 ± 0.017 m/s²' && (await page.textContent('.pna .dfb-note')).includes('7 rows'), 'pendulum: open a CSV file');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pna .pn-csv')]); const f = OUT + 'pendfit.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 7 && rows[0].startsWith('L_m,T_s,amplitude_deg') && rows[1].startsWith('0.2,0.909,15,'), 'pendulum: table CSV'); }
  { const t = await page.textContent('.pna .pn-cfacts'); check(t.includes('2.0061 s') && t.includes('2.0410 s') && t.includes('1.74 %'), 'pendulum: large-angle calculator at 30°'); }
  await page.fill('.pna .pn-ca', '200'); await page.waitForTimeout(100);
  check((await page.textContent('.pna .pn-cerr')).includes('between 0° and 180°'), 'pendulum: bad amplitude message in the calculator');
  await page.fill('.pna .pn-ca', '90'); await page.waitForTimeout(100);
  check((await page.textContent('.pna .pn-cfacts')).includes('18 %'), 'pendulum: 90° is 18 % longer');
  for (const [f, n] of [['png', 'Image'], ['pdf', 'PDF'], ['docx', 'Word']]) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.pna .dl [data-f=${f}]`)]); check(d.suggestedFilename().endsWith('.' + f), `pendulum: ${n} download`); }
};
