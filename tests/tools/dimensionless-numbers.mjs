// #956 dimensionless numbers calculator
export const path = '/science/dimensionless-numbers/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.dnc ';
  await page.goto(`${BASE}/science/dimensionless-numbers/`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.dn-big'), tab = () => page.textContent(R + '.dn-tab');
  check((await big()) === 'Re = 49900: turbulent pipe flow (above about 4000)', 'dimless: water pipe example');
  { const t = await tab(); check(t.includes('0.000676') && t.includes('1.428') && t.includes('685.4') && t.includes('6.990') && t.includes('348799') && t.includes('1.79 × 10⁷') && t.includes('0.001030') && t.includes('0.2000'), 'dimless: example numbers'); }
  check(await page.isVisible(R + '.dn-fig') && await page.isHidden(R + '.dn-p'), 'dimless: regime strip; no gas boxes for water');
  await page.fill(R + '.dn-u', '1'); await page.selectOption(R + '.dn-uu', '0.277777778'); await page.waitForTimeout(100);
  check((await big()).startsWith('Re = 13861: turbulent'), `dimless: km/h (${await big()})`);
  await page.selectOption(R + '.dn-uu', '1'); await page.fill(R + '.dn-u', '0.03'); await page.waitForTimeout(100);
  check((await big()).includes('laminar pipe'), 'dimless: slow flow is laminar');
  await page.fill(R + '.dn-u', '0.06'); await page.waitForTimeout(100);
  check((await big()).includes('transitional'), 'dimless: transitional pipe flow');
  for (const [g, w] of [['plate', 'laminar boundary layer'], ['cylinder', 'vortex street'], ['sphere', 'Newton regime'], ['channel', 'turbulent open-channel'], ['other', 'inertia dominates']]) { await page.selectOption(R + '.dn-geo', g); await page.waitForTimeout(80); check((await big()).includes(w), `dimless: ${g} regime note (${await big()})`); }
  check((await page.textContent(R + '.dn-ll')) === 'Length scale', 'dimless: the length label follows the shape');
  await page.click(R + '.dn-props summary');
  await page.selectOption(R + '.dn-fl', 'air'); await page.selectOption(R + '.dn-lu', '1e-6'); await page.fill(R + '.dn-l', '1'); await page.fill(R + '.dn-u', '0.01'); await page.waitForTimeout(100);
  { const t = await tab(); check(await page.isVisible(R + '.dn-p') && t.includes('Knudsen') && t.includes('0.0649') && !t.includes('Weber'), 'dimless: air in a 1 µm gap: Knudsen slip flow, no surface tension numbers'); }
  await page.fill(R + '.dn-p', '1'); await page.waitForTimeout(100);
  check((await tab()).includes('transitional: neither'), 'dimless: low pressure raises Knudsen');
  await page.fill(R + '.dn-mu', '2e-5'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.dn-fl')) === 'own', 'dimless: editing a property switches to your own fluid');
  await page.selectOption(R + '.dn-fl', 'gly'); await page.fill(R + '.dn-dt', ''); await page.fill(R + '.dn-f', ''); await page.waitForTimeout(100);
  { const t = await tab(); check(!t.includes('Grashof') && !t.includes('Strouhal') && t.includes('Ohnesorge'), 'dimless: glycerol without ΔT and f'); }
  for (const s of ['sea', 'oil']) { await page.selectOption(R + '.dn-fl', s); await page.waitForTimeout(80); check((await big()).startsWith('Re = '), `dimless: ${s} preset`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dn-csv')]); const f = OUT + 'dimless.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'number,value,formula,note' && rows[1].startsWith('Reynolds Re,'), 'dimless: table CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); check(d.suggestedFilename() === 'dimensionless-numbers.pdf', 'dimless: PDF download'); }
  await page.fill(R + '.dn-u', '0'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.dn-err')).includes('speed') && await page.isHidden(R + '.dn-out'), 'dimless: bad speed message');
  await page.fill(R + '.dn-u', '1'); await page.fill(R + '.dn-rho', ''); await page.waitForTimeout(100);
  check((await page.textContent(R + '.dn-err')).includes('density and a viscosity'), 'dimless: missing density message');
  await page.fill(R + '.dn-rho', '1000'); await page.fill(R + '.dn-f', '-3'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.dn-err')).includes('frequency'), 'dimless: bad frequency message');
};
