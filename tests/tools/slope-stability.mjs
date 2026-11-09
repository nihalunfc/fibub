// #658 slope stability (Bishop simplified)
export const path = '/science/slope-stability/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/slope-stability/`); await page.waitForTimeout(900);
  const big = () => page.textContent('.ssb .ss-big'), facts = () => page.textContent('.ssb .ss-facts');
  const settle = () => page.waitForTimeout(500);
  check((await big()) === 'Bishop FS = 1.18 (ordinary 1.11)', `slope-stability: example grid search (${await big()})`);
  { const f = await facts(); check(f.includes('centre (1.83, 20.79) m, R = 20.87 m') && f.includes('1227 circles tried') && f.includes('16 iterations'), 'slope-stability: critical circle facts'); }
  check((await page.textContent('.ssb .ss-sub')).startsWith('Between 1 and 1.3: marginal.') && await page.isVisible('.ssb .ss-fig'), 'slope-stability: verdict and drawing');
  await page.selectOption('.ssb .ss-wk', 'none'); await settle();
  check((await big()).startsWith('Bishop FS = 1.50'), `slope-stability: dry slope (${await big()})`);
  await page.selectOption('.ssb .ss-wk', 'line'); await settle();
  check(await page.isVisible('.ssb .ss-wt') && (await big()).startsWith('Bishop FS = 1.29'), `slope-stability: water table (${await big()})`);
  await page.selectOption('.ssb .ss-wk', 'ru'); await page.selectOption('.ssb .ss-nl', '2'); await settle();
  check(await page.isVisible('.ssb .ss-c2') && (await big()).startsWith('Bishop FS = 1.20'), `slope-stability: two soils (${await big()})`);
  await page.selectOption('.ssb .ss-nl', '1');
  // One circle.
  await page.selectOption('.ssb .ss-mode', 'one'); await settle();
  check((await big()) === 'Bishop FS = 1.18 (ordinary 1.10)' && (await facts()).includes('the circle you gave'), `slope-stability: one circle (${await big()})`);
  await page.click('.ssb summary'); await page.waitForTimeout(100);
  check((await page.$$('.ssb .ss-tab tr')).length === 41, 'slope-stability: slice table with 40 slices');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ssb .ss-csv')]); const f = OUT + 'ss.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 41 && r[0].startsWith('slice,x_m,width_m'), 'slope-stability: slices CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ssb .dl [data-f=png]')]); check((await d.suggestedFilename()).endsWith('.png'), 'slope-stability: image report'); }
  await page.fill('.ssb .ss-n', '20'); await settle();
  check((await page.$$('.ssb .ss-tab tr')).length === 21, 'slope-stability: number of slices');
  await page.fill('.ssb .ss-cr', '3'); await settle();
  check((await page.textContent('.ssb .ss-err')).includes('does not cut through the slope') && await page.isHidden('.ssb .ss-out'), 'slope-stability: circle that misses');
  await page.fill('.ssb .ss-cr', '20.1');
  // Grid: fit to a new slope, edge warning, bad input.
  await page.selectOption('.ssb .ss-mode', 'grid'); await page.fill('.ssb .ss-h', '6'); await page.fill('.ssb .ss-b', '45'); await page.click('.ssb .ss-fit'); await settle();
  check(Number(await page.inputValue('.ssb .ss-x1')) === 6 && Number(await page.inputValue('.ssb .ss-y0')) === 6.6 && (await big()).startsWith('Bishop FS ='), 'slope-stability: fit the grid');
  await page.fill('.ssb .ss-x0', '5'); await page.fill('.ssb .ss-x1', '6'); await settle();
  check((await page.textContent('.ssb .ss-sub')).includes('edge of the grid'), 'slope-stability: edge-of-grid warning');
  await page.fill('.ssb .ss-y0', '2'); await settle();
  check((await page.textContent('.ssb .ss-err')).includes('above the crest'), 'slope-stability: grid below the crest refused');
  await page.fill('.ssb .ss-ru', '1.2'); await settle();
  check((await page.textContent('.ssb .ss-err')).includes('ru must be'), 'slope-stability: bad ru');
  await page.fill('.ssb .ss-ru', '0.25'); await page.fill('.ssb .ss-c1', '0'); await page.fill('.ssb .ss-p1', '0'); await settle();
  check((await page.textContent('.ssb .ss-err')).includes('cannot both be zero'), 'slope-stability: no strength refused');
};
