// #686 decline curve analysis (Arps)
export const path = '/science/decline-curve/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/decline-curve/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.dca .dc-big'), facts = () => page.textContent('.dca .dc-facts'), set = async (s, v) => { await page.fill(`.dca ${s}`, v); await page.waitForTimeout(150); };
  check((await big()) === 'EUR 622,694 bbl: 358,473 produced + 264,221 bbl remaining (Hyperbolic, b = 0.71)', 'decline: example EUR, produced and remaining');
  { const f = await facts(); check(f.includes('799.9 bbl/d') && f.includes('1.06 per year nominal') && f.includes('54.7 %') && f.includes('R² = 0.9980') && f.includes('month 203.44'), 'decline: example qi, Di, effective decline, R² and limit time'); }
  { const t = await page.textContent('.dca .dc-tab'); check(t.includes('415,626') && t.includes('845,328') && t.includes('Hyperbolic (chosen)'), 'decline: comparison table of all three models'); }
  check(await page.isVisible('.dca .dc-fig') && await page.isVisible('.dca .dc-lfig'), 'decline: linear and log charts');
  await page.selectOption('.dca .dc-model', 'exponential'); await page.waitForTimeout(150);
  check((await big()).startsWith('EUR 415,626 bbl') && (await big()).includes('(Exponential)'), 'decline: exponential forecast');
  await page.selectOption('.dca .dc-model', 'harmonic'); await page.waitForTimeout(150);
  check((await big()).startsWith('EUR 845,328 bbl'), 'decline: harmonic forecast');
  await page.selectOption('.dca .dc-model', 'hyperbolic'); await page.selectOption('.dca .dc-space', 'log'); await page.waitForTimeout(150);
  check((await big()).includes('b = 0.69') && !(await big()).startsWith('EUR 622,694'), 'decline: fit to log rates');
  await page.selectOption('.dca .dc-space', 'rate');
  await set('.dc-dmin', '10');
  check((await facts()).includes('Terminal decline') && !(await big()).startsWith('EUR 622,694'), 'decline: terminal decline changes the forecast');
  await set('.dc-dmin', ''); await set('.dc-qel', '0'); await set('.dc-tmax', '10');
  check((await facts()).includes('Forecast stops') && (await facts()).includes('at the longest forecast'), 'decline: no economic limit stops at the longest forecast');
  await set('.dc-qel', '20'); await set('.dc-tmax', '30'); await set('.dc-from', '6');
  check((await facts()).includes('31 of 36'), 'decline: use points from month 6');
  await set('.dc-from', '');
  await page.selectOption('.dca .dc-ru', '30.4375'); await page.waitForTimeout(150);
  check((await facts()).includes('bbl/month'), 'decline: rates per month');
  await page.selectOption('.dca .dc-ru', '1');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dca .dc-csv')]); const f = OUT + 'decline.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0].startsWith('time (months),rate (bbl/d)') && rows.length > 190 && rows[rows.length - 1].endsWith('forecast'), `decline: forecast CSV (${rows.length} rows)`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dca .dl [data-f=pdf]')]); check((await d.suggestedFilename()) === 'decline-curve.pdf', 'decline: PDF report'); }
  await set('.dc-data', 'date\trate\n2024-01-01\t500\n2024-02-01\t450\n2024-03-01\t0\n2024-04-01\t380\n2024-05-01\t350\n2024-06-01\t325\n2024-07-01\t300');
  check((await facts()).includes('1 zero rate left out') && (await facts()).includes('2024-01-01'), 'decline: dates and a shut-in month');
  await set('.dc-data', '1\t100\n2\t90');
  check((await page.textContent('.dca .dc-err')).includes('at least 4 rows') && await page.isHidden('.dca .dc-out'), 'decline: too few rows message');
  await set('.dc-data', '1\t100\n2\t90\n3\t80\n4\t70'); await set('.dc-qel', '-5');
  check((await page.textContent('.dca .dc-err')).includes('economic limit'), 'decline: bad economic limit message');
};
