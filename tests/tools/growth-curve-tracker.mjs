// #399 growth curve tracker
export const path = '/science/growth-curve-tracker/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/growth-curve-tracker/`); await page.waitForTimeout(500);
  check(await page.isHidden('.grc .gc-out'), 'growth: nothing shown before records');
  await page.click('.grc .gc-ex'); await page.waitForTimeout(400);
  check((await page.textContent('.grc .gc-big')) === '2 animals: average daily gain 0.730 kg/day over 537 days', `growth: pooled example (${await page.textContent('.grc .gc-big')})`);
  check((await page.textContent('.grc .gc-fits')).includes('546.2 ± 30') && (await page.textContent('.grc .gc-fits tr.best')).startsWith('von Bertalanffy'), 'growth: pooled fits, best AIC marked');
  await page.selectOption('.grc .gc-an', 'Calf 41'); await page.waitForTimeout(300);
  check((await page.textContent('.grc .gc-big')) === 'Calf 41: average daily gain 0.749 kg/day over 537 days', 'growth: one animal ADG');
  { const t = await page.textContent('.grc .gc-fits'); check(t.includes('Gompertz514.9 ± 13') && t.includes('Logistic463.1 ± 15') && t.includes('von Bertalanffy554.7 ± 11') && t.includes('33.8') && t.includes('136164.4'), 'growth: Calf 41 curves as scipy'); }
  { const t = await page.textContent('.grc .gc-gain'); check(t.includes('Calf 412025-03-012025-04-1545410.911') && (await page.$$('.grc .gc-gain tr')).length === 12, 'growth: daily gain table'); }
  check((await page.textContent('.grc .gc-bcs')).includes('+0.012 points per 30 days') && (await page.textContent('.grc .gc-bcs')).includes('now about 3.19') && await page.isVisible('.grc .gc-bfig'), 'growth: BCS trend and figure');
  check(await page.isVisible('.grc .gc-fig') && (await page.getAttribute('.grc .gc-fig', 'aria-label') || '').includes('Gompertz'), 'growth: figure with Gompertz curve');
  await page.selectOption('.grc .gc-m', 'vonb'); await page.waitForTimeout(200);
  check((await page.getAttribute('.grc .gc-fig', 'aria-label') || '').includes('von Bertalanffy'), 'growth: curve choice');
  await page.fill('.grc .gc-u', 'lb'); await page.waitForTimeout(500);
  check((await page.textContent('.grc .gc-big')).includes('lb/day'), 'growth: weight unit');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.grc .gc-csv')]); const f = OUT + 'gains.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n'); check(t.length === 12 && t[0] === 'animal,from,to,days,gain_lb,adg_lb_per_day' && t[1] === 'Calf 41,2025-03-01,2025-04-15,45,41,0.91111', 'growth: gains CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.grc .gc-fcsv')]); const f = OUT + 'fits.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('animal,date,t_days,weight_lb,gompertz_fitted') && t.includes('vonb,554.6844,10.6148'), 'growth: fitted curves CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.grc .dl [data-f=png]')]); check(d.suggestedFilename() === 'growth-curve.png', 'growth: image report'); }
  // Ages in days, no BCS, too few points, a bad row.
  await page.fill('.grc .gc-in', 'Fish A, 0, 2\nFish A, 30, 9\nFish A, 60, x'); await page.waitForTimeout(500);
  check((await page.textContent('.grc .gc-err')).includes('weight must be a number') && (await page.textContent('.grc .gc-fits')).includes('Need at least 4 weighings') && await page.isHidden('.grc .gc-bcsw'), 'growth: bad row and too few weighings');
  writeFileSync(OUT + 'weights.csv', 'animal,age,weight\nT1,0,5\nT1,30,20\nT1,60,55\nT1,90,100\nT1,120,140\nT1,150,165\nT1,180,178\n');
  await page.setInputFiles('.grc .dfb-in', OUT + 'weights.csv'); await page.waitForTimeout(600);
  check((await page.textContent('.grc .gc-big')).startsWith('T1: average daily gain') && (await page.textContent('.grc .gc-fits')).includes('Logistic') && (await page.textContent('.grc .gc-gain')).includes('T103030'), 'growth: ages opened from a file');
};
