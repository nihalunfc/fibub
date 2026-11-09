// #901 projectile and drag simulator
export const path = '/science/projectile-drag/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/projectile-drag/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.pjd .pj-big'), facts = () => page.textContent('.pjd .pj-facts');
  check((await big()) === 'Range 94.85 m, top 21.25 m, in the air 4.10 s', 'projectile: example headline');
  { const f = await facts(); check(f.includes('51.75 m out, 1.91 s after launch') && f.includes('24.8 m/s') && f.includes('47.7° below level') && f.includes('154.7 m range') && f.includes('38.7 %') && f.includes('40.6°') && f.includes('96.28 m') && f.includes('39.3 m/s'), 'projectile: example facts (apex, landing, no-air, best angle, terminal speed)'); }
  check(await page.isVisible('.pjd .pj-fig') && await page.isVisible('.pjd .pj-fig2'), 'projectile: both charts');
  await page.fill('.pjd .pj-w', '-5'); await page.waitForTimeout(150);
  check((await big()).startsWith('Range 84.41 m'), 'projectile: headwind shortens the range');
  await page.fill('.pjd .pj-w', '0'); await page.fill('.pjd .pj-cd', '0'); await page.waitForTimeout(150);
  check((await big()).startsWith('Range 154.7 m') && (await facts()).includes('drag is off') && await page.inputValue('.pjd .pj-pre') === 'custom', 'projectile: Cd 0 gives the no-drag parabola and switches to Custom');
  await page.selectOption('.pjd .pj-pre', 'shot'); await page.waitForTimeout(150);
  check(await page.inputValue('.pjd .pj-m') === '7.26' && await page.inputValue('.pjd .pj-cd') === '0.47', 'projectile: preset fills mass and Cd');
  await page.selectOption('.pjd .pj-pre', 'football'); await page.fill('.pjd .pj-g', '1.62'); await page.fill('.pjd .pj-rho', '0'); await page.waitForTimeout(150);
  check((await big()).startsWith('Range 929.5 m') && (await facts()).includes('drag is off'), 'projectile: Moon gravity with no air (v²sin2θ/g from 1 m up)');
  await page.fill('.pjd .pj-g', '9.80665'); await page.fill('.pjd .pj-rho', '1.225'); await page.fill('.pjd .pj-h', '0'); await page.fill('.pjd .pj-a', '0'); await page.waitForTimeout(150);
  check((await page.textContent('.pjd .pj-err')).includes('angle must be above 0') && await page.isHidden('.pjd .pj-out'), 'projectile: level throw from the ground is refused');
  await page.fill('.pjd .pj-a', '35'); await page.fill('.pjd .pj-m', 'abc'); await page.waitForTimeout(150);
  check((await page.textContent('.pjd .pj-err')).includes('mass'), 'projectile: bad mass message');
  await page.fill('.pjd .pj-m', '0.145'); await page.fill('.pjd .pj-v', '-3'); await page.waitForTimeout(150);
  check((await page.textContent('.pjd .pj-err')).includes('launch speed'), 'projectile: bad speed message');
  await page.selectOption('.pjd .pj-pre', 'ball'); await page.fill('.pjd .pj-v', '40'); await page.fill('.pjd .pj-h', '1'); await page.waitForTimeout(150);
  check((await big()).startsWith('Range 94.85 m'), 'projectile: back to the example');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pjd .pj-csv')]); const f = OUT + 'proj.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); const last = rows[rows.length - 1].split(',').map(Number);
    check(rows[0] === 't_s,x_m,y_m,vx_m_s,vy_m_s,speed_m_s' && rows.length > 1000 && Math.abs(last[1] - 94.85) < 0.01 && last[2] === 0, 'projectile: path CSV ends at the landing point'); }
  for (const [f, n] of [['png', 'Image'], ['pdf', 'PDF'], ['docx', 'Word']]) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.pjd .dl [data-f=${f}]`)]); check(d.suggestedFilename().endsWith('.' + f), `projectile: ${n} download`); }
};
