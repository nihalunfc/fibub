// #673 wind turbine energy yield
export const path = '/science/wind-energy-yield/';
export default async ({ page, check, OUT, readFileSync, writeFileSync, BASE }) => {
  await page.goto(`${BASE}/science/wind-energy-yield/`); await page.waitForTimeout(1200);
  const t = (c) => page.textContent(`.wey ${c}`);
  check((await t('.we-big')) === '8,999 MWh a year, capacity factor 51.4 %', `wind: example (${await t('.we-big')})`);
  { const f = await t('.we-facts'); check(f.includes('k 2.102, c 9.97 m/s') && f.includes('c 7.173 m/s') && f.includes('10,309 MWh') && f.includes('10,347 MWh') && f.includes('8,760 readings'), 'wind: Weibull fit, gross energy, energy from data'); }
  check(await page.isVisible('.wey .we-f1') && await page.isVisible('.wey .we-f2') && await page.isVisible('.wey .we-f3'), 'wind: three plots');
  await page.fill('.wey .we-av', '100'); await page.fill('.wey .we-loss', '0'); await page.waitForTimeout(500);
  check((await t('.we-big')).startsWith('10,309 MWh'), 'wind: no losses gives the gross energy');
  await page.fill('.wey .we-elev', '1500'); await page.fill('.wey .we-t', '5.25'); await page.waitForTimeout(500);
  check(!(await t('.we-big')).startsWith('10,309') && (await t('.we-facts')).includes('Curve') === false && (await t('.we-facts')).includes('equivalent-speed'), 'wind: high site lowers the energy');
  await page.fill('.wey .we-elev', '0'); await page.fill('.wey .we-t', '15');
  await page.selectOption('.wey .we-law', 'log'); await page.fill('.wey .we-lp', '0.03'); await page.waitForTimeout(500);
  check((await t('.we-facts')).includes('z0 0.03 m') && (await t('.we-facts')).includes('× 1.396'), `wind: log law (${(await t('.we-facts')).match(/× [\d.]+ from/)})`);
  await page.selectOption('.wey .we-law', 'power'); await page.fill('.wey .we-lp', '0.143');
  await page.selectOption('.wey .we-src', 'kc'); await page.fill('.wey .we-h0', '100'); await page.waitForTimeout(500);
  check(await page.isHidden('.wey .we-data') && (await t('.we-facts')).includes('k 2, c 7 m/s'), 'wind: Weibull k and c');
  await page.selectOption('.wey .we-src', 'mean'); await page.waitForTimeout(400);
  check((await t('.we-facts')).includes('c 6.996 m/s'), `wind: mean speed and k (${(await t('.we-facts')).match(/k 2, c [\d.]+/)})`);
  await page.fill('.wey .we-cp', '0.7'); await page.waitForTimeout(500);
  check((await t('.we-err')).includes('Betz') && await page.isHidden('.wey .we-out'), 'wind: Cp above Betz message');
  await page.fill('.wey .we-cp', '0.45');
  await page.selectOption('.wey .we-csrc', 'paste'); await page.waitForTimeout(300);
  writeFileSync(OUT + 'curve.csv', 'speed,kW\n3,0\n4,50\n6,250\n8,600\n10,1000\n12,1500\n13,1500\n25,1500\n');
  const inputs = await page.$$('.wey .dfb-in'); await inputs[1].setInputFiles(OUT + 'curve.csv'); await page.waitForTimeout(700);
  check((await t('.we-facts')).includes('rated 1,500 kW'), 'wind: open a power curve file');
  await page.selectOption('.wey .we-src', 'data'); await page.fill('.wey .we-h0', '10');
  writeFileSync(OUT + 'wind.csv', 'time,speed\n' + Array.from({ length: 500 }, (_, i) => `${i},${(3 + 6 * Math.abs(Math.sin(i * 0.37))).toFixed(1)}`).join('\n'));
  await inputs[0].setInputFiles(OUT + 'wind.csv'); await page.fill('.wey .we-col', '2'); await page.waitForTimeout(700);
  check((await t('.we-facts')).includes('500 readings'), 'wind: open a wind file, second column');
  await page.fill('.wey .we-col', '1'); await page.fill('.wey .we-data', '1\n2'); await page.waitForTimeout(500);
  check((await t('.we-err')).includes('at least 20'), 'wind: too few readings message');
  await page.fill('.wey .we-data', Array.from({ length: 50 }, (_, i) => String((i % 9) + 1)).join('\n')); await page.waitForTimeout(500);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.wey .we-csv')]); const f = OUT + 'wbins.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r[0] === 'wind_speed_band_m_s,hours_per_year,power_kW_at_band_middle,gross_energy_kWh' && r[1].startsWith('0-1,') && r.length > 20, 'wind: energy bins CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.wey .dl button[data-f="png"]')]); check((await d.suggestedFilename()).endsWith('.png'), 'wind: image report'); }
};
