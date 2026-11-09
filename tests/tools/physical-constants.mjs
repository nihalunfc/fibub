// #977 Physical constants
export const path = '/science/physical-constants/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/physical-constants/`); await page.waitForTimeout(600);
  const t = (c) => page.textContent('.pcc ' + c), wait = () => page.waitForTimeout(150), S = ' ';
  check((await t('.pc-big')) === '70 constants, CODATA 2022' && (await page.$$('.pcc .pc-row')).length === 70, 'constants: all 70 listed');
  await page.fill('.pcc .pc-q', 'gravitation'); await wait();
  check((await t('.pc-list')).includes(`6.674${S}30(15) × 10⁻¹¹`) && (await t('.pc-list')).includes('m³ kg⁻¹ s⁻²') && (await t('.pc-list')).includes('2.2 × 10⁻⁵'), 'constants: G with uncertainty and unit');
  await page.click('.pcc .pc-copy'); await page.waitForTimeout(700);
  check((await t('.pc-status')).includes('6.67430e-11'), 'constants: copy the number');
  await page.selectOption('.pcc .pc-cp', 'full'); await wait(); await page.click('.pcc .pc-copy'); await page.waitForTimeout(700);
  check((await t('.pc-status')).includes('6.67430e-11 ± 0.00015e-11 m³ kg⁻¹ s⁻²'), 'constants: copy with uncertainty and unit');
  await page.fill('.pcc .pc-q', 'electron mass'); await wait();
  check((await page.textContent('.pcc .pc-row')).includes(`9.109${S}383${S}7139(28) × 10⁻³¹`) && (await t('.pc-list')).includes('updated since 2018') && (await t('.pc-list')).includes(`1836.152${S}673${S}426(32)`), 'constants: electron mass 2022');
  await page.selectOption('.pcc .pc-ed', '2018'); await wait();
  check((await page.textContent('.pcc .pc-row')).includes(`9.109${S}383${S}7015(28) × 10⁻³¹`) && !(await t('.pc-list')).includes('updated since') && (await t('.pc-big')).endsWith('CODATA 2018'), 'constants: electron mass 2018');
  await page.fill('.pcc .pc-q', 'planck'); await wait();
  check((await t('.pc-list')).includes(`6.626${S}070${S}15 × 10⁻³⁴`) && (await t('.pc-list')).includes(`1.054${S}571${S}817… × 10⁻³⁴`) && (await t('.pc-list')).includes('exact'), 'constants: exact and truncated exact values');
  await page.fill('.pcc .pc-q', ''); await page.selectOption('.pcc .pc-g', 'Adopted values'); await wait();
  check((await t('.pc-big')) === '5 constants, CODATA 2018' && (await t('.pc-list')).includes(`101${S}325`), 'constants: group filter');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pcc .pc-csv')]); const f = OUT + 'pc.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 6 && r[0] === 'quantity,symbol,value,standard_uncertainty,unit,group' && r.some((x) => x.startsWith('Standard atmosphere,atm,101325,exact,Pa')), 'constants: CSV of shown constants'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pcc .dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'codata-2018-constants.pdf', 'constants: PDF table'); }
  await page.selectOption('.pcc .pc-g', ''); await page.fill('.pcc .pc-q', 'qwerty'); await wait();
  check((await t('.pc-big')) === 'No constant matches' && (await page.$$('.pcc .pc-row')).length === 0, 'constants: no match message');
};
