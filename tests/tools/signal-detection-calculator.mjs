// #721 Signal detection calculator: one table, many people, ratings ROC, corrections, downloads, errors.
export const path = '/science/signal-detection-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.sd ';
  const txt = (s) => page.textContent(R + s);
  const dl = async (sel) => { await page.locator(R + sel).scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + sel)]); const p = OUT + d.suggestedFilename(); await d.saveAs(p); return p; };
  await page.goto(BASE + path);
  await page.waitForSelector(R + '.sd-out:not([hidden])');
  check((await txt('.sd-big')) === 'd′ = 1.701', `sdt: example d′ 1.701 (${await txt('.sd-big')})`);
  const f = await txt('.sd-facts');
  check(/1\.136 to 2\.266/.test(f) && /−0\.144/.test(f) && /0\.783/.test(f) && /0\.876/.test(f), 'sdt: interval, c, β, A′ shown');
  check(await page.isVisible(R + '.sd-fig'), 'sdt: distribution figure drawn');
  let p = await dl('.sd-csv');
  check(/d_prime,1\.70076/.test(readFileSync(p, 'utf8')), 'sdt: CSV has d′');
  // Perfect hits: corrections.
  await page.fill(R + '.sd-m', '0'); await page.fill(R + '.sd-h', '50'); await page.fill(R + '.sd-f', '5'); await page.fill(R + '.sd-c', '45'); await page.waitForTimeout(400);
  check((await txt('.sd-big')) === 'd′ = 3.608', `sdt: 1/2N correction (${await txt('.sd-big')})`);
  await page.selectOption(R + '.sd-corr', 'loglinear'); await page.waitForTimeout(300);
  check((await txt('.sd-big')) === 'd′ = 3.572', `sdt: log-linear (${await txt('.sd-big')})`);
  await page.selectOption(R + '.sd-corr', 'none'); await page.waitForTimeout(300);
  check(await page.isVisible(R + '.sd-err') && /infinite/.test(await txt('.sd-err')), 'sdt: no correction with perfect hits explains infinite d′');
  await page.fill(R + '.sd-h', 'x'); await page.waitForTimeout(400);
  check(/number for hits/.test(await txt('.sd-err')), 'sdt: bad count message');
  await page.fill(R + '.sd-h', '50'); await page.selectOption(R + '.sd-corr', 'half'); await page.waitForTimeout(300);
  // Many people
  await page.click(R + '.sd-mode [data-m=many]'); await page.waitForTimeout(300);
  check((await page.locator(R + '.sd-tab tbody tr').count()) === 5, 'sdt: many people table has 5 rows');
  check((await txt('.sd-big')) === 'mean d′ = 1.876', `sdt: mean d′ (${await txt('.sd-big')})`);
  check((await page.locator(R + '.sd-tab td.sd-warn').count()) === 1, 'sdt: corrected rate marked');
  p = await dl('.sd-csv');
  const many = readFileSync(p, 'utf8').trim().split('\n');
  check(many.length === 6 && many[4].startsWith('P04,50,0,9,41,0.99'), 'sdt: many-people CSV');
  await page.fill(R + '.sd-many', 'P1\t4\t1\tq\t3'); await page.waitForTimeout(400);
  check(/"q" in row 1/.test(await txt('.sd-err')), 'sdt: bad cell message in many-people mode');
  // ROC
  await page.click(R + '.sd-mode [data-m=roc]'); await page.waitForTimeout(400);
  check((await txt('.sd-big')) === 'Az = 0.814', `roc: Az 0.814 (${await txt('.sd-big')})`);
  const rf = await txt('.sd-facts');
  check(/0\.818 ± 0\.126/.test(rf) && /0\.240 on 3 df, p = 0\.971/.test(rf) && /0\.805/.test(rf), 'roc: slope, G² and area shown');
  check(await page.isVisible(R + '.sd-fig2') && (await page.locator(R + '.sd-tab tbody tr').count()) === 5, 'roc: z-ROC figure and 5 points');
  check(await page.isHidden(R + '.sd-corr'), 'roc: correction hidden for ratings');
  await page.selectOption(R + '.sd-order', 'noise'); await page.waitForTimeout(400);
  check((await txt('.sd-big')) !== 'Az = 0.814', 'roc: reversing the order changes the fit');
  await page.selectOption(R + '.sd-order', 'signal'); await page.waitForTimeout(300);
  p = await dl('.sd-csv');
  check(/ml_Az,0\.8138/.test(readFileSync(p, 'utf8')), 'roc: CSV has ML Az');
  p = await dl('.dl [data-f=pdf]');
  check(readFileSync(p).subarray(0, 4).toString() === '%PDF', 'roc: PDF report');
  await page.fill(R + '.sd-roc', '1\t5'); await page.waitForTimeout(400);
  check(/at least two rating rows/.test(await txt('.sd-err')), 'roc: too few rows message');
};
