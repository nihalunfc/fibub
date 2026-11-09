// #208 CTD cast viewer
export const path = '/science/ctd-cast-viewer/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/ctd-cast-viewer/`);
  await page.waitForFunction(() => Number(document.querySelector('.ctd')?.dataset.runs) >= 1, null, { timeout: 10000 });
  const txt = async (c) => (await page.textContent(c)).replace(/\s+/g, ' ').trim();
  const row = (n) => page.evaluate((n) => [...document.querySelectorAll(`.ctd .ctd-tab tbody tr:nth-child(${n}) td`)].map((td) => td.textContent).join(' | '), n);
  const nrows = () => page.evaluate(() => document.querySelectorAll('.ctd .ctd-tab tbody tr').length);
  const redraw = async (fn) => { const r = await page.getAttribute('.ctd', 'data-runs'); await fn(); await page.waitForFunction((r) => document.querySelector('.ctd').dataset.runs !== r, r, { timeout: 8000 }); };
  const type = (sel, v) => redraw(() => page.fill(sel, v));
  const pick = (sel, v) => redraw(() => page.selectOption(sel, v));

  // The example downcast.
  check((await txt('.ctd .ctd-big')) === 'Mixed layer 20.2 m (temperature), thermocline at 40.0 m', 'ctd: example mixed layer and thermocline');
  const facts = await txt('.ctd .ctd-facts');
  check(facts.includes('1,493 scans to 248.1 m') && facts.includes('downcast 997, upcast 497') && facts.includes('248 bins of 1 m'), 'ctd: scans, split and bins');
  check(facts.includes('Mixed layer (density)16.3 m') && facts.includes('away from 17.869 °C at 10 m'), 'ctd: both mixed layers');
  check(facts.includes('N² 9.35 × 10⁻⁴ s⁻²') && facts.includes('at 39.0 m') && facts.includes('17.5 cycles per hour') && facts.includes('3.42 min') && facts.includes('0.394 °C per m'), 'ctd: N² peak and thermocline gradient');
  check((await txt('.ctd .ctd-note')).startsWith('Columns used: pressure_dbar (pressure, turned into depth), temperature_C, salinity, oxygen_umol_kg, fluorescence.'), 'ctd: columns found by name');
  check(await page.evaluate(() => document.querySelectorAll('.ctd .ctd-profs canvas').length) === 6 && await page.isVisible('.ctd .ctd-ts'), 'ctd: six profiles and the T-S diagram');
  check((await row(1)).startsWith('1 | 3 | 17.983 | 34.601 | 25.032 |') && (await row(1)).endsWith('| 249.95 | 0.290') && await nrows() === 248, 'ctd: binned table');
  { const px = await page.evaluate(() => { const c = document.querySelector('.ctd .ctd-ts'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let k = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 120 && d[i + 2] > 120) k++; return k; }); check(px > 200, `ctd: T-S points drawn in blue (${px} px)`); }

  // Options.
  await pick('.ctd .ctd-by', 'rho');
  check((await txt('.ctd .ctd-big')) === 'Mixed layer 16.3 m (density), thermocline at 40.0 m', 'ctd: mixed layer from density');
  await pick('.ctd .ctd-by', 'T');
  await pick('.ctd .ctd-half', 'up');
  check((await txt('.ctd .ctd-big')) === 'Mixed layer 20.9 m (temperature), thermocline at 41.0 m' && (await txt('.ctd .ctd-facts')).includes('using the upcast, 247 bins'), 'ctd: upcast');
  await redraw(() => page.check('.ctd .ctd-other'));
  check((await page.getAttribute('.ctd .ctd-profs canvas', 'aria-label')) === 'Temperature against depth' && (await txt('.ctd .ctd-big')).includes('20.9 m'), 'ctd: other half drawn too');
  await redraw(() => page.uncheck('.ctd .ctd-other'));
  await pick('.ctd .ctd-half', 'all');
  check((await txt('.ctd .ctd-facts')).includes('using all scans, 248 bins'), 'ctd: all scans');
  await pick('.ctd .ctd-half', 'down');
  await type('.ctd .ctd-bin', '2');
  check(await nrows() === 125 && (await txt('.ctd .ctd-facts')).includes('125 bins of 2 m') && (await txt('.ctd .ctd-facts')).includes('(over 4 m)'), 'ctd: 2 m bins');
  await type('.ctd .ctd-bin', '1');
  await type('.ctd .ctd-ref', '20');
  check((await txt('.ctd .ctd-facts')).includes('at 20 m') && !(await txt('.ctd .ctd-big')).includes('20.2 m'), 'ctd: deeper reference depth');
  await type('.ctd .ctd-ref', '10');
  await type('.ctd .ctd-dt', '0.5');
  check((await txt('.ctd .ctd-big')).startsWith('Mixed layer 2') && !(await txt('.ctd .ctd-big')).includes('20.2 m'), 'ctd: larger temperature step');
  await type('.ctd .ctd-dt', '0.2');
  await type('.ctd .ctd-a', '0.0003');
  check(!(await txt('.ctd .ctd-facts')).includes('N² 9.35') && (await txt('.ctd .ctd-big')).includes('20.2 m'), 'ctd: α changes density and N², not the temperature mixed layer');
  await type('.ctd .ctd-a', '0');
  check((await txt('.ctd .ctd-serr')).startsWith('α should be above 0') && await page.isHidden('.ctd .ctd-out'), 'ctd: bad α message');
  await type('.ctd .ctd-a', '0.0002');
  check((await txt('.ctd .ctd-big')) === 'Mixed layer 20.2 m (temperature), thermocline at 40.0 m', 'ctd: back to the example');

  // Downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ctd .ctd-csv')]); const f = OUT + 'ctd.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 249 && r[0] === 'depth_m,scans,temperature_C,salinity,density_linear_kg_m3,sigma_kg_m3,N2_per_s2,oxygen,fluorescence' && r[1].startsWith('1,3,17.98260,34.60063,1025.03225,25.03225,') && d.suggestedFilename() === 'example-cast-binned.csv', 'ctd: binned CSV'); }
  { await page.locator('.ctd .dl button[data-f=png]').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download', { timeout: 20000 }), page.click('.ctd .dl button[data-f=png]')]); check(d.suggestedFilename() === 'example-cast-ctd.png', 'ctd: PNG report'); }

  // A file without oxygen or fluorescence, by depth, opened with the file button.
  const lines = ['Depth (m),Temp,Sal'];
  for (let z = 0; z <= 60; z += 0.5) lines.push(`${z},${z < 25 ? 15 : 15 - (z - 25) * 0.2},${(35 + z * 0.001).toFixed(3)}`);
  writeFileSync(OUT + 'my cast.csv', lines.join('\n'));
  await redraw(() => page.setInputFiles('.ctd .dfb-in', OUT + 'my cast.csv'));
  await page.waitForTimeout(400);
  check((await txt('.ctd .ctd-big')).startsWith('Mixed layer 26.') && await page.evaluate(() => document.querySelectorAll('.ctd .ctd-profs canvas').length) === 4 && (await txt('.ctd .ctd-note')).includes('Depth (m) (depth)'), 'ctd: opened depth file, no oxygen or fluorescence');
  check((await txt('.ctd .ctd-facts')).includes('upcast none'), 'ctd: a cast with no upcast');
  await pick('.ctd .ctd-half', 'up');
  check((await txt('.ctd .ctd-err')).startsWith('This cast has no upcast') && await page.isHidden('.ctd .ctd-out'), 'ctd: no upcast message');
  await pick('.ctd .ctd-half', 'down');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ctd .ctd-csv')]); check(d.suggestedFilename() === 'my-cast-binned.csv', 'ctd: CSV named after the opened file'); }

  // Pasting without a header, and bad input.
  await page.selectOption('.ctd .ctd-zis', 'depth');
  await type('.ctd .ctd-in', '0 20 35\n5 20 35\n10 20 35\n15 19.9 35\n20 19.5 35\n25 18 35\n30 15 35');
  check(/^Mixed layer 16\.[23] m/.test(await txt('.ctd .ctd-big')) && (await txt('.ctd .ctd-note')).startsWith('Columns used: depth (depth), temperature, salinity.'), 'ctd: pasted without a header (hand example: 16.25 m)');
  await type('.ctd .ctd-in', 'depth,temperature,oxygen\n1,10,200\n2,9,200\n3,8,200');
  check((await txt('.ctd .ctd-err')).startsWith('No salinity column found') && await page.isHidden('.ctd .ctd-out'), 'ctd: missing salinity message');
  await type('.ctd .ctd-in', '');
  check((await txt('.ctd .ctd-err')).startsWith('Paste a cast'), 'ctd: empty box message');
  await page.selectOption('.ctd .ctd-zis', 'pressure');
  await redraw(() => page.click('.ctd .ctd-ex'));
  check((await txt('.ctd .ctd-big')) === 'Mixed layer 20.2 m (temperature), thermocline at 40.0 m' && await page.isHidden('.ctd .ctd-err'), 'ctd: example again');
};
