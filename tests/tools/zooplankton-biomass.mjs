// #333 Zooplankton biomass
export const path = '/science/zooplankton-biomass/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/zooplankton-biomass/`); await page.waitForTimeout(700);
  const big = () => page.textContent('.zpb .zp-big'), facts = () => page.textContent('.zpb .zp-facts'), tab = () => page.textContent('.zpb .zp-tab');
  check((await big()) === '3,192 ind/m³; biomass 7,433 µg/m³', 'zooplankton: example totals');
  { const f = await facts(); check(f.includes('1.767 m³') && f.includes('counts are multiplied by 8') && f.includes('3.19 ind/L') && f.includes('7.43 mg/m³'), 'zooplankton: example volume, share, per litre, mg'); }
  { const t = await tab(); check(t.includes('Calanoid copepods21296068105.094,889') && t.includes('Nauplii964350––––'), 'zooplankton: example taxon table'); }
  check((await page.textContent('.zpb .zp-warn')).includes('No lengths for Nauplii'), 'zooplankton: missing lengths warning');
  await page.selectOption('.zpb .zp-vmode', 'flow'); await page.waitForTimeout(400);
  check(await page.isVisible('.zpb .zp-rev') && await page.isHidden('.zpb .zp-eff') && (await facts()).includes('9.45 m from the flowmeter'), 'zooplankton: flowmeter volume');
  await page.selectOption('.zpb .zp-vmode', 'direct'); await page.fill('.zpb .zp-vol', '2'); await page.waitForTimeout(400);
  check((await facts()).includes('2 m³as given') && (await tab()).includes('848'), 'zooplankton: volume typed directly');
  await page.fill('.zpb .zp-frac', '12.5 %'); await page.waitForTimeout(400);
  check((await tab()).includes('848'), 'zooplankton: share as a percentage');
  await page.fill('.zpb .zp-frac', '2'); await page.waitForTimeout(400);
  check((await page.textContent('.zpb .zp-err')).includes('share of the sample counted') && await page.isHidden('.zpb .zp-out'), 'zooplankton: bad share message');
  await page.fill('.zpb .zp-frac', '1'); await page.selectOption('.zpb .zp-form', 'power'); await page.fill('.zpb .zp-taxa', 'taxon,count,a,b\nCopepods,10,0.000002,3\nOthers,5,0.001,2'); await page.fill('.zpb .zp-lens', 'copepods,1000\nCOPEPODS,2000\nStrays,50'); await page.selectOption('.zpb .zp-mu', 'mg'); await page.selectOption('.zpb .zp-lu', 'mm'); await page.waitForTimeout(500);
  // Copepods: density 5/m³; masses 2000 and 16000 mg, mean 9000; biomass 45000 mg/m³.
  check((await big()) === '7.50 ind/m³; biomass 45,000 mg/m³' && (await page.textContent('.zpb .zp-warn')).includes('Lengths for Strays have no row') && (await tab()).includes('Mean length (mm)'), 'zooplankton: power form, names matched ignoring capitals, units');
  await page.selectOption('.zpb .zp-form', 'log10'); await page.fill('.zpb .zp-taxa', 'Copepods,10,-1,2'); await page.fill('.zpb .zp-lens', 'Copepods,10'); await page.waitForTimeout(400);
  check((await big()) === '5 ind/m³; biomass 50 mg/m³', 'zooplankton: log10 form');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.zpb .zp-csv')]); const f = OUT + 'zoo.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 7 && rows[0].startsWith('Taxon,Count,Density') && rows[1].startsWith('Copepods,10,5,1,10,10,50,1') && rows[6].endsWith(',50'), 'zooplankton: CSV download'); }
  await page.fill('.zpb .zp-taxa', 'Copepods,10,x,2'); await page.waitForTimeout(400);
  check((await page.textContent('.zpb .zp-err')).includes('give the a and b'), 'zooplankton: missing equation message');
  await page.fill('.zpb .zp-taxa', 'Copepods,10,1,2\ncopepods,3,1,2'); await page.waitForTimeout(400);
  check((await page.textContent('.zpb .zp-err')).includes('only once'), 'zooplankton: repeated taxon message');
  await page.selectOption('.zpb .zp-vmode', 'net'); await page.fill('.zpb .zp-eff', '150'); await page.waitForTimeout(400);
  check((await page.textContent('.zpb .zp-err')).includes('efficiency from 1 to 100'), 'zooplankton: bad efficiency message');
};
