// #1250 Balance scale equation solver
export const path = '/learn/balance-scale/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/balance-scale/`); await page.waitForSelector('.bs .bs-fig .bs-beam');
  const R = '.bs ', txt = (s) => page.textContent(R + s);
  check((await page.$$(R + '.bs-fig .bs-x')).length === 4 && (await page.$$(R + '.bs-fig .bs-u')).length === 18, 'balance: 4 boxes and 18 weights drawn');
  check((await txt('.bs-eq')) === 'Now: 3x + 5 = x + 13' && (await txt('.bs-big')) === 'Too small: try a bigger x' && (await txt('.bs-fig')).includes('right pan is heavier'), 'balance: start, guess 2 too small');
  await page.fill(R + '.bs-g', '4'); await page.waitForTimeout(60);
  check((await txt('.bs-big')) === 'x = 4 balances' && (await txt('.bs-fig')).includes('Balanced at x = 4') && (await txt('.bs-test')).includes('= 17.'), 'balance: guess 4 balances');
  await page.fill(R + '.bs-g', '6'); await page.waitForTimeout(60);
  check((await txt('.bs-big')) === 'Too big: try a smaller x', 'balance: guess 6 too big');
  const tap = async (m) => { await page.click(`${R}.bs-m[data-m=${m}]`); await page.waitForTimeout(40); };
  await tap('unit');
  check((await txt('.bs-eq')) === 'Now: 3x + 4 = x + 12', 'balance: −1 from each');
  await tap('box'); await tap('units');
  check((await txt('.bs-eq')) === 'Now: 2x = 8', `balance: −x and −all 1s (${await txt('.bs-eq')})`);
  await page.fill(R + '.bs-k', '3'); await tap('share');
  check((await txt('.bs-msg')).includes('divide by 3') && (await txt('.bs-eq')) === 'Now: 2x = 8', 'balance: share into 3 refused');
  await page.fill(R + '.bs-k', '2'); await tap('share');
  check((await txt('.bs-eq')) === 'Now: x = 4  ✓' && (await txt('.bs-msg')).startsWith('Solved! x = 4') && (await page.$$(R + '.bs-log li')).length === 5, 'balance: solved in the log');
  await tap('swap');
  check((await txt('.bs-eq')) === 'Now: 4 = x  ✓', 'balance: swap');
  await page.click(R + '.bs-reset');
  check((await txt('.bs-eq')) === 'Now: 3x + 5 = x + 13' && (await page.$$(R + '.bs-log li')).length === 1, 'balance: start again');
  await page.click(R + '.bs-hint');
  check((await txt('.bs-msg')).includes('Take an x box'), 'balance: hint');
  for (const [k, v] of [['a', 2], ['b', 4], ['c', 2], ['d', 4]]) await page.fill(R + '.bs-' + k, String(v));
  check((await txt('.bs-big')).startsWith('Every x balances'), 'balance: identity');
  await page.fill(R + '.bs-d', '6');
  check((await txt('.bs-big')) === 'No x can balance these pans', 'balance: no solution');
  await page.fill(R + '.bs-d', '40');
  check(await page.isVisible(R + '.bs-err'), 'balance: too many weights refused');
  await page.click(R + '.bs-new');
  check(await page.isHidden(R + '.bs-err') && /^Now: /.test(await txt('.bs-eq')), 'balance: new equation');
  for (let i = 1; i <= 4; i++) {
    const w = await page.textContent(`${R}.sm-q:nth-child(${i}) .sm-qwork`);
    const want = i === 3 ? (/x = (\d+\/\d+)/.exec(w) || [])[1] : i === 4 ? (w.endsWith('Yes.') ? '1' : '0') : (/x = (\d+)\.$/.exec(w) || [])[1];
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, want ?? 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await page.textContent(`${R}.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `balance: quiz ${i} (${w})`);
  }
};
