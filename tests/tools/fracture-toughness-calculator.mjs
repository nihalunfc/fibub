// #848 fracture toughness calculator
export const path = '/science/fracture-toughness-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.frt ', t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/science/fracture-toughness-calculator/`); await page.waitForTimeout(500);
  check((await t('.frt-big')) === 'K = 25.22 MPa√m: safety factor 2.38', 'fracture: example K with the secant correction (matches SciPy)');
  { const f = await t('.frt-facts'); check(f.includes('1.0062') && f.includes('475.8 MPa') && f.includes('22.05 mm') && f.includes('25 mm') && f.includes('thick enough for plane strain') && f.includes('0.2812 mm plane stress'), 'fracture: example facts'); }
  check((await t('.frt-pbig')) === '82,780 cycles from 5 mm to 22.05 mm' && (await t('.frt-pfacts')).includes('22.70 to 54.00 MPa√m'), 'fracture: Paris life (matches scipy quad)');
  check(await page.isVisible(R + '.frt-fig') && await page.isVisible(R + '.frt-pfig'), 'fracture: K and crack growth plots');
  // Every geometry gives the SciPy critical crack size (a0 = 5 mm, W = 100 mm, σ = 200, K_IC = 60).
  const ac = { 'centre-inf': '28.65 mm', 'centre-tada': '22.12 mm', 'edge-inf': '22.78 mm', 'edge-finite': '16.90 mm', 'double-edge': '21.41 mm', penny: '70.69 mm', custom: '12.73 mm' };
  const life = { 'centre-inf': '101,421', 'centre-tada': '83,112', 'edge-inf': '65,632', 'edge-finite': '48,792', 'double-edge': '62,937', penny: '495,577', custom: '19,269' };
  for (const g of Object.keys(ac)) {
    await page.selectOption(R + '.frt-g', g); await page.waitForTimeout(100);
    check((await t('.frt-facts')).includes(ac[g]) && (await t('.frt-pbig')).startsWith(life[g] + ' cycles'), `fracture: ${g} critical crack ${ac[g]} and life ${life[g]}`);
  }
  check(await page.isVisible(R + '.frt-ybox') && await page.isHidden(R + '.frt-wbox'), 'fracture: custom Y box shown, width hidden');
  await page.selectOption(R + '.frt-g', 'centre-secant'); await page.waitForTimeout(100);
  // Thin plate.
  await page.fill(R + '.frt-b', '10'); await page.waitForTimeout(100);
  check((await t('.frt-facts')).includes('too thin for plane strain') && (await t('.frt-facts')).includes('Thickness check'), 'fracture: thin plate warning');
  // Overload.
  await page.fill(R + '.frt-s', '500'); await page.waitForTimeout(100);
  check((await t('.frt-big')).endsWith('fracture expected') && (await t('.frt-perr')).includes('already at or past'), 'fracture: overload');
  await page.fill(R + '.frt-s', '200');
  // Typed final crack.
  await page.selectOption(R + '.frt-end', 'typed'); await page.fill(R + '.frt-af', '10'); await page.waitForTimeout(100);
  check((await t('.frt-pbig')).endsWith('from 5 mm to 10 mm') && await page.isVisible(R + '.frt-afbox'), 'fracture: typed final crack');
  await page.fill(R + '.frt-smin', '-50'); await page.waitForTimeout(100);
  check((await t('.frt-pfacts')).includes('Δσ200 MPa'), 'fracture: compressive part of the cycle left out');
  await page.fill(R + '.frt-smin', '20'); await page.waitForTimeout(100);
  { await page.locator(R + '.frt-csv').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.frt-csv')]); const f = OUT + 'crack.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'cycles,crack_size_mm' && rows[1] === '0,5' && rows[rows.length - 1].endsWith(',10'), 'fracture: crack growth CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); check((await d.suggestedFilename()) === 'fracture-toughness.png', 'fracture: image report'); }
  // Bad input.
  await page.fill(R + '.frt-af', '3'); await page.waitForTimeout(100);
  check((await t('.frt-perr')).includes('larger than the starting crack'), 'fracture: final crack too small');
  await page.fill(R + '.frt-a', '60'); await page.waitForTimeout(100);
  check((await t('.frt-err')).includes('only up to a = 49.95 mm'), 'fracture: crack beyond the formula range');
  await page.fill(R + '.frt-a', ''); await page.waitForTimeout(100);
  check((await t('.frt-err')).includes('crack size above zero') && await page.isHidden(R + '.frt-out'), 'fracture: empty crack size');
};
