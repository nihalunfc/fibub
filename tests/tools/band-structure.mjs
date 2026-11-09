// #962 band structure explorer
export const path = '/science/band-structure/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.bst ';
  const big = () => page.textContent(R + '.bs-big'), facts = () => page.textContent(R + '.bs-facts');
  const set = async (c, v) => { await page.fill(R + c, v); await page.waitForTimeout(350); };
  await page.goto(`${BASE}/science/band-structure/`); await page.waitForTimeout(800);
  check((await big()) === 'Bandwidth 4 eV, E_F = 0 eV: metal (partly filled band)', 'band: example chain');
  { const f = await facts(); check(f.includes('0.423 mₑ') && f.includes('0.159 per eV') && f.includes('−2 to 2 eV'), 'band: chain mass and DOS at E_F'); }
  check(await page.isVisible(R + '.bs-bfig') && await page.isVisible(R + '.bs-dfig'), 'band: both figures drawn');
  await set('.bs-n', '0.5'); check((await big()).includes('E_F = −1.41 eV'), 'band: quarter filling E_F = −√2 t');
  await set('.bs-n', '1'); await set('.bs-tpv', '0.5'); check((await big()).startsWith('Bandwidth 4.5 eV'), 'band: next-neighbour hopping widens the band');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.bs-csv')]); const f = OUT + 'bands.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 162 && rows[0].startsWith('path distance'), 'band: bands CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.bs-dcsv')]); const f = OUT + 'dos.csv'; await d.saveAs(f); check(readFileSync(f, 'utf8').trim().split('\n').length === 201, 'band: DOS CSV'); }
  await page.selectOption(R + '.bs-kind', 'diatomic'); await page.waitForTimeout(400);
  check((await big()) === 'Gap 1 eV, E_F = 0 eV: insulator (filled band, gap above)' && await page.isVisible(R + '.bs-d') && await page.isHidden(R + '.bs-tp'), 'band: diatomic chain gap Δ');
  await set('.bs-n', '1'); check((await big()).endsWith('metal (partly filled band)'), 'band: diatomic half-filled lower band is a metal');
  await page.selectOption(R + '.bs-kind', 'square'); await page.waitForTimeout(600);
  check((await big()) === 'Bandwidth 8 eV, E_F = 0 eV: metal (partly filled band)' && (await facts()).includes('0.238 mₑ'), 'band: square lattice');
  await page.selectOption(R + '.bs-kind', 'graphene'); await page.waitForTimeout(800);
  check((await big()) === 'Gap 0 eV, E_F = 0 eV: metal (partly filled band)' && (await facts()).includes('8.74 × 10⁵ m/s') && (await page.textContent(R + '.bs-al')).includes('C–C'), 'band: graphene Dirac point and Fermi velocity');
  await set('.bs-dv', '0.5'); await page.waitForTimeout(500); check((await big()).startsWith('Gap 0.5 eV') && (await big()).includes('insulator') && (await facts()).includes('Dirac mass0.25 eV'), 'band: graphene with Δ opens a gap');
  await page.selectOption(R + '.bs-kind', 'kp'); await page.waitForTimeout(500);
  check((await big()) === 'First gap 0.242 eV, lowest band 0.132 to 0.785 eV' && await page.isHidden(R + '.bs-t'), 'band: Kronig-Penney example');
  { const t = await page.textContent(R + '.bs-tab'); check((await page.$$(R + '.bs-tab tr')).length === 5 && t.includes('1.0273') && t.includes('12.407'), 'band: Kronig-Penney band table'); }
  await set('.bs-V', '0'); check((await big()).startsWith('First gap 0 eV'), 'band: V0 = 0 closes the gaps');
  await set('.bs-V', '0.5'); await set('.bs-m', '0.067'); await set('.bs-nb', '2'); check((await big()).startsWith('First gap 0.248 eV') && (await page.$$(R + '.bs-tab tr')).length === 3, 'band: effective mass and band count');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); const f = OUT + 'band.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'band: PDF report'); }
  await set('.bs-nb', '9'); check((await page.textContent(R + '.bs-err')).includes('1 to 8') && await page.isHidden(R + '.bs-out'), 'band: bad band count message');
  await set('.bs-nb', '4'); await set('.bs-w', '0'); check((await page.textContent(R + '.bs-err')).includes('well width'), 'band: bad well width message');
  await page.selectOption(R + '.bs-kind', 'chain'); await page.waitForTimeout(300); await set('.bs-t', '0'); check((await page.textContent(R + '.bs-err')).includes('not 0') && await page.isHidden(R + '.bs-out'), 'band: zero hopping message');
  await set('.bs-t', '1'); await set('.bs-n', '3'); check((await page.textContent(R + '.bs-err')).includes('between 0 and 2'), 'band: too many electrons message');
};
