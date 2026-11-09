// #553 Interactive geometry construction
export const path = '/science/geometry-construction/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.setViewportSize({ width: 1000, height: 900 });
  await page.goto(`${BASE}/science/geometry-construction/`); await page.waitForTimeout(600);
  const R = '.gc ';
  const rows = () => page.$$eval(R + '.gc-list tbody tr', (t) => Object.fromEntries(t.map((r) => [r.dataset.id, [r.cells[1].textContent, r.querySelector('input') ? `(${[...r.querySelectorAll('input')].map((i) => i.value).join(', ')})` : r.cells[2].textContent]])));
  { const r = await rows(); check(r.D[1] === '(−0.159574, −0.117021)' && r.c1[1].includes('radius 4.2772') && r.d1[1] === '4.2772' && r.d2[1] === '4.2772' && r.d3[1] === '4.2772' && r.α1[1] === '65.9245°' && r.l4[0] === 'Perpendicular bisector of AB', `construct: circumcircle example (sympy values) ${JSON.stringify(r.D)}`); }
  // Type a coordinate: distances stay equal.
  await page.fill(R + '.gc-list input[aria-label="A x"]', '-6'); await page.press(R + '.gc-list input[aria-label="A x"]', 'Enter'); await page.waitForTimeout(150);
  { const r = await rows(); check(r.d1[1] === r.d2[1] && r.d2[1] === r.d3[1] && r.d1[1] !== '4.2772', `construct: after moving A the circle still passes through A, B and C (${r.d1[1]})`); }
  // Drag C.
  const cv = page.locator(R + '.gc-cv'); await cv.evaluate((e) => e.scrollIntoView({ block: 'center' }));
  let box = await cv.boundingBox(); const S = (x, y) => [box.x + box.width / 2 + (x * box.width) / 14, box.y + box.height / 2 - (y * box.width) / 14];
  { const [x, y] = S(1, 4), [x2, y2] = S(2, 5); await page.mouse.move(x, y); await page.mouse.down(); await page.mouse.move(x2, y2, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(150);
    const r = await rows(), c = r.C[1].slice(1, -1).split(', ').map(Number); check(Math.abs(c[0] - 2) < 0.1 && Math.abs(c[1] - 5) < 0.1 && r.d1[1] === r.d3[1], `construct: drag C (${r.C[1]})`); }
  await page.click(R + '.gc-undo'); await page.waitForTimeout(100);
  check((await rows()).C[1] === '(1, 4)', 'construct: undo the drag');
  // Incircle example.
  await page.selectOption(R + '.gc-ex', 'incircle'); await page.waitForTimeout(200);
  { const r = await rows(); check(r.D[1] === '(0.0623325, −0.438)' && r.d1[1] === '2.1208' && r.P1[1].startsWith('area 23.5,') && r.E[0] === 'Crossing of l1 and l6', `construct: incircle example (${r.D[1]} ${r.d1[1]})`); }
  // Varignon.
  await page.selectOption(R + '.gc-ex', 'varignon'); await page.waitForTimeout(200);
  { const r = await rows(); check(r.P1[1].startsWith('area 63,') && r.P2[1].startsWith('area 31.5,'), 'construct: midpoint quadrilateral has half the area'); }
  // Build on a blank page with snapping.
  await page.selectOption(R + '.gc-ex', 'blank'); await page.check(R + '.gc-snap'); await page.waitForTimeout(100);
  await cv.evaluate((e) => e.scrollIntoView({ block: 'center' })); box = await cv.boundingBox();
  const tap = async (x, y) => { await cv.scrollIntoViewIfNeeded(); box = await cv.boundingBox(); const [sx, sy] = S(x, y); await page.mouse.click(sx, sy); await page.waitForTimeout(80); };
  await tap(-4, 0); await tap(4, 0); await tap(0, 3);
  { const r = await rows(); check(r.A[1] === '(-4, 0)' && r.B[1] === '(4, 0)' && r.C[1] === '(0, 3)', 'construct: point tool with snapping'); }
  await page.click(R + '.gc-tools [data-t="segment"]'); await tap(-4, 0); check((await page.textContent(R + '.gc-hint')).includes('Chosen: A'), 'construct: hint shows the chosen point'); await tap(4, 0);
  await page.click(R + '.gc-tools [data-t="circle"]'); await tap(0, 3); await tap(4, 0);
  await page.click(R + '.gc-tools [data-t="perp"]'); await tap(2, 0); await tap(0, 3);
  await page.click(R + '.gc-tools [data-t="inter"]'); await tap(1, 0); await tap(0, 1.5);
  { const r = await rows(); check(r.l1[1] === 'length 8; y = 0' && r.c1[1].startsWith('centre (0, 3), radius 5') && r.l2[1] === 'x = 0' && r.D[1] === '(0, 0)', `construct: segment, circle, perpendicular and their crossing (${JSON.stringify(r)})`); }
  await page.click(R + '.gc-tools [data-t="inter"]'); await tap(-2, 0); await tap(3, -1);
  { const r = await rows(); check(r.E && r.F && r.E[1] === '(−4, 0)' && r.F[1] === '(4, 0)', `construct: segment meets circle twice (${r.E?.[1]} ${r.F?.[1]})`); }
  await page.click(R + '.gc-tools [data-t="mid"]'); await tap(-4, 0); await tap(0, 3);
  await page.click(R + '.gc-tools [data-t="par"]'); await tap(2, 0); await tap(-2, 1.5);
  { const r = await rows(); check(r.G[1] === '(−2, 1.5)' && r.l3[0] === 'Parallel to l1 through G' && r.l3[1] === 'y = 1.5', 'construct: midpoint and parallel'); }
  await page.click(R + '.gc-tools [data-t="pbis"]'); await tap(-4, 0); await tap(0, 3);
  { const r = await rows(); check(r.l4[1] === 'y = −1.33333x − 1.16667', `construct: perpendicular bisector equation (${r.l4[1]})`); }
  await page.click(R + '.gc-tools [data-t="abis"]'); await tap(-4, 0); await tap(4, 0); await tap(0, 3);
  await page.click(R + '.gc-tools [data-t="dist"]'); await tap(-4, 0); await tap(0, 3);
  await page.click(R + '.gc-tools [data-t="angle"]'); await tap(-4, 0); await tap(0, 3); await tap(4, 0);
  await page.click(R + '.gc-tools [data-t="poly"]'); await tap(-4, 0); await tap(4, 0); await tap(0, 3); await tap(-4, 0);
  { const r = await rows(); check(r.l5[0] === 'Bisector of angle ABC' && r.d1[1] === '5' && r.α1[1] === '106.26°' && r.P1[1] === 'area 12, perimeter 18', `construct: bisector, distance 5, angle ACB 106.26°, triangle area 12 (${r.α1?.[1]})`); }
  await page.click(R + '.gc-tools [data-t="inter"]'); await tap(1, 1.5); await tap(0, 2);
  { const r = await rows(); check(r.H && r.H[1] === '(0, 1.5)', `construct: lines meet (${r.H?.[1]})`); }
  // Delete cascades; a crossing that stops existing.
  await page.click(R + '.gc-list button[aria-label="Remove A"]'); await page.waitForTimeout(100);
  { const r = await rows(); check(!r.A && !r.l1 && !r.D && !r.d1 && !r.P1 && r.B && r.c1, 'construct: removing A removes everything built on it'); }
  await page.click(R + '.gc-undo'); await page.waitForTimeout(100);
  check(!!(await rows()).A, 'construct: undo a removal');
  await page.fill(R + '.gc-list input[aria-label="C x"]', '10'); await page.press(R + '.gc-list input[aria-label="C x"]', 'Enter'); await page.waitForTimeout(100);
  { const r = await rows(); check(r.l2[1] === 'x = 10' && r.D[1] === 'does not exist now', `construct: the perpendicular from C now misses segment AB (${r.D[1]})`); }
  await page.fill(R + '.gc-list input[aria-label="C x"]', '0'); await page.press(R + '.gc-list input[aria-label="C x"]', 'Enter'); await page.waitForTimeout(100);
  check((await rows()).D[1] === '(0, 0)', 'construct: and comes back');
  // Downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.gc-csv')]); const f = OUT + 'gc.csv'; await d.saveAs(f); const s = readFileSync(f, 'utf8').trim().split('\n'); check(s[0] === 'name,what,x,y,value,description' && s.includes('A,Free point,-4,0,,"(−4, 0)"') && s.some((l) => l.startsWith('d1,Distance AC,,,5,')), 'construct: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.gc-svg')]); const f = OUT + 'gc.svg'; await d.saveAs(f); const s = readFileSync(f, 'utf8'); check(s.includes('<svg') && s.includes('>A</text>') && s.includes('<circle') && s.includes('106.3°'), 'construct: SVG'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.gc-png')]); const f = OUT + 'gc.png'; await d.saveAs(f); check(readFileSync(f).slice(1, 4).toString() === 'PNG', 'construct: PNG'); }
  await page.click(R + '.gc-zin'); await page.uncheck(R + '.gc-grid'); await page.click(R + '.gc-clear'); await page.waitForTimeout(100);
  check(!(await page.$(R + '.gc-list tbody')), 'construct: clear all');
  // Phone screenshot.
  await page.setViewportSize({ width: 375, height: 800 }); await page.reload(); await page.waitForTimeout(500);
  await page.locator(R + '.gc-tools').evaluate((e) => e.scrollIntoView({ block: 'start' })); await page.screenshot({ path: OUT + 'geometry-construction-375.png' });
  check(await page.evaluate(() => document.documentElement.scrollWidth) <= 375, 'construct: fits 375 px');
  await page.setViewportSize({ width: 1280, height: 800 });
};
