// #745 Difference-in-differences: example (statsmodels numbers), options, downloads, bad input.
export const path = '/science/difference-in-differences/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const vp = page.viewportSize();
  await page.goto(BASE + path);
  await page.waitForSelector('.dd-out:not([hidden])');
  const big = () => page.textContent('.dd-big'), facts = () => page.textContent('.dd-facts');
  check(/DiD = 2\.115 \(95 % CI 1\.868 to 2\.363\)/.test(await big()), `did: example DiD 2.115 (${await big()})`);
  check(/Clustered SE0\.1183/.test(await facts()) && /8 treated, 12 comparison/.test(await facts()) && /F\(3, 19\) = 0\.1616, p 0\.9209/.test(await facts()), `did: SE, units and pre-trend F (${await facts()})`);
  const tab = await page.textContent('.dd-tab');
  check(/2018−10 \(reference\)/.test(tab) && /201901\.193/.test(tab) && /3\.149/.test(tab), `did: event-study table (${tab.slice(0, 200)})`);
  check(/fewer than about 30 units/.test(await page.textContent('.dd-note')) && /fits parallel trends/.test(await page.textContent('.dd-note')), 'did: notes on parallel trends and few clusters');
  // Reference period and confidence level.
  await page.selectOption('.dd-ref', '2017');
  await page.waitForTimeout(200);
  check(/2017−20 \(reference\)/.test(await page.textContent('.dd-tab')), 'did: reference period 2017');
  await page.selectOption('.dd-ref', '');
  await page.selectOption('.dd-lv', '0.9');
  await page.waitForTimeout(200);
  check(/90 % CI/.test(await big()), 'did: 90 % interval');
  await page.selectOption('.dd-lv', '0.95');
  // CSV.
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.dd-csv')]);
  const csv = readFileSync(await dl.path(), 'utf8');
  check(/^period,event_time,coefficient,clustered_se,p,ci_low,ci_high\n2015,-4,-0\.00416/.test(csv) && /\n2018,-1,0,,,,\n/.test(csv) && csv.trim().split('\n').length === 9, 'did: event-study CSV');
  for (const f of ['png', 'pdf', 'docx']) {
    const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.did .dl button[data-f="${f}"]`)]);
    check(d.suggestedFilename() === `did-event-study.${f}`, `did: ${f} download`);
  }
  // Start period errors and a treated column that changes inside a unit.
  await page.fill('.dd-start', '2015'); await page.waitForTimeout(500);
  check(/No periods before the start/.test(await page.textContent('.dd-err')), 'did: no pre-period explained');
  await page.fill('.dd-start', '2019'); await page.waitForTimeout(500);
  const text = await page.inputValue('.dd-in');
  await page.fill('.dd-in', text.replace('C01,2015,1,', 'C01,2015,0,')); await page.waitForTimeout(500);
  check(/same in every row of a unit/.test(await page.textContent('.dd-err')), 'did: treated must be fixed within a unit');
  await page.fill('.dd-in', text.replace('C01,2015,1,', 'C01,2015,maybe,')); await page.waitForTimeout(500);
  check(/should hold 1 or 0/.test(await page.textContent('.dd-err')), 'did: non 0/1 treated value explained');
  await page.fill('.dd-in', text + '\nC01,2016,1,55'); await page.waitForTimeout(500);
  check(/two rows for period 2016/.test(await page.textContent('.dd-err')), 'did: duplicate unit-period explained');
  await page.fill('.dd-in', text); await page.waitForTimeout(500);
  await page.selectOption('.dd-tr', 'county'); await page.waitForTimeout(200);
  check(/four different columns/.test(await page.textContent('.dd-err')), 'did: same column twice explained');
  await page.selectOption('.dd-tr', 'treated'); await page.waitForTimeout(200);
  // Group means.
  await page.click('.dd-mode button[data-m="means"]');
  await page.waitForTimeout(200);
  check(/DiD = 4 \(95 % CI −1\.038 to 9\.038\)/.test(await big()) && /Standard error2\.551/.test(await facts()) && /Treated after without treatment53/.test(await facts()), `did: 2 × 2 from means (${await big()})`);
  check(await page.isHidden('.dd-ev'), 'did: event study hidden for group means');
  await page.fill('.dd-m[data-c="cPost"][data-k="sd"]', ''); await page.waitForTimeout(500);
  check((await big()) === 'DiD = 4' && /Fill in the SD/.test(await page.textContent('.dd-note')), 'did: means without all SDs gives the estimate only');
  await page.fill('.dd-m[data-c="cPost"][data-k="mean"]', 'abc'); await page.waitForTimeout(500);
  check(/"abc" is not a number/.test(await page.textContent('.dd-err')), 'did: bad mean explained');
  await page.fill('.dd-m[data-c="cPost"][data-k="mean"]', '51'); await page.fill('.dd-m[data-c="cPost"][data-k="sd"]', '8.2'); await page.waitForTimeout(500);
  const [d2] = await Promise.all([page.waitForEvent('download'), page.click('.did .dl button[data-f="pdf"]')]);
  check(d2.suggestedFilename() === 'did-2x2.pdf', 'did: 2 × 2 PDF');
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(BASE + path);
  await page.waitForSelector('.dd-out:not([hidden])');
  await page.screenshot({ path: OUT + 'difference-in-differences.png', fullPage: true });
  await page.setViewportSize(vp);
};
