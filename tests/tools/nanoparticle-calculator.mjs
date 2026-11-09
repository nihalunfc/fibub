// #858 nanoparticle calculator
export const path = '/science/nanoparticle-calculator/';
export default async ({ page, check, BASE }) => {
  const R = '.npc ', t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/science/nanoparticle-calculator/`); await page.waitForTimeout(500);
  check((await t('.npc-big')) === '15.54 m²/g, 9.26 % of atoms on the surface', 'nano: example specific surface and surface share (match numpy)');
  { const f = await t('.npc-facts'); check(f.includes('0.3000 /nm') && f.includes('1257 nm²') && f.includes('8.084 × 10⁻¹⁷ g') && f.includes('247,171') && f.includes('22,886') && f.includes('0.3187 nm'), 'nano: sphere facts'); }
  check(await page.isVisible(R + '.npc-fig'), 'nano: surface share plot');
  check((await t('.npc-cbig')) === '147 atoms, 92 on the surface (62.6 %)' && (await t('.npc-cfacts')).includes('Edge atoms48') && (await t('.npc-cfacts')).includes('Face atoms32') && (await t('.npc-nsug')) === '31', 'nano: cuboctahedron n = 3 (matches numpy-built cluster)');
  await page.selectOption(R + '.npc-shape', 'ico'); await page.waitForTimeout(100);
  check((await t('.npc-cfacts')).includes('Edge atoms60') && (await t('.npc-cfacts')).includes('Face atoms20'), 'nano: icosahedron n = 3 (matches numpy-built Mackay cluster)');
  await page.fill(R + '.npc-n', '5'); await page.waitForTimeout(100);
  check((await t('.npc-cbig')).startsWith('561 atoms, 252 on the surface') && (await page.locator(R + '.npc-tab tbody tr').count()) === 10 && (await t('.npc-tab .npc-hit')).startsWith('5561'), 'nano: cluster table');
  { const f = await t('.npc-kfacts'); check(f.includes('6.185 × 10¹¹') && f.includes('1.027 nM') && f.includes('253.8 µM of atoms') && f.includes('7.772 cm²'), 'nano: number and molar concentration'); }
  await page.selectOption(R + '.npc-of', 'cluster'); await page.waitForTimeout(100);
  check((await t('.npc-kfacts')).includes('Particles per mL') && !(await t('.npc-kfacts')).includes('Surface area per mL'), 'nano: concentration of clusters');
  await page.selectOption(R + '.npc-cu', '1'); await page.fill(R + '.npc-c', '0.05'); await page.selectOption(R + '.npc-of', 'sphere'); await page.waitForTimeout(100);
  check((await t('.npc-kfacts')).includes('1.027 nM'), 'nano: mg/mL unit');
  check((await t('.npc-bfacts')).includes('25.91 nm') && (await t('.npc-bfacts')).includes('close to separate'), 'nano: BET diameter');
  await page.fill(R + '.npc-ssa', '5'); await page.waitForTimeout(100);
  check((await t('.npc-bfacts')).includes('aggregated'), 'nano: BET hints at aggregation');
  await page.fill(R + '.npc-da', '0.288'); await page.waitForTimeout(100);
  check((await t('.npc-facts')).includes('0.2880 nm') && (await t('.npc-big')).includes('8.39 %'), 'nano: typed atom diameter');
  await page.fill(R + '.npc-d', '0.4'); await page.waitForTimeout(100);
  check((await t('.npc-facts')).includes('below two atoms'), 'nano: very small particle');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); check((await d.suggestedFilename()) === 'nanoparticle.png', 'nano: image report'); }
  // Bad input.
  await page.fill(R + '.npc-n', '2.5'); await page.waitForTimeout(100);
  check((await t('.npc-cerr')).includes('whole number'), 'nano: bad shell number');
  await page.fill(R + '.npc-ssa', '0'); await page.waitForTimeout(100);
  check((await t('.npc-berr')).includes('above zero'), 'nano: bad surface area');
  await page.fill(R + '.npc-c', ''); await page.waitForTimeout(100);
  check((await t('.npc-kerr')).includes('above zero'), 'nano: no concentration');
  await page.fill(R + '.npc-rho', '0'); await page.waitForTimeout(100);
  check((await t('.npc-err')).includes('density') && (await t('.npc-kerr')).includes('Fix the material') && await page.isHidden(R + '.npc-out'), 'nano: bad density');
};
