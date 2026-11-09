// Gini and Lorenz curve: made-up incomes, weights, grouped shares, Atkinson options, downloads and bad input.
export const path = '/science/gini-lorenz/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  page.setDefaultTimeout(120000); // pages load slowly when many builds share the machine; reset at the end
  const dl = async (sel) => { await page.locator(sel).scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(sel)]); const f = OUT + d.suggestedFilename(); await d.saveAs(f); return f; };
  const waitBig = (re) => page.waitForFunction((s) => new RegExp(s).test(document.querySelector('.gl-big')?.textContent || ''), re.source);
  const waitErr = (re) => page.waitForFunction((s) => { const e = document.querySelector('.gl-err'); return e && !e.hidden && new RegExp(s).test(e.textContent || ''); }, re.source);
  await page.goto(BASE + path);
  check((await page.textContent('.gl-big')) === 'Gini 0.399', `gini: example (${await page.textContent('.gl-big')})`);
  const f = await page.textContent('.gl-facts');
  check(/sample-corrected0\.422/.test(f) && /Palma ratio1\.803/.test(f) && /Top 10 % share29\.3 %/.test(f) && /Bottom 40 % share16\.3 %/.test(f) && /Top 1 % share3\.4 %/.test(f), `gini: shares and Palma (${f.slice(0, 300)})`);
  check(/Theil T0\.264/.test(f) && /Theil L \(mean log deviation\)0\.265/.test(f) && /ε = 0\.5\)0\.125/.test(f) && /ε = 1\)0\.233/.test(f) && /ε = 2\)0\.398/.test(f) && /P90\/P107\.778/.test(f), 'gini: Theil, Atkinson, P90/P10');
  const tab = await page.textContent('.gl-tab');
  check(/Poorest 20 %6\.1 %/.test(tab) && /Richest 20 %46\.8 %100\.0 %/.test(tab), `gini: quintiles (${tab})`);
  const csv = readFileSync(await dl('.gl-csv'), 'utf8');
  check(/^Measure,Value\nGini,0\.398594682/.test(csv) && /Population share,Income share\n0,0\n/.test(csv), 'gini: CSV with Lorenz points');
  check(readFileSync(await dl('.dl [data-f=docx]')).slice(0, 2).toString() === 'PK', 'gini: Word report');
  // Weights equal repeated rows.
  await page.fill('.gl-raw', 'income\tweight\n1\t2\n2\t1\n3\t3');
  await waitBig(/^Gini 0\.218$/);
  check(!/sample-corrected/.test(await page.textContent('.gl-facts')), 'gini: weighted data, no sample correction');
  await page.fill('.gl-eps', '3');
  await page.waitForFunction(() => /ε = 3/.test(document.querySelector('.gl-facts')?.textContent || ''));
  check(true, 'gini: Atkinson ε option');
  await page.fill('.gl-raw', '0\n0\n10\n20\n70');
  await waitBig(/^Gini 0\.640$/);
  check(/not defined/.test(await page.textContent('.gl-facts')) && /Palma ratio∞/.test(await page.textContent('.gl-facts')), 'gini: zero incomes');
  await page.fill('.gl-raw', '10\n-5');
  await waitErr(/cannot be negative/);
  check(true, 'gini: negative income explained');
  await page.fill('.gl-raw', '10\nabc');
  await waitErr(/"abc" is not a number/);
  check(true, 'gini: text explained');
  await page.fill('.gl-eps', '0.5, 1, 2');
  await page.click('.gl-mode button[data-m=grp]');
  await waitBig(/^Gini 0\.352$/);
  check(/Palma ratio1\.286/.test(await page.textContent('.gl-facts')) && !/sample-corrected/.test(await page.textContent('.gl-facts')), 'gini: grouped quintile shares, no sample correction');
  await page.fill('.gl-grp', 'A\t0\t5\nB\t50\t5');
  await waitErr(/population/);
  check(true, 'gini: zero population explained');
  const vp = page.viewportSize(); await page.setViewportSize({ width: 375, height: 800 });
  await page.fill('.gl-grp', 'Group\tPop\tIncome\nA\t20\t6.5\nB\t20\t11\nC\t20\t15.5\nD\t20\t22\nE\t20\t45');
  await waitBig(/^Gini 0\.352$/);
  await page.screenshot({ path: OUT + 'gini-375.png', fullPage: true });
  await page.setViewportSize(vp);
  page.setDefaultTimeout(30000);
};
