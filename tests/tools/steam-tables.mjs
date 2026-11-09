// #661 steam tables and Rankine cycle
export const path = '/science/steam-tables/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.sts ';
  await page.goto(`${BASE}/science/steam-tables/`); await page.waitForTimeout(700);
  check((await page.textContent(R + '.st-big')) === 'Superheated steam at 500 °C and 10 MPa', 'steam: example state');
  { const t = await page.textContent(R + '.st-tab'); check(t.includes('3375.06') && t.includes('6.5993') && t.includes('0.032813'), 'steam: example properties'); }
  check((await page.textContent(R + '.st-facts')).includes('189 K of superheat'), 'steam: superheat shown');
  await page.selectOption(R + '.st-mode', 'sp'); await page.fill(R + '.st-p', '0.101325'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.st-big')).startsWith('Boils at 100 °C') || (await page.textContent(R + '.st-big')).startsWith('Boils at 99.97'), `steam: saturation at 1 atm (${await page.textContent(R + '.st-big')})`);
  check((await page.textContent(R + '.st-facts')).includes('2256'), 'steam: heat of evaporation at 1 atm');
  await page.selectOption(R + '.st-mode', 'sT'); await page.fill(R + '.st-t', '200'); await page.waitForTimeout(100);
  { const t = await page.textContent(R + '.st-big'); check(t === 'Boils at 200 °C at 1.5547 MPa', `steam: saturation at 200 °C (${t})`); }
  await page.selectOption(R + '.st-mode', 'ph'); await page.fill(R + '.st-p', '1'); await page.fill(R + '.st-h', '2500'); await page.waitForTimeout(100);
  { const t = await page.textContent(R + '.st-tab'); check(t.includes('Quality x0.86243') && (await page.textContent(R + '.st-big')).startsWith('Wet steam'), 'steam: wet steam from p and h'); }
  await page.selectOption(R + '.st-mode', 'ps'); await page.fill(R + '.st-p', '0.01'); await page.fill(R + '.st-s', '7'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.st-tab')).includes('0.84681'), 'steam: quality from p and s');
  await page.selectOption(R + '.st-mode', 'px'); await page.fill(R + '.st-x', '1.5'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.st-err')).includes('quality from 0') && await page.isHidden(R + '.st-out'), 'steam: bad quality message');
  await page.fill(R + '.st-x', '0.5'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.st-big')).startsWith('Wet steam'), 'steam: pressure and quality');
  await page.selectOption(R + '.st-mode', 'pT'); await page.fill(R + '.st-p', '25'); await page.fill(R + '.st-t', '380'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.st-big')).startsWith('Supercritical fluid') && (await page.textContent(R + '.st-facts')).includes('3 (') === false && (await page.textContent(R + '.st-facts')).includes('near-critical'), 'steam: region 3 point');
  await page.fill(R + '.st-t', '900'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.st-err')).includes('0 to 800 °C'), 'steam: out of range message');
  // Cycle.
  check((await page.textContent(R + '.st-cbig')) === 'Thermal efficiency 34.7 %', 'steam: example cycle efficiency');
  { const t = await page.textContent(R + '.st-cfacts'); check(t.includes('1143.9 kJ/kg') && t.includes('quality 0.9') && t.includes('3.147 kg/kWh') && t.includes('87.42 kg/s') && t.includes('61.25 %'), 'steam: cycle facts'); }
  check((await page.textContent(R + '.st-ctab')).includes('4 turbine exit') && await page.isVisible(R + '.st-fig'), 'steam: state table and T-s diagram');
  await page.check(R + '.st-rh'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.st-cbig')) === 'Thermal efficiency 36.98 %' && (await page.textContent(R + '.st-ctab')).includes('5 reheated'), 'steam: reheat cycle');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.st-csv')]); const f = OUT + 'rankine.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 7 && rows[0].startsWith('state,p_MPa') && rows[3].startsWith('3 turbine inlet,10,550'), 'steam: cycle CSV'); }
  await page.fill(R + '.st-prh', '20'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.st-cerr')).includes('reheat pressure'), 'steam: bad reheat pressure message');
  await page.uncheck(R + '.st-rh'); await page.fill(R + '.st-et', '100'); await page.fill(R + '.st-ep', '100'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.st-cbig')) === 'Thermal efficiency 40.95 %', 'steam: ideal cycle');
  await page.selectOption(R + '.st-pu', '0.1'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.st-pb')) === '100' && (await page.inputValue(R + '.st-pc')) === '0.1' && (await page.textContent(R + '.st-cbig')) === 'Thermal efficiency 40.95 %', 'steam: switching to bar converts the pressures');
  await page.fill(R + '.st-t3', '300'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.st-cerr')).includes('above the boiling point'), 'steam: turbine inlet below boiling message');
  await page.fill(R + '.st-t3', '550'); await page.waitForTimeout(100);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=docx]')]); check((await d.suggestedFilename()) === 'steam-rankine.docx', 'steam: Word report'); }
};
