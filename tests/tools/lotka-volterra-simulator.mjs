// #304 Lotka-Volterra simulator
export const path = '/science/lotka-volterra-simulator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const T = (s) => page.textContent('.lvs ' + s);
  await page.goto(`${BASE}/science/lotka-volterra-simulator/`); await page.waitForTimeout(600);
  check((await T('.lv-big')) === 'At t = 50: prey 15.02, predators 3.359', 'lotka: example predator-prey run');
  { const f = await T('.lv-facts'); check(f.includes('Coexistence at (20, 10)') && f.includes('5.130') && f.includes('5.480') && f.includes('9 prey peaks') && f.includes('5,000 RK4 steps'), 'lotka: example facts'); }
  { const t = await T('.lv-tab'); check(t.includes('1, −1.5saddle') && t.includes('0 ± 1.225icentre'), 'lotka: equilibria and stability'); }
  check(await page.isVisible('.lvs .lv-fig') && await page.isVisible('.lvs .lv-ph'), 'lotka: time and phase-plane charts');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.lvs .lv-csv')]); const f = OUT + 'lv.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 't,Prey,Predators' && rows.length === 1669 && rows[rows.length - 1].startsWith('50,15.0212'), 'lotka: simulation CSV'); }
  await page.fill('.lvs .lv-K', '200'); await page.waitForTimeout(450);
  check((await T('.lv-tab')).includes('−0.05 ± 1.161istable spiral') && (await T('.lv-tab')).includes('Prey only'), 'lotka: prey carrying capacity');
  await page.fill('.lvs .lv-K', '15'); await page.waitForTimeout(450);
  check((await T('.lv-facts')).includes('Predators cannot persist'), 'lotka: predators cannot persist when γ/δ ≥ K');
  await page.fill('.lvs .lv-K', ''); await page.fill('.lvs .lv-dt', '0.1'); await page.waitForTimeout(450);
  check((await T('.lv-facts')).includes('500 RK4 steps of 0.1'), 'lotka: time step option');
  await page.fill('.lvs .lv-dt', '0.0001'); await page.waitForTimeout(450);
  check((await T('.lv-err')).includes('500,000 steps') && await page.isHidden('.lvs .lv-out'), 'lotka: too many steps message');
  await page.fill('.lvs .lv-dt', '0.01'); await page.fill('.lvs .lv-b', '0'); await page.waitForTimeout(450);
  check((await T('.lv-err')).includes('must all be numbers above zero'), 'lotka: bad rate message');
  await page.fill('.lvs .lv-b', '0.1');
  await page.locator('.lvs button[data-m=cp]').scrollIntoViewIfNeeded(); await page.click('.lvs button[data-m=cp]'); await page.waitForTimeout(450);
  check((await T('.lv-big')) === 'At t = 50: species 1 447, species 2 88.14', 'lotka: competition example');
  { const t = await T('.lv-tab'); check(t.includes('448.386.21') && t.includes('stable node') && (await T('.lv-facts')).includes('Stable coexistence'), 'lotka: coexistence equilibrium'); }
  await page.fill('.lvs .lv-a21', '1.2'); await page.waitForTimeout(450);
  check((await T('.lv-facts')).includes('Species 1 wins'), 'lotka: species 1 wins');
  await page.fill('.lvs .lv-a21', '0.7'); await page.fill('.lvs .lv-a12', '1.5'); await page.waitForTimeout(450);
  check((await T('.lv-facts')).includes('Species 2 wins'), 'lotka: species 2 wins');
  await page.fill('.lvs .lv-a21', '1.2'); await page.waitForTimeout(450);
  check((await T('.lv-facts')).includes('Either species can win') && (await T('.lv-tab')).includes('saddle'), 'lotka: founder control');
  await page.fill('.lvs .lv-K1', '-5'); await page.waitForTimeout(450);
  check((await T('.lv-err')).includes('must be above zero'), 'lotka: bad capacity message');
  await page.fill('.lvs .lv-K1', '500'); await page.waitForTimeout(450);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.lvs .dl [data-f=pdf]')]); check((await d.suggestedFilename()) === 'lotka-volterra.pdf', 'lotka: PDF report'); }
};
