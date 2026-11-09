// #984 adduct calculator
export const path = '/science/adduct-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.adc ';
  const t = (s) => page.textContent(R + s);
  const set = async (sel, v) => { await page.fill(R + sel, v); await page.waitForTimeout(350); };
  const pick = async (sel, v) => { await page.selectOption(R + sel, v); await page.waitForTimeout(350); };
  const rows = (sel) => page.$$eval(R + sel + ' tbody tr', (r) => r.map((x) => [...x.cells].map((c) => c.textContent).join('|')));
  await page.goto(`${BASE}/science/adduct-calculator/`); await page.waitForTimeout(500);
  check((await t('.ad-big')) === 'M = 180.06339 Da (C6H12O6)', 'adduct: glucose M 180.06339');
  { const f = await t('.ad-facts'); check(f.includes('181.07066') && f.includes('179.05611') && f.includes('33') && f.includes('4 of 4'), 'adduct: [M+H]+, [M−H]−, 33 ions, 4 of 4 matched'); }
  { const m = await rows('.ad-mtab'); check(m[0] === '203.05300|[M+Na]+|203.05261|+1.9 ppm' && m[1].startsWith('181.07100|[M+H]+') && m[2].includes('+2.5 ppm') && m.some((r) => r.startsWith('179.05600|[M−H]−|179.05611|−0.6 ppm')), 'adduct: matches with ppm (Python)'); }
  { const a = await rows('.ad-atab'); check(a.length === 25 && a.some((r) => r === '[M+Na]+|+|203.05261|22.98922') && a.some((r) => r.startsWith('[M+2H]2+|2+|91.03897')) && a.some((r) => r.startsWith('[M+HCOO]− (formate)|−|225.06159')), 'adduct: adduct table (25, Na, 2+, formate)'); }
  { const l = await rows('.ad-ltab'); check(l.length === 8 && l.some((r) => r.startsWith('[M+H]+|Water (H2O)|18.01056|163.06010')), 'adduct: loss table'); }
  await pick('.ad-mode', '-');
  check((await rows('.ad-atab')).length === 10 && (await t('.ad-facts')).includes('1 of 4'), 'adduct: negative mode only');
  await pick('.ad-mode', 'both');
  await page.check(R + '.ad-loss[value=C6H10O5]'); await set('.ad-lc', 'C3H5NO');
  check((await rows('.ad-ltab')).length === 12 && (await t('.ad-ltab')).includes('C3H5NO'), 'adduct: extra losses (hexose and custom)');
  await set('.ad-lc', 'Xy2');
  check((await t('.ad-err')).includes('"Xy2" is not a formula'), 'adduct: bad loss formula');
  await set('.ad-lc', ''); await set('.ad-ppm', '1');
  check((await t('.ad-facts')).includes('1 of 4'), 'adduct: tighter tolerance 1 ppm leaves only [M−H]−');
  await set('.ad-mda', '1');
  check((await t('.ad-facts')).includes('4 of 4'), 'adduct: 1 mDa window');
  await set('.ad-mda', '0'); await set('.ad-ppm', '5');
  // Mass instead of formula
  await pick('.ad-as', 'm'); await set('.ad-m', '180.06339');
  check((await t('.ad-big')) === 'M = 180.06339 Da' && (await t('.ad-facts')).includes('4 of 4'), 'adduct: neutral mass input');
  await set('.ad-m', '-1');
  check((await t('.ad-err')).includes('neutral monoisotopic mass'), 'adduct: bad mass message');
  // Inverse
  await pick('.ad-as', 'none');
  check((await t('.ad-big')) === 'Neutral masses for 4 observed m/z' && (await t('.ad-facts')).includes('M ≈ 180.06375') && (await rows('.ad-itab'))[0].startsWith('203.05300|202.04572|180.06378'), 'adduct: neutral masses from m/z and the agreeing pair');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ad-csv')]); const f = OUT + 'inv.csv'; await d.saveAs(f); check(readFileSync(f, 'utf8').startsWith('observed_mz,neutral_if_M+H,'), 'adduct: neutral mass CSV'); }
  await pick('.ad-as', 'f');
  // File
  writeFileSync(OUT + 'peaks.csv', 'mz,intensity\n181.0707,1000\n219.0266,300\n');
  await page.setInputFiles(R + '.dfb-in', OUT + 'peaks.csv'); await page.waitForTimeout(800);
  check((await t('.ad-facts')).includes('2 of 2') && (await t('.ad-mtab')).includes('[M+K]+'), 'adduct: peak list from a CSV file with a header and intensities');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ad-mcsv')]); const f = OUT + 'm.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r[0] === 'observed_mz,ion,theory_mz,error_ppm,error_mda' && r[1].startsWith('181.0707,[M+H]+,181.070665,'), 'adduct: matches CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ad-csv')]); const f = OUT + 'i.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 36 && r[1] === '[M+H]+,1,181.070665', 'adduct: ions CSV (25 adducts, 10 loss ions)'); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl button[data-f=${fmt}]`)]); check(d.suggestedFilename() === `adducts.${fmt}`, `adduct: ${fmt} download`); }
  await set('.ad-obs', '181.07\nabc');
  check((await t('.ad-err')).includes('Line 2 does not start with an m/z'), 'adduct: bad peak line');
  await set('.ad-obs', ''); await set('.ad-f', 'C6H12O6+');
  check((await t('.ad-err')).includes('neutral molecule'), 'adduct: charged formula message');
  await set('.ad-f', 'Qq');
  check(!(await page.isHidden(R + '.ad-err')) && await page.isHidden(R + '.ad-out'), 'adduct: bad formula message');
};
