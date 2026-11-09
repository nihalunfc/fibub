import { haversine } from '../../src/lib/sci/gravity.ts';
export const path = '/science/gravity-model/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const wait = () => page.waitForTimeout(500);
  await page.goto(BASE + path);
  await page.waitForSelector('.gm-out:not([hidden])');
  check((await page.textContent('.gm-big')) === 'Distance exponent c = 1.66 (PPML)', `gravity tool: example c (${await page.textContent('.gm-big')})`);
  const facts = await page.textContent('.gm-facts');
  check(/42 \(2 zero\)/.test(facts) && /0\.916/.test(facts) && /0\.924/.test(facts) && /Great circle/.test(facts), 'gravity tool: pairs, R², pseudo R²');
  const coef = await page.textContent('.gm-coef');
  check(/0\.838 \(0\.065\)/.test(coef) && /0\.949 \(0\.056\)/.test(coef) && /−1\.662 \(0\.136\)/.test(coef) && /0\.816 \(0\.088\)/.test(coef), 'gravity tool: OLS and PPML coefficients with SEs');
  check((await page.locator('.gm-tab tbody tr').count()) === 42 && /129\.7/.test(await page.textContent('.gm-tab tbody tr:first-child')) && /368/.test(await page.textContent('.gm-tab tbody tr:first-child')), 'gravity tool: pair table with distance 129.7 km and PPML 368');
  check(/divides the flow by 3\.17/.test(await page.textContent('.gm-note')), 'gravity tool: plain reading of c');

  // CSV and report
  const csvBtn = page.locator('.gm-csv'); await csvBtn.scrollIntoViewIfNeeded();
  const [dl] = await Promise.all([page.waitForEvent('download'), csvBtn.click()]);
  const p = OUT + 'gravity.csv'; await dl.saveAs(p); const text = readFileSync(p, 'utf8');
  check(dl.suggestedFilename() === 'gravity-fit.csv' && text.split('\n').length === 44 && /^Ashford Bay,Brimley,129\.72227\d*,820,310,371,/m.test(text), 'gravity tool: CSV download');
  const pdf = page.locator('.dl button[data-f="pdf"]'); await pdf.scrollIntoViewIfNeeded();
  const [d2] = await Promise.all([page.waitForEvent('download'), pdf.click()]);
  check(d2.suggestedFilename() === 'gravity-fit.pdf', 'gravity tool: PDF report');

  // One mass exponent
  await page.selectOption('.gm-same', '1');
  check(/0\.760 \(0\.052\)/.test(await page.textContent('.gm-coef')) && /0\.881 \(0\.060\)/.test(await page.textContent('.gm-coef')), 'gravity tool: one mass exponent');
  await page.selectOption('.gm-same', '0');

  // Use PPML estimates in predict mode
  const use = page.locator('.gm-use'); await use.scrollIntoViewIfNeeded(); await use.click();
  check((await page.inputValue('.gm-c')) === '1.6625' && (await page.inputValue('.gm-a')) === '0.9493' && await page.isVisible('.gm-k'), 'gravity tool: fitted parameters copied to predict');
  check((await page.textContent('.gm-h')) === 'Predicted flows' && /Observed total/.test(await page.textContent('.gm-facts')), 'gravity tool: predict mode with observed flows');

  // Newton's parameters
  await page.fill('.gm-k', '1'); await page.fill('.gm-a', '1'); await page.fill('.gm-b', '1'); await page.fill('.gm-c', '2'); await wait();
  const d = haversine(46.2, 3.1, 46.95, 4.4), want = 820 * 310 / d ** 2;
  const first = await page.textContent('.gm-tab tbody tr:first-child');
  check(first.includes(want.toPrecision(3)), `gravity tool: predicted Ashford Bay → Brimley ${want.toPrecision(3)} (${first})`);
  await page.selectOption('.gm-pairs', 'all');
  check((await page.locator('.gm-tab tbody tr').count()) === 42 && (await page.locator('.gm-tab thead th').count()) === 4, 'gravity tool: every pair of places, both ways');
  const [d3] = await Promise.all([page.waitForEvent('download'), page.locator('.gm-csv').click()]);
  check(d3.suggestedFilename() === 'gravity-prediction.csv', 'gravity tool: prediction CSV');

  // Given distances, no coordinates
  await page.fill('.gm-places', 'A,100\nB,200\nC,50');
  await page.selectOption('.gm-pairs', 'flows');
  await page.fill('.gm-flows', 'A,B,,10\nB,C,,20\nA,C,,5'); await wait();
  check(/Pairs3/.test((await page.textContent('.gm-facts')).replace(/\s/g, '')) && (await page.textContent('.gm-tab tbody tr:first-child')).includes('200'), 'gravity tool: distances from the flows table (A→B = 100·200/10² = 200)');
  await page.selectOption('.gm-pairs', 'all');
  check(/No coordinates for A/.test(await page.textContent('.gm-err')), 'gravity tool: missing coordinates explained');

  // Fit errors
  await page.locator('.gm-mode button[data-m="fit"]').click();
  check(/the flow from A to B must be a number/.test(await page.textContent('.gm-err')), 'gravity tool: missing flow when fitting');
  await page.fill('.gm-flows', 'A,B,4,10\nB,C,3,20\nA,C,2,5'); await wait();
  check(/at least 6 flows/.test(await page.textContent('.gm-err')), 'gravity tool: too few flows');
  await page.fill('.gm-flows', 'A,Q,4,10'); await wait();
  check(/"Q" is not in the places list/.test(await page.textContent('.gm-err')), 'gravity tool: unknown place');
  await page.fill('.gm-places', 'A,x'); await wait();
  check(/mass of A must be a number above zero|at least two places/.test(await page.textContent('.gm-err')), 'gravity tool: bad mass');

  // Opening a file
  writeFileSync(OUT + 'gm-places.csv', 'Place,Mass,Lat,Lon\nP1,100,10,10\nP2,200,10,11\nP3,300,11,10\n');
  await page.setInputFiles('.gm .dfb-in >> nth=0', OUT + 'gm-places.csv');
  await page.locator('.gm-mode button[data-m="predict"]').click();
  await wait();
  check((await page.locator('.gm-tab tbody tr').count()) === 6, 'gravity tool: opens a places file');
};
