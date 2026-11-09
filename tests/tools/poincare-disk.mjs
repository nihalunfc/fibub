// #555 Hyperbolic geometry drawer
export const path = '/science/poincare-disk/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const vp0 = page.viewportSize();
  await page.setViewportSize({ width: 1000, height: 900 });
  await page.goto(`${BASE}/science/poincare-disk/`); await page.waitForTimeout(600);
  const R = '.hd ';
  const mt = () => page.textContent(R + '.hd-mt');
  const ptRows = () => page.$$eval(R + '.hd-pts tbody tr', (t) => t.map((r) => [r.querySelector('b').textContent, ...[...r.querySelectorAll('input')].map((i) => +i.value)]));
  { const t = await mt(); check(['1.93065, 2.3842, 2.6065', '21.381°, 35.53°, 46.722°', '103.63° (less than 180°)', '1.33285', '7.38401', '3.41228', 'centre (0.085392, 0.51235), radius 0.31611', 'Meets the rim at angles'].every((s) => t.includes(s)), `hyperbolic: example triangle, circle and line measured (mpmath values) ${t}`); }
  // Type a point.
  await page.fill(R + '.hd-pts input[aria-label="A x"]', '0'); await page.press(R + '.hd-pts input[aria-label="A x"]', 'Enter');
  await page.fill(R + '.hd-pts input[aria-label="A y"]', '0'); await page.press(R + '.hd-pts input[aria-label="A y"]', 'Enter'); await page.waitForTimeout(150);
  check((await ptRows())[0].join() === 'A,0,0' && (await mt()).includes('Triangle ABC'), 'hyperbolic: typed coordinates');
  await page.fill(R + '.hd-pts input[aria-label="A x"]', '1.2'); await page.press(R + '.hd-pts input[aria-label="A x"]', 'Enter'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.hd-err')).includes('inside the unit circle'), 'hyperbolic: point outside the disk refused');
  await page.fill(R + '.hd-pts input[aria-label="A x"]', '0'); await page.press(R + '.hd-pts input[aria-label="A x"]', 'Enter'); await page.waitForTimeout(100);
  // Change the line into a segment from A (0,0) to B (0.6, 0.1).
  await page.selectOption(R + '.hd-shape[data-i="2"] .hd-k', 'segment'); await page.waitForTimeout(100); await page.selectOption(R + '.hd-shape[data-i="2"] .hd-b', 'B'); await page.waitForTimeout(150);
  { const t = await mt(); const d = 2 * Math.atanh(Math.hypot(0.6, 0.1)); check(t.includes('Segment AB') && t.includes(String(+d.toPrecision(6))) && t.includes('0.608276'), `hyperbolic: segment from the centre has length 2 artanh r = ${d}`); }
  // Circle radius.
  await page.fill(R + '.hd-shape[data-i="1"] .hd-r', '2'); await page.press(R + '.hd-shape[data-i="1"] .hd-r', 'Enter'); await page.waitForTimeout(150);
  check((await mt()).includes(String(+(2 * Math.PI * Math.sinh(2)).toPrecision(6))), 'hyperbolic: circle of radius 2 has circumference 2π sinh 2');
  await page.fill(R + '.hd-shape[data-i="1"] .hd-r', '0'); await page.press(R + '.hd-shape[data-i="1"] .hd-r', 'Enter'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.hd-err')).includes('radius above 0'), 'hyperbolic: bad radius message');
  await page.fill(R + '.hd-shape[data-i="1"] .hd-r', '1'); await page.press(R + '.hd-shape[data-i="1"] .hd-r', 'Enter'); await page.waitForTimeout(100);
  // Tap to add a point, then drag it.
  const cv = page.locator(R + '.hd-cv'); await cv.evaluate((e) => e.scrollIntoView({ block: 'center' }));
  { const b = await cv.boundingBox(), Rr = b.width / 2 - 6, cx = b.x + b.width / 2, cy = b.y + b.height / 2;
    await page.mouse.click(cx + 0.5 * Rr, cy + 0.5 * Rr); await page.waitForTimeout(150);
    const rows = await ptRows(), e = rows.find((r) => r[0] === 'E');
    check(rows.length === 5 && e && Math.abs(e[1] - 0.5) < 0.02 && Math.abs(e[2] + 0.5) < 0.02, `hyperbolic: tap adds point E (${e})`);
    await page.mouse.move(cx + 0.5 * Rr, cy + 0.5 * Rr); await page.mouse.down(); await page.mouse.move(cx + 0.2 * Rr, cy + 0.6 * Rr, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(150);
    const e2 = (await ptRows()).find((r) => r[0] === 'E');
    check(Math.abs(e2[1] - 0.2) < 0.02 && Math.abs(e2[2] + 0.6) < 0.02 && (await ptRows()).length === 5, `hyperbolic: drag moves E (${e2})`); }
  // Add a triangle shape with E.
  await page.click(R + '.hd-add'); await page.waitForTimeout(100);
  await page.selectOption(R + '.hd-shape[data-i="3"] .hd-k', 'triangle'); await page.waitForTimeout(100);
  await page.selectOption(R + '.hd-shape[data-i="3"] .hd-c', 'E'); await page.waitForTimeout(150);
  check((await mt()).includes('Triangle ABE'), 'hyperbolic: new triangle with the tapped point');
  await page.selectOption(R + '.hd-shape[data-i="3"] .hd-c', 'A'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.hd-err')).includes('not on one line'), 'hyperbolic: degenerate triangle message');
  await page.click(R + '.hd-shape[data-i="3"] .hd-sdel'); await page.waitForTimeout(100);
  await page.click(R + '.hd-pts button[aria-label="Remove point D"]'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.hd-err') && (await page.$$(R + '.hd-pts tbody tr')).length === 4, 'hyperbolic: remove a shape and a point');
  // Downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.hd-csv')]); const f = OUT + 'hyp.csv'; await d.saveAs(f); const s = readFileSync(f, 'utf8'); check(s.startsWith('point,x,y\nA,0,0\n') && s.includes('shape,measure,value') && s.includes('Area = π − angle sum'), 'hyperbolic: drawing CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.hd-svg')]); const f = OUT + 'hyp.svg'; await d.saveAs(f); const s = readFileSync(f, 'utf8'); check(s.includes('<svg') && s.includes('>A</text>') && s.includes('<polygon'), 'hyperbolic: SVG'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.hd-png')]); const f = OUT + 'hyp.png'; await d.saveAs(f); check(readFileSync(f).slice(1, 4).toString() === 'PNG', 'hyperbolic: PNG'); }
  await page.click(R + '.hd-clear'); await page.waitForTimeout(100);
  check(!(await mt()) && await page.isDisabled(R + '.hd-add'), 'hyperbolic: clear all');
  // Tiling.
  await page.click(R + '.hd-mode button[data-m="tile"]'); await page.waitForTimeout(400);
  { const f = await page.textContent(R + '.hd-facts'); const n = +(/Tiles drawn([\d,]+)/.exec(f)?.[1] ?? '0').replace(/,/g, '');
    check(f.includes('Corner angle 2π/q120°') && f.includes('Side length0.566256') && f.includes('Centre to corner0.620672') && f.includes('Centre to side0.545275') && f.includes('1.0472 = π × 0.333333') && n > 300, `hyperbolic: {7,3} tile measures and ${n} tiles (${f})`); }
  await page.selectOption(R + '.hd-p', '4'); await page.selectOption(R + '.hd-q', '5'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.hd-facts')).includes('Side length1.25374') && (await page.textContent(R + '.hd-mh')) === 'The tiling {4, 5}', 'hyperbolic: {4,5}');
  await page.selectOption(R + '.hd-q', '4'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.hd-err')).includes('tiles the flat plane'), 'hyperbolic: {4,4} is flat');
  await page.selectOption(R + '.hd-p', '3'); await page.selectOption(R + '.hd-q', '5'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.hd-err')).includes('sphere'), 'hyperbolic: {3,5} is spherical');
  await page.selectOption(R + '.hd-p', '5'); await page.selectOption(R + '.hd-q', '4'); await page.waitForTimeout(300);
  check(await page.isHidden(R + '.hd-err') && (await page.textContent(R + '.hd-facts')).includes('Corner angle 2π/q90°'), 'hyperbolic: {5,4}');
  await cv.evaluate((e) => e.scrollIntoView({ block: 'center' }));
  { const b = await cv.boundingBox(), cx = b.x + b.width / 2, cy = b.y + b.height / 2; await page.mouse.move(cx, cy); await page.mouse.down(); await page.mouse.move(cx + b.width * 0.3, cy, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(300); }
  check(await page.isVisible(R + '.hd-reset'), 'hyperbolic: dragging walks across the tiling');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.hd-csv')]); const f = OUT + 'tiles.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n').slice(1).map((r) => r.split(',').map(Number));
    const t1 = rows.filter((r) => r[0] === 1), t9 = rows.filter((r) => r[0] === 9); const side = 2 * Math.acosh(Math.cos(Math.PI / 5) / Math.sin(Math.PI / 4));
    const dd = (a, c) => Math.acosh(1 + (2 * ((a[3] - c[3]) ** 2 + (a[4] - c[4]) ** 2)) / ((1 - a[3] ** 2 - a[4] ** 2) * (1 - c[3] ** 2 - c[4] ** 2)));
    check(t1.length === 5 && [t1, t9].every((t) => t.every((r, i) => Math.abs(dd(r, t[(i + 1) % 5]) - side) < 1e-6)) && Math.hypot(t1[0][3], t1[0][4]) > 0.1, 'hyperbolic: after walking, tiles in the CSV still have the {5,4} side length'); }
  await page.click(R + '.hd-reset'); await page.waitForTimeout(200);
  check(await page.isHidden(R + '.hd-reset'), 'hyperbolic: back to the centre');
  await page.uncheck(R + '.hd-shade'); await page.waitForTimeout(200);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.hd-svg')]); const f = OUT + 'tiles.svg'; await d.saveAs(f); const s = readFileSync(f, 'utf8'); check(s.includes('<polygon') && !s.includes('#cfe0f3'), 'hyperbolic: shading off'); }
  // Phone screenshot.
  await page.setViewportSize({ width: 375, height: 800 }); await page.reload(); await page.waitForTimeout(500);
  await page.locator(R + '.hd-cv').evaluate((e) => e.scrollIntoView({ block: 'center' })); await page.screenshot({ path: OUT + 'poincare-disk-375.png' });
  check(await page.evaluate(() => document.documentElement.scrollWidth) <= 375, 'hyperbolic: fits 375 px');
  await page.setViewportSize(vp0);
};
