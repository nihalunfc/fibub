// #920 heat conduction solver
export const path = '/science/heat-conduction/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/heat-conduction/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.hcd .hc-big'), facts = () => page.textContent('.hcd .hc-facts'), wait = (ms = 450) => page.waitForTimeout(ms);
  check((await big()) === 'U = 0.3493 W/m²·K: 87.33 W through 10 m²', 'conduction: example wall U-value and heat loss');
  { const t = await page.textContent('.hcd .hc-tab'); check(t.includes('Mineral wool') && t.includes('87.3 %') && t.includes('−3.403') && t.includes('18.43'), 'conduction: wall layer table'); }
  check((await facts()).includes('2.863 m²·K/W') && await page.isVisible('.hcd .hc-f1') && await page.isHidden('.hcd .hc-f2'), 'conduction: wall resistance and chart');
  await page.selectOption('.hcd .hc-wm', 'eps'); await page.fill('.hcd .hc-wt', '50'); await page.click('.hcd .hc-add'); await wait(150);
  check((await page.inputValue('.hcd .hc-layers')).endsWith('Polystyrene foam, 50, 0.035') && (await big()).startsWith('U = 0.2'), 'conduction: add a layer');
  await page.fill('.hcd .hc-hi', ''); await wait(150);
  check((await facts()).includes('Inside surface20 °C'), 'conduction: empty film fixes the surface temperature');
  await page.fill('.hcd .hc-layers', 'Brick, abc, 0.7'); await wait(150);
  check((await page.textContent('.hcd .hc-err')).includes('Layer 1') && await page.isHidden('.hcd .hc-out'), 'conduction: bad layer message');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.hcd .hc-seg [data-m=slab]').then(() => page.waitForTimeout(600)).then(() => page.click('.hcd .hc-csv'))]); const f = OUT + 'slab.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 102 && rows[0].startsWith('x_mm,T_at_6_min') && d.suggestedFilename() === 'heat-conduction-slab.csv', 'conduction: slab profiles CSV'); }
  check((await big()) === 'After 120 min: middle 69.30 °C, faces 55.89 °C and 55.89 °C', 'conduction: example slab');
  { const f = await facts(); check(f.includes('Exact series, middle69.30 °C') && f.includes('Biot number0.714') && f.includes('0.498'), 'conduction: slab exact series, Biot and Fourier numbers'); }
  check(await page.isVisible('.hcd .hc-f1') && await page.isVisible('.hcd .hc-f2'), 'conduction: slab charts');
  await page.selectOption('.hcd .hc-lt', 'insulated'); await wait();
  check((await facts()).includes('Exact series, insulated face'), 'conduction: insulated left face, series at the insulated face');
  await page.selectOption('.hcd .hc-lt', 'fixed'); await page.fill('.hcd .hc-lT', '100'); await wait();
  check((await big()).includes('faces 100 °C'), 'conduction: fixed left face');
  await page.selectOption('.hcd .hc-rt', 'insulated'); await page.selectOption('.hcd .hc-lt', 'insulated'); await wait();
  check((await page.textContent('.hcd .hc-err')).includes('both faces insulated'), 'conduction: both faces insulated message');
  await page.selectOption('.hcd .hc-lt', 'conv'); await page.selectOption('.hcd .hc-rt', 'conv'); await page.selectOption('.hcd .hc-sm', 'steel'); await wait();
  check((await page.inputValue('.hcd .hc-sk')) === '50' && (await page.inputValue('.hcd .hc-srho')) === '7850', 'conduction: material fills properties');
  await page.fill('.hcd .hc-sk', '45'); await wait(250);
  check((await page.inputValue('.hcd .hc-sm')) === 'custom', 'conduction: typed property switches to Other');
  await page.click('.hcd .hc-seg [data-m=plate]'); await wait(800);
  check((await big()) === 'After 0.5 min: centre 30.75 °C' && (await facts()).includes('= 24 s'), 'conduction: example plate after 30 s');
  await page.check('.hcd .hc-pss'); await wait(1200);
  check((await big()) === 'Steady state: centre 40 °C' && (await facts()).includes('Exact series, centre40 °C'), 'conduction: plate steady state against the series');
  await page.fill('.hcd .hc-pl', '60'); await wait(1200);
  check(!(await facts()).includes('Exact series') && (await big()).startsWith('Steady state'), 'conduction: two hot edges, no series');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.hcd .hc-csv')]); const f = OUT + 'plate.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 42 && rows[1].split(',').length === 42, 'conduction: plate grid CSV'); }
  await page.click('.hcd .hc-seg [data-m=fin]'); await wait();
  check((await big()) === '1.485 W per fin, efficiency 92.3 %' && (await facts()).includes('90.75 °C') && (await facts()).includes('37.82'), 'conduction: example pin fin');
  await page.selectOption('.hcd .hc-ftip', 'adiabatic'); await wait(150);
  check((await big()).startsWith('1.454 W'), 'conduction: insulated tip');
  await page.selectOption('.hcd .hc-fs', 'rect'); await page.selectOption('.hcd .hc-fm', 'steel'); await page.fill('.hcd .hc-fL', '30'); await page.fill('.hcd .hc-fh', '40'); await page.fill('.hcd .hc-fb', '100'); await page.fill('.hcd .hc-fa', '20'); await page.selectOption('.hcd .hc-ftip', 'conv'); await wait(150);
  check((await big()).startsWith('16.20 W') && await page.isVisible('.hcd .hc-ft') && await page.isHidden('.hcd .hc-fD'), 'conduction: flat steel fin');
  await page.fill('.hcd .hc-fa', '100'); await wait(150);
  check((await page.textContent('.hcd .hc-err')).includes('same temperature'), 'conduction: no temperature difference message');
  await page.click('.hcd .hc-seg [data-m=pipe]'); await wait();
  check((await big()) === '35.99 W per metre, 0.8998 kW over 25 m', 'conduction: example pipe');
  { const f = await facts(); check(f.includes('28.18 °C') && f.includes('239 W/m') && f.includes('84.9 %') && f.includes('4 mm') && f.includes('17.5 mm'), 'conduction: pipe surface, saving, critical radius, thickness'); }
  check((await page.textContent('.hcd .hc-tab')).includes('Insulation'), 'conduction: pipe resistance table');
  await page.fill('.hcd .hc-qdo', '4'); await page.fill('.hcd .hc-qdi', '2'); await page.fill('.hcd .hc-qs', '1'); await wait(150);
  check((await facts()).includes('thin insulation increases the heat loss'), 'conduction: critical radius warning on a thin wire');
  for (const fm of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.hcd .dl button[data-f=${fm}]`)]); check(d.suggestedFilename() === `heat-conduction-pipe.${fm}`, `conduction: ${fm} download`); }
  await page.fill('.hcd .hc-qdo', '1'); await wait(150);
  check((await page.textContent('.hcd .hc-err')).includes('outside diameter must be larger'), 'conduction: bad pipe diameters message');
};
