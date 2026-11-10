// #1476 random variable builder (maths checked against scipy.stats in tests/sci-tools/random-variable.mjs)
export const path = '/learn/random-variable/';
export default async ({ page, check, BASE }) => {
  const R = '.rvb ';
  const t = (s) => page.textContent(R + s);
  const sel = async (s, v) => { await page.selectOption(R + s, v); await page.waitForTimeout(80); };
  await page.goto(`${BASE}/learn/random-variable/`); await page.waitForTimeout(500);
  { const f = await t('.rv-facts'); check(f.includes('Mean E(X) = μ1.5') && f.includes('E(X²)3') && f.includes('Variance0.75') && f.includes('Standard deviation σ0.866') && f.includes('np = 1.5, npq = 0.75'), `random variable: coins (${f})`); }
  check((await page.$$eval(R + '.rv-tab tbody tr', (r) => r.length)) === 4 && (await t('.rv-tab')).includes('3/8'), 'random variable: coins table in fractions');
  check((await t('.rv-work')).includes('= 1.5') && (await t('.rv-work')).includes('3 − 1.5² = 0.75'), `random variable: working (${await t('.rv-work')})`);
  const px = await page.evaluate(() => { const c = document.querySelector('.rv-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 200 || d[i + 2] < 200) n++; return n; });
  check(px > 3000, `random variable: bars drawn (${px} px)`);
  await sel('.rv-src', 'dice');
  check((await t('.rv-facts')).includes('μ7') && (await t('.rv-facts')).includes('Variance5.8333'), `random variable: dice (${await t('.rv-facts')})`);
  await page.click(R + '.rv-runs button[data-n="10000"]'); await page.waitForTimeout(100);
  { const s = await t('.rv-sim'); const m = Number((s.match(/Average of X([\d.]+)/) || [])[1]); check(s.includes('Runs10,000') && Math.abs(m - 7) < 0.15, `random variable: simulated 10 000 (${s})`); }
  await sel('.rv-src', 'bulbs');
  check((await t('.rv-facts')).includes('μ0.6') && (await t('.rv-tab')).includes('8/120') && (await t('.rv-sim')) === '', 'random variable: bulbs, simulation reset');
  await sel('.rv-src', 'bin');
  check((await t('.rv-facts')).includes('μ1.8') && (await t('.rv-facts')).includes('Variance1.26'), `random variable: binomial 6, 0.3 (${await t('.rv-facts')})`);
  await page.$eval(R + '.rv-n', (e) => { e.value = '10'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.$eval(R + '.rv-p', (e) => { e.value = '0.5'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  check((await t('.rv-facts')).includes('μ5') && (await t('.rv-facts')).includes('Variance2.5') && (await page.$$eval(R + '.rv-tab tbody tr', (r) => r.length)) === 11, 'random variable: binomial sliders');
  await page.click(R + '.rv-copy'); await page.waitForTimeout(80);
  check((await page.$eval(R + '.rv-src', (e) => e.value)) === 'own' && (await t('.rv-facts')).includes('μ5') && (await page.$eval(R + '.rv-err', (e) => e.hidden)), `random variable: copied into my own table (${await t('.rv-err')})`);
  await sel('.rv-src', 'dice'); await sel('.rv-src', 'own');
  check((await t('.rv-facts')).includes('μ5'), 'random variable: own table kept');
  await sel('.rv-src', 'coins'); await page.click(R + '.rv-copy'); await page.waitForTimeout(80);
  const ins = await page.$$(R + '.rv-tab tbody input');
  await ins[1].fill('1/4'); await page.waitForTimeout(60);
  check((await t('.rv-err')).includes('add to 1.125'), `random variable: sum warning (${await t('.rv-err')})`);
  await ins[1].fill('1/8'); await page.waitForTimeout(60);
  check(await page.$eval(R + '.rv-err', (e) => e.hidden), 'random variable: fixed');
  await page.click(R + '.rv-add'); await page.waitForTimeout(60);
  check((await page.$$eval(R + '.rv-tab tbody tr', (r) => r.length)) === 5, 'random variable: add a row');
  await page.click(R + '.rv-tab tbody tr:nth-child(5) .rv-del'); await page.waitForTimeout(60);
  check((await page.$$eval(R + '.rv-tab tbody tr', (r) => r.length)) === 4 && (await t('.rv-facts')).includes('μ1.5'), 'random variable: remove a row');
  check((await page.$$eval(R + '.smq-q', (e) => e.length)) === 5, 'random variable: five quiz questions');
  await page.fill(R + '.smq-q:nth-child(5) .smq-in', '0.5'); await page.click(R + '.smq-q:nth-child(5) .smq-check');
  check((await t('.smq-q:nth-child(5) .smq-out')) === 'Right!', 'random variable: quiz answer');
};
