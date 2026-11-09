// #953 particle drift simulator
export const path = '/science/particle-drifts/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.pdr ';
  await page.goto(`${BASE}/science/particle-drifts/`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.pd-big');
  check((await big()) === 'Drift 20000 m/s −y; theory 20000 m/s (−0.00 %)', `drifts: E × B example (${await big()})`);
  { const t = await page.textContent(R + '.pd-facts'); check(t.includes('1.445 m') && t.includes('6.559 × 10⁻⁵ s') && await page.isVisible(R + '.pd-fig'), 'drifts: example gyroradius, period and figure'); }
  check((await page.textContent(R + '.pd-play')) === 'Pause', 'drifts: animation plays on load');
  await page.click(R + '.pd-play'); check((await page.textContent(R + '.pd-play')) === 'Play', 'drifts: pause button');
  await page.click(R + '.pd-again'); check((await page.textContent(R + '.pd-play')) === 'Pause', 'drifts: play again');
  await page.selectOption(R + '.pd-v', '3');
  await page.selectOption(R + '.pd-sc', 'gradb'); await page.waitForTimeout(150);
  check((await big()) === 'Drift 5003 m/s +y; theory 5000 m/s (+0.06 %)' && await page.isVisible(R + '.pd-l') && await page.isHidden(R + '.pd-e'), `drifts: grad-B (${await big()})`);
  await page.selectOption(R + '.pd-p', 'e'); await page.fill(R + '.pd-b', '0.1'); await page.fill(R + '.pd-wp', '10'); await page.waitForTimeout(150);
  check((await big()).includes('−y') && (await big()).includes('theory 5000 m/s'), `drifts: electron grad-B drifts the other way (${await big()})`);
  await page.selectOption(R + '.pd-p', 'p'); await page.fill(R + '.pd-b', '1'); await page.fill(R + '.pd-wp', '100');
  await page.selectOption(R + '.pd-sc', 'curv'); await page.waitForTimeout(150);
  check((await big()).includes('up (+z)') && (await big()).includes('theory 15000 m/s'), `drifts: curvature drift (${await big()})`);
  await page.selectOption(R + '.pd-sc', 'grav'); await page.waitForTimeout(150);
  check((await big()).includes('−y') && (await big()).includes('theory 10440 m/s'), `drifts: gravity drift (${await big()})`);
  await page.selectOption(R + '.pd-p', 'c'); await page.fill(R + '.pd-z', '-1'); await page.waitForTimeout(150);
  check(await page.isVisible(R + '.pd-m') && (await big()).includes('+y'), 'drifts: custom negative ion drifts the other way');
  await page.selectOption(R + '.pd-p', 'a'); await page.selectOption(R + '.pd-s', '256'); await page.fill(R + '.pd-n', '4'); await page.waitForTimeout(150);
  check((await big()) === 'Drift 20736 m/s −y; theory 20736 m/s (−0.00 %)', `drifts: alpha, more steps, fewer gyrations (${await big()})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pd-csv')]); const f = OUT + 'path.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'x_m,y_m,t_s' && rows.length === 4 * 256 + 2, `drifts: path CSV (${rows.length} rows)`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=png]')]); check(d.suggestedFilename() === 'particle-drift.png', 'drifts: image download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=pdf]')]); check(d.suggestedFilename() === 'particle-drift.pdf', 'drifts: PDF download'); }
  await page.selectOption(R + '.pd-sc', 'gradb'); await page.fill(R + '.pd-l', '2'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.pd-err')).includes('too big for this gradient') && await page.isHidden(R + '.pd-out'), 'drifts: gyroradius too large message');
  await page.fill(R + '.pd-l', '20'); await page.fill(R + '.pd-b', '-1'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.pd-err')).includes('magnetic field'), 'drifts: bad field message');
  await page.fill(R + '.pd-b', '1'); await page.fill(R + '.pd-n', '100'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.pd-err')).includes('between 2 and 60'), 'drifts: too many gyrations message');
  await page.fill(R + '.pd-n', '10'); await page.selectOption(R + '.pd-p', 'c'); await page.fill(R + '.pd-z', '0'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.pd-err')).includes('non-zero'), 'drifts: zero charge message');
};
