// #541 Graphing calculator
export const path = '/science/function-grapher/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.setViewportSize({ width: 1100, height: 900 });
  await page.goto(`${BASE}/science/function-grapher/`); await page.waitForTimeout(800);
  const R = '.fg ';
  const txt = (s) => page.textContent(R + s);
  const kinds = async () => (await page.$$eval(R + '.fg-kind', (e) => e.map((x) => x.textContent)));
  const win = async () => page.$$eval(R + '.fg-w', (e) => e.map((x) => x.value));
  // The example: cubic and circle, with key points matching numpy.
  { const k = await txt('.fg-kt'); check(['−1', '−0.618034', '1.61803', '−0.816497', '0.0886621', '−2.08866', '−1.84025', '−3.55155', '2.0428', '3.43904', 'Crossing', 'Local maximum', 'Crosses the y axis'].every((s) => k.includes(s)), 'grapher: example key points (roots, turning points, circle crossings)'); }
  check((await kinds()).join('|') === 'y = f(x)|Equation in x and y', 'grapher: curve kinds read from what was typed');
  check((await win()).join() === '-6,6,-4.5,4.5', 'grapher: example window');
  // Value at x.
  await page.fill(R + '.fg-at', '2'); await page.waitForTimeout(150);
  { const t = await txt('.fg-att'); check(t.includes('y = 3') && t.includes('y = −3.4641, 3.4641'), `grapher: value at x = 2 on both curves (${t})`); }
  // Tap to trace the cubic at x = 1.5 (y = -0.625).
  const cv = page.locator(R + '.fg-cv'); await cv.scrollIntoViewIfNeeded();
  { const b = await cv.boundingBox(); await page.mouse.click(b.x + ((1.5 + 6) / 12) * b.width, b.y + b.height - ((-0.625 + 4.5) / 9) * b.height); await page.waitForTimeout(200);
    const t = await txt('.fg-trace'); const m = /x = (\S+), y = (\S+)/.exec(t.replace(/−/g, '-')); const x = +m?.[1], y = +m?.[2];
    check(t.startsWith('Curve 1 (y = x^3 - 2x - 1)') && Math.abs(x - 1.5) < 0.05 && Math.abs(y - (x ** 3 - 2 * x - 1)) < 1e-4, `grapher: tap traces the cubic (${t})`); }
  { await cv.evaluate((e) => e.scrollIntoView({ block: 'center' })); const b = await cv.boundingBox(); await page.mouse.click(b.x + 5, b.y + b.height * 0.25); await page.waitForTimeout(150); { const t = await txt('.fg-trace'); check(t.includes('No curve near there'), `grapher: tap away from curves (${t})`); } }
  // Zoom, reset, typed window, drag.
  await page.click(R + '.fg-zin'); await page.waitForTimeout(250);
  check((await win()).join() === '-4,4,-3,3', 'grapher: zoom in by 1.5 about the centre');
  await page.click(R + '.fg-zout'); await page.click(R + '.fg-zout'); await page.waitForTimeout(250);
  check((await win()).join() === '-9,9,-6.75,6.75', 'grapher: zoom out');
  await page.click(R + '.fg-reset'); await page.waitForTimeout(250);
  check((await win()).join() === '-6,6,-4.5,4.5', 'grapher: reset view');
  await cv.scrollIntoViewIfNeeded();
  { const b = await cv.boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.mouse.move(b.x + b.width / 2 - b.width / 4, b.y + b.height / 2, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(300);
    const w = (await win()).map(Number); check(Math.abs(w[0] - -3) < 0.05 && Math.abs(w[1] - 9) < 0.05 && w[2] === -4.5, `grapher: drag moves the view (${w})`); }
  await page.click(R + '.fg-reset'); await page.waitForTimeout(250);
  await page.click(R + '.fg-win summary');
  await page.fill(R + '.fg-w[data-k="yb"]', '10'); await page.press(R + '.fg-w[data-k="yb"]', 'Enter'); await page.waitForTimeout(250);
  check(!(await page.isChecked(R + '.fg-eq')) && (await win()).join() === '-6,6,-4.5,10', 'grapher: typed window turns off equal scale');
  await page.check(R + '.fg-eq'); await page.waitForTimeout(250);
  check((await win()).map(Number).every((v, i) => Math.abs(v - [-6, 6, -1.75, 7.25][i]) < 1e-9), 'grapher: equal scale restored around the centre');
  await page.click(R + '.fg-reset'); await page.waitForTimeout(200);
  // Add a curve with a slider.
  await page.click(R + '.fg-add'); await page.fill(R + '.fg-row:nth-child(3) .fg-in', 'y = a x'); await page.waitForTimeout(250);
  check(await page.isVisible(R + '.fg-par[data-p="a"]') && (await kinds())[2] === 'y = f(x)', 'grapher: a new curve with a slider letter');
  await page.fill(R + '.fg-par[data-p="a"] .fg-pv', '-2'); await page.waitForTimeout(300);
  { const k = await txt('.fg-kt'); check(k.includes('1 and 3') && k.includes('2 and 3'), `grapher: crossings with the new line (${k})`); }
  // y = -2x meets x^3 - 2x - 1 where x^3 = 1: (1, -2).
  { const rows = await page.$$eval(R + '.fg-kt tbody tr', (t) => t.map((r) => [...r.cells].map((c) => c.textContent))); check(rows.some((r) => r[0] === '1 and 3' && r[2] === '1' && r[3] === '−2'), 'grapher: slider value used: y = -2x meets the cubic at (1, -2)'); }
  await page.fill(R + '.fg-row:nth-child(3) .fg-in', 'y = sinx'); await page.waitForTimeout(200);
  check((await kinds())[2].includes('not a name') && (await txt('.fg-err')).includes('could not be read'), 'grapher: bad formula message');
  await page.fill(R + '.fg-row:nth-child(3) .fg-in', 'x^2 + y^2 = (4'); await page.waitForTimeout(200);
  check((await kinds())[2].includes('not closed'), 'grapher: unclosed bracket message');
  await page.click(R + '.fg-row:nth-child(3) .fg-del'); await page.waitForTimeout(200);
  check((await page.$$(R + '.fg-row')).length === 2 && await page.isHidden(R + '.fg-err') && !(await page.isVisible(R + '.fg-par')), 'grapher: remove a curve');
  // Downloads (2D).
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fg-csv')]); const f = OUT + 'grapher.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    const c1 = rows.filter((r) => r.startsWith('1,')).map((r) => r.split(',').slice(-2).map(Number)); const c2 = rows.filter((r) => r.startsWith('2,')).map((r) => r.split(',').slice(-2).map(Number));
    check(rows[0] === 'curve,formula,kind,piece,x,y' && c1.length > 500 && c1.every(([x, y]) => Math.abs(y - (x ** 3 - 2 * x - 1)) < 1e-9) && c2.length > 100 && c2.every(([x, y]) => Math.abs(Math.hypot(x, y) - 4) < 1e-9), 'grapher: CSV points lie on both curves'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fg-svg')]); const f = OUT + 'grapher.svg'; await d.saveAs(f); const s = readFileSync(f, 'utf8'); check(s.includes('<svg') && (s.match(/<polyline/g) || []).length > 10 && s.includes('#0072B2'), 'grapher: SVG download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fg-png')]); const f = OUT + 'grapher.png'; await d.saveAs(f); const b = readFileSync(f); check(b.slice(1, 4).toString() === 'PNG' && b.readUInt32BE(16) > 1000, 'grapher: PNG download at twice the size'); }
  // Examples of each kind.
  await page.selectOption(R + '.fg-ex', 'rose'); await page.waitForTimeout(300);
  check((await kinds())[0] === 'Polar r(θ)' && (await page.inputValue(R + '.fg-th1')) === 'pi', 'grapher: polar rose example');
  await page.selectOption(R + '.fg-ex', 'liss'); await page.waitForTimeout(300);
  check((await kinds())[0] === 'Parametric (x(t), y(t))', 'grapher: Lissajous example');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fg-csv')]); const f = OUT + 'liss.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n').slice(1).map((r) => r.split(',').slice(-2).map(Number));
    check(rows.length > 2000 && rows.every(([x, y]) => Math.abs(x) <= 4 + 1e-12 && Math.abs(y) <= 3 + 1e-12), 'grapher: parametric points stay in their box'); }
  await page.selectOption(R + '.fg-ex', 'heart'); await page.waitForTimeout(300);
  { const k = await kinds(), w = await win(); check(k[0] === 'Equation in x and y' && w.join() === '-2,2,-1.5,1.5', `grapher: heart curve example (${k} ${w})`); }
  await page.selectOption(R + '.fg-ex', 'asym'); await page.waitForTimeout(300);
  { const k = await txt('.fg-kt'); check(k.includes('−3.14159') && k.includes('3.14159') && !k.includes('Local'), 'grapher: tan roots, no false turning points at asymptotes'); }
  await page.selectOption(R + '.fg-ex', 'slider'); await page.waitForTimeout(300);
  { const rg = page.locator(R + '.fg-par[data-p="b"] input[type=range]'); await rg.fill('2'); await page.waitForTimeout(250);
    check((await page.inputValue(R + '.fg-par[data-p="b"] .fg-pv')) === '2' && (await txt('.fg-kt')).includes('0.785398'), 'grapher: slider b = 2 moves the maximum of 2 sin(2x) to π/4'); }
  // 3D surfaces.
  await page.selectOption(R + '.fg-ex', 's-saddle'); await page.waitForTimeout(400);
  { const f = await txt('.fg-facts'); check(f.includes('Lowest z on the grid−4 at (0, −2)') && f.includes('Highest z on the grid4 at (−2, 0)') && f.includes('31 × 31 = 961') && await page.isHidden(R + '.fg-kp'), `grapher: saddle surface facts (${f})`); }
  { const before = await page.inputValue(R + '.fg-az'); await cv.scrollIntoViewIfNeeded(); const b = await cv.boundingBox(); await page.mouse.move(b.x + 100, b.y + 100); await page.mouse.down(); await page.mouse.move(b.x + 200, b.y + 120, { steps: 4 }); await page.mouse.up(); await page.waitForTimeout(150);
    check((await page.inputValue(R + '.fg-az')) !== before && (await page.inputValue(R + '.fg-el')) !== '30', 'grapher: dragging turns and tilts the surface'); }
  await page.selectOption(R + '.fg-n', '20'); await page.waitForTimeout(200);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fg-csv')]); const f = OUT + 'surface.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); const v = rows.slice(1).map((r) => r.split(',').map(Number));
    check(rows[0] === 'x,y,z' && rows.length === 442 && v.every(([x, y, z]) => Math.abs(z - (x * x - y * y)) < 1e-9), 'grapher: surface CSV (21 × 21 grid, z = x² − y²)'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fg-svg')]); const f = OUT + 'surface.svg'; await d.saveAs(f); check((readFileSync(f, 'utf8').match(/<polygon/g) || []).length >= 400, 'grapher: surface SVG has every face'); }
  await page.fill(R + '.fg-z', 'sqrt(1 - x^2 - y^2)'); await page.waitForTimeout(300);
  check((await txt('.fg-facts')).includes('grid points (left as gaps)'), 'grapher: undefined surface points counted');
  await page.fill(R + '.fg-z', 'z + 1'); await page.waitForTimeout(200);
  check((await txt('.fg-err')).includes('no z on the right'), 'grapher: surface error message');
  await page.fill(R + '.fg-z', 'a x y'); await page.waitForTimeout(200);
  check(await page.isVisible(R + '.fg-par[data-p="a"]') && await page.isHidden(R + '.fg-err'), 'grapher: surface slider');
  await page.fill(R + '.fg-sx1', '-5'); await page.waitForTimeout(200);
  check((await txt('.fg-err')).includes('must be larger'), 'grapher: surface range message');
  await page.click(R + '.fg-mode button[data-m="2d"]'); await page.waitForTimeout(300);
  check(await page.isVisible(R + '.fg-kp') && await page.isHidden(R + '.fg-3d'), 'grapher: back to curves');
  // Phone screenshot.
  await page.setViewportSize({ width: 375, height: 800 }); await page.selectOption(R + '.fg-ex', 'cubic'); await page.waitForTimeout(500);
  await page.locator(R + '.fg-cv').scrollIntoViewIfNeeded(); await page.screenshot({ path: OUT + 'function-grapher-375.png' });
  check(await page.evaluate(() => document.documentElement.scrollWidth) <= 375, 'grapher: fits 375 px');
  await page.setViewportSize({ width: 1280, height: 800 });
};
