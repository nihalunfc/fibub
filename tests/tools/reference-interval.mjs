// #502 Reference interval calculator
export const path = '/science/reference-interval/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/reference-interval/`); await page.waitForTimeout(900);
  const big = () => page.textContent('.ri .ri-big'), tab = async () => (await page.textContent('.ri .ri-tab')).replace(/\n/g, '|'), facts = () => page.textContent('.ri .ri-facts');
  const pick = async (s, v) => { await page.selectOption(s, v); await page.waitForTimeout(250); };
  check((await page.textContent('.ri .ri-med')).includes('not medical advice'), 'refint: medical notice near the top');
  check((await big()) === '13 to 44.97 U/L', `refint: example nonparametric interval (${await big()})`);
  check((await tab()).includes('Nonparametric (CLSI rank)13|11 to 1344.97|41 to 118') && (await tab()).includes('Parametric (log)12.18|11.38 to 12.9247.71|44.96 to 51.06'), 'refint: example table = numpy/scipy');
  check((await page.textContent('.ri .ri-note')).includes('ranks 6.025 and 234.975') && (await page.textContent('.ri .ri-note')).includes('order statistics 2 and 11'), 'refint: ranks explained');
  check((await facts()).includes('3: 10, 118, 140'), 'refint: Tukey flags on logs');
  check((await page.textContent('.ri .ri-hbread')).includes('z = 5.20 is above z* = 3') && (await page.textContent('.ri .ri-gtab')).includes('F12011 to 43.85'), 'refint: Harris-Boyd and subgroup intervals');
  check(await page.isVisible('.ri .ri-fig') && (await page.textContent('.ri .ri-figNote')).includes('beyond the plot: 10, 118, 140'), 'refint: histogram drawn, far outliers named');
  await page.locator('.ri .ri-drop').scrollIntoViewIfNeeded(); await page.click('.ri .ri-drop'); await page.waitForTimeout(300);
  check((await big()) === '13 to 43.05 U/L' && (await tab()).includes('43.05|39 to 48') && (await tab()).includes('13.01|12.24 to 13.72') && (await facts()).includes('237 (3 left out)'), 'refint: leaving out flagged results = numpy/scipy');
  await pick('.ri .ri-out', 'dixon');
  check((await facts()).includes('Flagged as outliersnone'), 'refint: Dixon misses masked outliers');
  await pick('.ri .ri-out', 'none'); check((await facts()).includes('Flagged as outliersnone'), 'refint: no screen');
  await pick('.ri .ri-out', 'tukey'); await page.click('.ri .ri-drop'); await page.waitForTimeout(300);
  await pick('.ri .ri-tr', 'boxcox');
  check((await tab()).includes('Parametric (Box-Cox, λ = −0.335)12.96|12.28 to 13.5950.21|46.65 to 54.75'), 'refint: Box-Cox = scipy');
  await pick('.ri .ri-tr', 'none');
  check((await tab()).includes('Parametric (raw)1.869'), 'refint: raw Gaussian scale');
  await pick('.ri .ri-tr', 'log');
  await pick('.ri .ri-conf', '0.95');
  check((await page.textContent('.ri .ri-tab')).includes('95 % CI'), 'refint: 95 % CIs');
  await pick('.ri .ri-conf', '0.9'); await pick('.ri .ri-cov', '0.9');
  check((await page.textContent('.ri .ri-note')).includes('The 90 % interval'), 'refint: central 90 % interval');
  await pick('.ri .ri-cov', '0.95');
  await page.locator('.ri .ri-csv').scrollIntoViewIfNeeded();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ri .ri-csv')]); const f = OUT + 'ri.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n'); check(t[0] === 'result,group,flagged,used' && t.filter((l) => l.endsWith(',yes,yes')).length === 3 && t.some((l) => l.startsWith('nonparametric,13,11,13,44.97')), 'refint: CSV with flags and limits'); }
  await page.locator('.ri .dl button[data-f=png]').scrollIntoViewIfNeeded();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ri .dl button[data-f=png]')]); const f = OUT + 'ri.png'; await d.saveAs(f); check(readFileSync(f).length > 10000, 'refint: report image'); }
  await page.fill('.ri .ri-data', Array.from({ length: 60 }, (_, i) => 10 + (i % 13)).join('\n')); await page.waitForTimeout(500);
  check(await page.isHidden('.ri .ri-hb') && (await page.textContent('.ri .ri-note')).includes('needs at least 119 results') && (await page.textContent('.ri .ri-note')).includes('at least 120'), 'refint: 60 results: no subgroup card, CI needs 119');
  await page.fill('.ri .ri-data', '1\n2\n3'); await page.waitForTimeout(500);
  check((await page.textContent('.ri .ri-err')).includes('at least 10') && await page.isHidden('.ri .ri-res'), 'refint: too few results message');
  await page.fill('.ri .ri-data', '0\n1\n2\n3\n4\n5\n6\n7\n8\n9\n10'); await page.waitForTimeout(500);
  check((await page.textContent('.ri .ri-err')).includes('above zero'), 'refint: log scale needs positive values');
};
