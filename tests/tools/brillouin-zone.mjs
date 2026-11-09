// #963 Brillouin zone viewer
export const path = '/science/brillouin-zone/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.bzv ';
  const big = () => page.textContent(R + '.bz-big'), facts = () => page.textContent(R + '.bz-facts'), pts = () => page.textContent(R + '.bz-pts');
  const kind = async (k) => { await page.selectOption(R + '.bz-kind', k); await page.waitForTimeout(300); };
  const set = async (c, v) => { await page.fill(R + c, v); await page.waitForTimeout(250); };
  await page.goto(`${BASE}/science/brillouin-zone/`); await page.waitForTimeout(800);
  check((await big()) === 'Truncated octahedron: 14 faces, 24 corners, 36 edges', 'bz: example fcc zone');
  { const f = await facts(); check(f.includes('16 Å³') && f.includes('15.503 Å⁻³') && f.includes('2.721, 2.721, 2.721 Å⁻¹') && f.includes('body-centred cubic'), 'bz: fcc volumes and reciprocal vectors'); }
  { const t = await pts(); check(t.includes('X(½, 0, ½)') && t.includes('1.5708') && t.includes('1.3603') && t.includes('1.7562') && t.includes('1.6661'), 'bz: fcc high-symmetry points'); }
  check(await page.isVisible(R + '.bz-fig') && await page.isHidden(R + '.bz-fig2') && await page.isVisible(R + '.bz-az'), 'bz: 3D figure and view sliders');
  await page.fill(R + '.bz-az', '120'); await page.dispatchEvent(R + '.bz-az', 'input'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.bz-azv')) === '120', 'bz: turn slider');
  await kind('bcc'); check((await big()) === 'Rhombic dodecahedron: 12 faces, 14 corners, 24 edges' && (await facts()).includes('face-centred cubic'), 'bz: bcc zone');
  await kind('sc'); check((await big()) === 'Cube: 6 faces, 8 corners, 12 edges' && (await pts()).includes('R(½, ½, ½)'), 'bz: simple cubic zone');
  await kind('hex'); check((await big()) === 'Hexagonal prism: 8 faces, 12 corners, 18 edges' && await page.isVisible(R + '.bz-c') && (await pts()).includes('K(⅓, ⅓, 0)'), 'bz: hexagonal zone');
  await kind('tet'); check((await big()).startsWith('Square prism: 6 faces'), 'bz: tetragonal zone');
  await kind('orth'); check((await big()).startsWith('Rectangular box: 6 faces') && await page.isVisible(R + '.bz-b'), 'bz: orthorhombic zone');
  await kind('tric'); check((await big()) === 'Truncated octahedron shape: 14 faces, 24 corners, 36 edges' && (await facts()).includes('2.1752 Å⁻³'), 'bz: triclinic zone');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.bz-csv')]); const f = OUT + 'bz.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 25 && rows[0].startsWith('corner,kx'), 'bz: corners CSV'); }
  await set('.bz-al', '30'); await set('.bz-be', '60'); check((await page.textContent(R + '.bz-err')).includes('between 50° and 130°'), 'bz: angle range message');
  await set('.bz-al', '55'); await set('.bz-be', '55'); await set('.bz-ga', '125'); check((await page.textContent(R + '.bz-err')).includes('cannot close a cell') && await page.isHidden(R + '.bz-out'), 'bz: impossible cell message');
  await set('.bz-ga', '105'); await set('.bz-al', '80'); await set('.bz-be', '95');
  await kind('hex2'); check((await big()) === 'Regular hexagon: 6 sides, area 2.849 Å⁻²' && await page.isVisible(R + '.bz-fig2') && await page.isHidden(R + '.bz-az') && (await pts()).includes('K(⅔, ⅓)'), 'bz: 2D hexagonal zone and real-space cell');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.bz-pcsv')]); const f = OUT + 'bzp.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('name,fractional,kx,ky,|k|') && t.includes('K,0.666667 0.333333'), 'bz: points CSV'); }
  await kind('square'); check((await big()) === 'Square: 4 sides, area 2.467 Å⁻²', 'bz: square zone');
  await kind('rect'); check((await big()).startsWith('Rectangle: 4 sides'), 'bz: rectangular zone');
  await kind('oblique'); check((await big()).startsWith('Hexagon: 6 sides') && (await facts()).includes('6 at up to'), 'bz: oblique zone');
  await kind('crect'); check((await big()).startsWith('Hexagon: 6 sides, area 3.948'), 'bz: centred rectangular zone');
  await page.selectOption(R + '.bz-conv', 'cryst'); await page.waitForTimeout(250); check((await big()).startsWith('Hexagon: 6 sides, area 0.1'), 'bz: crystallographic convention scales the zone by 1/(2π)²');
  await page.selectOption(R + '.bz-conv', 'phys');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=docx]')]); const f = OUT + 'bz.docx'; await d.saveAs(f); check(readFileSync(f).subarray(0, 2).toString() === 'PK', 'bz: Word report'); }
  await set('.bz-a', '0'); check((await page.textContent(R + '.bz-err')).includes('greater than 0'), 'bz: bad length message');
  await set('.bz-a', '1'); await set('.bz-b', '9'); check((await page.textContent(R + '.bz-err')).includes('factor of 4'), 'bz: length ratio message');
  await set('.bz-b', '5'); await kind('fcc'); check((await big()).startsWith('Truncated octahedron'), 'bz: back to a valid lattice');
};
