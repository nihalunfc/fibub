// #910 coil field designer
export const path = '/science/coil-field-designer/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/coil-field-designer/`); await page.waitForTimeout(800);
  const big = () => page.textContent('.cfd .cf-big'), facts = () => page.textContent('.cfd .cf-facts');
  check((await big()) === 'B = 0.8992 mT (8.992 gauss) at the centre', 'coil: Helmholtz example centre field');
  { const f = await facts(); check(f.includes('±3.14 cm') && f.includes('radius 3.13 cm') && f.includes('125.7 m') && f.includes('4.30 Ω') && f.includes('4.30 W') && f.includes('1.99 A/mm²'), 'coil: uniform length, sphere, wire, resistance and heat'); }
  check((await facts()).includes('0.8997 mT') && await page.isVisible('.cfd .cf-fig') && await page.isVisible('.cfd .cf-map'), 'coil: probe and both figures');
  await page.fill('.cfd .cf-tgt', '2'); await page.waitForTimeout(300);
  check((await facts()).includes('Current for 2 mT2.224 A'), 'coil: current for a target field');
  await page.selectOption('.cfd .cf-tol', '0.001'); await page.waitForTimeout(300);
  check((await facts()).includes('Uniform to 0.1 % along the axis±1.73 cm'), 'coil: 0.1 % tolerance ' + (await facts()).slice(0, 120));
  await page.selectOption('.cfd .cf-tol', '0.0001'); await page.waitForTimeout(300);
  check((await facts()).includes('Uniform to 100 ppm along the axis'), 'coil: 100 ppm tolerance');
  await page.selectOption('.cfd .cf-tol', '0.01');
  await page.selectOption('.cfd .cf-set', 'maxwell'); await page.waitForTimeout(400);
  check((await big()).startsWith('B = 1.178 mT') && (await facts()).includes('±4.32 cm'), 'coil: Maxwell coil centre field and 1 % length');
  await page.selectOption('.cfd .cf-set', 'anti'); await page.waitForTimeout(400);
  check((await big()) === 'Gradient 0.08059 mT/cm (0.008059 T/m) at the centre' && (await facts()).includes('±2.51 cm'), 'coil: anti-Helmholtz gradient and its uniform length');
  check((await page.textContent('.cfd .cf-leg')).includes('of the largest |B|'), 'coil: gradient map legend');
  await page.selectOption('.cfd .cf-set', 'single'); await page.waitForTimeout(400);
  check((await big()).startsWith('B = 0.6283 mT'), `coil: single coil μ0NI/2R (${await big()})`);
  await page.selectOption('.cfd .cf-set', 'helmholtz'); await page.fill('.cfd .cf-w', '20'); await page.fill('.cfd .cf-d', '10'); await page.waitForTimeout(400);
  check(!(await big()).startsWith('B = 0.8992 mT') && (await big()).startsWith('B = 0.89'), `coil: winding size changes the field slightly (${await big()})`);
  await page.fill('.cfd .cf-w', '0'); await page.fill('.cfd .cf-d', '0');
  await page.selectOption('.cfd .cf-rho', '2.82e-8'); await page.waitForTimeout(300);
  check((await facts()).includes('7.05 Ω'), 'coil: aluminium wire');
  await page.fill('.cfd .cf-dw', '1.6'); await page.waitForTimeout(300);
  check((await facts()).includes('1.76 Ω') && (await facts()).includes('0.497 A/mm²'), 'coil: thicker wire');
  await page.fill('.cfd .cf-pr', '0'); await page.fill('.cfd .cf-pz', '5'); await page.waitForTimeout(300);
  check((await facts()).includes('Probe at r = 0, z = 5 cm'), 'coil: probe moved');
  // Custom coils, prefilled from the Helmholtz pair.
  await page.selectOption('.cfd .cf-set', 'custom'); await page.waitForTimeout(400);
  check((await page.inputValue('.cfd .cf-list')).startsWith('10, −5, 100, 1') && (await big()) === 'B = 0.8992 mT (8.992 gauss) at the centre', 'coil: custom list starts from the Helmholtz pair');
  await page.fill('.cfd .cf-list', '10, -5, 100, 1\n10, 6, 100, 1'); await page.waitForTimeout(400);
  check((await big()).includes('at the centre') && !(await facts()).includes('±3.14 cm'), 'coil: misplaced coil shrinks the uniform region');
  // Downloads
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cfd .cf-csv')]); const f = OUT + 'coil.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 202 && r[0] === 'z_cm,Bz_mT,deviation_from_centre_percent', 'coil: axis profile CSV'); }
  for (const t of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.cfd .dl [data-f=${t}]`)]); check(d.suggestedFilename() === `coil-field.${t}`, `coil: ${t} report`); }
  // Bad input
  await page.fill('.cfd .cf-list', '10, abc, 100, 1'); await page.waitForTimeout(300);
  check((await page.textContent('.cfd .cf-err')).includes('Line 1') && await page.isHidden('.cfd .cf-out'), 'coil: bad custom line message');
  await page.fill('.cfd .cf-list', '10, 0, 0, 1'); await page.waitForTimeout(300);
  check((await page.textContent('.cfd .cf-err')).includes('zero ampere-turns'), 'coil: zero ampere-turns message');
  await page.selectOption('.cfd .cf-set', 'helmholtz'); await page.fill('.cfd .cf-R', '0'); await page.waitForTimeout(300);
  check((await page.textContent('.cfd .cf-err')).includes('radius'), 'coil: bad radius message');
  await page.fill('.cfd .cf-R', '10'); await page.fill('.cfd .cf-I', '0'); await page.waitForTimeout(300);
  check((await page.textContent('.cfd .cf-err')).includes('current'), 'coil: zero current message');
  await page.fill('.cfd .cf-I', '1'); await page.fill('.cfd .cf-tgt', '-3'); await page.waitForTimeout(300);
  check((await page.textContent('.cfd .cf-err')).includes('target field'), 'coil: bad target message');
  await page.fill('.cfd .cf-tgt', ''); await page.fill('.cfd .cf-dw', '0'); await page.waitForTimeout(300);
  check((await page.textContent('.cfd .cf-err')).includes('wire diameter'), 'coil: bad wire message');
};
