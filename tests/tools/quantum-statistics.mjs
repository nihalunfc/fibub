// #921 quantum statistics plotter
export const path = '/science/quantum-statistics/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/quantum-statistics/`); await page.waitForTimeout(600);
  const facts = () => page.textContent('.qst .qs-facts'), gf = () => page.textContent('.qst .qs-gfacts'), gb = () => page.textContent('.qst .qs-gbig');
  check((await page.textContent('.qst .qs-big')) === 'kT = 0.02585 eV; at E − μ = 0.05 eV (1.934 kT)', 'quantum: example kT and reading');
  { const f = await facts(); check(f.includes('0.1446') && f.includes('0.1263') && f.includes('0.169'), 'quantum: example occupancies'); }
  check(await page.isVisible('.qst .qs-f1') && await page.isVisible('.qst .qs-f2') && await page.isVisible('.qst .qs-f3'), 'quantum: three charts');
  await page.fill('.qst .qs-E', '-0.05'); await page.waitForTimeout(100);
  check((await facts()).includes('Bose-Einstein needs E > μ') && (await facts()).includes('0.8737'), 'quantum: below μ, Bose-Einstein undefined, Fermi-Dirac above ½');
  await page.uncheck('.qst .qs-sbe'); await page.waitForTimeout(100);
  check(!(await facts()).includes('Bose-Einstein'), 'quantum: hide a distribution');
  await page.selectOption('.qst .qs-u', '0.001'); await page.fill('.qst .qs-e0', '-100'); await page.fill('.qst .qs-e1', '200'); await page.fill('.qst .qs-E', '50'); await page.waitForTimeout(100);
  check((await page.textContent('.qst .qs-big')).startsWith('kT = 25.85 meV') && (await facts()).includes('0.1263'), 'quantum: meV unit');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.qst .qs-csv')]); const f = OUT + 'qs.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 402 && rows[0].startsWith('E (meV),x = (E-mu)/kT,Maxwell-Boltzmann'), 'quantum: occupancies CSV'); }
  await page.fill('.qst .qs-e1', '-200'); await page.waitForTimeout(100);
  check((await page.textContent('.qst .qs-err')).includes('energy range') && await page.isHidden('.qst .qs-out'), 'quantum: bad range message');
  await page.fill('.qst .qs-e1', '200'); await page.uncheck('.qst .qs-smb'); await page.uncheck('.qst .qs-sfd'); await page.waitForTimeout(100);
  check((await page.textContent('.qst .qs-err')).includes('Tick at least one'), 'quantum: nothing ticked message');
  check((await gb()) === 'μ = 7.049 eV (272.7 kT)', 'quantum: example electron gas chemical potential');
  { const f = await gf(); check(f.includes('4.303 nm') && f.includes('0.2274 nm') && f.includes('3387') && f.includes('4.230 eV') && f.includes('3.84 × 10¹⁰ Pa') && f.includes('81804 K'), 'quantum: electron gas wavelength, degeneracy, energy, pressure, TF'); }
  await page.selectOption('.qst .qs-p', 'rb87'); await page.fill('.qst .qs-n', '1e20'); await page.fill('.qst .qs-gT', '2e-7'); await page.waitForTimeout(150);
  check((await gb()) === 'μ = 0: 64.4 % of the atoms are in the condensate' && (await gf()).includes('398.3 nK'), 'quantum: rubidium-87 condensate');
  await page.fill('.qst .qs-gT', '1e-6'); await page.waitForTimeout(150);
  check((await gb()).startsWith('μ = ') && (await gb()).includes('−0.6548 kT'), 'quantum: rubidium above Tc');
  await page.selectOption('.qst .qs-st', 'mb'); await page.waitForTimeout(150);
  check((await gf()).includes('1.5 kT') && !(await gf()).includes('Classical chemical potential'), 'quantum: classical statistics');
  await page.fill('.qst .qs-m', '4'); await page.waitForTimeout(100);
  check((await page.inputValue('.qst .qs-p')) === 'custom', 'quantum: typed mass switches to Other');
  for (const fm of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.qst .dl button[data-f=${fm}]`)]); check(d.suggestedFilename() === `quantum-statistics.${fm}`, `quantum: ${fm} download`); }
  await page.fill('.qst .qs-g', '1.5'); await page.waitForTimeout(100);
  check((await page.textContent('.qst .qs-gerr')).includes('whole number') && await page.isHidden('.qst .qs-gout'), 'quantum: bad degeneracy message');
};
