// #840 Insolation calculator
export const path = '/science/insolation-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/insolation-calculator/`);
  await page.waitForFunction(() => document.querySelector('.isl .isl-f3')?.dataset.drawn, null, { timeout: 8000 });
  const txt = async (c) => (await page.textContent(c)).replace(/\s+/g, ' ').trim();
  const row = (n) => page.evaluate((n) => [...document.querySelectorAll(`.isl .isl-tab tbody tr:nth-child(${n}) td`)].map((td) => td.textContent).join(' | '), n);
  const settle = async () => { const d = await page.getAttribute('.isl .isl-f3', 'data-drawn'); await page.waitForFunction((d) => document.querySelector('.isl .isl-f3').dataset.drawn !== d, d, { timeout: 8000 }); };
  check((await txt('.isl .isl-big')) === '65° N, day 172 (21 Jun): Today 477.9 W/m², Example B 442.5 W/m²', 'insolation: example daily means');
  check((await row(1)) === 'Daily mean (W/m²) | 477.9 | 442.5 | -35.49', 'insolation: daily mean row with B − A');
  check((await row(2)) === 'At 12:00 local solar time (W/m²) | 986.1 | 929.2 | -56.86', 'insolation: noon value');
  check((await row(3)).startsWith('True solar longitude λ | 89.28° | 87.23°') && (await row(6)) === 'Earth–Sun distance (× a) | 1.01622 | 1.03893 | +0.02271', 'insolation: λ and distance');
  check((await row(9)).startsWith('Caloric summer mean (W/m²) | 366.0 | 351.8') && (await row(12)) === 'Caloric summer runs | 22 Mar to 21 Sep | 24 Mar to 23 Sep | ', 'insolation: caloric summer');
  check((await row(8)).startsWith('Annual mean here (W/m²) | 213.7 | 211.1'), 'insolation: annual mean');
  check(await page.evaluate(() => ['.isl-f1', '.isl-f2', '.isl-f3'].every((c) => document.querySelector('.isl ' + c).width > 300)), 'insolation: three figures drawn');
  // Heatmap pixel: B − A is diverging; north summer cell is blue (B gets less)
  await page.click('.isl .isl-hm [data-k=d]'); await page.waitForTimeout(300);
  check(await page.evaluate(() => { const c = document.querySelector('.isl .isl-f3'); return c.getAttribute('aria-label').includes('Example B − Today'); }), 'insolation: difference map');
  // Solar longitude mode: λ = 90
  await page.selectOption('.isl .isl-mode', 'lam'); await page.waitForTimeout(400);
  await page.fill('.isl .isl-t', '90'); await page.dispatchEvent('.isl .isl-t', 'input'); await settle();
  check((await txt('.isl .isl-big')) === '65° N, λ = 90°: Today 477.9 W/m², Example B 442.5 W/m²' && (await row(4)).startsWith('Calendar day | 172.8 (21 Jun) | 175.0 (24 Jun)'), 'insolation: by solar longitude, calendar day differs');
  await page.selectOption('.isl .isl-mode', 'day'); await page.waitForTimeout(400);
  check((await page.inputValue('.isl .isl-t')) === '172.76', 'insolation: switching back converts λ to a day');
  // Convention switch keeps the orbit
  await page.selectOption('.isl .isl-conv', 'sun'); await page.waitForTimeout(400);
  check((await page.inputValue('.isl [data-set=a] .isl-peri')) === '282.937' && (await page.inputValue('.isl [data-set=b] .isl-peri')) === '280' && (await row(1)).startsWith('Daily mean (W/m²) | 477.9'), 'insolation: ϖ convention switch');
  await page.selectOption('.isl .isl-conv', 'helio'); await page.waitForTimeout(400);
  // Latitude profile options
  for (const v of ['annual', 'summer', 'winter', 'above', 'day']) { await page.selectOption('.isl .isl-prof', v); await page.waitForTimeout(150); }
  check((await page.getAttribute('.isl .isl-f2', 'aria-label')).startsWith('Daily mean, day 172.76'), 'insolation: profile options');
  // Pole and instantaneous time
  await page.fill('.isl .isl-lat', '-90'); await page.fill('.isl .isl-hr', '9.5'); await page.dispatchEvent('.isl .isl-hr', 'input'); await settle();
  check((await row(1)).startsWith('Daily mean (W/m²) | 0.0') && (await row(2)).startsWith('At 09:30 local solar time'), 'insolation: South Pole in June is dark');
  // CSV downloads
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.isl .isl-csvl')]); const f = OUT + 'isl.csv'; await d.saveAs(f); const s = readFileSync(f, 'utf8').trim().split('\n');
    check(d.suggestedFilename() === 'insolation-by-latitude.csv' && s.length === 182 && s[0].startsWith('latitude,Today_daily_mean_chosen_time,Today_annual_mean') && s[26].startsWith('65,477.9') , 'insolation: latitude CSV'); }
  await page.click('.isl .isl-hm [data-k=a]'); await page.waitForTimeout(300);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.isl .isl-csvg')]); const f = OUT + 'islg.csv'; await d.saveAs(f); const s = readFileSync(f, 'utf8').trim().split('\n');
    check(d.suggestedFilename() === 'insolation-Today-by-day.csv' && s.length === 182 && s[0].split(',').length === 366 && s[1].split(',')[172].startsWith('5'), 'insolation: grid CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.isl .dl [data-f=pdf]')]); check(d.suggestedFilename() === 'insolation.pdf', 'insolation: report PDF'); }
  // One orbit only
  await page.uncheck('.isl .isl-useb'); await page.waitForTimeout(400);
  check((await page.$$eval('.isl .isl-tab thead th', (t) => t.length)) === 2 && await page.isDisabled('.isl .isl-hm [data-k=b]'), 'insolation: one orbit');
  await page.check('.isl .isl-useb'); await page.waitForTimeout(300);
  // Bad input
  await page.fill('.isl [data-set=b] .isl-e', '0.6'); await page.dispatchEvent('.isl [data-set=b] .isl-e', 'input'); await page.waitForTimeout(500);
  check((await txt('.isl .isl-oerr')).startsWith('Example B: Eccentricity must be') && await page.isHidden('.isl .isl-out'), 'insolation: bad eccentricity');
  await page.fill('.isl [data-set=b] .isl-e', '0.04'); await page.fill('.isl .isl-lat', '95'); await page.dispatchEvent('.isl .isl-lat', 'input'); await page.waitForTimeout(500);
  check((await txt('.isl .isl-terr')) === 'Latitude must be from -90 to 90.', 'insolation: bad latitude');
  await page.fill('.isl .isl-lat', '65'); await page.dispatchEvent('.isl .isl-lat', 'input'); await page.waitForTimeout(500);
  await page.click('.isl .isl-today');
  check(await page.isVisible('.isl .isl-out') && await page.isHidden('.isl .isl-terr'), 'insolation: back to good input');
};
