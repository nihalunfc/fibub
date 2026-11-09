// #936 Polarisation calculator
export const path = '/science/polarisation-calculator/';
export default async ({ page, check, BASE }) => {
  const R = '.plc ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.pl-big'), facts = () => page.textContent(R + '.pl-facts'), tab = () => page.textContent(R + '.pl-tab'), w = () => page.waitForTimeout(200);
  check((await big()) === 'Out: linear at 30°, 50 % of the light', `pol: example output (${await big()})`);
  { const t = await tab(); check(t.includes('linear at 45°') && t.includes('right-handed circular') && (await page.$$(R + '.pl-tab tr')).length === 5, 'pol: +45° after the HWP, right circular after the QWP'); }
  { const f = await facts(); check(f.includes('0.500, 0.250, 0.433, 0.000') && f.includes('Azimuth ψ30°') && f.includes('(0.530 + 0.306i, 0.306 + 0.177i)'), `pol: Stokes and Jones vectors ${f}`); }
  check(await page.isVisible(R + '.pl-sph') && await page.isVisible(R + '.pl-fig') && (await page.$$(R + '.pl-mm tr')).length === 5, 'pol: sphere, sweep chart and Mueller matrix');
  await page.fill(R + '.pl-els', 'pol 0\npol 90'); await page.selectOption(R + '.pl-in', 'u'); await w();
  check((await big()) === 'No light gets through' && await page.isHidden(R + '.pl-dopl'), 'pol: crossed polarisers, unpolarised light');
  await page.fill(R + '.pl-els', 'pol 0\npol 45\npol 90'); await w();
  check((await big()) === 'Out: linear at 90°, 12.5 % of the light', 'pol: a 45° polariser between crossed ones');
  check((await facts()).includes('Jones vectors describe fully polarised light only'), 'pol: no Jones vector for unpolarised input');
  await page.selectOption(R + '.pl-in', 'e'); await page.fill(R + '.pl-psi', '20'); await page.fill(R + '.pl-chi', '10'); await page.fill(R + '.pl-dop', '0.6');
  await page.fill(R + '.pl-els', 'retarder 60 30\nrotator 25\npartial 0.9 0.2 10\ndepolariser 0.5'); await w();
  check((await big()).startsWith('Out: partly polarised') && (await facts()).includes('0.646, 0.197, 0.191, −0.014'), `pol: elliptical, partly polarised, all element kinds (${await facts()})`);
  check(await page.isHidden(R + '.pl-fig'), 'pol: no sweep after a depolariser');
  await page.fill(R + '.pl-dop', '1'); await page.fill(R + '.pl-els', 'retarder 60 30\nrotator 25\npartial 0.9 0.2 10'); await w();
  check((await facts()).includes('0.710, 0.437, 0.558, −0.046') && await page.isVisible(R + '.pl-fig'), 'pol: fully polarised elliptical through retarder, rotator, partial');
  for (const [v, s] of [['v', 'linear at 90°'], ['d', 'linear at 45°'], ['a', 'linear at −45°'], ['r', 'right-handed circular'], ['l', 'left-handed circular']]) {
    await page.selectOption(R + '.pl-in', v); await page.fill(R + '.pl-els', ''); await w();
    check((await big()) === `Out: ${s}, 100 % of the light`, `pol: input preset ${v}`);
  }
  await page.selectOption(R + '.pl-in', 'h'); await page.fill(R + '.pl-els', 'hwp 30'); await w();
  check((await big()) === 'Out: linear at 60°, 100 % of the light', 'pol: half-wave plate rotates by twice its angle');
  await page.fill(R + '.pl-els', 'mirror 3'); await w();
  check((await page.textContent(R + '.pl-err')).includes('is not an element') && await page.isHidden(R + '.pl-out'), 'pol: unknown element message');
  await page.fill(R + '.pl-els', 'polariser 0'); await page.fill(R + '.pl-dop', '2'); await w();
  check((await page.textContent(R + '.pl-err')).includes('degree of polarisation'), 'pol: bad degree of polarisation message');
  await page.fill(R + '.pl-dop', '1'); await page.selectOption(R + '.pl-in', 'e'); await page.fill(R + '.pl-chi', '60'); await w();
  check((await page.textContent(R + '.pl-err')).includes('ellipticity'), 'pol: bad ellipticity message');
  await page.selectOption(R + '.pl-in', 'h'); await page.fill(R + '.pl-els', 'hwp 22.5\nqwp 0\npolariser 30'); await w();
  check((await big()) === 'Out: linear at 30°, 50 % of the light', 'pol: back to the example');
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl [data-f=${fmt}]`)]); check(d.suggestedFilename().endsWith('.' + fmt), `pol: ${fmt} download`); }
};
