// #851 diffusion calculator
export const path = '/science/diffusion-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.dfc ', t = (s) => page.textContent(R + s);
  await page.goto(`${BASE}/science/diffusion-calculator/`); await page.waitForTimeout(500);
  { const f = await t('.dfc-dfacts'); check(f.includes('3.608 × 10⁻¹¹ m²/s') && f.includes('1273.15 K') && f.includes('1.451 eV') && f.includes('66.7 K'), 'diffusion: Arrhenius D at 1000 °C'); }
  check(await page.isVisible(R + '.dfc-afig'), 'diffusion: D against temperature plot');
  check((await t('.dfc-big')) === 'Diffusion length √(Dt) = 720.8 µm', 'diffusion: diffusion length');
  { const f = await t('.dfc-cfacts'); check(f.includes('Case depth to C = 0.4 after 4 h1.173 mm') && f.includes('43.64 min') && f.includes('2618.2 s') && f.includes('after 4 h0.6990') && f.includes('16 h'), 'diffusion: case depth, time and concentration (match scipy brentq)'); }
  // Units.
  await page.selectOption(R + '.dfc-tu', 'k'); await page.fill(R + '.dfc-temp', '1273.15'); await page.selectOption(R + '.dfc-qu', 'ev'); await page.fill(R + '.dfc-q', String(140 / 96.48533212)); await page.selectOption(R + '.dfc-d0u', '1e-4'); await page.fill(R + '.dfc-d0', '0.2'); await page.waitForTimeout(100);
  check((await t('.dfc-dfacts')).includes('3.608 × 10⁻¹¹ m²/s'), 'diffusion: K, eV and cm²/s units give the same D');
  await page.click(R + '.dfc-mode button[data-m=d]'); await page.fill(R + '.dfc-d', '3.607775801339348e-11'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.dfc-afig') && (await t('.dfc-cfacts')).includes('1.173 mm'), 'diffusion: typed D');
  await page.selectOption(R + '.dfc-tunit', '60'); await page.fill(R + '.dfc-t', '240'); await page.waitForTimeout(100);
  check((await t('.dfc-cfacts')).includes('1.173 mm'), 'diffusion: time in minutes');
  // Finite-difference check.
  await page.check(R + '.dfc-fd'); await page.waitForTimeout(150);
  { const f = await t('.dfc-pfacts'); const m = f.match(/Finite-difference check([\d.]+) % largest gap/); check(m && Number(m[1]) < 0.02 && f.includes('r = DΔt/Δx²'), `diffusion: FD agrees with erfc (${m && m[1]} %)`); }
  { await page.locator(R + '.dfc-csv').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dfc-csv')]); const f = OUT + 'dif.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'depth_m,concentration,finite_difference' && rows[1] === '0,1,1' && rows.length === 242, 'diffusion: profile CSV with FD column'); }
  // Thin film.
  await page.selectOption(R + '.dfc-case', 'film1'); await page.fill(R + '.dfc-c0', '0'); await page.fill(R + '.dfc-ct', '0.001'); await page.waitForTimeout(150);
  check((await t('.dfc-cfacts')).includes('1.684 mm') && (await t('.dfc-cfacts')).includes('9.731 min') && await page.isVisible(R + '.dfc-fh'), 'diffusion: thin film depth and first time (match brentq)');
  { const m = (await t('.dfc-pfacts')).match(/check([\d.]+) %/); check(m && Number(m[1]) < 0.02, 'diffusion: thin film FD check'); }
  await page.fill(R + '.dfc-ct', '1'); await page.waitForTimeout(100);
  check((await t('.dfc-cfacts')).includes('never reached'), 'diffusion: thin film target above the peak');
  await page.selectOption(R + '.dfc-case', 'film2'); await page.fill(R + '.dfc-ct', '0.0005'); await page.waitForTimeout(100);
  check((await t('.dfc-pfacts')).includes('Peak (at the film)0.001957'), 'diffusion: buried film has half the peak');
  // Couple.
  await page.selectOption(R + '.dfc-case', 'couple'); await page.fill(R + '.dfc-ct', '0.3'); await page.fill(R + '.dfc-x', '-0.3'); await page.waitForTimeout(150);
  check((await t('.dfc-cfacts')).includes('−534.5 µm') && (await t('.dfc-cfacts')).includes('75.60 min') && await page.isVisible(R + '.dfc-c1'), 'diffusion: couple position and time (match brentq)');
  await page.fill(R + '.dfc-x', '0.3'); await page.waitForTimeout(100);
  check((await t('.dfc-cfacts')).includes('never'), 'diffusion: couple target on the wrong side');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); check((await d.suggestedFilename()) === 'diffusion.png', 'diffusion: image report'); }
  // Bad input.
  await page.fill(R + '.dfc-c2', '0'); await page.waitForTimeout(100);
  check((await t('.dfc-perr')).includes('nothing diffuses') && await page.isHidden(R + '.dfc-pout'), 'diffusion: equal couple');
  await page.fill(R + '.dfc-c2', '1'); await page.fill(R + '.dfc-t', '0'); await page.waitForTimeout(100);
  check((await t('.dfc-perr')).includes('time above zero'), 'diffusion: zero time');
  await page.fill(R + '.dfc-t', '240'); await page.selectOption(R + '.dfc-case', 'surface'); await page.fill(R + '.dfc-c0', '0.2'); await page.fill(R + '.dfc-ct', '2'); await page.fill(R + '.dfc-x', '0.5'); await page.waitForTimeout(100);
  check((await t('.dfc-cfacts')).includes('between the starting and surface'), 'diffusion: target outside the range');
  await page.click(R + '.dfc-mode button[data-m=arr]'); await page.selectOption(R + '.dfc-tu', 'c'); await page.fill(R + '.dfc-temp', '-300'); await page.waitForTimeout(100);
  check((await t('.dfc-derr')).includes('absolute zero') && (await t('.dfc-perr')).includes('Fix the diffusion'), 'diffusion: temperature below absolute zero');
};
