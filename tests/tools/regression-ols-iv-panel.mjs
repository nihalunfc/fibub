// #744 Regression (OLS, IV, panel FE): example numbers (statsmodels/linearmodels), every option, downloads, errors.
export const path = '/science/regression-ols-iv-panel/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const vp = page.viewportSize();
  page.setDefaultTimeout(120000);
  await page.goto(BASE + path);
  await page.waitForSelector('.rg-out:not([hidden])');
  const cell = (r, c) => page.textContent(`.rg-tab tbody tr:nth-child(${r}) td:nth-child(${c})`);
  const facts = () => page.textContent('.rg-facts');
  check((await cell(2, 1)) === 'educ' && /^0\.0582\*\*\*$/.test(await cell(2, 2)) && (await cell(2, 3)) === '0.0145', `regression: OLS educ 0.0582 (SE 0.0145) (${await cell(2, 2)} ${await cell(2, 3)})`);
  check(/R²0\.3128/.test(await facts()) && /F\(3, 56\)8\.495/.test(await facts()), `regression: R² 0.3128, F(3, 56) 8.495 (${await facts()})`);
  check((await cell(4, 5)) === '0.2925', 'regression: union p = 0.2925');
  // Robust and clustered errors.
  await page.selectOption('.rg-se', 'hc3');
  await page.waitForTimeout(150);
  check((await cell(2, 3)) === '0.0170', `regression: HC3 SE of educ 0.0170 (${await cell(2, 3)})`);
  check(/leverage\)²/.test(await page.textContent('.rg-sehelp')), 'regression: HC3 explained in one line');
  for (const [v, se] of [['hc0', null], ['hc1', null], ['hc2', null]]) { await page.selectOption('.rg-se', v); await page.waitForTimeout(100); check(!(await page.isHidden('.rg-out')), `regression: ${v} runs`); }
  check(await page.isHidden('.rg-clw'), 'regression: cluster column hidden unless clustered');
  await page.selectOption('.rg-se', 'cluster');
  await page.waitForTimeout(150);
  check(!(await page.isHidden('.rg-clw')) && (await cell(2, 3)) === '0.0401' && /5 clusters/.test(await facts()) && /4 degrees of freedom/.test(await facts()), `regression: clustered by region SE 0.0401, 5 clusters, df 4 (${await cell(2, 3)})`);
  await page.selectOption('.rg-lv', '0.9');
  await page.waitForTimeout(150);
  check(/90 % CI low/.test(await page.textContent('.rg-tab thead')), 'regression: 90 % intervals');
  await page.selectOption('.rg-lv', '0.95');
  await page.selectOption('.rg-se', 'classical');
  // CSV of coefficients.
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.rg-csv')]);
  const csv = readFileSync(await dl.path(), 'utf8');
  check(/^variable,coefficient,std_error,t,p,ci_low,ci_high\nConstant,1\.41361880920/.test(csv) && csv.trim().split('\n').length === 5, 'regression: coefficients CSV');
  // IV.
  await page.click('.rg-mode button[data-m="iv"]');
  await page.waitForTimeout(200);
  check(/^0\.0292/.test(await cell(4, 2)) && (await cell(4, 3)) === '0.0170' && /educ \(endog\.\)/.test(await cell(4, 1)), `regression: 2SLS educ 0.0292 (SE 0.0170) (${await cell(4, 2)})`);
  const fs = await page.textContent('.rg-fs');
  check(/F\(1, 56\) = 204\.4/.test(fs) && /0\.7849/.test(fs) && /strong/.test(fs), `regression: first-stage F 204.4 (${fs})`);
  await page.selectOption('.rg-se', 'robust'); await page.waitForTimeout(150);
  check((await cell(4, 3)) !== '0.0170' && !(await page.isHidden('.rg-out')), 'regression: IV robust');
  await page.selectOption('.rg-se', 'cluster'); await page.waitForTimeout(150);
  check(!(await page.isHidden('.rg-out')), 'regression: IV clustered');
  await page.selectOption('.rg-se', 'classical');
  await page.locator('.rg-z input[value="distance"]').uncheck();
  await page.waitForTimeout(150);
  check(/excluded instrument/.test(await page.textContent('.rg-err')), 'regression: missing instrument explained');
  await page.locator('.rg-z input[value="distance"]').check();
  // Panel FE.
  await page.click('.rg-mode button[data-m="fe"]');
  await page.waitForTimeout(200);
  check((await cell(1, 1)) === 'exper' && /^0\.0473/.test(await cell(1, 2)) && (await cell(1, 3)) === '0.0105' && /Within R²0\.3360/.test(await facts()), `regression: FE exper 0.0473 (SE 0.0105), within R² 0.3360 (${await cell(1, 2)})`);
  check(/educ left out/.test(await page.textContent('.rg-note')), 'regression: time-invariant educ left out with a note');
  await page.check('.rg-te'); await page.selectOption('.rg-se', 'cluster'); await page.waitForTimeout(200);
  check(/^0\.0524/.test(await cell(1, 2)) && (await cell(1, 3)) === '0.0406' && /15 entities \+ 3 periods/.test(await facts()), `regression: two-way FE clustered exper 0.0524 (SE 0.0406) (${await cell(1, 2)} ${await cell(1, 3)})`);
  await page.selectOption('.rg-se', 'robust'); await page.waitForTimeout(150);
  check(!(await page.isHidden('.rg-out')), 'regression: FE robust');
  await page.uncheck('.rg-te');
  await page.selectOption('.rg-time', 'person'); await page.waitForTimeout(150);
  check(/must be different/.test(await page.textContent('.rg-err')), 'regression: same entity and time column explained');
  await page.selectOption('.rg-time', 'region'); await page.waitForTimeout(150);
  check(/two rows for time/.test(await page.textContent('.rg-err')), 'regression: duplicate entity-period rows explained');
  await page.selectOption('.rg-time', 'year');
  // Report downloads.
  await page.selectOption('.rg-se', 'classical'); await page.waitForTimeout(150);
  for (const f of ['png', 'pdf', 'docx']) {
    const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.rg .dl button[data-f="${f}"]`)]);
    check(d.suggestedFilename() === `regression-fe.${f}`, `regression: ${f} download`);
  }
  // Bad input.
  await page.click('.rg-mode button[data-m="ols"]');
  await page.fill('.rg-in', 'y,x\n1,2');
  await page.waitForTimeout(500);
  check(/more rows than coefficients/.test(await page.textContent('.rg-err')), `regression: too few rows explained (${await page.textContent('.rg-err')})`);
  await page.fill('.rg-in', 'y,x,z\n1,2,4\n2,3,6\n3,5,10\n5,4,8\n4,4,8');
  await page.waitForTimeout(500);
  check(/collinear.*z/.test(await page.textContent('.rg-err')), 'regression: collinear columns explained');
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(BASE + path);
  await page.waitForSelector('.rg-out:not([hidden])');
  await page.screenshot({ path: OUT + 'regression-ols-iv-panel.png', fullPage: true });
  await page.setViewportSize(vp);
  page.setDefaultTimeout(30000);
};
