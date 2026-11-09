// #904 moment of inertia builder
export const path = '/science/moment-of-inertia/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/science/moment-of-inertia/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.moi .mi-big'), facts = () => page.textContent('.moi .mi-facts');
  check((await big()) === 'I = 1.270 kg·m² about the axis', 'inertia: pendulum example total');
  { const f = await facts(); check(f.includes('1.500 kg') && f.includes('0.9202 m') && f.includes('(0.8667, 0) m') && f.includes('0.1435 kg·m²'), 'inertia: mass, radius of gyration, centre of mass, I about it'); }
  { const s = await page.textContent('.moi .mi-steps'); check(s.includes('mL²/12') && s.includes('0.04167') && s.includes('2mR²/5') && s.includes('1.103') && s.includes('= 1.270 kg·m²'), 'inertia: steps show formulas and parallel-axis terms'); }
  check((await page.$$('.moi .mi-tab tr')).length === 4 && await page.isVisible('.moi .mi-fig'), 'inertia: table and picture');
  await page.fill('.moi .mi-rpm', '60'); await page.waitForTimeout(150);
  check((await facts()).includes('25.07 J') && (await facts()).includes('7.981 kg·m²/s'), 'inertia: spin energy and angular momentum at 60 rpm');
  await page.selectOption('.moi .mi-pre', 'plate'); await page.waitForTimeout(200);
  check((await big()) === 'I = 0.03942 kg·m² about the axis' && (await facts()).includes('(−0.01111, 0) m') && (await facts()).includes('holes subtracted'), 'inertia: plate with a hole');
  await page.selectOption('.moi .mi-u', '0.01'); await page.waitForTimeout(150);
  check((await big()) === 'I = 3.942 × 10⁻⁶ kg·m² about the axis' || (await big()).startsWith('I = 3.942'), 'inertia: same numbers read as centimetres');
  await page.selectOption('.moi .mi-u', '1');
  await page.selectOption('.moi .mi-pre', 'fly'); await page.waitForTimeout(200);
  check((await big()) === 'I = 0.1434 kg·m² about the axis' && (await page.$$('.moi .mi-row')).length === 3 && await page.isVisible('.moi .mi-row >> nth=2 >> .mi-d3'), 'inertia: flywheel with a tube (three sizes shown)');
  await page.selectOption('.moi .mi-row >> nth=0 >> .mi-o', 'across'); await page.waitForTimeout(150);
  check((await big()) !== 'I = 0.1434 kg·m² about the axis' && (await page.textContent('.moi .mi-steps')).includes('m(3R² + h²)/12'), 'inertia: axis across the disc');
  await page.click('.moi .mi-add'); await page.waitForTimeout(150);
  check((await page.$$('.moi .mi-row')).length === 4 && await page.isHidden('.moi .mi-row >> nth=3 >> .mi-d1'), 'inertia: add a point mass (no sizes)');
  await page.selectOption('.moi .mi-row >> nth=3 >> .mi-shape', 'hollowsphere'); await page.fill('.moi .mi-row >> nth=3 >> .mi-d1', '0.3'); await page.fill('.moi .mi-row >> nth=3 >> .mi-d2', '0.1'); await page.waitForTimeout(150);
  check((await page.textContent('.moi .mi-err')).includes('outer radius'), 'inertia: inner radius larger than outer message');
  await page.click('.moi .mi-row >> nth=3 >> .mi-del'); await page.waitForTimeout(150);
  await page.fill('.moi .mi-row >> nth=0 >> .mi-m', '-1'); await page.waitForTimeout(150);
  check((await page.textContent('.moi .mi-err')).includes('Part 1: give a mass'), 'inertia: bad mass message');
  await page.selectOption('.moi .mi-pre', 'plate'); await page.fill('.moi .mi-row >> nth=1 >> .mi-m', '5'); await page.waitForTimeout(150);
  check((await page.textContent('.moi .mi-err')).includes('holes weigh'), 'inertia: hole heavier than the plate message');
  await page.selectOption('.moi .mi-pre', 'blank'); await page.fill('.moi .mi-x', 'a'); await page.waitForTimeout(150);
  check((await page.textContent('.moi .mi-err')).includes('centre x and y'), 'inertia: bad position message');
  await page.fill('.moi .mi-x', '3'); await page.fill('.moi .mi-y', '4'); await page.waitForTimeout(150);
  check((await big()) === 'I = 25 kg·m² about the axis', 'inertia: point mass m d² (1 kg at 5 m)');
  for (const [f, n] of [['png', 'Image'], ['pdf', 'PDF'], ['docx', 'Word']]) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.moi .dl [data-f=${f}]`)]); check(d.suggestedFilename().endsWith('.' + f), `inertia: ${n} download`); }
};
