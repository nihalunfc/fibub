// #412 Amino acid racemisation age estimator
export const path = '/science/racemisation-age/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  const P = '.aar ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(800);
  check((await page.textContent(P + '.aa-big')) === '21,600 ± 5,850 years', 'aar: example age');
  check((await page.textContent(P + '.aa-sub')).includes('Monte Carlo (20,000 draws): median 21,600 years, 68 % range 16,500 to 28,400, 95 % range 12,500 to 37,600'), 'aar: Monte Carlo ranges');
  { const f = await page.textContent(P + '.aa-facts'); check(f.includes('k at 12 °C (calibrated)2.284 × 10⁻⁵ per year') && f.includes('k at 10 °C (your sample)1.598 × 10⁻⁵') && f.includes('Equilibrium D/L (1/K′)1'), 'aar: rate constants'); }
  check((await page.textContent(P + '.aa-btab tr:nth-child(2)')).startsWith('Sample temperature10144.3 %') && (await page.textContent(P + '.aa-btab tr:nth-child(3)')).includes('Calibration temperature'), 'aar: temperature dominates the budget');
  check(await page.isVisible(P + '.aa-cfig') && await page.isVisible(P + '.aa-hfig'), 'aar: curve and Monte Carlo figures');
  await page.fill(P + '.aa-v-Ts', '12'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.aa-big')) === '15,100 ± 4,040 years', 'aar: same temperature as calibration');
  await page.fill(P + '.aa-v-Ts', '10');
  await page.selectOption(P + '.aa-mode', 'k'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.aa-big')) === '24,700 ± 5,400 years' && await page.isVisible(P + '.aa-v-k') && await page.isHidden(P + '.aa-v-rCal'), 'aar: known k');
  await page.selectOption(P + '.aa-mc', '0'); await page.waitForTimeout(300);
  check(await page.isHidden(P + '.aa-hfig') && (await page.textContent(P + '.aa-sub')).includes('Turn on Monte Carlo'), 'aar: Monte Carlo off');
  await page.selectOption(P + '.aa-kp', '0.77'); await page.waitForTimeout(300);
  check((await page.textContent(P + '.aa-facts')).includes('Equilibrium D/L (1/K′)1.299'), "aar: isoleucine K'");
  await page.selectOption(P + '.aa-kp', 'other'); await page.fill(P + '.aa-kpv', '2'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.aa-err')).includes('below the equilibrium ratio 1/K\' = 0.5') || (await page.textContent(P + '.aa-facts')).includes('0.5'), "aar: other K'");
  await page.fill(P + '.aa-kpv', '1'); await page.selectOption(P + '.aa-mode', 'cal'); await page.selectOption(P + '.aa-mc', '20000'); await page.waitForTimeout(500);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.aa-csv')]); const f = OUT + 'aa.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r[0] === 'quantity,value,uncertainty_or_range,share_of_age_variance' && r[1].startsWith('age_years,21623.133,5850.027') && r.some((l) => l.startsWith('mc_draws,20000')) && r.some((l) => l.startsWith('Ts,10,1,0.44')), 'aar: summary CSV'); }
  // Bad input.
  await page.fill(P + '.aa-v-r', '0.01'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.aa-err')).includes('above the D/L at time zero') && await page.isHidden(P + '.aa-out'), 'aar: ratio below time zero message');
  await page.fill(P + '.aa-v-r', '1.2'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.aa-err')).includes('below the equilibrium'), 'aar: ratio above equilibrium message');
  await page.fill(P + '.aa-v-r', '0.35'); await page.fill(P + '.aa-u-Ea', '-1'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.aa-err')).includes('uncertainty of 0 or more'), 'aar: negative uncertainty message');
  await page.fill(P + '.aa-u-Ea', '10'); await page.fill(P + '.aa-v-tCal', 'abc'); await page.waitForTimeout(500);
  check((await page.textContent(P + '.aa-err')).includes('type a number'), 'aar: not a number message');
  await page.fill(P + '.aa-v-tCal', '8000'); await page.waitForTimeout(500);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(P + '.dl [data-f=pdf]')]); const f = OUT + 'aa.pdf'; await d.saveAs(f); check(readFileSync(f).slice(0, 5).toString() === '%PDF-', 'aar: PDF report'); }
};
