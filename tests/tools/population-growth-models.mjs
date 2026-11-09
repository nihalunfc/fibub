// #303 population growth models
export const path = '/science/population-growth-models/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const T = (s) => page.textContent('.pgm ' + s);
  await page.goto(`${BASE}/science/population-growth-models/`); await page.waitForTimeout(500);
  check((await T('.pg-big')) === 'At t = 30: exponential 162,062, logistic 498.5', 'growth: example curves');
  { const f = await T('.pg-facts'); check(f.includes('1.3499') && f.includes('2.310') && f.includes('37.50 per time unit') && f.includes('t = 10.59') && f.includes('exp. 8.419, log. 10.59'), 'growth: example facts'); }
  check((await T('.pg-vals')).includes('151800394.8'), 'growth: values table');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pgm .pg-csv')]); const f = OUT + 'pg.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 102 && rows[0] === 'Time,Exponential N,Logistic N' && rows[101].startsWith('30,162061.'), 'growth: curves CSV'); }
  await page.fill('.pgm .pg-r', '-0.1'); await page.waitForTimeout(300);
  check((await T('.pg-facts')).includes('Halving time6.931') && (await T('.pg-facts')).includes('exp. never'), 'growth: negative r');
  await page.fill('.pgm .pg-r', '0.3'); await page.fill('.pgm .pg-N0', '800'); await page.fill('.pgm .pg-target', ''); await page.waitForTimeout(300);
  check((await T('.pg-big')).endsWith('logistic 500') && !(await T('.pg-facts')).includes('Time to reach'), 'growth: start above K falls to K; no target');
  await page.fill('.pgm .pg-K', '0'); await page.waitForTimeout(300);
  check((await T('.pg-err')).includes('carrying capacity') && await page.isHidden('.pgm .pg-out'), 'growth: bad K message');
  await page.fill('.pgm .pg-K', '500'); await page.fill('.pgm .pg-N0', '20'); await page.fill('.pgm .pg-target', '250');
  await page.locator('.pgm button[data-m=les]').scrollIntoViewIfNeeded(); await page.click('.pgm button[data-m=les]'); await page.waitForTimeout(300);
  check((await T('.pg-big')) === 'λ = 1.1283: the population grows 12.8 % per time step in the long run', 'leslie: example λ');
  { const f = await T('.pg-facts'); check(f.includes('0.1207') && f.includes('5.741') && f.includes('1.380') && f.includes('2.668') && f.includes('2192') && f.includes('from 190'), 'leslie: example facts'); }
  { const t = await T('.pg-tab'); check(t.includes('56.74') && t.includes('25.14') && t.includes('2.257') && t.includes('1.329'), 'leslie: stable distribution and reproductive values'); }
  check((await T('.pg-mat')).startsWith('Age 0Age 1Age 2Age 3Age 001.221.5'), 'leslie: matrix shown');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pgm .pg-csv')]); const f = OUT + 'les.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('Step,Age 0,Age 1,Age 2,Age 3,Total') && t.includes('lambda,1.128334944'), 'leslie: projection CSV'); }
  await page.fill('.pgm .pg-steps', '5'); await page.waitForTimeout(300);
  check((await T('.pg-facts')).includes('Total after 5 steps'), 'leslie: steps option');
  await page.fill('.pgm .pg-data', 'Juvenile\t0\t0.4\t50\nAdult\t0.9\t0.8\t20'); await page.waitForTimeout(300);
  check((await T('.pg-big')).startsWith('λ = 1.1') && (await T('.pg-tab')).includes('Juvenile'), 'leslie: plus group stage model');
  await page.fill('.pgm .pg-data', 'A\t0\t0.5\t10\nB\t0\t0\t5'); await page.waitForTimeout(300);
  check((await T('.pg-err')).includes('cannot grow or persist'), 'leslie: no breeding message');
  await page.fill('.pgm .pg-data', 'A\t1\t1.5\t10'); await page.waitForTimeout(300);
  check((await T('.pg-err')).includes('between 0 and 1'), 'leslie: survival above 1 message');
  await page.fill('.pgm .pg-data', 'Age 0\t0\t0.5\t100\nAge 1\t1.2\t0.6\t50\nAge 2\t2.0\t0.4\t30\nAge 3\t1.5\t0\t10'); await page.fill('.pgm .pg-steps', '20'); await page.waitForTimeout(300);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pgm .dl [data-f=png]')]); check((await d.suggestedFilename()) === 'population-growth.png', 'leslie: image report'); }
};
