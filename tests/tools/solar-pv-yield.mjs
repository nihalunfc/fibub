// #672 solar PV yield estimator
export const path = '/science/solar-pv-yield/';
export default async ({ page, check, OUT, readFileSync, BASE }) => {
  await page.goto(`${BASE}/science/solar-pv-yield/`); await page.waitForTimeout(800);
  const t = (c) => page.textContent(`.spv ${c}`);
  check((await t('.sp-big')) === '6,541 kWh a year (1,308 kWh per kWp)', `pv: example (${await t('.sp-big')})`);
  { const f = await t('.sp-facts'); check(f.includes('10,063 kWh') && f.includes('2,340 kWh/m²') && f.includes('14.9 %') && f.includes('36.4°') && f.includes('Jul') && f.includes('worst Dec'), 'pv: clear-sky bound, capacity factor, best tilt, months'); }
  { const rows = await page.$$eval('.spv .sp-tab tr', (r) => r.map((x) => x.textContent)); check(rows.length === 14 && rows[7].includes('696') && rows[13].includes('6,541'), 'pv: monthly table'); }
  check(await page.isVisible('.spv .sp-f1') && await page.isVisible('.spv .sp-f2'), 'pv: two plots');
  await page.fill('.spv .sp-cloud', '100'); await page.waitForTimeout(500);
  check((await t('.sp-big')).startsWith('10,063 kWh'), 'pv: 100 % sunshine gives the clear-sky bound');
  await page.fill('.spv .sp-mcloud', '45, 50, 55, 60, 65, 70, 72, 70, 65, 55, 45, 40'); await page.waitForTimeout(500);
  { const rows = await page.$$eval('.spv .sp-tab tr', (r) => r.map((x) => x.textContent)); check(rows[1].includes('45') && rows[7].includes('72') && !(await t('.sp-big')).startsWith('10,063'), 'pv: monthly sunshine'); }
  await page.fill('.spv .sp-mcloud', '45, 50'); await page.waitForTimeout(500);
  check((await t('.sp-err')).includes('12 monthly') && await page.isHidden('.spv .sp-out'), 'pv: bad monthly list message');
  await page.fill('.spv .sp-mcloud', ''); await page.fill('.spv .sp-cloud', '65');
  await page.fill('.spv .sp-az', '0'); await page.waitForTimeout(500);
  check((await t('.sp-facts')).includes('Facing away from the equator'), 'pv: north-facing panels in the north get a hint');
  await page.fill('.spv .sp-lat', '-33.9'); await page.fill('.spv .sp-lon', '151.2'); await page.fill('.spv .sp-tilt', '30'); await page.waitForTimeout(600);
  check(!(await t('.sp-facts')).includes('Facing away') && (await t('.sp-facts')).includes('30.7°'), 'pv: southern hemisphere, north-facing, best tilt 30.7°');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.spv .sp-hcsv')]); const f = OUT + 'pvh.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 8761 && r[0].startsWith('utc_time,month,sun_zenith_deg'), 'pv: hourly CSV has 8,760 hours'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.spv .sp-csv')]); const f = OUT + 'pvm.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 13 && r[1].startsWith('Jan,65,'), 'pv: monthly CSV'); }
  await page.fill('.spv .sp-lat', '80'); await page.waitForTimeout(500);
  check((await t('.sp-err')).includes('latitude'), 'pv: polar latitude message');
  await page.fill('.spv .sp-lat', '43.7');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.spv .dl button[data-f="pdf"]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'pv: PDF report'); }
};
