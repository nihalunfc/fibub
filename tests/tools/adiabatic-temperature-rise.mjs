// #666 heat of reaction and adiabatic temperature rise
export const path = '/science/adiabatic-temperature-rise/';
export default async ({ page, check, OUT, readFileSync, writeFileSync, BASE }) => {
  await page.goto(`${BASE}/science/adiabatic-temperature-rise/`); await page.waitForTimeout(600);
  const t = (c) => page.textContent(`.adt ${c}`);
  check((await t('.at-big')) === 'Adiabatic outlet 1,937 °C, a rise of 1,912 K', `adiabatic: example (${await t('.at-big')})`);
  { const f = await t('.at-facts'); check(f.includes('−802.5 kJ/mol') && f.includes('Δcp = 8.143'), 'adiabatic: heat of reaction'); check(f.includes('−805.49 kJ/mol') && f.includes('2,521 kJ per kg of feed') && f.includes('50,031 kJ per kg of CH4') && f.includes('2,335 K') && f.includes('O2 10 %'), 'adiabatic: Kirchhoff, energy per kg, quick estimate, excess'); }
  { const rows = await page.$$eval('.adt .at-tab tr', (r) => r.map((x) => x.textContent)); check(rows.length === 6 && rows[2].includes('0.2') && rows[4].includes('CO2'), 'adiabatic: outlet table'); }
  check(await page.isVisible('.adt .at-f1') && await page.isVisible('.adt .at-f2'), 'adiabatic: two charts');
  await page.fill('.adt .at-x', '50'); await page.waitForTimeout(400);
  check((await t('.at-big')).startsWith('Adiabatic outlet 1,053 °C'), 'adiabatic: 50 % conversion');
  await page.selectOption('.adt .at-tu', 'K'); await page.fill('.adt .at-tin', '298.15'); await page.fill('.adt .at-x', '100'); await page.waitForTimeout(400);
  check((await t('.at-big')).startsWith('Adiabatic outlet 2,210 K'), 'adiabatic: kelvin');
  await page.selectOption('.adt .at-key', '1'); await page.waitForTimeout(300);
  check((await t('.at-err')).includes('Not enough of another reactant'), 'adiabatic: O2 as key at 100 % needs more CH4');
  await page.selectOption('.adt .at-key', 'auto');
  await page.fill('.adt .at-sp', 'A, -1, 1, 0, 10, 20'); await page.waitForTimeout(400);
  check((await t('.at-err')).includes('one product') && await page.isHidden('.adt .at-out'), 'adiabatic: missing product message');
  writeFileSync(OUT + 'rx.csv', 'name,nu,feed,dHf,M,a,b\nA,-1,1,-100,50,100,0\nB,1,0,-150,50,100,0\nW,0,10,0,18,75,0\n');
  await page.setInputFiles('.adt .dfb-in', OUT + 'rx.csv'); await page.waitForTimeout(600);
  check((await t('.at-big')) === 'Adiabatic outlet 357 K, a rise of 59 K', `adiabatic: open a file, constant cp (${await t('.at-big')})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.adt .at-csv')]); const f = OUT + 'ad.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 52 && r[0] === 'conversion_percent,outlet_K,outlet_C,rise_K' && r[51].startsWith('100,356.9'), 'adiabatic: sweep CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.adt .at-ocsv')]); const f = OUT + 'ado.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 4 && r[1].startsWith('A,-1,1,0,'), 'adiabatic: outlet CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.adt .dl button[data-f="pdf"]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'adiabatic: PDF report'); }
};
