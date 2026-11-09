// #933 Diffraction pattern generator
export const path = '/science/diffraction-patterns/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.dfp ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.df-big'), facts = () => page.textContent(R + '.df-facts');
  check((await big()) === 'Double slit: fringes every 2.66 mm at 1 m', `diff: example double slit (${await big()})`);
  { const f = await facts(); check(f.includes('0.0271') && f.includes('far field: Fraunhofer applies') && f.includes('13.3 mm from centre') && f.includes('central band 26.6 mm wide') && f.includes('Bright fringes in the central band9') && f.includes('order 5 falls') && f.includes('0.01203'), `diff: example facts ${f}`); }
  check(await page.isVisible(R + '.df-img') && await page.isVisible(R + '.df-fig') && await page.isHidden(R + '.df-ci') && await page.isHidden(R + '.df-gr'), 'diff: picture, profile and the right inputs');
  await page.selectOption(R + '.df-k', 'slit'); await page.waitForTimeout(300);
  check((await big()) === 'Single slit: central band 26.6 mm wide at 1 m' && await page.isHidden(R + '.df-multi'), 'diff: single slit');
  await page.selectOption(R + '.df-k', 'grating'); await page.fill(R + '.df-a', '0.5'); await page.fill(R + '.df-d', '1.6'); await page.fill(R + '.df-z', '0.3'); await page.fill(R + '.df-w', '150'); await page.waitForTimeout(400);
  check((await big()) === '10-slit grating: 1st order at 19.4°, 106 mm from centre' && (await facts()).includes('625 lines per mm') && (await facts()).includes('resolves 53.2 nm'), `diff: grating orders and resolving power (${await big()})`);
  await page.selectOption(R + '.df-k', 'circle'); await page.fill(R + '.df-z', '1'); await page.fill(R + '.df-w', '20'); await page.waitForTimeout(800);
  check((await big()) === 'Circular hole: Airy disc radius 3.24 mm at 1 m' && await page.isVisible(R + '.df-ci'), `diff: Airy disc (${await big()})`);
  await page.fill(R + '.df-D', '2'); await page.waitForTimeout(1200);
  check((await facts()).includes('1.88') && (await facts()).includes('0.1411 × incident') && (await facts()).includes('near field'), 'diff: 2 mm hole near field, dark-ish centre');
  await page.selectOption(R + '.df-r', 'far'); await page.waitForTimeout(400);
  check((await facts()).includes('far-field peak'), 'diff: far field only');
  await page.selectOption(R + '.df-g', 'log'); await page.waitForTimeout(400);
  check(await page.isVisible(R + '.df-img'), 'diff: logarithmic picture');
  await page.selectOption(R + '.df-r', 'near'); await page.fill(R + '.df-D', '50'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.df-err')).includes('too many zones'), 'diff: huge Fresnel number message');
  await page.fill(R + '.df-D', '0.2'); await page.selectOption(R + '.df-k', 'double'); await page.fill(R + '.df-a', '40'); await page.fill(R + '.df-d', '30'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.df-err')).includes('overlap'), 'diff: overlapping slits message');
  await page.fill(R + '.df-d', '200'); await page.fill(R + '.df-l', '50'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.df-err')).includes('wavelength') && await page.isHidden(R + '.df-out'), 'diff: bad wavelength message');
  await page.fill(R + '.df-l', '532'); await page.selectOption(R + '.df-r', 'both'); await page.selectOption(R + '.df-g', 'lin'); await page.waitForTimeout(500);
  check((await big()) === 'Double slit: fringes every 2.66 mm at 1 m', 'diff: back to the example');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.df-csv')]); const f = OUT + 'diff.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 1202 && rows[0] === 'x_mm,I_far_field,I_fresnel' && rows[601].startsWith('0,0.01203'), `diff: profile CSV (${rows[601]})`); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl [data-f=${fmt}]`)]); check(d.suggestedFilename().endsWith('.' + fmt), `diff: ${fmt} download`); }
};
