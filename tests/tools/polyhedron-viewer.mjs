// #554 Polyhedron and tiling viewer
export const path = '/science/polyhedron-viewer/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const vp0 = page.viewportSize();
  await page.setViewportSize({ width: 1000, height: 900 });
  await page.goto(`${BASE}/science/polyhedron-viewer/`); await page.waitForTimeout(600);
  const R = '.pv ';
  const facts = () => page.textContent(R + '.pv-facts');
  { const f = await facts(); check(['Vertices V60', 'Edges E90', 'Faces F32: 12 pentagons, 20 hexagons', '60 − 90 + 32 = 2', '5.6.6 (pentagon, hexagon, hexagon)', '12° (× 60 vertices = 720°)', 'Surface area72.6073', 'Volume55.2877', '2.47802', '2.42705', 'Pentakis dodecahedron: 32 vertices, 90 edges, 60 faces (60 with 3 sides)'].every((s) => f.includes(s)), `polyhedra: truncated icosahedron facts (${f})`); }
  check((await page.textContent(R + '.pv-leg')).includes('pentagons') && (await page.textContent(R + '.pv-h')).startsWith('Truncated icosahedron'), 'polyhedra: legend and heading');
  // Edge length scales area and volume.
  await page.fill(R + '.pv-a', '2'); await page.waitForTimeout(100);
  check((await facts()).includes('Volume442.302') && (await facts()).includes('Surface area290.429'), 'polyhedra: edge 2 gives 4× area and 8× volume');
  await page.fill(R + '.pv-a', '-1'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.pv-err')).includes('above zero'), 'polyhedra: bad edge length message');
  await page.fill(R + '.pv-a', '1'); await page.waitForTimeout(100);
  // Every solid: Euler characteristic 2.
  const ids = await page.$$eval(R + '.pv-s option', (o) => o.map((x) => x.value));
  let euler = 0;
  for (const id of ids) { await page.selectOption(R + '.pv-s', id); if ((await facts()).includes(' = 2')) euler++; }
  check(ids.length === 18 && euler === 18, `polyhedra: all 18 solids show V − E + F = 2 (${euler})`);
  await page.selectOption(R + '.pv-s', 'cube');
  { const f = await facts(); check(f.includes('Faces F6: 6 squares') && f.includes('Volume1') && f.includes('Octahedron: 6 vertices, 12 edges, 8 faces') && f.includes('90° (× 8 vertices = 720°)'), 'polyhedra: cube'); }
  await page.selectOption(R + '.pv-s', 'snub-dodecahedron');
  check((await facts()).includes('Volume37.6166') && (await facts()).includes('3.3.3.3.5'), 'polyhedra: snub dodecahedron volume 37.6166');
  // Turning by drag changes the picture.
  const cv = page.locator(R + '.pv-cv'); await cv.evaluate((e) => e.scrollIntoView({ block: 'center' }));
  const snap = () => cv.evaluate((c) => c.toDataURL());
  { const a = await snap(), b = await cv.boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.mouse.move(b.x + b.width / 2 + 80, b.y + b.height / 2 + 30, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(100);
    const c = await snap(); await page.click(R + '.pv-reset'); await page.waitForTimeout(100); const d = await snap(); check(a !== c && a === d, 'polyhedra: drag turns, reset puts it back'); }
  // Dual and both.
  await page.selectOption(R + '.pv-s', 'cuboctahedron'); await page.selectOption(R + '.pv-show', 'dual'); await page.waitForTimeout(100);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pv-obj')]); const f = OUT + 'dual.obj'; await d.saveAs(f); const s = readFileSync(f, 'utf8'); const v = s.split('\n').filter((l) => l.startsWith('v ')), fa = s.split('\n').filter((l) => l.startsWith('f '));
    check(d.suggestedFilename() === 'cuboctahedron-dual.obj' && v.length === 14 && fa.length === 12 && fa.every((l) => l.split(' ').length === 5), 'polyhedra: OBJ of the dual (rhombic dodecahedron: 14 vertices, 12 rhombi)'); }
  await page.selectOption(R + '.pv-show', 'both'); await page.waitForTimeout(100);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pv-svg')]); const f = OUT + 'both.svg'; await d.saveAs(f); const s = readFileSync(f, 'utf8'); check(s.includes('<polygon') && s.includes('stroke-dasharray'), 'polyhedra: SVG with the dual drawn over the solid'); }
  await page.selectOption(R + '.pv-show', 'solid'); await page.fill(R + '.pv-a', '2'); await page.waitForTimeout(100);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pv-csv')]); const f = OUT + 'v.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); const v = rows.slice(1).map((r) => r.split(',').slice(1).map(Number));
    check(rows[0] === 'vertex,x,y,z' && v.length === 12 && v.every((p) => Math.abs(Math.hypot(...p) - 2) < 1e-9), 'polyhedra: vertex CSV (cuboctahedron, edge 2: every vertex 2 from the centre)'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pv-png')]); const f = OUT + 'pv.png'; await d.saveAs(f); check(readFileSync(f).slice(1, 4).toString() === 'PNG', 'polyhedra: PNG'); }
  await page.check(R + '.pv-spin'); { const a = await snap(); await page.waitForTimeout(300); const b = await snap(); check(a !== b, 'polyhedra: spin'); } await page.uncheck(R + '.pv-spin');
  // Tilings.
  await page.click(R + '.pv-mode button[data-m="tiling"]'); await page.waitForTimeout(150);
  { const f = await facts(); check(f.includes('3.4.6.4 (triangle, square, hexagon, square)') && f.includes('60° + 90° + 120° + 90° = 360°') && f.includes('2 triangles, 3 squares, 1 hexagon') && f.includes('triangles 13.4 %, squares 46.4 %, hexagons 40.2 %') && f.includes('Cell area (edge 1)6.4641') && await page.isHidden(R + '.pv-obj'), `polyhedra: rhombitrihexagonal tiling (${f})`); }
  const tids = await page.$$eval(R + '.pv-t option', (o) => o.map((x) => x.value));
  let sum = 0; for (const id of tids) { await page.selectOption(R + '.pv-t', id); if ((await facts()).includes('= 360°')) sum++; }
  check(tids.length === 11 && sum === 11, 'polyhedra: all 11 tilings, angles adding to 360°');
  await page.selectOption(R + '.pv-t', 'snub-hexagonal'); await page.check(R + '.pv-cell'); await page.waitForTimeout(100);
  check((await facts()).includes('8 triangles, 1 hexagon') && (await facts()).includes('Semi-regular'), 'polyhedra: snub hexagonal cell');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pv-svg')]); const f = OUT + 'tile.svg'; await d.saveAs(f); check(d.suggestedFilename() === 'tiling-snub-hexagonal.svg' && (readFileSync(f, 'utf8').match(/<polygon/g) || []).length > 50, 'polyhedra: tiling SVG'); }
  // Phone screenshot.
  await page.setViewportSize({ width: 375, height: 800 }); await page.reload(); await page.waitForTimeout(500);
  await cv.evaluate((e) => e.scrollIntoView({ block: 'center' })); await page.screenshot({ path: OUT + 'polyhedron-viewer-375.png' });
  check(await page.evaluate(() => document.documentElement.scrollWidth) <= 375, 'polyhedra: fits 375 px');
  await page.setViewportSize(vp0);
};
