// #852 thermal mismatch stress
export const path = '/science/thermal-mismatch-stress/';
export default async ({ page, check, BASE }) => {
  const R = '.tms ', t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/science/thermal-mismatch-stress/`); await page.waitForTimeout(500);
  check((await t('.tms-fbig')) === 'Film stress 585.1 MPa (tension)', 'thermal: film stress of the example (matches numpy)');
  { const f = await t('.tms-ffacts'); check(f.includes('5600 µε') && f.includes('104.5 GPa') && f.includes('77.77 /km') && f.includes('12.86 m') && f.includes('97.21 µm') && f.includes('585.1 N/m') && f.includes('−0.26 %'), 'thermal: Stoney curvature, bow and beam check'); }
  check(await page.isVisible(R + '.tms-ffig') && await page.isHidden(R + '.tms-af1'), 'thermal: stress-temperature plot, slopes hidden');
  await page.check(R + '.tms-lin'); await page.waitForTimeout(100);
  check((await t('.tms-fbig')) === 'Film stress 650.6 MPa (tension)' && await page.isVisible(R + '.tms-af1'), 'thermal: CTE linear in T (matches scipy quad)');
  await page.uncheck(R + '.tms-lin'); await page.fill(R + '.tms-t1', '500'); await page.waitForTimeout(100);
  check((await t('.tms-fbig')).includes('(compression)') && (await t('.tms-ffacts')).includes('film side bulges'), 'thermal: heating a film puts it in compression');
  await page.fill(R + '.tms-t1', '20'); await page.fill(R + '.tms-hf', '100'); await page.waitForTimeout(100);
  check((await t('.tms-ffacts')).includes('not thin'), 'thermal: thick film warning');
  await page.fill(R + '.tms-hf', '1');
  // Stoney from bow.
  await page.click(R + '.tms-mode button[data-m=stoney]'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.tms-temps') && (await t('.tms-sbig')) === 'Film stress 300.9 MPa (tension)' && (await t('.tms-sfacts')).includes('25 m'), 'thermal: Stoney stress from bow');
  await page.fill(R + '.tms-bow0', '10'); await page.waitForTimeout(100);
  check((await t('.tms-sbig')) === 'Film stress 240.7 MPa (tension)', 'thermal: Stoney uses the change in bow');
  await page.selectOption(R + '.tms-meas', 'r'); await page.fill(R + '.tms-r1', '-25'); await page.waitForTimeout(100);
  check((await t('.tms-sbig')) === 'Film stress −300.9 MPa (compression)' && await page.isVisible(R + '.tms-r0'), 'thermal: Stoney from a radius, compressive');
  await page.fill(R + '.tms-r1', '0'); await page.waitForTimeout(100);
  check((await t('.tms-serr')).includes('not zero'), 'thermal: zero radius');
  // Strip.
  await page.click(R + '.tms-mode button[data-m=strip]'); await page.waitForTimeout(100);
  check((await t('.tms-bbig')) === 'Curvature 2.615 /m: radius 382.3 mm', 'thermal: Timoshenko bimetal curvature');
  { const f = await t('.tms-bfacts'); check(f.includes('1750 µε') && f.includes('3.265 mm') && f.includes('−64.30 MPa to 118.8 MPa') && f.includes('−99.17 MPa to 44.68 MPa') && f.includes('check0 %'), 'thermal: strip deflection and layer stresses (match numpy)'); }
  await page.selectOption(R + '.tms-wideplate', 'plate'); await page.waitForTimeout(100);
  check((await t('.tms-bbig')) !== 'Curvature 2.615 /m: radius 382.3 mm' && await page.isVisible(R + '.tms-bfig'), 'thermal: wide plate uses biaxial moduli');
  // Bar.
  await page.click(R + '.tms-mode button[data-m=bar]'); await page.fill(R + '.tms-t1', '70'); await page.waitForTimeout(100);
  check((await t('.tms-rbig')) === 'Bar stress −120 MPa (compression)' && (await t('.tms-rfacts')).includes('48 %') && (await t('.tms-rfacts')).includes('Buckling'), 'thermal: held bar');
  await page.check(R + '.tms-lin'); await page.fill(R + '.tms-t1', '120'); await page.fill(R + '.tms-bg', '0.5'); await page.waitForTimeout(100);
  check((await t('.tms-rbig')) === 'Bar stress −150 MPa (compression)' && (await t('.tms-rfacts')).includes('closes at 60.97 °C'), 'thermal: bar with a gap (matches scipy brentq)');
  await page.fill(R + '.tms-t1', '0'); await page.waitForTimeout(100);
  check((await t('.tms-rbig')) === 'Bar stress 0 MPa (no stress)', 'thermal: cooling with a gap is stress-free');
  await page.fill(R + '.tms-bg', '0'); await page.fill(R + '.tms-by', '40'); await page.waitForTimeout(100);
  check((await t('.tms-rbig')).includes('(tension)') && (await t('.tms-rfacts')).includes('the bar yields'), 'thermal: cooling a fixed bar pulls; yield warning');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); check((await d.suggestedFilename()) === 'thermal-mismatch-stress.png', 'thermal: image report'); }
  // Bad input.
  await page.fill(R + '.tms-bl', '0'); await page.waitForTimeout(100);
  check((await t('.tms-rerr')).includes('above zero') && await page.isHidden(R + '.tms-rout'), 'thermal: zero length');
  await page.fill(R + '.tms-bl', '1000'); await page.fill(R + '.tms-t0', '-400'); await page.waitForTimeout(100);
  check((await t('.tms-rerr')).includes('−273.15'), 'thermal: temperature below absolute zero');
  await page.fill(R + '.tms-t0', '20'); await page.click(R + '.tms-mode button[data-m=film]'); await page.fill(R + '.tms-nuf', '0.6'); await page.waitForTimeout(100);
  check((await t('.tms-ferr')).includes("Poisson's ratios"), 'thermal: bad Poisson ratio');
};
