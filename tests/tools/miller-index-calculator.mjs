// #844 Miller index calculator
export const path = '/science/miller-index-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.mic ';
  const txt = (s) => page.textContent(R + s);
  const set = async (s, v) => { await page.fill(R + s, v); await page.waitForTimeout(350); };
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  check((await txt('.mi-big')) === 'd(111) = 2.3383 Å', 'miller: example d(111)');
  { const f = await txt('.mi-facts'); check(f.includes('2θ = 38.469° at λ = 1.5406 Å') && f.includes('54.74°') && f.includes('[01−1]') && f.includes('66.430 Å³'), 'miller: example facts'); }
  check(await page.isVisible(R + '.mi-fig') && await page.isHidden(R + '[data-p=b]') && await page.isVisible(R + '[data-p=a]'), 'miller: picture and cubic fields only');
  { const t = await txt('.mi-rtab'); check(t.includes('(100)') && t.includes('4.0500') && t.includes('(210)') && t.includes('24'), 'miller: reflection list'); }
  // Direction in the plane.
  await set('.mi-u', '1 -1 0');
  check((await txt('.mi-facts')).includes('90.00° from the normal of (111), so it lies in that plane'), 'miller: direction in the plane (zone law)');
  await set('.mi-u', '12');
  check((await txt('.mi-err')).includes('three whole numbers') && await page.isHidden(R + '.mi-out'), 'miller: bad direction message');
  await set('.mi-u', '');
  // Hexagonal with four-index input.
  await page.selectOption(R + '.mi-sys', 'hexagonal'); await set('.mi-a', '3.21'); await set('.mi-c', '5.21'); await set('.mi-h1', '1 0 -1 1'); await set('.mi-u', '2 -1 -1 0');
  check((await txt('.mi-big')) === 'd(101) = 2.4526 Å' && (await txt('.mi-facts')).includes('(10−11)') && (await txt('.mi-facts')).includes('Direction [100] = [2−1−10]3.2100 Å long'), `miller: hexagonal four-index plane and direction (${await txt('.mi-facts')})`);
  await set('.mi-h1', '1 0 1 1');
  check((await txt('.mi-err')).includes('third index must be'), 'miller: bad four-index plane');
  await page.selectOption(R + '.mi-sys', 'cubic'); await page.waitForTimeout(200);
  check((await txt('.mi-err')).includes('four indices are for hexagonal'), 'miller: four indices refused for cubic');
  // Triclinic, checked against NumPy.
  await page.selectOption(R + '.mi-sys', 'triclinic');
  await set('.mi-a', '5.1'); await set('.mi-b', '6.3'); await set('.mi-c', '7.7'); await set('.mi-alpha', '82'); await set('.mi-beta', '97'); await set('.mi-gamma', '104');
  await set('.mi-h1', '1 2 3'); await set('.mi-h2', '-2 1 1'); await set('.mi-u', '');
  { const f = await txt('.mi-facts'); check((await txt('.mi-big')) === 'd(123) = 1.7639 Å' && f.includes('2.4705 Å') && f.includes('95.92°') && f.includes('236.71 Å³'), 'miller: triclinic matches NumPy'); }
  await set('.mi-gamma', '179.5');
  check((await txt('.mi-cerr')).includes('cannot make a cell'), 'miller: impossible angles message');
  await set('.mi-gamma', '104');
  for (const [s, show] of [['monoclinic', ['a', 'b', 'c', 'beta']], ['trigonal', ['a', 'alpha']], ['tetragonal', ['a', 'c']], ['orthorhombic', ['a', 'b', 'c']]]) {
    await page.selectOption(R + '.mi-sys', s); await page.waitForTimeout(200);
    const vis = await page.$$eval(R + '[data-p]', (els) => els.filter((e) => !e.hidden).map((e) => e.dataset.p).join());
    check(vis === show.join() && !(await txt('.mi-big')).includes('NaN'), `miller: ${s} shows ${show.join(', ')}`);
  }
  // Parallel planes: no zone axis.
  await page.selectOption(R + '.mi-sys', 'cubic'); await set('.mi-a', '4'); await set('.mi-h1', '1 1 0'); await set('.mi-h2', '2 2 0');
  check((await txt('.mi-facts')).includes('the planes are parallel'), 'miller: parallel planes');
  await set('.mi-h2', '1 -1 1');
  check((await txt('.mi-facts')).includes('[1−1−2]'), 'miller: zone axis of (110) and (1−11)');
  // Reflection list size and CSV.
  await page.selectOption(R + '.mi-max', '1'); await page.waitForTimeout(200);
  check((await page.$$(R + '.mi-rtab tbody tr')).length === 3, 'miller: largest index 1 gives 3 groups in cubic');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.mi-csv')]); const f = OUT + 'refl.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 4 && rows[0] === 'h,k,l,d_angstrom,two_theta_deg,planes_with_this_d' && rows[1].startsWith('1,0,0,4,'), 'miller: reflection CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.mi-svg')]); const f = OUT + 'miller.svg'; await d.saveAs(f); const s = readFileSync(f, 'utf8'); check(s.startsWith('<svg') && (s.match(/<polygon/g) || []).length === 2 && (s.match(/<line/g) || []).length === 13, 'miller: SVG picture (one (110) plane, one (1−11) plane, 12 edges and the zone axis)'); }
  // Turning the picture changes it.
  const before = await page.$eval(R + '.mi-fig', (c) => c.toDataURL());
  await page.fill(R + '.mi-yaw', '40'); await page.dispatchEvent(R + '.mi-yaw', 'input'); await page.waitForTimeout(100);
  check(before !== await page.$eval(R + '.mi-fig', (c) => c.toDataURL()), 'miller: Turn slider redraws');
  await page.$eval(R + '.mi-fig', (e) => e.scrollIntoView({ block: 'center' })); await page.waitForTimeout(100);
  { const bb = await page.locator(R + '.mi-fig').boundingBox(); await page.mouse.move(bb.x + 100, bb.y + 100); await page.mouse.down(); await page.mouse.move(bb.x + 160, bb.y + 100, { steps: 4 }); await page.mouse.up(); }
  check((await page.inputValue(R + '.mi-yaw')) === '4', `miller: dragging turns the cell (${await page.inputValue(R + '.mi-yaw')})`);
  await page.click(R + '.mi-reset');
  check((await page.inputValue(R + '.mi-yaw')) === '-110' && (await page.inputValue(R + '.mi-tilt')) === '22', 'miller: reset view');
  // Converter.
  await page.fill(R + '.mi-mb', '1 1 0'); await page.waitForTimeout(100);
  check((await txt('.mi-mbo')) === '[110] = [11−20]', 'miller: converter direction 3 → 4');
  await page.selectOption(R + '.mi-mbk', 'plane'); await page.fill(R + '.mi-mb', '1 0 -1 2'); await page.waitForTimeout(100);
  check((await txt('.mi-mbo')) === '(10−12) = (102)', 'miller: converter plane 4 → 3');
  await page.fill(R + '.mi-mb', '1 0 0 2'); await page.waitForTimeout(100);
  check((await txt('.mi-mbo')).includes('must be −(first + second)'), 'miller: converter bad four-index');
};
