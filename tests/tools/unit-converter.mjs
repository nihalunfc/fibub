// #692 engineering unit converter
export const path = '/science/unit-converter/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/unit-converter/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.ucv .uc-big'), facts = () => page.textContent('.ucv .uc-facts');
  const ex = async (v) => { await page.fill('.ucv .uc-expr', v); await page.waitForTimeout(120); };
  check((await big()) === '2212.686448 lbf·ft' && (await facts()).includes('L²·M·T⁻²') && (await facts()).includes('energy, work or torque'), 'units: example expression');
  await page.click('.ucv .uc-chip[data-e="100 °C to °F"]'); await page.waitForTimeout(120);
  check((await big()) === '212 °F' && (await facts()).includes('absolute temperature'), 'units: example chip, absolute temperature');
  await page.click('.ucv .uc-chip[data-e="450 bbl/d to m^3/h"]'); await page.waitForTimeout(120);
  check((await big()) === '2.98101178 m³/h', 'units: oil flow');
  await page.click('.ucv .uc-chip[data-e="1 W/(m*K) to Btu/(h*ft*°F)"]'); await page.waitForTimeout(120);
  check((await big()).startsWith('0.5777893165') && (await facts()).includes('temperature difference'), 'units: thermal conductivity with a °F difference');
  await page.click('.ucv .uc-chip[data-e="5 m/s to N"]'); await page.waitForTimeout(120);
  check((await page.textContent('.ucv .uc-err')).includes('L·T⁻¹ (speed)') && (await page.textContent('.ucv .uc-err')).includes('(force)') && (await big()) === '', 'units: dimension mismatch message');
  await ex('1 psi');
  check((await big()) === '6894.757293 m⁻¹·kg·s⁻²', 'units: no "to" gives SI base units');
  await ex('2 furlong to m');
  check((await page.textContent('.ucv .uc-err')) === 'Unknown unit "furlong".', 'units: unknown unit');
  await ex('100 N*m * 3000 rpm to kW');
  check((await big()) === '31.41592654 kW', 'units: torque times speed is power');
  await ex('1 J to eV');
  check((await big()) === '6.241509074 × 10¹⁸ eV' && (await facts()).includes('electronvolt'), 'units: very large numbers and the eV name');
  await ex('(2 ft');
  check((await page.textContent('.ucv .uc-err')).includes('closing bracket'), 'units: bracket message');
  { const t = await page.textContent('.ucv .uc-tab'); check(t.includes('14.50377377') && t.includes('100,000') && t.includes('750.0616827'), 'units: pressure table from 1 bar'); }
  await page.selectOption('.ucv .uc-cat', 'temperature'); await page.waitForTimeout(100);
  await page.selectOption('.ucv .uc-from', '°C'); await page.fill('.ucv .uc-val', '-40'); await page.waitForTimeout(150);
  { const t = await page.textContent('.ucv .uc-tab'); check(t.includes('233.15') && t.includes('−40') && t.includes('419.67'), 'units: temperature table is absolute'); }
  await page.selectOption('.ucv .uc-cat', 'dvisc'); await page.waitForTimeout(100); await page.selectOption('.ucv .uc-from', 'cP'); await page.fill('.ucv .uc-val', '1'); await page.waitForTimeout(150);
  check((await page.textContent('.ucv .uc-tab')).includes('0.001'), 'units: 1 cP = 0.001 Pa·s');
  await page.fill('.ucv .uc-val', 'abc'); await page.waitForTimeout(100);
  check((await page.textContent('.ucv .uc-terr')).includes('Type a number'), 'units: bad table value');
  await page.fill('.ucv .uc-val', '2');
  await page.waitForTimeout(100);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ucv .uc-csv')]); const f = OUT + 'units.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 8 && rows[0].startsWith('unit,name,value (from 2 cP)') && rows.some((r) => r.startsWith('Pa*s,') && r.endsWith(',0.002')), 'units: CSV with raw numbers'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ucv .dl [data-f=png]')]); check((await d.suggestedFilename()) === 'units-dvisc.png', 'units: image report'); }
};
