// #384 seeding rate calculator
export const path = '/science/seeding-rate-calculator/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  const big = () => page.textContent('.sdr .sd-big'), facts = () => page.textContent('.sdr .sd-facts');
  const cbig = () => page.textContent('.sdr .sd-cbig'), cfacts = () => page.textContent('.sdr .sd-cfacts');
  check((await big()) === 'Sow 164.4 kg/ha (391 seeds/m²)', `seeding: example rate (${await big()})`);
  { const f = await facts(); check(f.includes('76.6 % (pure live seed 90.2 %') && f.includes('70.5 seeds per metre, one every 1.42 cm') && f.includes('4,110 kg of seed') && f.includes('164.4 bags (buy 165)'), 'seeding: example facts'); }
  check((await cbig()) === '2,877,778 plants per ha (287.8 per m²)', `seeding: example stand (${await cbig()})`);
  { const f = await cfacts(); check(f.includes('CV 8.6 %') && f.includes('95.9 % of 3,000,000') && f.includes('73.5 % of the 3,914,609 seeds'), 'seeding: stand against target and establishment'); }
  // Population per hectare, seeds per kg.
  await page.selectOption('.sdr .sd-popu', 'ha'); await page.fill('.sdr .sd-pop', '3000000'); await page.selectOption('.sdr .sd-wu', 'perkg'); await page.fill('.sdr .sd-w', '23809.5238'); await page.waitForTimeout(100);
  check((await big()) === 'Sow 164.4 kg/ha (391 seeds/m²)', 'seeding: per hectare and seeds per kg give the same');
  // Bags by seed count.
  await page.selectOption('.sdr .sd-bagu', 'seeds'); await page.fill('.sdr .sd-bag', '1000000'); await page.waitForTimeout(100);
  check((await facts()).includes('97.9 bags (buy 98)'), 'seeding: bags as seed-count units');
  // US maize-style.
  await page.selectOption('.sdr .sd-u', 'us'); await page.selectOption('.sdr .sd-popu', 'ac'); await page.fill('.sdr .sd-pop', '34000');
  await page.fill('.sdr .sd-g', '95'); await page.fill('.sdr .sd-pu', '99'); await page.fill('.sdr .sd-e', '95'); await page.selectOption('.sdr .sd-wu', 'perlb'); await page.fill('.sdr .sd-w', '1600');
  await page.fill('.sdr .sd-row', '30'); await page.fill('.sdr .sd-area', '160'); await page.selectOption('.sdr .sd-bagu', 'seeds'); await page.fill('.sdr .sd-bag', '80000'); await page.waitForTimeout(100);
  check((await big()) === 'Sow 23.8 lb/ac (38,054 seeds per acre)', `seeding: US units (${await big()})`);
  { const f = await facts(); check(f.includes('2.18 seeds per foot, one every 5.49 in') && f.includes('76.1 bags (buy 77)') && (await page.textContent('.sdr .sd-lrow')).includes('(in;'), 'seeding: US row and bags'); }
  await page.fill('.sdr .sd-len', '17.424'); await page.fill('.sdr .sd-cnt', '33\n35\n34'); await page.waitForTimeout(100);
  check((await cbig()).startsWith('34,000 plants per acre') && (await page.textContent('.sdr .sd-chelp')).includes('17.42 ft of row is 1/1000 acre'), 'seeding: 1/1000 acre row count');
  await page.selectOption('.sdr .sd-cm', 'frame'); await page.fill('.sdr .sd-fr', '10'); await page.fill('.sdr .sd-cnt', '8'); await page.waitForTimeout(100);
  check(await page.isVisible('.sdr .sd-fr') && await page.isHidden('.sdr .sd-len') && (await cbig()).startsWith('34,848 plants per acre') && !(await cfacts()).includes('Spread'), 'seeding: frame count in ft²');
  // Bad input.
  await page.fill('.sdr .sd-cnt', '8 x'); await page.waitForTimeout(100);
  check((await page.textContent('.sdr .sd-cerr')).includes('"x" is not a count'), 'seeding: bad count');
  await page.fill('.sdr .sd-g', '120'); await page.waitForTimeout(100);
  check((await page.textContent('.sdr .sd-err')).includes('percentages above 0') && (await big()) === '', 'seeding: bad germination');
  await page.click('.sdr .sd-ex'); await page.waitForTimeout(100);
  check((await big()) === 'Sow 164.4 kg/ha (391 seeds/m²)' && (await cbig()).startsWith('2,877,778'), 'seeding: example button');
  await page.fill('.sdr .sd-row', ''); await page.waitForTimeout(100);
  check(!(await facts()).includes('In the row') && (await page.textContent('.sdr .sd-cerr')).includes('row spacing above'), 'seeding: broadcast seed');
  await page.click('.sdr .sd-ex'); await page.waitForTimeout(100);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.sdr .dl [data-f=pdf]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'seeding: PDF report'); }
};
