// #965 Hall effect and van der Pauw analyser
export const path = '/science/hall-effect/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.hle ';
  const big = () => page.textContent(R + '.hl-big'), facts = () => page.textContent(R + '.hl-facts'), err = () => page.textContent(R + '.hl-err');
  const set = async (c, v) => { await page.fill(R + c, v); await page.waitForTimeout(300); };
  const opt = async (c, v) => { await page.selectOption(R + c, v); await page.waitForTimeout(300); };
  await page.goto(`${BASE}/science/hall-effect/`); await page.waitForTimeout(800);
  check((await big()) === 'n-type: 1.56 × 10¹⁴ cm⁻², μ = 82.5 cm²/(V·s)', 'hall: example result');
  { const f = await facts(); check(f.includes('484.94 Ω/□') && f.includes('f = 0.9953') && f.includes('3.12 × 10¹⁸ cm⁻³') && f.includes('0.02425 Ω·cm') && f.includes('0.33 % spread') && f.includes('offset (V₊ + V₋)/2 = −0.1 mV'), 'hall: sheet resistance, density, resistivity, reciprocity'); }
  check(await page.isVisible(R + '.hl-fig') && await page.isVisible(R + '.hl-ffig'), 'hall: figures');
  await set('.hl-vp', '2.10'); await set('.hl-vm', '-1.90'); check((await big()).startsWith('p-type: 1.56 × 10¹⁴'), 'hall: positive Hall voltage is p-type');
  await set('.hl-rh', '1.18'); check((await big()) === 'p-type: 1.84 × 10¹⁴ cm⁻², μ = 69.9 cm²/(V·s)', 'hall: Hall factor');
  await set('.hl-rh', '1'); await opt('.hl-iu', '1e-6'); check((await big()).startsWith('p-type: 1.56 × 10¹¹'), 'hall: current in µA');
  await opt('.hl-iu', '1e-3'); await set('.hl-t', ''); { const f = await facts(); check(!f.includes('cm⁻³') && f.includes('cm⁻²'), 'hall: sheet values only without thickness'); }
  await set('.hl-t', '0.5'); await opt('.hl-tu', '1e-6'); check((await facts()).includes('3.12 × 10¹⁸ cm⁻³'), 'hall: thickness in µm');
  await set('.hl-ra', '120, 140'); check((await facts()).includes('above 5 %'), 'hall: reciprocity warning');
  await set('.hl-ra', '1000'); await set('.hl-rb', '50'); check((await facts()).includes('large ratio'), 'hall: large ratio warning');
  await set('.hl-ra', '120.4, 119.6'); await set('.hl-rb', '95.2, 94.8');
  await opt('.hl-mode', 'sweep'); check(await page.isVisible(R + '.hl-data') && await page.isHidden(R + '.hl-b'), 'hall: sweep inputs shown');
  { const f = await facts(); check((await big()) === 'n-type: 1.56 × 10¹⁴ cm⁻², μ = 82.6 cm²/(V·s)' && f.includes('−4.008 ± 0.0083 mV/T') && f.includes('R² = 0.99999'), `hall: field sweep fit (${await big()})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.hl-csv')]); const f = OUT + 'hall.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('quantity,value,unit') && t.includes('carrier type,n,') && t.includes('Hall voltage,-4.008,mV/T'), 'hall: results CSV'); }
  writeFileSync(OUT + 'sweep.csv', 'B,V\n-1,-2\n0,0\n1,2\n2,4\n');
  await page.setInputFiles(R + '.dfb-in', OUT + 'sweep.csv'); await page.waitForTimeout(600);
  check((await big()).startsWith('p-type'), 'hall: open a field sweep file');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); const f = OUT + 'hall.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'hall: PDF report'); }
  await set('.hl-data', '1 2\n1 3\n1 4'); check((await err()).includes('two different values'), 'hall: one field value message');
  await set('.hl-data', '1 2'); check((await err()).includes('at least 3 rows'), 'hall: too few rows message');
  await opt('.hl-mode', 'pm'); await set('.hl-vp', '1'); await set('.hl-vm', '1'); check((await err()).includes('no Hall signal'), 'hall: no Hall signal message');
  await set('.hl-vp', '-2.10'); await set('.hl-vm', '1.90'); await set('.hl-b', '0'); check((await err()).includes('tesla'), 'hall: bad field message');
  await set('.hl-b', '0.5'); await set('.hl-ra', 'abc'); check((await err()).includes('R_A and R_B') && await page.isHidden(R + '.hl-out'), 'hall: bad resistance message');
  await set('.hl-ra', '120'); await set('.hl-i', '0'); check((await err()).includes('current'), 'hall: bad current message');
  await set('.hl-i', '1'); check(!(await page.isHidden(R + '.hl-out')), 'hall: back to a result');
};
