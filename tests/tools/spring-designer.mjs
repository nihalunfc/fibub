// #644 spring designer
export const path = '/science/spring-designer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/science/spring-designer/`); await page.waitForTimeout(500);
  const R = '.spd', t = (c) => page.textContent(`${R} ${c}`);
  check((await t('.sp-big')) === 'Rate 2.469 N/mm; 30 N compresses it 12.15 mm', `spring: compression example (${await t('.sp-big')})`);
  { const f = await t('.sp-facts'); check(f.includes('Wahl factor Kw = 1.145') && f.includes('218.6 MPa') && f.includes('20 mm') && f.includes('force to solid 74.06 N') && f.includes('539.8 MPa') && f.includes('factor 1.11: safe to close solid') && f.includes('2.63 D / α = 105.2 mm') && f.includes('223.1 Hz'), 'spring: compression facts'); }
  check(await page.isVisible(`${R} .sp-fig`) && await page.isHidden(`${R} .sp-warn`), 'spring: chart, no warnings');
  await page.selectOption(`${R} .sp-by`, 'y'); await page.fill(`${R} .sp-y`, '10'); await page.waitForTimeout(100);
  check((await t('.sp-big')) === 'Rate 2.469 N/mm; 24.69 N compresses it 10 mm', 'spring: by deflection');
  await page.fill(`${R} .sp-y`, '35'); await page.waitForTimeout(100);
  check((await t('.sp-warn')).includes('goes solid'), 'spring: travel past solid warned');
  await page.selectOption(`${R} .sp-ends`, 'plain'); await page.fill(`${R} .sp-y`, '10'); await page.waitForTimeout(100);
  check((await t('.sp-facts')).includes('18 mm') && (await t('.sp-facts')).includes('8 total coils'), 'spring: plain ends');
  await page.fill(`${R} .sp-L0`, '120'); await page.selectOption(`${R} .sp-alpha`, '2'); await page.waitForTimeout(100);
  check((await t('.sp-facts')).includes('may buckle'), 'spring: buckling');
  await page.fill(`${R} .sp-L0`, '15'); await page.waitForTimeout(100);
  check((await t('.sp-err')).includes('more than the solid height') && await page.isHidden(`${R} .sp-out`), 'spring: free length below solid');
  // Extension.
  await page.click(`${R} .sp-type button[data-t=ext]`); await page.waitForTimeout(100);
  check((await t('.sp-big')) === 'Rate 1.419 N/mm; 25 N stretches it 14.1 mm' && (await t('.sp-facts')).includes('20.39') && (await t('.sp-facts')).includes('513.3 MPa') && (await t('.sp-facts')).includes('268 MPa'), `spring: extension example (${await t('.sp-big')})`);
  await page.fill(`${R} .sp-Fe`, '3'); await page.waitForTimeout(100);
  check((await t('.sp-err')).includes('initial tension'), 'spring: force below initial tension');
  await page.fill(`${R} .sp-Fe`, '25');
  // Torsion.
  await page.click(`${R} .sp-type button[data-t=tor]`); await page.waitForTimeout(100);
  check((await t('.sp-big')) === 'Rate 8.167 N·mm per degree; 500 N·mm turns it 61.22°' && (await t('.sp-facts')).includes('2940 N·mm per turn') && (await t('.sp-facts')).includes('702 MPa'), `spring: torsion example (${await t('.sp-big')})`);
  check(await page.isHidden(`${R} .sp-G`) && await page.isVisible(`${R} .sp-E`) && await page.isVisible(`${R} .sp-l1`), 'spring: torsion fields');
  await page.fill(`${R} .sp-sig`, '500'); await page.waitForTimeout(100);
  check((await t('.sp-warn')).includes('above the allowed'), 'spring: overstress warning');
  await page.fill(`${R} .sp-D`, '6'); await page.waitForTimeout(100);
  check((await t('.sp-warn')).includes('below 4'), 'spring: low index warning');
  await page.fill(`${R} .sp-D`, '16');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R} .dl button[data-f=pdf]`)]); check((await d.suggestedFilename()) === 'spring.pdf', 'spring: PDF report'); }
  await page.fill(`${R} .sp-d`, '0'); await page.waitForTimeout(100);
  check((await t('.sp-err')).includes('wire diameter'), 'spring: bad wire');
};
