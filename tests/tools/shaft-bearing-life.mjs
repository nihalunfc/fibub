// #645 shaft and bearing life
export const path = '/science/shaft-bearing-life/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/science/shaft-bearing-life/`); await page.waitForTimeout(500);
  const R = '.sbl', t = (c) => page.textContent(`${R} ${c}`);
  check((await t('.sb-big')) === 'L10 life 4390 hours; 2717 hours at 95 % reliability', `bearing: example life (${await t('.sb-big')})`);
  { const f = await t('.sb-facts'); check(f.includes('4.404 kN') && f.includes('> e') && f.includes('316.1 million') && f.includes('0.6189') && f.includes('195.6 million'), 'bearing: equivalent load, L10, a1'); }
  await page.selectOption(`${R} .sb-mode`, 'C'); await page.waitForTimeout(100);
  check((await t('.sb-big')) === 'Choose a bearing with C of at least 58.36 kN', `bearing: C for 20000 h (${await t('.sb-big')})`);
  await page.selectOption(`${R} .sb-mode`, 'L'); await page.fill(`${R} .sb-fa`, '0.5'); await page.selectOption(`${R} .sb-p`, '3.3333333333'); await page.fill(`${R} .sb-R`, '90'); await page.waitForTimeout(100);
  { const P = 1.2 * 3.5, h = (30 / P) ** (10 / 3) * 1e6 / 72000; check((await t('.sb-facts')).includes('≤ e, so P = fa Fr') && (await t('.sb-big')).startsWith(`L10 life ${+h.toPrecision(4)} hours`), `bearing: roller, below e, 90 % (${await t('.sb-big')})`); }
  await page.fill(`${R} .sb-R`, '100'); await page.waitForTimeout(100);
  check((await t('.sb-err')).includes('reliability') && await page.isHidden(`${R} .sb-out`), 'bearing: bad reliability');
  await page.fill(`${R} .sb-R`, '95');
  // Shaft.
  check((await t('.sh-big')) === 'Fatigue (DE-Goodman) diameter 28 mm for n = 1.5', `shaft: example diameter (${await t('.sh-big')})`);
  { const f = await t('.sh-facts'); check(f.includes('σa′ 118.3, σm′ 72.32 MPa') && f.includes('n = 4.04') && f.includes('17.08 mm (von Mises), 17.37 mm (max shear)'), 'shaft: stresses, yield, static diameters'); }
  check(await page.isVisible(`${R} .sh-fig`) && await page.isVisible(`${R} .sb-fig`), 'shaft: both charts');
  await page.selectOption(`${R} .sh-mode`, 'n'); await page.waitForTimeout(100);
  check((await t('.sh-big')) === 'Fatigue safety factor 1.84 at 30 mm', `shaft: factor at 30 mm (${await t('.sh-big')})`);
  await page.fill(`${R} .sh-d`, '10'); await page.waitForTimeout(100);
  check((await t('.sh-facts')).includes('yields on the first cycle'), 'shaft: yield warning at 10 mm');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .dl button[data-f=docx]`)]); check((await d.suggestedFilename()) === 'shaft-bearing.docx', 'shaft: Word report'); }
  await page.fill(`${R} .sh-sy`, '900'); await page.waitForTimeout(100);
  check((await t('.sh-err')).includes('cannot be above'), 'shaft: Sy above Sut');
  await page.fill(`${R} .sh-sy`, '560'); await page.fill(`${R} .sh-kf`, '0.5'); await page.waitForTimeout(100);
  check((await t('.sh-err')).includes('1 or more'), 'shaft: Kf below 1');
};
