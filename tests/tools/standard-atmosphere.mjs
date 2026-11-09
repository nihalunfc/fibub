// #667 standard atmosphere calculator
export const path = '/science/standard-atmosphere/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/standard-atmosphere/`); await page.waitForTimeout(500);
  const t = (c) => page.textContent(`.sat ${c}`);
  check((await t('.sa-big')) === '216.77 K (−56.38 °C), 22,700 Pa, 0.3648 kg/m³', `atmos: example at 11,000 m geometric (${await t('.sa-big')})`);
  { const f = await t('.sa-facts'); check(f.includes('Troposphere') && f.includes('295.15 m/s') && f.includes('σ = 0.2978') && f.includes('10,981 m geopotential'), 'atmos: example facts'); }
  await page.selectOption('.sat .sa-ht', 'gp'); await page.waitForTimeout(100);
  check((await t('.sa-big')).startsWith('216.65 K') && (await t('.sa-big')).includes('22,632 Pa') && (await t('.sa-facts')).includes('Tropopause'), 'atmos: 11,000 m geopotential gives the tropopause values');
  await page.fill('.sat .sa-dt', '15'); await page.waitForTimeout(100);
  { const f = await t('.sa-facts'); check((await t('.sa-big')).startsWith('231.65 K') && (await t('.sa-big')).includes('22,632 Pa') && f.includes('Density altitude') && f.includes('standard 216.65 K'), 'atmos: ISA +15 keeps pressure, shows density altitude'); }
  await page.fill('.sat .sa-dt', '0');
  check((await t('.sa-pbig')) === 'Pressure altitude 3,012 m', 'atmos: 700 hPa pressure altitude');
  await page.selectOption('.sat .sa-pu', 'inHg'); await page.fill('.sat .sa-p', '29.92'); await page.waitForTimeout(100);
  check((await t('.sa-pbig')) === 'Pressure altitude 0.4 m', `atmos: 29.92 inHg is about sea level (${await t('.sa-pbig')})`);
  check((await t('.sa-dbig')) === 'Density altitude 2,380 m' && (await t('.sa-dfacts')).includes('+24.9 °C') && (await t('.sa-dfacts')).includes('1,526 m'), 'atmos: example airfield density altitude');
  await page.selectOption('.sat .sa-tu', 'F'); await page.fill('.sat .sa-oat', '86'); await page.waitForTimeout(100);
  check((await t('.sa-dbig')) === 'Density altitude 2,380 m', 'atmos: °F temperature gives the same density altitude');
  await page.fill('.sat .sa-qnh', '5'); await page.waitForTimeout(100);
  check((await t('.sa-derr')).includes('altimeter setting') && (await t('.sa-dbig')) === '', 'atmos: bad QNH message');
  await page.fill('.sat .sa-qnh', '1010');
  check(await page.isVisible('.sat .sa-f1') && await page.isVisible('.sat .sa-f2') && (await page.$$('.sat .sa-tab tr')).length === 44, 'atmos: plots and table 0 to 84,852 m every 2,000 m (43 rows)');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.sat .sa-csv')]); const f = OUT + 'atmos.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 44 && rows[0].startsWith('geopotential_altitude_m,geometric_m') && rows[6].startsWith('10000,') && rows[6].includes(',223.15'), 'atmos: table CSV'); }
  await page.selectOption('.sat .sa-ht', 'geo'); await page.selectOption('.sat .sa-u', 'us'); await page.waitForTimeout(150);
  check((await page.inputValue('.sat .sa-alt')) === '36089.24' && (await t('.sa-big')).startsWith('216.77 K') && (await t('.sa-facts')).includes('ft geometric'), 'atmos: switch to feet converts the altitude');
  check((await t('.sa-dbig')) === 'Density altitude 7,808 ft' && (await page.$$('.sat .sa-tab tr')).length === 58, `atmos: feet for density altitude and table (${await t('.sa-dbig')})`);
  await page.selectOption('.sat .sa-u', 'si'); await page.fill('.sat .sa-alt', '90000'); await page.waitForTimeout(100);
  check((await t('.sa-err')).includes('−5 km to 86 km') && await page.isHidden('.sat .sa-out'), 'atmos: altitude out of range message');
  await page.fill('.sat .sa-alt', '11000'); await page.fill('.sat .sa-step', '0'); await page.waitForTimeout(100);
  check((await t('.sa-terr')).includes('5,000 rows') && await page.isHidden('.sat .sa-tout'), 'atmos: bad step message');
  await page.fill('.sat .sa-step', '1000'); await page.waitForTimeout(100);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.sat .dl button[data-f="pdf"]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'atmos: PDF report'); }
};
