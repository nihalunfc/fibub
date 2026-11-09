// #850 laminate calculator
export const path = '/science/laminate-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.lmc ', t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/science/laminate-calculator/`); await page.waitForTimeout(500);
  { const f = await t('.lmc-ply'); check(f.includes('46.40 GPa') && f.includes('15.02 GPa') && f.includes('Reuss gives 8.178 GPa') && f.includes('4.493 GPa') && f.includes('Reuss gives 3.051 GPa') && f.includes('0.2600'), 'laminate: rule of mixtures and Halpin-Tsai ply (matches numpy)'); }
  check((await t('.lmc-plies')).startsWith('8 plies, 1 mm thick: 0° / 45° / −45° / 90° / 90° / −45° / 45° / 0°') && (await t('.lmc-plies')).includes('Symmetric') && (await t('.lmc-plies')).includes('Balanced'), 'laminate: stacking parsed, symmetric and balanced');
  { const f = await t('.lmc-eff'); check(f.includes('24.03 GPa') && f.includes('9.098 GPa') && f.includes('0.3209') && f.includes('33.37 GPa'), 'laminate: effective moduli of the quasi-isotropic example'); }
  check((await t('.lmc-abd')).includes('26793') && (await page.locator(R + '.lmc-abd tbody tr').count()) === 6, 'laminate: ABD table');
  check((await page.locator(R + '.lmc-q tbody tr').count()) === 5 && (await t('.lmc-q')).includes('Q-bar at −45°'), 'laminate: Q and Q-bar for each angle');
  check((await t('.lmc-big')) === 'First ply fails at 1.249 × these loads (Tsai-Wu)', 'laminate: Tsai-Wu first-ply failure ratio');
  { const f = await t('.lmc-fpf'); check(f.includes('ply 4 (90°), bottom face') && f.includes('Nx = 49.94') && f.includes('1.281') && f.includes('transverse tension') && f.includes('1664, −534'), 'laminate: failure facts and mid-plane strains'); }
  check((await page.locator(R + '.lmc-tab tbody tr').count()) === 16 && (await t('.lmc-tab')).includes('23.43') && (await t('.lmc-tab')).includes('12.84'), 'laminate: ply table');
  check(await page.isVisible(R + '.lmc-fig'), 'laminate: through-thickness plot');
  for (const o of ['xy', 'eps', '12']) { await page.selectOption(R + '.lmc-plot', o); await page.waitForTimeout(80); }
  check(await page.isVisible(R + '.lmc-fig'), 'laminate: plot options');
  // Reuss model.
  await page.selectOption(R + '.lmc-model', 'reuss'); await page.waitForTimeout(100);
  check((await t('.lmc-ply')).includes('8.178 GPa') && (await t('.lmc-ply')).includes('Halpin-Tsai gives 15.02 GPa'), 'laminate: Reuss model');
  // Typed ply, unsymmetric stack with moment: matches numpy case.
  await page.click(R + '.lmc-mode button[data-m=ply]'); await page.waitForTimeout(100);
  await page.fill(R + '.lmc-stack', '0/90'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.lmc-e1') && (await t('.lmc-plies')).includes('Not symmetric'), 'laminate: typed ply properties, unsymmetric stack');
  await page.fill(R + '.lmc-stack', '[±30]'); await page.waitForTimeout(100);
  check((await t('.lmc-plies')).includes('Not symmetric') && (await t('.lmc-plies')).includes('Balanced'), 'laminate: antisymmetric angle-ply is balanced but not symmetric');
  await page.fill(R + '.lmc-stack', '0/90/0'); await page.fill(R + '.lmc-nx', '0'); await page.fill(R + '.lmc-mx', '10'); await page.waitForTimeout(100);
  check((await t('.lmc-fpf')).includes('Mx = '), 'laminate: bending moment load');
  // CSV.
  { await page.locator(R + '.lmc-csv').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.lmc-csv')]); const f = OUT + 'lam.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0].startsWith('ply,angle_deg,face,z_mm') && rows.length === 7, 'laminate: ply results CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); check((await d.suggestedFilename()) === 'laminate.png', 'laminate: image report'); }
  // Bad input.
  await page.fill(R + '.lmc-yt', '0'); await page.waitForTimeout(100);
  check((await t('.lmc-lerr')).includes('strengths must be above zero') && await page.isHidden(R + '.lmc-lout'), 'laminate: bad strength');
  await page.fill(R + '.lmc-yt', '30'); await page.fill(R + '.lmc-f12', '-1.5'); await page.waitForTimeout(100);
  check((await t('.lmc-lerr')).includes('between −1 and 1'), 'laminate: bad F12*');
  await page.fill(R + '.lmc-f12', '-0.5'); await page.fill(R + '.lmc-mx', '0'); await page.waitForTimeout(100);
  check((await t('.lmc-lerr')).includes('at least one load'), 'laminate: no load');
  await page.fill(R + '.lmc-stack', '0/abc'); await page.waitForTimeout(100);
  check((await t('.lmc-serr')).includes('"abc" is not a ply angle') && (await t('.lmc-lerr')).includes('Fix the ply'), 'laminate: bad stacking');
  await page.fill(R + '.lmc-nu12', '5'); await page.waitForTimeout(100);
  check((await t('.lmc-perr')).includes('not physical'), 'laminate: impossible Poisson ratio');
  await page.click(R + '.lmc-mode button[data-m=fm]'); await page.fill(R + '.lmc-vf', '1.2'); await page.waitForTimeout(100);
  check((await t('.lmc-perr')).includes('volume fraction'), 'laminate: bad fibre fraction');
};
