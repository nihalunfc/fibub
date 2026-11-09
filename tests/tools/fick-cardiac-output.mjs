// #343 Fick cardiac output, diffusion and Poiseuille
export const path = '/science/fick-cardiac-output/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.fck ';
  const t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/science/fick-cardiac-output/`); await page.waitForTimeout(500);
  check((await t('.fk-big')) === 'Cardiac output = 5.22 L/min', 'fick: example cardiac output');
  { const f = await t('.fk-facts'); check(f.includes('19.99 mL/dL') && f.includes('15.20 mL/dL') && f.includes('4.79 mL/dL') && f.includes('74.5 mL') && f.includes('1043 mL/min') && f.includes('24 %'), 'fick: example contents, stroke volume, delivery, extraction'); }
  check((await page.textContent('main')).includes('not for clinical use'), 'fick: study and teaching note');
  await page.fill(R + '.fk-bsa', '1.9'); await page.waitForTimeout(150);
  check((await t('.fk-facts')).includes('2.74 L/min/m²'), 'fick: cardiac index with body surface area');
  await page.selectOption(R + '.fk-pu', 'kPa'); await page.waitForTimeout(150);
  check((await page.inputValue(R + '.fk-pa')) === '12.7' && (await t('.fk-big')).startsWith('Cardiac output = 5.2'), 'fick: PO₂ switched to kPa');
  await page.selectOption(R + '.fk-huf', '1.39'); await page.waitForTimeout(150);
  check((await t('.fk-facts')).includes('20.7') , 'fick: Hüfner factor 1.39');
  await page.fill(R + '.fk-sv', '99'); await page.waitForTimeout(150);
  check((await t('.fk-err')).includes('must be higher than venous') && await page.isHidden(R + '.fk-out'), 'fick: venous above arterial message');
  await page.fill(R + '.fk-sv', '75'); await page.fill(R + '.fk-hr', ''); await page.waitForTimeout(150);
  check(!(await t('.fk-facts')).includes('Stroke volume'), 'fick: heart rate optional');
  { const f = await t('.fd-facts'); check(f.includes('20 nmol/s') && f.includes('0.250 ms'), 'fick: diffusion example'); }
  await page.fill(R + '.fd-x', '2'); await page.waitForTimeout(150);
  check((await t('.fd-facts')).includes('10 nmol/s'), 'fick: double thickness halves the rate');
  await page.fill(R + '.fd-D', 'abc'); await page.waitForTimeout(150);
  check((await t('.fd-err')).includes('diffusion coefficient'), 'fick: bad diffusion input message');
  await page.fill(R + '.fd-D', '2e-5');
  { const f = await t('.fp-facts'); check(f.includes('7.573 mL/s') && f.includes('107.1 cm/s') && f.includes('973.4') && f.includes('laminar'), 'fick: Poiseuille example'); }
  await page.fill(R + '.fp-r', '3'); await page.waitForTimeout(150);
  check((await t('.fp-facts')).includes('121.2 mL/s') && (await t('.fp-facts')).includes('turbulent'), 'fick: doubled radius, 16 times the flow, turbulence warning');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fk-csv')]); const f = OUT + 'fick.csv'; await d.saveAs(f); const c = readFileSync(f, 'utf8'); check(c.startsWith('Quantity,Value') && c.includes('Cardiac output (L/min),') && c.includes('Diffusion rate (mol/s),1e-8') && c.includes('Flow (mL/s),121.166'), 'fick: CSV download'); }
  await page.fill(R + '.fp-eta', '0'); await page.waitForTimeout(150);
  check((await t('.fp-err')).includes('viscosity') && await page.isHidden(R + '.fp-out'), 'fick: bad viscosity message');
};
