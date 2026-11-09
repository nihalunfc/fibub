// #664 mass and energy balance solver
export const path = '/science/mass-balance-solver/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.mbs ';
  await page.goto(`${BASE}/science/mass-balance-solver/`); await page.waitForTimeout(600);
  check((await page.textContent(R + '.mb-big')) === 'Solved: 0 degrees of freedom', 'massbal: example solved');
  { const t = await page.textContent(R + '.mb-facts'); check(t.includes('28 unknown flows') && t.includes('86.957 kmol/h') && t.includes('closes at every unit') && t.includes('2624 kW'), `massbal: example facts`); }
  { const t = await page.textContent(R + '.mb-tab'); check(t.includes('173.457') && t.includes('60.37') && t.includes('280.62') && t.includes('T °C'), 'massbal: stream table with temperatures'); }
  await page.selectOption(R + '.mb-show', 'frac'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.mb-tab')).includes('1.0000'), 'massbal: mole fractions');
  await page.selectOption(R + '.mb-show', 'mass'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.mb-tab')).includes('2954.14'), 'massbal: mass flows');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.mb-csv')]); const f = OUT + 'mb.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 8 && rows[0] === 'stream,N2_kmol_per_h,H2_kmol_per_h,NH3_kmol_per_h,Ar_kmol_per_h,total_kmol_per_h,total_kg_per_h,T_C' && rows[1].startsWith('S1,100,300,0,1,401'), 'massbal: stream table CSV'); }
  await page.selectOption(R + '.mb-show', 'flow'); await page.fill(R + '.mb-feeds', ''); await page.waitForTimeout(500);
  check((await page.textContent(R + '.mb-big')) === 'Under-specified: 4 more specifications needed' && (await page.textContent(R + '.mb-facts')).includes('in S6'), 'massbal: under-specified');
  await page.fill(R + '.mb-feeds', 'S1: N2 100, H2 300, Ar 1 | T 150\nS6 total 999'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.mb-big')).startsWith('Over-specified'), 'massbal: over-specified');
  await page.fill(R + '.mb-feeds', 'S1: N2 100, H2 ?, Ar 1 | T 150\nS6 H2 39.130434782608695'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.mb-big')) === 'Solved: 0 degrees of freedom' && (await page.textContent(R + '.mb-tab')).includes('300.00'), 'massbal: unknown feed fixed by a purge spec');
  await page.fill(R + '.mb-units', 'reactor R1: S1 -> S2 | N2 + 3 H2 -> 2 NH3 | N2 0.5 | T 400'); await page.fill(R + '.mb-feeds', 'S1: N2 10, H2 30 | T 400'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.mb-facts')).includes('Heat duty of R1') && (await page.textContent(R + '.mb-facts')).includes('heat removed'), 'massbal: isothermal reactor duty');
  await page.fill(R + '.mb-units', 'pump P1: S1 -> S2'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.mb-err')).includes('Could not read the unit line') && await page.isHidden(R + '.mb-out'), 'massbal: bad unit line message');
  await page.fill(R + '.mb-units', 'separator X: S1 -> P + W | N2 0.9, H2 0.1'); await page.fill(R + '.mb-feeds', 'S1: N2 10, H2 30'); await page.waitForTimeout(500);
  check((await page.textContent(R + '.mb-facts')).includes('not included'), 'massbal: no energy balance without feed temperatures');
  writeFileSync(OUT + 'mb-comps.csv', 'Component,M\nN2,28.014\nH2,2.016\n');
  await page.setInputFiles(R + '.dfb-in', OUT + 'mb-comps.csv'); await page.waitForTimeout(600);
  check((await page.textContent(R + '.mb-big')) === 'Solved: 0 degrees of freedom' && (await page.textContent(R + '.mb-tab')).includes('9.000'), 'massbal: components opened from a file');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=docx]')]); check((await d.suggestedFilename()) === 'mass-balance.docx', 'massbal: Word report'); }
};
