// #566 Time series decomposition and ARIMA
export const path = '/science/time-series-analyser/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const vp0 = page.viewportSize();
  const txt = (s) => page.textContent(`.ts ${s}`);
  const wait = (ms = 600) => page.waitForTimeout(ms);
  const csvOf = async (sel, name) => { await page.locator(sel).scrollIntoViewIfNeeded(); const [dl] = await Promise.all([page.waitForEvent('download'), page.click(sel)]); const f = OUT + name; await dl.saveAs(f); return readFileSync(f, 'utf8').trim().split('\n'); };
  await page.goto(`${BASE}${path}`); await wait(1200);

  // Monthly example: STL decomposition.
  { const f = await txt('.ts-dec-facts'); check(f.includes('Strength of trend0.984') && f.includes('Strength of season0.922') && f.includes('position 6 (as 2017-06): +10.81') && f.includes('−19.59'), `time series: STL strengths and seasonal peak (${f})`); }
  check(await page.isVisible('.ts .ts-c-obs') && await page.isVisible('.ts .ts-c-trend') && await page.isVisible('.ts .ts-c-seas') && await page.isVisible('.ts .ts-c-res'), 'time series: four decomposition panels');
  { const r = await csvOf('.ts .ts-dcsv', 'ts-dec.csv'); check(r[0] === 'time,observed,trend,seasonal,remainder' && r.length === 97 && r[1].startsWith('2017-01,117.9,'), 'time series: components CSV'); }
  // ACF after one difference.
  { const f = await txt('.ts-acf-facts'); check(f.includes('95 values after 1 difference') && f.includes('Q = 151.5, p = 1.15 × 10⁻²²') && f.includes('not white noise'), `time series: Ljung–Box on the differenced series (${f})`); }
  check(await page.isVisible('.ts .ts-c-acf') && await page.isVisible('.ts .ts-c-pacf') && await page.isVisible('.ts .ts-c-diff'), 'time series: ACF, PACF and differenced series drawn');
  // ARIMA(1,1,1).
  check((await txt('.ts-big')) === 'ARIMA(1,1,1): AICc = 654.956', `time series: ARIMA(1,1,1) fit (${await txt('.ts-big')})`);
  { const t = await txt('.ts-coef'); check(t.includes('ar.L1') && t.includes('0.27482') && t.includes('0.1807') && t.includes('53.982'), 'time series: coefficient table'); }
  check((await txt('.ts-ar-facts')).includes('Q(10) = 21.8, df 8, p = 0.0053'), 'time series: residual Ljung–Box');
  { const t = await txt('.ts-fct'); check(t.includes('2025-01') && t.includes('209.36') && t.includes('199.95') && t.includes('2025-12'), 'time series: forecast table with continued month labels'); }
  { const r = await csvOf('.ts .ts-fcsv', 'ts-fc.csv'); check(r[0] === 'time,forecast,se,lo80,hi80,lo95,hi95' && r.length === 13 && r[1].startsWith('2025-01,209.36'), 'time series: forecast CSV'); }
  await page.setViewportSize({ width: 375, height: 900 }); await wait(); await page.screenshot({ path: OUT + 'time-series-analyser-375.png', fullPage: true }); await page.setViewportSize(vp0);

  // Every decomposition method and the seasonal window.
  await page.selectOption('.ts .ts-meth', 'stl-robust'); await wait();
  check((await txt('.ts-dec-facts')).includes('Strength of trend0.976') && (await txt('.ts-dec-facts')).includes('Strength of season0.884') && await page.isVisible('.ts .ts-sw'), 'time series: robust STL');
  await page.fill('.ts .ts-sw', '13'); await wait();
  check(await page.isHidden('.ts .ts-dec-err'), 'time series: seasonal window 13');
  await page.fill('.ts .ts-sw', '8'); await wait();
  check((await txt('.ts-dec-err')).includes('odd'), 'time series: even seasonal window refused');
  await page.fill('.ts .ts-sw', '7');
  await page.selectOption('.ts .ts-meth', 'additive'); await wait();
  check(await page.isHidden('.ts .ts-sw') && (await txt('.ts-dec-facts')).includes('Strength of season'), 'time series: classical additive');
  await page.selectOption('.ts .ts-meth', 'multiplicative'); await wait();
  check((await txt('.ts-dec-facts')).includes('×'), 'time series: classical multiplicative shows factors');
  // Seasonal difference and lags.
  await page.selectOption('.ts .ts-D', '1'); await wait();
  check((await txt('.ts-acf-facts')).includes('83 values after 1 difference and a seasonal difference (lag 12)'), 'time series: seasonal differencing');
  await page.fill('.ts .ts-lags', '10'); await wait();
  check((await txt('.ts-acf-facts')).includes('of 10 lags'), 'time series: chosen number of lags');
  await page.fill('.ts .ts-lags', '500'); await wait();
  check((await txt('.ts-acf-err')).includes('Lags must be'), 'time series: too many lags refused');
  await page.fill('.ts .ts-lags', '');
  // ARIMA options.
  await page.selectOption('.ts .ts-ad', '2'); await page.selectOption('.ts .ts-p', '0'); await wait(900);
  check((await txt('.ts-ar-warn')).includes('over-differenced'), 'time series: over-differencing warning');
  await page.fill('.ts .ts-h', '0'); await wait();
  check((await txt('.ts-ar-err')).includes('Forecast steps'), 'time series: bad forecast horizon');
  await page.fill('.ts .ts-h', '6'); await wait();

  // Sensor example: ARMA with a mean, then the automatic search.
  await page.selectOption('.ts .ts-ex', 'sensor'); await wait(1200);
  check((await txt('.ts-dec-err')).includes('Set a season length') && await page.isHidden('.ts .ts-dec-out'), 'time series: no season, no decomposition');
  check((await txt('.ts-big')) === 'ARIMA(2,0,1) with mean: AICc = 433.281' && (await txt('.ts-ar-facts')).includes('p = 0.372'), `time series: ARMA(2,1) with mean (${await txt('.ts-big')})`);
  check((await txt('.ts-coef')).includes('mean') && (await txt('.ts-coef')).includes('19.935'), 'time series: mean estimate');
  await page.uncheck('.ts .ts-mean'); await wait(900);
  check((await txt('.ts-big')).startsWith('ARIMA(2,0,1): AICc'), 'time series: without a mean');
  await page.check('.ts .ts-mean'); await wait(600);
  await page.locator('.ts .ts-auto').scrollIntoViewIfNeeded(); await page.click('.ts .ts-auto'); await page.waitForFunction(() => !document.querySelector('.ts .ts-auto').disabled, null, { timeout: 60000 }); await wait();
  check((await txt('.ts-big')) === 'ARIMA(3,0,1) with mean: AICc = 433.243' && (await page.inputValue('.ts .ts-p')) === '3' && await page.isVisible('.ts .ts-autot'), `time series: best by AICc (${await txt('.ts-big')})`);
  check((await txt('.ts-autot')).includes('ARIMA(0,0,2)'), 'time series: table of the best models');
  { const t = await txt('.ts-fct'); check(t.includes('151') && t.includes('156'), 'time series: numeric labels continue (151 …)'); }

  // Daily example: weekly season, multiplicative.
  await page.selectOption('.ts .ts-ex', 'daily'); await wait(1200);
  check((await page.inputValue('.ts .ts-m')) === '7' && (await txt('.ts-dec-facts')).includes('×1.4'), 'time series: daily example, weekly factors');

  // Downloads.
  for (const f of ['png', 'pdf', 'docx']) { await page.locator(`.ts .dl button[data-f="${f}"]`).scrollIntoViewIfNeeded(); const [dl] = await Promise.all([page.waitForEvent('download'), page.click(`.ts .dl button[data-f="${f}"]`)]); check(dl.suggestedFilename() === `time-series.${f}`, `time series: ${f} download`); }

  // Own data and errors.
  await page.fill('.ts .ts-data', 'v\n1\n2\n\n3'); await wait(900);
  check((await txt('.ts-err')).includes('at least 8') || (await txt('.ts-err')).length > 0, 'time series: too short refused');
  await page.fill('.ts .ts-data', 'v\n1\n2\nx\n3\n4\n5\n6\n7\n8'); await wait(900);
  check((await txt('.ts-err')).includes('Fill gaps'), 'time series: text in the values refused');
  writeFileSync(OUT + 'ts.csv', 'quarter,sales\n' + Array.from({ length: 24 }, (_, i) => `${2019 + Math.floor(i / 4)}-Q${(i % 4) + 1},${100 + 2 * i + [5, -3, 8, -10][i % 4]}`).join('\n'));
  await page.fill('.ts .ts-m', '4');
  await page.setInputFiles('.ts .dfb-in', OUT + 'ts.csv'); await wait(1200);
  { const f = await txt('.ts-dec-facts'); check(f.includes('Strength of season') && (await txt('.dfb-note')).includes('Opened ts.csv') && (await page.inputValue('.ts .ts-ex')) === '', `time series: quarterly data from a file (${f})`); }
  await page.fill('.ts .ts-m', 'x'); await wait();
  check((await txt('.ts-err')).includes('season length'), 'time series: bad season length');
};
