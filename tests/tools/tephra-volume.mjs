// #887 tephra volume from isopachs
export const path = '/science/tephra-volume/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/tephra-volume/`); await page.waitForTimeout(800);
  const t = (c) => page.textContent('.tpv ' + c);
  check((await t('.tv-big')) === '0.0485 km³ (exponential, 2 segments): VEI 3', 'tephra: example volume and VEI');
  { const tab = await t('.tv-tab'); check(tab.includes('Power law0.090') && tab.includes('Weibull0.0500') && tab.includes('4.85 × 10¹⁰') && tab.includes('0.0194'), 'tephra: table of models, mass and DRE'); }
  { const f = await t('.tv-facts'); check(f.includes('8.73 km') && f.includes('isopachs 1–4') && f.includes('bt = 1.15 km') && f.includes('n 1.09'), 'tephra: segment facts'); }
  check(await page.isVisible('.tpv .tv-fig'), 'tephra: plot');
  await page.selectOption('.tpv .tv-ns', '1'); await page.waitForTimeout(300);
  check((await t('.tv-big')) === '0.0514 km³ (exponential, 1 segment): VEI 3', 'tephra: one segment (Pyle)');
  await page.selectOption('.tpv .tv-ns', '3'); await page.waitForTimeout(300);
  check((await t('.tv-big')).startsWith('0.0532 km³'), 'tephra: three segments');
  await page.fill('.tpv .tv-C', '50'); await page.waitForTimeout(300);
  check(!(await t('.tv-tab')).includes('Power law0.090'), 'tephra: power-law limits change its volume');
  await page.fill('.tpv .tv-C', '0.5'); await page.waitForTimeout(300);
  check((await t('.tv-err')).includes('0 < B < C'), 'tephra: bad limits message');
  await page.fill('.tpv .tv-C', '300'); await page.selectOption('.tpv .tv-tu', '1e-3'); await page.waitForTimeout(300);
  check((await t('.tv-big')).startsWith('5.32 km³') && (await t('.tv-big')).includes('VEI 5'), 'tephra: thickness in metres');
  await page.selectOption('.tpv .tv-tu', '1e-5'); await page.selectOption('.tpv .tv-ns', '2'); await page.waitForTimeout(300);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.tpv .tv-csv')]); const f = OUT + 'tv.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 4 && rows[0] === 'model,bulk_km3,bulk_m3,VEI,mass_kg,DRE_km3' && rows[1].startsWith('"Exponential, 2 segments",0.0484901,4.84901e+7,3'), 'tephra: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.tpv .tv-out > .dl:last-child [data-f=docx]')]); const f = OUT + 'tv.docx'; await d.saveAs(f); check(readFileSync(f).subarray(0, 2).toString() === 'PK', 'tephra: Word report'); }
  await page.fill('.tpv .tv-in', '10 1\n5 4\n3 9\n2 25\n1 64'); await page.waitForTimeout(600);
  check((await t('.tv-big')).includes('VEI') && (await t('.tv-facts')).includes('Exponential segment 2'), 'tephra: typed data');
  await page.fill('.tpv .tv-in', '10 1\n5 4\n2 9'); await page.waitForTimeout(600);
  check((await t('.tv-err')).includes('need at least 4 isopachs'), 'tephra: too few isopachs for 2 segments');
  await page.fill('.tpv .tv-in', '10 1\n5 -4\n2 9'); await page.waitForTimeout(600);
  check((await t('.tv-err')).includes('above zero') && await page.isHidden('.tpv .tv-out'), 'tephra: negative area message');
  await page.fill('.tpv .tv-in', '1 1\n2 4\n4 9\n8 16'); await page.selectOption('.tpv .tv-ns', '1'); await page.waitForTimeout(600);
  check((await t('.tv-big')).startsWith('No exponential volume'), 'tephra: thickening deposit has no exponential volume');
};
