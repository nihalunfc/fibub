// #507 Ocean currents
export const path = '/science/ocean-currents/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.ocx';
  await page.goto(`${BASE}/science/ocean-currents/`); await page.waitForTimeout(500);
  const t = (c) => page.textContent(`${R} ${c}`);
  const set = async (c, v) => { await page.fill(`${R} ${c}`, v); await page.waitForTimeout(100); };
  check((await t('.oc-f')) === 'f = 9.37 × 10⁻⁵ s⁻¹ (northern hemisphere: water is turned to the right)', `ocean: Coriolis (${await t('.oc-f')})`);
  { const e = await t('.oc-ek');
    check(e.includes('0.159 N/m², towards 180° (S)') && e.includes('1.65 m²/s per metre of width, towards 270° (W) (90° right of the wind)'), 'ocean: stress and Ekman transport');
    check(e.includes('45.9 m') && e.includes('0.16 m/s towards 225° (SW) (45° right of the wind)') && e.includes('surface 0.158 m/s, depth 53.6 m'), 'ocean: Ekman depth, surface current, empirical'); }
  { const c = await t('.oc-coast');
    check(c.includes('Coastal upwelling8.25 × 10⁻⁵ m/s = 7.13 m/day over 20 km') && c.includes('1.65 m²/s away from the coast'), 'ocean: coastal upwelling');
    check(c.includes('Wind stress curl1.40 × 10⁻⁶ N/m³') && c.includes('Ekman pumping (upwelling)1.45 × 10⁻⁵ m/s = 1.25 m/day'), `ocean: curl and pumping (${c})`); }
  check((await t('.oc-geo')).includes('Current0.523 m/s towards 0° (N)'), 'ocean: geostrophic from sea level');
  { const r = await t('.oc-ros'); check(r.includes('2110 km') && r.includes('30.9 km (g′ = 0.0191 m/s²') && r.includes('67.9 km'), `ocean: Rossby radii (${r})`); }
  check((await t('.oc-sbig')) === 'Current at 0 m: 0.541 m/s towards 180° (S), relative to 0 m/s at 1000 m.', `ocean: thermal wind (${await t('.oc-sbig')})`);
  // Southern hemisphere: turns left
  await set('.oc-lat', '-40');
  check((await t('.oc-ek')).includes('towards 90° (E) (90° left of the wind)') && (await t('.oc-coast')).includes('Coastal downwelling') && (await t('.oc-sbig')).includes('towards 0° (N)'), 'ocean: southern hemisphere');
  await set('.oc-lat', '1');
  check((await t('.oc-err')).includes('Within 2° of the equator') && (await page.isHidden(`${R} .oc-sout`)), 'ocean: equator guard');
  await set('.oc-lat', '40');
  // Wind and drag changes
  await set('.oc-from', '90');
  { const e = await t('.oc-ek'), c = await t('.oc-coast'); check(e.includes('towards 0° (N) (90° right of the wind)') && c.includes('across the coast0 m²/s (the transport runs along the coast)') && c.includes('No coastal upwelling0 m/s'), `ocean: east wind on a west-facing coast (${c})`); }
  await set('.oc-from', '0'); await set('.oc-cd', '0.0026');
  check((await t('.oc-ek')).includes('0.317 N/m²'), 'ocean: drag coefficient doubles the stress');
  await set('.oc-cd', '0.0013'); await set('.oc-az', '0.04');
  check((await t('.oc-ek')).includes('91.8 m') && (await t('.oc-ek')).includes('0.0799 m/s'), 'ocean: eddy viscosity');
  await set('.oc-az', '0.01');
  // Section options
  await set('.oc-vref', '0.1');
  check((await t('.oc-sbig')).startsWith('Current at 0 m: 0.441 m/s towards 180° (S), relative to 0.1 m/s at 1000 m'), 'ocean: reference velocity');
  await set('.oc-vref', '0'); await set('.oc-ref', '400');
  check((await t('.oc-sbig')).includes('0.398 m/s') && (await t('.oc-sbig')).includes('at 400 m'), 'ocean: level of no motion at 400 m');
  await set('.oc-ref', '2000');
  check((await t('.oc-serr')).includes('between 0 and 1000 m'), 'ocean: reference outside the data');
  await set('.oc-ref', '');
  await page.selectOption(`${R} .oc-mode`, 'dynamic'); await set('.oc-sec', 'depth,DA,DB\n0,1.2,1.0\n500,0,0');
  check((await t('.oc-sbig')) === 'Current at 0 m: 0.427 m/s towards 180° (S), relative to 0 m/s at 500 m.', `ocean: dynamic height (${await t('.oc-sbig')})`);
  await set('.oc-sec', 'depth,a,b\n0,1,2\n-5,1,2');
  check((await t('.oc-serr')).includes('positive downwards'), 'ocean: bad section row');
  await page.click(`${R} .oc-sex`); await page.waitForTimeout(150);
  check((await page.inputValue(`${R} .oc-mode`)) === 'density' && (await t('.oc-sbig')).includes('0.541 m/s'), 'ocean: section example');
  await page.setInputFiles(`${R} .dfb-in`, { name: 's.csv', mimeType: 'text/csv', buffer: Buffer.from('depth,a,b\n0,1025,1025.5\n500,1027,1027\n') }); await page.waitForTimeout(400);
  check((await t('.oc-sbig')).startsWith('Current at 0 m:') && (await t('.oc-sbig')).includes('at 500 m'), 'ocean: open a section file');
  await page.click(`${R} .oc-sex`); await page.waitForTimeout(100);
  // Downloads
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .oc-csv`)]); const f = OUT + 'oc.csv'; await d.saveAs(f); const s = readFileSync(f, 'utf8');
    check(s.startsWith('depth_m,current_m_s\n0,-0.541091\n100,-0.418579\n') && s.trim().endsWith('1000,0'), 'ocean: profile CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} [data-f="pdf"]`)]); const f = OUT + 'oc.pdf'; await d.saveAs(f); check(d.suggestedFilename() === 'ocean-currents.pdf' && readFileSync(f).subarray(0, 5).toString() === '%PDF-', 'ocean: PDF report'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} [data-f="docx"]`)]); check(d.suggestedFilename() === 'ocean-currents.docx', 'ocean: Word report'); }
};
