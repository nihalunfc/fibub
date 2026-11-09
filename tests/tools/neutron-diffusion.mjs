// #678 one-group diffusion and criticality
export const path = '/science/neutron-diffusion/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/neutron-diffusion/`); await page.waitForTimeout(700);
  const big = () => page.textContent('.ndf .nd-big'), facts = () => page.textContent('.ndf .nd-facts');
  check((await big()) === 'k_eff = 0.99774 (subcritical)', `diffusion: 40 cm sphere (${await big()})`);
  { const t = await facts(); check(t.includes('1.25641') && t.includes('46.154 cm²') && t.includes('0.0056172 cm⁻²') && t.includes('79.41 %') && t.includes('sphere of radius 40.23 cm') && t.includes('272.8\u00a0L') && t.includes('1.917 cm'), 'diffusion: k∞, L², B², non-leakage, critical sphere'); }
  check((await facts()).includes('Numeric check (finite volume)0.99774') && (await facts()).includes('200 cells'), 'diffusion: numeric solve agrees');
  { const t = await page.textContent('.ndf .nd-crit'); check(t.includes('38.31 cm thick') && t.includes('R 36.62 cm, H 73.24 cm') && t.includes('69.17 × 69.17 × 69.17 cm') && t.includes('330.9\u00a0L'), 'diffusion: critical sizes table'); }
  check(await page.isVisible('.ndf .nd-fig') && await page.isVisible('.ndf .nd-kfig'), 'diffusion: flux and k-against-size charts');
  await page.fill('.ndf .nd-R', '41'); await page.waitForTimeout(200);
  check((await big()).endsWith('(supercritical)'), 'diffusion: bigger sphere is supercritical');
  await page.fill('.ndf .nd-R', '40.2319'); await page.waitForTimeout(200);
  check((await big()) === 'k_eff = 1.00000 (critical)', 'diffusion: critical radius gives k = 1');
  await page.selectOption('.ndf .nd-g', 'cylinder'); await page.fill('.ndf .nd-R', '35'); await page.waitForTimeout(200);
  check(await page.isVisible('.ndf .nd-H') && await page.isHidden('.ndf .nd-a') && (await big()).startsWith('k_eff = 0.99663'), `diffusion: cylinder R 35, H 80 (${await big()})`);
  await page.fill('.ndf .nd-H', '0'); await page.waitForTimeout(200);
  check((await facts()).includes('infinitely tall'), 'diffusion: infinite cylinder');
  await page.selectOption('.ndf .nd-g', 'slab'); await page.waitForTimeout(200);
  check((await big()).startsWith('k_eff = 1.13008'), `diffusion: 60 cm slab (${await big()})`);
  await page.selectOption('.ndf .nd-g', 'cuboid'); await page.fill('.ndf .nd-a', '70'); await page.waitForTimeout(200);
  check((await big()).startsWith('k_eff = 1.00748') && (await facts()).includes('Numeric check'), `diffusion: 70 × 60 × 90 box (${await big()})`);
  await page.uncheck('.ndf .nd-ext'); await page.waitForTimeout(200);
  check((await facts()).includes('not used') && !(await big()).startsWith('k_eff = 1.00748'), 'diffusion: without extrapolation distance');
  await page.check('.ndf .nd-ext'); await page.fill('.ndf .nd-n', '50'); await page.waitForTimeout(200);
  check((await facts()).includes('50 cells'), 'diffusion: cell count');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ndf .nd-csv')]); const f = OUT + 'nd.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 51 && rows[0] === 'position_cm,flux_formula,flux_numeric', 'diffusion: flux CSV'); }
  await page.selectOption('.ndf .nd-g', 'sphere'); await page.fill('.ndf .nd-R', '40'); await page.selectOption('.ndf .nd-mode', '2'); await page.waitForTimeout(200);
  check((await big()).startsWith('k_eff = 0.96726') && (await facts()).includes('1.31771') && (await facts()).includes('59.792 cm²') && !(await facts()).includes('Numeric check') && (await facts()).includes('radius 42.7 cm'), `diffusion: two-group (${await big()})`);
  await page.fill('.ndf .nd-sa1', '0.03'); await page.waitForTimeout(200);
  check((await page.textContent('.ndf .nd-err')).includes('smaller than the fast removal'), 'diffusion: two-group bad input message');
  await page.fill('.ndf .nd-sa1', '0.002'); await page.selectOption('.ndf .nd-mode', '1'); await page.fill('.ndf .nd-nsf', '0.018'); await page.waitForTimeout(200);
  check((await facts()).includes('no size of this material can be critical') && (await page.textContent('.ndf .nd-crit')).includes('not possible'), 'diffusion: k∞ below 1');
  await page.fill('.ndf .nd-D', '0'); await page.waitForTimeout(200);
  check((await page.textContent('.ndf .nd-err')).includes('D and Σa above 0') && await page.isHidden('.ndf .nd-out'), 'diffusion: bad material message');
  await page.fill('.ndf .nd-D', '0.9'); await page.fill('.ndf .nd-nsf', '0.0245'); await page.waitForTimeout(200);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ndf .dl [data-f=pdf]')]); const f = OUT + 'nd.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'diffusion: PDF report'); }
};
