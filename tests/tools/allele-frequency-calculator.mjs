// #312 Allele frequency calculator
export const path = '/science/allele-frequency-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.afc ';
  await page.goto(`${BASE}/science/allele-frequency-calculator/`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.af-big'), facts = () => page.textContent(R + '.af-facts'), tab = () => page.textContent(R + '.af-tab');
  check((await big()) === 'FST = 0.124 (Weir and Cockerham), across 3 populations', `allele-freq: example FST (${await big()})`);
  { const f = await facts(); check(f.includes('FIS (f)0.2287') && f.includes('FIT (F)0.3243') && f.includes('p = 0.000326'), 'allele-freq: W&C facts and pooled test'); }
  { const t = await tab(); check(t.includes('North meadow') && t.includes('5 (22.8)') && t.includes('0.7802') && t.includes('2.16 × 10⁻⁸') && t.includes('All pooled'), 'allele-freq: population table'); }
  check((await page.textContent(R + '.af-note')).includes('below 5 (Coast dunes)') && (await page.textContent(R + '.af-note')).includes('North meadow'), 'allele-freq: small expected count and HWE notes');
  await page.selectOption(R + '.af-meth', 'nei'); await page.waitForTimeout(400);
  check((await big()).startsWith('FST = 0.0941 (Nei)') && (await facts()).includes('FIS0.2191') && (await facts()).includes('FIT0.2925'), 'allele-freq: Nei F-statistics');
  await page.fill(R + '.af-names', 'C, T'); await page.waitForTimeout(400);
  check((await tab()).includes('p(C)') && (await tab()).includes('CT obs (exp)'), 'allele-freq: allele names');
  await page.fill(R + '.af-in', '10\t40\t50'); await page.waitForTimeout(400);
  check((await big()) === 'Population 1: p(C) = 0.3, Hardy-Weinberg exact p = 0.637', `allele-freq: one population without a name (${await big()})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.af-csv')]); const f = OUT + 'af.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 2 && rows[0].startsWith('Population,n,p(C)') && rows[1].startsWith('Population 1,100,0.3,0.7'), 'allele-freq: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=docx]')]); const f = OUT + 'af.docx'; await d.saveAs(f); check(readFileSync(f).subarray(0, 2).toString() === 'PK', 'allele-freq: Word report'); }
  // Open a CSV file
  writeFileSync(OUT + 'af-in.csv', 'pop,AA,AB,BB\nX,25,50,25\nY,50,0,50\n');
  await page.setInputFiles(R + '.dfb-in', OUT + 'af-in.csv'); await page.waitForTimeout(600);
  check((await big()).startsWith('FST = ') && (await tab()).includes('Y'), 'allele-freq: CSV file opened');
  // Bad input
  await page.fill(R + '.af-in', 'X\t1.5\t2\t3'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.af-err')).includes('whole numbers') && await page.isHidden(R + '.af-out'), 'allele-freq: decimal count message');
  await page.fill(R + '.af-in', 'X\t0\t0\t0'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.af-err')).includes('no individuals'), 'allele-freq: empty population message');
  await page.fill(R + '.af-in', 'Population\tAA\tAB\tBB\nX\t3\t4'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.af-err')).includes('three counts'), 'allele-freq: short row message');
  await page.fill(R + '.af-in', 'X\t5\t5\t5'); await page.waitForTimeout(400);
  check(await page.isHidden(R + '.af-err') && await page.isVisible(R + '.af-out'), 'allele-freq: recovers');
};
