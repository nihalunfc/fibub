// #746 Unit root and cointegration: statistics (statsmodels), simulated critical values, options, downloads, errors.
export const path = '/science/unit-root-cointegration/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const vp = page.viewportSize();
  page.setDefaultTimeout(120000);
  await page.goto(BASE + path);
  const done = () => page.waitForFunction(() => /simulated samples \(seed/.test(document.querySelector('.ur-status')?.textContent ?? '') || !document.querySelector('.ur-err').hidden, null, { timeout: 180000 });
  const txt = (s) => page.textContent(s);
  await done();
  check((await txt('.ur-big')) === 'ADF statistic = −1.702' && /0 \(by AIC, 0 to 13 tried\)/.test(await txt('.ur-facts')) && /Rows in the regression119/.test(await txt('.ur-facts')), `unitroot: ADF price_a −1.702, 0 lags, 119 rows (${await txt('.ur-big')})`);
  check(/p = 0\.4\d\d: do not reject a unit root/.test(await txt('.ur-verdict')), `unitroot: ADF verdict (${await txt('.ur-verdict')})`);
  const crit = await txt('.ur-crit');
  check(/5 %−2\.8\d\d/.test(crit) && /1 %−3\.[45]\d\d/.test(crit), `unitroot: simulated ADF critical values (${crit})`);
  check(/10,000 simulated samples \(seed 1\)/.test(await txt('.ur-status')), 'unitroot: simulation size and seed shown');
  // Lag rules and terms.
  await page.selectOption('.ur-lagm', 'bic'); await done();
  check(/by BIC/.test(await txt('.ur-facts')), 'unitroot: BIC lag choice');
  await page.selectOption('.ur-lagm', 'fixed'); await page.fill('.ur-lag', '3'); await page.waitForTimeout(500); await done();
  check(/Lags of Δ used3/.test(await txt('.ur-facts')) && /Rows in the regression116/.test(await txt('.ur-facts')), 'unitroot: fixed 3 lags uses 116 rows');
  await page.selectOption('.ur-reg', 'ct'); await done();
  check(/Constant and trend/.test(await txt('.ur-facts')), 'unitroot: constant and trend');
  await page.fill('.ur-lag', '80'); await page.waitForTimeout(600);
  check(/at most 57/.test(await txt('.ur-err')), `unitroot: too many lags explained (${await txt('.ur-err')})`);
  await page.fill('.ur-lag', ''); await page.selectOption('.ur-lagm', 'aic'); await page.selectOption('.ur-reg', 'c'); await done();
  // Same seed, same answer; another seed, nearly the same.
  const v1 = await txt('.ur-verdict');
  await page.click('.ur-sim summary');
  await page.fill('.ur-seed', '2'); await page.waitForTimeout(500); await done();
  const v2 = await txt('.ur-verdict');
  await page.fill('.ur-seed', '1'); await page.waitForTimeout(500); await done();
  check((await txt('.ur-verdict')) === v1 && v2 !== v1 && /do not reject/.test(v2), 'unitroot: seeded simulation repeats; another seed differs slightly');
  await page.selectOption('.ur-reps', '2000'); await done();
  check(/2,000 simulated samples/.test(await txt('.ur-status')), 'unitroot: 2,000 samples');
  // KPSS.
  await page.click('.ur-mode button[data-m="kpss"]'); await done();
  check((await txt('.ur-big')) === 'KPSS statistic = 1.708' && /Lags \(Bartlett window\)6/.test(await txt('.ur-facts')) && /p < 0\.00\d+: reject level stationarity/.test(await txt('.ur-verdict')), `unitroot: KPSS 1.708 with 6 lags (${await txt('.ur-verdict')})`);
  check(await page.isHidden('.ur-lagw'), 'unitroot: KPSS lag box hidden unless fixed');
  await page.selectOption('.ur-lagm', 'legacy'); await done();
  check(/Lags \(Bartlett window\)13/.test(await txt('.ur-facts')), 'unitroot: KPSS Schwert rule 13 lags');
  await page.selectOption('.ur-reg', 'ct'); await done();
  check(/straight-line trend/.test(await txt('.ur-facts')) && /trend stationarity/.test(await txt('.ur-verdict')), 'unitroot: KPSS trend');
  // Engle-Granger.
  await page.click('.ur-mode button[data-m="eg"]'); await done();
  check((await page.inputValue('.ur-reg')) === 'ct', 'unitroot: trend setting kept when switching test');
  await page.selectOption('.ur-reg', 'c'); await done();
  check((await txt('.ur-big')) === 'ADF statistic = −3.808' && /price_b = 10\.06 \+ 0\.7994·price_a/.test(await txt('.ur-facts')), `unitroot: Engle-Granger −3.808 (${await txt('.ur-big')})`);
  check(/p = 0\.0[0-4]\d: reject no cointegration/.test(await txt('.ur-verdict')), `unitroot: cointegration found (${await txt('.ur-verdict')})`);
  await page.locator('.ur-xs input[value="index_c"]').check(); await done();
  check(/Series3/.test(await txt('.ur-facts')), 'unitroot: three-series Engle-Granger');
  await page.locator('.ur-xs input[value="index_c"]').uncheck(); await done();
  // Downloads.
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.ur-csv')]);
  const csv = readFileSync(await dl.path(), 'utf8');
  check(/^item,value\ntest,Engle-Granger test: price_b on price_a\nstatistic,-3\.8076350/.test(csv) && /critical_value_5pct,-3\.\d+/.test(csv) && /seed,1/.test(csv), 'unitroot: results CSV');
  for (const f of ['png', 'pdf', 'docx']) {
    const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.ur .dl button[data-f="${f}"]`)]);
    check(d.suggestedFilename() === `eg-test.${f}`, `unitroot: ${f} download`);
  }
  await page.locator('.ur-xs input[value="price_a"]').uncheck(); await page.waitForTimeout(400);
  check(/Tick at least one other series/.test(await txt('.ur-err')), 'unitroot: no regressor explained');
  // Bad data.
  await page.click('.ur-mode button[data-m="adf"]');
  await page.fill('.ur-in', 'a,b\n1,1\n2,2\n,3\n4,4\n5,5\n6,6\n7,7\n8,8\n9,9\n10,10\n11,11\n12,12'); await page.waitForTimeout(600);
  check(/blank or text in row 3/.test(await txt('.ur-err')), `unitroot: gap in series explained (${await txt('.ur-err')})`);
  await page.fill('.ur-in', 'a\n1\n2\n3'); await page.waitForTimeout(600);
  check(/need at least 10/.test(await txt('.ur-err')), 'unitroot: short series explained');
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(BASE + path); await done();
  await page.screenshot({ path: OUT + 'unit-root-cointegration.png', fullPage: true });
  await page.setViewportSize(vp);
  page.setDefaultTimeout(30000);
};
