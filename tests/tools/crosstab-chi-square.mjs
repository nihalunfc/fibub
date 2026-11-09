// #747 Cross-tab and chi-square: example (scipy numbers), percentages, weights, 2 × 2 Fisher, downloads, errors.
export const path = '/science/crosstab-chi-square/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const vp = page.viewportSize();
  page.setDefaultTimeout(120000);
  await page.goto(BASE + path);
  await page.waitForSelector('.xt-out:not([hidden])');
  const txt = (s) => page.textContent(s);
  check((await txt('.xt-big')) === 'Pearson χ² = 22.455, p 0.0002' && /related/.test(await txt('.xt-verdict')), `crosstab: example χ² 22.455 (${await txt('.xt-big')})`);
  const f = await txt('.xt-facts');
  check(/G²24\.223/.test(f) && /Cramér's V0\.217/.test(f) && /Respondents238/.test(f) && /2 rows with a blank/.test(f), `crosstab: G², V, n, blanks (${f})`);
  const cell = (s, r, c) => page.textContent(`${s} tbody tr:nth-child(${r}) td:nth-child(${c})`);
  check((await cell('.xt-tab', 1, 2)) === '43 (50.0 %)' && (await cell('.xt-tab', 4, 5)) === '238', `crosstab: row % cell 43 (50.0 %) and total (${await cell('.xt-tab', 1, 2)})`);
  check((await cell('.xt-res', 1, 2)) === '3.91' && (await page.locator('.xt-res td.xt-hi').count()) === 2 && (await page.locator('.xt-res td.xt-lo').count()) === 2, 'crosstab: adjusted residuals marked');
  for (const [p, want] of [['col', '43 (53.1 %)'], ['tot', '43 (18.1 %)'], ['none', '43']]) {
    await page.click(`.xt-pct button[data-p="${p}"]`);
    check((await cell('.xt-tab', 1, 2)) === want, `crosstab: ${p} view shows ${want} (${await cell('.xt-tab', 1, 2)})`);
  }
  await page.click('.xt-pct button[data-p="row"]');
  // CSV and reports.
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.xt-csv')]);
  const csv = readFileSync(await dl.path(), 'utf8');
  check(/^age_group \/ main_transport,Bus or train,Car,Walk or cycle,Total\n18-34,43,21,22,86\n/.test(csv) && /Adjusted residuals/.test(csv), 'crosstab: CSV');
  for (const fm of ['png', 'pdf', 'docx']) {
    const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.xt .dl button[data-f="${fm}"]`)]);
    check(d.suggestedFilename() === `crosstab.${fm}`, `crosstab: ${fm} download`);
  }
  // Weights.
  await page.selectOption('.xt-w', 'weight');
  await page.waitForTimeout(200);
  const fw = await txt('.xt-facts');
  check((await txt('.xt-big')) === 'Design-adjusted χ² = 19.205, p 0.0007' && /Design effect \(Kish\)1\.208: effective sample 197/.test(fw), `crosstab: weighted design-adjusted χ² (${await txt('.xt-big')})`);
  check(/Kish's design effect/.test(await txt('.xt-note')) && /61\.6/.test(await cell('.xt-tab', 1, 2)), 'crosstab: weighted note and weighted counts');
  await page.selectOption('.xt-w', '');
  await page.selectOption('.xt-c', 'region');
  await page.waitForTimeout(200);
  check(/age_group by region/.test(await txt('.xt-h')), 'crosstab: other column');
  await page.selectOption('.xt-r', 'region');
  await page.waitForTimeout(200);
  check(/two different questions/.test(await txt('.xt-err')), 'crosstab: same question twice explained');
  // A small 2 × 2: Fisher, Yates, small-cell warning.
  await page.fill('.xt-in', 'treat,outcome\nA,yes\nA,yes\nA,yes\nA,no\nB,yes\nB,no\nB,no\nB,no');
  await page.waitForTimeout(600);
  const f2 = await txt('.xt-facts');
  check(/Fisher's exact p \(two-sided\)0\.4857/.test(f2) && /Odds ratio0\.111/.test(f2) && /Yates-corrected χ²0\.500/.test(f2), `crosstab: 2 × 2 Fisher 0.4857, OR 0.111, Yates (${f2})`);
  check(/expected count below 5/.test(await txt('.xt-note')) && /Fisher's exact test/.test(await txt('.xt-note')), 'crosstab: small cells warning');
  await page.fill('.xt-in', 'q1,q2\na,x\na,x\na,y');
  await page.waitForTimeout(600);
  check(/at least two categories/.test(await txt('.xt-err')), 'crosstab: single category explained');
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(BASE + path);
  await page.waitForSelector('.xt-out:not([hidden])');
  await page.screenshot({ path: OUT + 'crosstab-chi-square.png', fullPage: true });
  await page.setViewportSize(vp);
  page.setDefaultTimeout(30000);
};
