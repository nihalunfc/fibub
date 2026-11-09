// #547 Fractal explorer
export const path = '/science/fractal-explorer/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const vp0 = page.viewportSize();
  await page.setViewportSize({ width: 1000, height: 900 });
  await page.goto(`${BASE}/science/fractal-explorer/`);
  const R = '.fx ';
  let n = 0;
  const done = async () => { await page.waitForFunction(() => { const r = document.querySelector('.fx'); return r.dataset.done && r.dataset.done !== ''; }, null, { timeout: 30000 }); await page.waitForTimeout(50); };
  const facts = () => page.textContent(R + '.fx-facts');
  const pixel = (fx, fy) => page.$eval(R + '.fx-cv', (c, [fx, fy]) => [...c.getContext('2d').getImageData(Math.floor(c.width * fx), Math.floor(c.height * fy), 1, 1).data].slice(0, 3), [fx, fy]);
  await done();
  { const f = await facts(); const area = +/Area inside, in view([\d.]+)/.exec(f)?.[1];
    check(f.includes('Centre−0.6 + 0i') && f.includes('Width of the view3.6') && f.includes('Magnification1 ×') && f.includes('Iterations200 (automatic)') && area > 1.49 && area < 1.56, `fractal: opening Mandelbrot view and area by pixel count (${f})`); }
  check((await pixel(0.5, 0.5)).join() === '0,0,0' && (await pixel(0.02, 0.02)).join() !== '0,0,0', 'fractal: centre pixel is inside (black), corner is coloured');
  check((await page.textContent(R + '.fx-status')).startsWith('Drawn in'), 'fractal: drawn by the worker');
  // Zoom buttons and reset.
  await page.click(R + '.fx-zin'); await done();
  check((await facts()).includes('Width of the view1.8') && (await facts()).includes('Magnification2 ×') && (await facts()).includes('Iterations320'), 'fractal: zoom in doubles the magnification and adds iterations');
  await page.click(R + '.fx-zout'); await page.click(R + '.fx-zout'); await done();
  check((await facts()).includes('Width of the view7.2'), 'fractal: zoom out');
  await page.click(R + '.fx-reset'); await done();
  // Drag to pan.
  const cv = page.locator(R + '.fx-cv'); await cv.evaluate((e) => e.scrollIntoView({ block: 'center' }));
  { const b = await cv.boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.mouse.move(b.x + b.width / 4, b.y + b.height / 2, { steps: 5 }); await page.mouse.up(); await done();
    const cx = +(await page.inputValue(R + '.fx-cx')); check(Math.abs(cx - 0.3) < 0.02 && +(await page.inputValue(R + '.fx-cy')) === 0, `fractal: drag moves the centre (${cx})`); }
  // Double-click zooms at the point.
  { const b = await cv.boundingBox(); await page.mouse.dblclick(b.x + b.width / 2, b.y + b.height / 2); await done();
    check(+(await page.inputValue(R + '.fx-sp')) === 1.8, 'fractal: double-tap zooms in'); }
  // Go to a point, deep.
  await page.click(R + '.fx-go summary');
  await page.fill(R + '.fx-cx', '-0.7436447860'); await page.fill(R + '.fx-cy', '0.1318252536'); await page.fill(R + '.fx-sp', '0.00001'); await page.press(R + '.fx-sp', 'Enter'); await done();
  { const f = await facts(); check(f.includes('Magnification360,000 ×') && f.includes('Centre−0.743644786 + 0.1318252536i'), `fractal: go to a point in seahorse valley (${f})`); }
  await page.fill(R + '.fx-sp', '1e-20'); await page.press(R + '.fx-sp', 'Enter'); await done();
  { const sp = +(await page.inputValue(R + '.fx-sp')); check(sp > 1e-12 && sp < 1e-11 && await page.isVisible(R + '.fx-limit'), `fractal: zoom stops at the double-precision limit (${sp})`); }
  await page.fill(R + '.fx-sp', '-1'); await page.press(R + '.fx-sp', 'Enter');
  check((await page.textContent(R + '.fx-err')).includes('width above zero'), 'fractal: bad width message');
  await page.click(R + '.fx-reset'); await done();
  // Iterations and colours.
  await page.selectOption(R + '.fx-it', '1000'); await done();
  check((await facts()).includes('Iterations1,000') && !(await facts()).includes('automatic'), 'fractal: fixed iterations');
  { const before = await pixel(0.02, 0.02); await page.selectOption(R + '.fx-pal', 'fire'); await page.waitForTimeout(200); const after = await pixel(0.02, 0.02); check(before.join() !== after.join() && (await pixel(0.5, 0.5)).join() === '0,0,0', 'fractal: palette changes the colours without redrawing'); }
  await page.selectOption(R + '.fx-pal', 'grey'); await page.waitForTimeout(150);
  { const p = await pixel(0.02, 0.02); check(p[0] === p[1] && p[1] === p[2], 'fractal: grey palette'); }
  await page.selectOption(R + '.fx-it', 'auto'); await done();
  // PNG downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fx-png')]); const f = OUT + 'fractal.png'; await d.saveAs(f); const b = readFileSync(f); check(b.slice(1, 4).toString() === 'PNG' && b.readUInt32BE(16) >= 600, 'fractal: PNG as shown'); }
  { const [d] = await Promise.all([page.waitForEvent('download', { timeout: 60000 }), page.click(R + '.fx-big')]); const f = OUT + 'fractal-big.png'; await d.saveAs(f); const b = readFileSync(f); check(b.readUInt32BE(16) === 2400 && b.readUInt32BE(20) === 1800 && d.suggestedFilename() === 'mandelbrot-2400.png', 'fractal: PNG 2400 × 1800'); }
  // Julia from the centre, presets and connectivity.
  await page.click(R + '.fx-zin'); await done();
  await page.click(R + '.fx-tojulia'); await done();
  check((await page.inputValue(R + '.fx-jr')) === '-0.6' && (await page.inputValue(R + '.fx-jp')) === 'custom' && (await facts()).includes('Connected?Yes'), 'fractal: Julia set for the centre (c = -0.6, connected)');
  await page.selectOption(R + '.fx-jp', '-0.123,0.745'); await done();
  check((await facts()).includes('Connected?Yes') && (await pixel(0.5, 0.5)).join() === '0,0,0', 'fractal: Douady rabbit is connected, centre inside');
  await page.selectOption(R + '.fx-jp', '0.285,0.01'); await done();
  check((await facts()).includes('Connected?No') && !(await facts()).includes('Area inside'), 'fractal: c = 0.285 + 0.01i gives dust');
  await page.fill(R + '.fx-jr', 'abc'); await page.press(R + '.fx-jr', 'Enter'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.fx-err')).includes('real and imaginary parts'), 'fractal: bad c message');
  await page.fill(R + '.fx-jr', '-1'); await page.fill(R + '.fx-ji', '0'); await page.press(R + '.fx-ji', 'Enter'); await done();
  check((await facts()).includes('Connected?Yes') && await page.isHidden(R + '.fx-err'), 'fractal: typed c = -1 (the basilica)');
  // IFS.
  await page.click(R + '.fx-mode button[data-m="ifs"]'); await done();
  { const f = await facts(); check(f.includes('Maps4') && f.includes('none: the maps are not all similarities') && (await page.textContent(R + '.fx-mt')).includes('0.85') && await page.isHidden(R + '.fx-nav'), 'fractal: Barnsley fern with its four maps'); }
  await page.selectOption(R + '.fx-ip', 'sierpinski'); await done();
  { const f = await facts(); const b = +/Box-counting estimate([\d.]+)/.exec(f)?.[1]; check(f.includes('Similarity dimension1.58496') && Math.abs(b - 1.585) < 0.06, `fractal: Sierpinski triangle dimension (${f})`); }
  await page.selectOption(R + '.fx-ip', 'carpet'); await page.selectOption(R + '.fx-n', '1000000'); await done();
  check((await facts()).includes('Similarity dimension1.89279') && (await facts()).includes('1,000,000 points'), 'fractal: carpet with a million points');
  await page.selectOption(R + '.fx-ip', 'dragon'); await page.selectOption(R + '.fx-n', '50000'); await done();
  check((await facts()).includes('Similarity dimension2 '), 'fractal: dragon dimension 2');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fx-big')]); const f = OUT + 'dragon.png'; await d.saveAs(f); const b = readFileSync(f); check(b.readUInt32BE(16) === 2400 && d.suggestedFilename() === 'dragon-2400.png', 'fractal: IFS PNG 2400 × 1800'); }
  // Phone screenshot.
  await page.setViewportSize({ width: 375, height: 800 }); await page.click(R + '.fx-mode button[data-m="mandelbrot"]'); await done();
  await cv.evaluate((e) => e.scrollIntoView({ block: 'center' })); await page.screenshot({ path: OUT + 'fractal-explorer-375.png' });
  check(await page.evaluate(() => document.documentElement.scrollWidth) <= 375, 'fractal: fits 375 px');
  await page.setViewportSize(vp0);
};
