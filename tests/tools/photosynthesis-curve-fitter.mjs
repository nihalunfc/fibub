// #325 Photosynthesis curve fitter
export const path = '/science/photosynthesis-curve-fitter/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/photosynthesis-curve-fitter/`); await page.waitForTimeout(800);
  const lf = () => page.textContent('.psc .ps-lfacts'), af = () => page.textContent('.psc .ps-afacts');
  check((await page.textContent('.psc .ps-lbig')) === 'Amax 21.8 µmol m⁻² s⁻¹, Rd 1.55', 'photosynthesis: light example headline');
  { const f = await lf(); check(f.includes('21.81 µmol') && f.includes('0.0522 mol mol⁻¹') && f.includes('0.789') && f.includes('30.2 µmol') && f.includes('1159 µmol') && f.includes('417.6'), 'photosynthesis: light example facts'); }
  await page.selectOption('.psc .ps-sat', '0.75'); await page.waitForTimeout(400);
  check((await lf()).includes('Light saturation (75 %)'), 'photosynthesis: saturation share');
  await page.selectOption('.psc .ps-th', 'fix'); await page.waitForTimeout(400);
  check((await page.textContent('.psc .ps-lbig')) === 'Amax 22.5 µmol m⁻² s⁻¹, Rd 1.71' && (await lf()).includes('fixed'), 'photosynthesis: θ fixed at 0.7');
  await page.fill('.psc .ps-thv', '1.5'); await page.waitForTimeout(400);
  check((await page.textContent('.psc .ps-lerr')).includes('from 0 to 1'), 'photosynthesis: bad θ message');
  await page.selectOption('.psc .ps-th', 'fit'); await page.waitForTimeout(400);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.psc .ps-lcsv')]); const f = OUT + 'light.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[1].startsWith('Amax,21.812') && rows.length === 22, 'photosynthesis: light CSV'); }
  await page.fill('.psc .ps-ldata', '0\t1\n100\t2'); await page.waitForTimeout(400);
  check((await page.textContent('.psc .ps-lerr')).includes('at least 5 light levels') && await page.isHidden('.psc .ps-lout'), 'photosynthesis: too few light points');
  // A/Ci
  check((await page.textContent('.psc .ps-abig')) === 'Vcmax 68.7, J 129, Rd 1.14 µmol m⁻² s⁻¹', 'photosynthesis: A/Ci example headline');
  { const f = await af(); check(f.includes('68.65') && f.includes('128.6') && f.includes('144 µmol') && f.includes('464.5 µmol mol⁻¹') && f.includes('7 points Rubisco-limited, 5 RuBP-limited'), 'photosynthesis: A/Ci example facts'); }
  check((await page.textContent('.psc .ps-atab')).includes('RuBP') && (await page.textContent('.psc .ps-atab')).includes('Rubisco'), 'photosynthesis: limitation table');
  await page.selectOption('.psc .ps-je', '4.5,10.5'); await page.waitForTimeout(400);
  check((await af()).includes('146.5'), 'photosynthesis: 4.5/10.5 electron requirement');
  await page.selectOption('.psc .ps-je', '4,8'); await page.selectOption('.psc .ps-split', 'ci'); await page.fill('.psc .ps-splitv', '350'); await page.waitForTimeout(400);
  check((await af()).includes('6 points Rubisco-limited'), 'photosynthesis: split set by Ci');
  await page.fill('.psc .ps-splitv', '20000'); await page.waitForTimeout(400);
  check((await page.textContent('.psc .ps-aerr')).includes('two points fall on each side'), 'photosynthesis: bad split message');
  await page.selectOption('.psc .ps-split', 'auto'); await page.fill('.psc .ps-kc', '300'); await page.waitForTimeout(400);
  check(!(await af()).includes('68.65'), 'photosynthesis: editing Kc changes Vcmax');
  await page.fill('.psc .ps-kc', '404.9'); await page.fill('.psc .ps-ppfd', ''); await page.waitForTimeout(400);
  check((await af()).includes('give the light during the curve'), 'photosynthesis: no PPFD, no Jmax');
  await page.fill('.psc .ps-ppfd', '200'); await page.waitForTimeout(400);
  check((await af()).includes('J is too high for this light'), 'photosynthesis: impossible Jmax message');
  await page.fill('.psc .ps-ppfd', '1500'); await page.waitForTimeout(400);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.psc .ps-acsv')]); const f = OUT + 'aci.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[1].startsWith('Vcmax,68.65') && rows[11] === 'Ci,A measured,A fitted,Residual,Limited by' && rows.length === 24, 'photosynthesis: A/Ci CSV'); }
  await page.fill('.psc .ps-adata', '30\t1\n100\t3\n200\t5\n300\t6\n400\t7'); await page.waitForTimeout(400);
  check((await page.textContent('.psc .ps-aerr')).includes('above Γ*'), 'photosynthesis: Ci below Γ* message');
};
