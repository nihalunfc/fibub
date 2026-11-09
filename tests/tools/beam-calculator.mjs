// #641 beam deflection calculator
export const path = '/science/beam-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/beam-calculator/`); await page.waitForTimeout(500);
  const R = '.bmc', big = () => page.textContent(`${R} .bm-big`), facts = () => page.textContent(`${R} .bm-facts`);
  check((await big()) === 'Largest deflection 8.09 mm down at 2.925 m', `beam: example deflection (${await big()})`);
  { const f = await facts(); check(f.includes('21.67 kN up') && f.includes('18.33 kN up') && f.includes('33.61 kN·m') && f.includes('sagging at 2.333 m') && f.includes('66.42 MPa') && f.includes('span / 742') && f.includes('10.3 MPa'), 'beam: example reactions, moment, stress, ratio'); }
  check(await page.isVisible(`${R} .bm-sk`) && await page.isVisible(`${R} .bm-mf`) && await page.isVisible(`${R} .bm-df`) && await page.isVisible(`${R} .bm-vf`), 'beam: sketch and three diagrams');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .bm-csv`)]); const f = OUT + 'beam.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'x_m,shear_kN,moment_kNm,deflection_mm,slope_rad' && rows.length > 240 && rows[1].startsWith('0,21.66'), 'beam: diagram CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .dl button[data-f=pdf]`)]); check((await d.suggestedFilename()) === 'beam.pdf', 'beam: PDF report'); }
  // Cantilever with only a 10 kN tip load: PL³/3EI.
  await page.click(`${R} .bm-row:first-child .bm-del`);
  await page.selectOption(`${R} .bm-sup`, 'cant'); await page.fill(`${R} .bm-row .bm-lx`, '6'); await page.waitForTimeout(150);
  { const EI = 200 * 75905333.3333 * 1e-6, d = 10 * 216 / 3 / EI * 1000; check((await big()) === `Largest deflection ${+d.toPrecision(3)} mm down at 6 m` && (await facts()).includes('moment of 60 kN·m anticlockwise'), `beam: cantilever tip load (${await big()})`); }
  await page.selectOption(`${R} .bm-sup`, 'ff'); await page.fill(`${R} .bm-row .bm-lx`, '3'); await page.waitForTimeout(150);
  { const EI = 200 * 75905333.3333 * 1e-6, d = 10 * 216 / 192 / EI * 1000; check((await big()) === `Largest deflection ${+d.toPrecision(3)} mm down at 3 m` && (await facts()).includes('7.5 kN·m'), `beam: fixed-fixed central load PL³/192EI, PL/8 (${await big()})`); }
  await page.selectOption(`${R} .bm-sup`, 'prop'); await page.waitForTimeout(100);
  check((await facts()).includes('3.125 kN up'), 'beam: propped cantilever central load, prop 5P/16');
  await page.selectOption(`${R} .bm-sup`, 'cont'); await page.fill(`${R} .bm-b`, '3'); await page.waitForTimeout(100);
  check((await facts()).includes('Reaction at 3 m') && (await facts()).includes('10 kN up'), 'beam: continuous, load on the middle support');
  await page.selectOption(`${R} .bm-sup`, 'ovh'); await page.fill(`${R} .bm-a`, '0'); await page.fill(`${R} .bm-b`, '4'); await page.fill(`${R} .bm-row .bm-lx`, '6'); await page.waitForTimeout(100);
  check((await facts()).includes('5 kN down') && (await facts()).includes('15 kN up'), 'beam: overhang with tip load, uplift at the first support');
  // Moment and sloping load.
  await page.click(`${R} .bm-add`); await page.selectOption(`${R} .bm-row:nth-child(2) .bm-lt`, 'moment'); await page.fill(`${R} .bm-row:nth-child(2) .bm-lv`, '8'); await page.waitForTimeout(100);
  check(!(await page.isVisible(`${R} .bm-row:nth-child(2) .bm-lx2`)) && (await page.textContent(`${R} .bm-row:nth-child(2) .bm-vl`)) === 'Moment (kN·m)', 'beam: moment row');
  await page.selectOption(`${R} .bm-sup`, 'ss'); await page.selectOption(`${R} .bm-row:nth-child(2) .bm-lt`, 'dist'); await page.fill(`${R} .bm-row:nth-child(2) .bm-lx`, '0'); await page.fill(`${R} .bm-row:nth-child(2) .bm-lx2`, '6'); await page.fill(`${R} .bm-row:nth-child(2) .bm-lv`, '0'); await page.fill(`${R} .bm-row:nth-child(2) .bm-lv2`, '9'); await page.fill(`${R} .bm-row:first-child .bm-lv`, '0'); await page.waitForTimeout(100);
  check((await facts()).includes('9 kN up') && (await facts()).includes('18 kN up') && (await facts()).includes('20.78 kN·m'), 'beam: triangular load, wL²/(9√3)');
  // Sections.
  await page.selectOption(`${R} .bm-shape`, 'rect'); await page.waitForTimeout(100);
  check((await facts()).includes('I = 6.667 × 10⁷ mm⁴'), 'beam: rectangle section I = bh³/12');
  await page.selectOption(`${R} .bm-shape`, 'circle'); await page.fill(`${R} .bm-di`, '40'); await page.waitForTimeout(100);
  check(await page.isVisible(`${R} .bm-d`) && !(await page.isVisible(`${R} .bm-rb`)), 'beam: tube fields');
  await page.selectOption(`${R} .bm-shape`, 'custom'); await page.waitForTimeout(100);
  check((await facts()).includes('I = 8 × 10⁷ mm⁴Z = I / c = 533333 mm³'), 'beam: own I and c');
  await page.selectOption(`${R} .bm-Epick`, '70'); await page.waitForTimeout(100);
  check((await page.inputValue(`${R} .bm-E`)) === '70', 'beam: typical E fills in');
  await page.fill(`${R} .bm-fy`, '1'); await page.waitForTimeout(100);
  check(await page.isVisible(`${R} .bm-warn`), 'beam: above yield warning');
  // Bad input.
  await page.fill(`${R} .bm-row:nth-child(2) .bm-lx2`, '9'); await page.waitForTimeout(100);
  check((await page.textContent(`${R} .bm-err`)).includes('Load 2: the "to" position') && await page.isHidden(`${R} .bm-out`), 'beam: load past the end');
  await page.fill(`${R} .bm-L`, 'abc'); await page.waitForTimeout(100);
  check((await page.textContent(`${R} .bm-err`)).includes('beam length'), 'beam: bad length');
};
