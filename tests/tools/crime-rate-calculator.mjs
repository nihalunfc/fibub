// #767 Crime rate calculator: one rate (exact and Byar, bases, confidence), comparisons, age standardisation,
// downloads and bad input messages.
export const path = '/science/crime-rate-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(BASE + path);
  const until = async (fn, ok) => { let v; for (let i = 0; i < 80; i++) { v = await fn(); if (ok(v)) return v; await page.waitForTimeout(100); } return v; };
  await page.waitForSelector('.cr-out:not([hidden])');
  const big = () => page.innerText('.cr-big'), facts = () => page.innerText('.cr-facts'), err = () => page.innerText('.cr-err');
  const drawn = (part) => page.waitForFunction((p) => (document.querySelector('.cr-fig').getAttribute('aria-label') || '').includes(p), part);
  check((await big()) === '222.7 per 100,000 (95 % interval 201.7 to 245.3)', `crime: example rate (${await big()})`);
  check((await facts()).includes('2.23 per 1,000; 1 in 449'), 'crime: per 1,000 and 1 in N');
  await drawn('for 1 row');
  await page.selectOption('.cr-meth', 'byar');
  check((await facts()).includes('(Byar)') && (await big()).includes('201.7 to 245.3'), 'crime: Byar interval');
  await page.selectOption('.cr-meth', 'exact'); await page.selectOption('.cr-per', '1000');
  check((await big()).startsWith('2.2 per 1,000'), `crime: per 1,000 (${await big()})`);
  await page.selectOption('.cr-per', '100000'); await page.selectOption('.cr-conf', '0.99');
  check((await big()).includes('99 % interval'), 'crime: 99 % interval');
  await page.selectOption('.cr-conf', '0.95');
  await page.fill('.cr-k', '7');
  check((await until(() => page.innerText('.cr-note'), (v) => v.includes('only 7 offences'))).includes('only 7 offences'), 'crime: small count warning');
  await page.fill('.cr-k', '2.5');
  check((await until(err, (v) => v.includes('whole number'))).includes('whole number'), 'crime: fractional count refused');
  await page.fill('.cr-k', '412'); await page.fill('.cr-pop', '0');
  check((await until(err, (v) => v.includes('above zero'))).includes('above zero'), 'crime: zero population refused');
  await page.fill('.cr-k', '500'); await page.fill('.cr-pop', '100');
  check((await until(err, (v) => v.includes('larger than the population'))).includes('larger than the population'), 'crime: count above population refused');
  await page.fill('.cr-k', '412'); await page.fill('.cr-pop', '185000'); await until(async () => (await page.isVisible('.cr-out')) && (await big()), (v) => String(v).startsWith('222.7'));
  const dl = async (sel) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(sel)]); const p = OUT + d.suggestedFilename(); await d.saveAs(p); return { name: d.suggestedFilename(), p }; };
  const c1 = await dl('.cr-csv');
  check(c1.name === 'crime-rate-single.csv' && readFileSync(c1.p, 'utf8').split('\n')[1].startsWith('412,185000,222.7027,201.7149,245.2809,0.95,exact'), 'crime: single rate CSV');

  // Compare.
  await page.click('.cr-mode button[data-m="cmp"]');
  check((await big()) === 'Year 3: 206.4 per 100,000, +4.9 % on Year 1 (rate ratio 1.049, p = 0.533)', `crime: comparison headline (${await big()})`);
  const rows = await page.$$eval('.cr-tab tbody tr', (r) => r.map((x) => [...x.cells].map((c) => c.textContent).join('|')));
  check(rows[1] === 'Year 2|412|185,000|222.7|201.7 to 245.3|1.132|0.980 to 1.309|0.090|+13.2 %', `crime: Year 2 row (${rows[1]})`);
  check((await facts()).includes('0.906 to 1.215') && (await facts()).includes('0.909 to 1.211'), 'crime: exact and log intervals');
  await drawn('for 3 rows');
  await page.selectOption('.cr-ref', '1');
  check((await big()).includes('on Year 2') && (await big()).startsWith('Year 3'), `crime: reference row can change (${await big()})`);
  const c2 = await dl('.cr-csv'), cr = readFileSync(c2.p, 'utf8').trim().split('\n');
  check(c2.name === 'crime-rate-comparison.csv' && cr.length === 4 && cr[0].startsWith('name,count,population,rate'), 'crime: comparison CSV');
  await page.fill('.cr-rows', 'Only, 5, 1000');
  check((await until(err, (v) => v.includes('at least two rows'))).includes('at least two rows'), 'crime: one row refused');
  await page.fill('.cr-rows', 'A, 5, 1000\nB, x, 1000');
  check((await until(err, (v) => v.includes('row 2'))).includes('row 2'), 'crime: bad count names its row');
  await page.fill('.cr-rows', 'North, 0, 1000\nSouth, 5, 1000');
  await until(() => page.$$eval('.cr-ref option', (o) => o.map((x) => x.textContent).join()), (v) => v === 'North,South');
  await page.selectOption('.cr-ref', '0');
  const zr = await until(() => page.$$eval('.cr-tab tbody tr', (r) => (r[1] ? r[1].cells[0].textContent + '|' + r[1].cells[5].textContent + '|' + r[1].cells[6].textContent : '')), (v) => v.startsWith('South'));
  check(zr.startsWith('South|∞|') && zr.endsWith('to ∞'), `crime: zero reference count gives an open-ended ratio (${zr})`);

  // Age standardisation.
  await page.click('.cr-mode button[data-m="std"]');
  check((await big()) === 'Age-standardised rate 193.1 per 100,000 (95 % interval 173.2 to 215.1)', `crime: ASR (${await big()})`);
  const f = await facts();
  check(f.includes('172.6 to 213.6') && f.includes('200.0 per 100,000') && f.includes('10.44') && !(await page.isVisible('.cr-mw')), 'crime: normal interval, crude rate, SE; no Poisson method choice');
  check((await page.$$('.cr-tab tbody tr')).length === 5, 'crime: 5 age groups');
  await drawn('for 7 rows');
  const pdf = await dl('.dl button[data-f="pdf"]');
  check(pdf.name === 'crime-rate.pdf' && readFileSync(pdf.p).subarray(0, 4).toString() === '%PDF', 'crime: PDF report');
  await page.fill('.cr-age', '0-17, 1, 100\n18+, 2, 200');
  check((await until(err, (v) => v.includes('needs a name, count, population and standard population'))).includes('needs a name, count, population and standard population'), 'crime: short age rows refused');
  await page.fill('.cr-age', 'a, 0, 100, 50\nb, 0, 200, 50');
  check((await until(err, (v) => v.includes('All counts are zero'))).includes('All counts are zero'), 'crime: all-zero counts refused');
};
