// #639 Kalman filter playground
export const path = '/science/kalman-filter-playground/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/kalman-filter-playground/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.kfp .kf-big'), facts = () => page.textContent('.kfp .kf-facts');
  check((await big()) === 'RMS error 0.946 filtered against 2.02 raw', `kalman-filter-playground: example simulation (${await big()})`);
  { const f = await facts(); check(f.includes('0.988') && f.includes('close to 1') && f.includes('99 %') && f.includes('2.02 ± 0.815 per s'), 'kalman-filter-playground: NIS, coverage, velocity'); }
  check(await page.isVisible('.kfp .kf-fig') && await page.isVisible('.kfp .kf-inn') && await page.isVisible('.kfp .kf-cov'), 'kalman-filter-playground: three charts');
  await page.fill('.kfp .kf-q', '5'); await page.waitForTimeout(150);
  check((await big()) === 'RMS error 1.41 filtered against 2.02 raw' && Math.abs(+(await page.inputValue('.kfp .kf-qs')) - Math.log10(5)) < 0.03, 'kalman-filter-playground: typed Q moves the slider');
  await page.fill('.kfp .kf-q', '0.05'); await page.fill('.kfp .kf-r', '0.1'); await page.waitForTimeout(150);
  check((await facts()).includes('overconfident'), 'kalman-filter-playground: small R is overconfident');
  // Slider.
  await page.locator('.kfp .kf-rs').evaluate((e) => { e.value = '0'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(150);
  check((await page.inputValue('.kfp .kf-r')) === '1', 'kalman-filter-playground: R slider sets the box');
  await page.click('.kfp .kf-match'); await page.waitForTimeout(150);
  check((await page.inputValue('.kfp .kf-r')) === '4' && (await big()) === 'RMS error 0.946 filtered against 2.02 raw', 'kalman-filter-playground: set Q and R to the truth');
  await page.click('.kfp .kf-new'); await page.waitForTimeout(150);
  check((await page.inputValue('.kfp .kf-seed')) === '2' && (await big()) !== 'RMS error 0.946 filtered against 2.02 raw', 'kalman-filter-playground: new noise');
  await page.selectOption('.kfp .kf-model', 'constant'); await page.waitForTimeout(150);
  { const f = await facts(); check(f.includes('Steady-state gain') && f.includes('0.076') && await page.isHidden('.kfp .kf-v0'), `kalman-filter-playground: constant model with steady gain`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.kfp .kf-csv')]); const f = OUT + 'kf.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 101 && r[0].startsWith('time,measurement,truth,estimate,std'), 'kalman-filter-playground: CSV of every step'); }
  // Pasted data.
  await page.selectOption('.kfp .kf-src', 'paste'); await page.selectOption('.kfp .kf-model', 'cv'); await page.waitForTimeout(150);
  check((await big()) === 'Last estimate 24.7 ± 2.46' && await page.isVisible('.kfp .kf-data'), `kalman-filter-playground: pasted example (${await big()})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.kfp .dl [data-f=png]')]); check((await d.suggestedFilename()).endsWith('.png'), 'kalman-filter-playground: image report'); }
  await page.fill('.kfp .kf-data', '5\n6\n7\n8'); await page.waitForTimeout(150);
  check((await big()).startsWith('Last estimate'), 'kalman-filter-playground: one column of measurements');
  await page.fill('.kfp .kf-data', '0\t1\n2\t2\n1\t3'); await page.waitForTimeout(150);
  check((await page.textContent('.kfp .kf-err')).includes('Times must increase'), 'kalman-filter-playground: times out of order');
  await page.fill('.kfp .kf-data', '0\t1\t1\n1\t2\t2\n2\t3\t3'); await page.waitForTimeout(150);
  check((await big()).startsWith('RMS error'), 'kalman-filter-playground: third column as truth');
  await page.fill('.kfp .kf-r', '0'); await page.waitForTimeout(150);
  check((await page.textContent('.kfp .kf-err')).includes('R must be above zero'), 'kalman-filter-playground: R of zero refused');
};
