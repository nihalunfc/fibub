// #978 Dimensional analysis checker
export const path = '/science/dimensional-analysis/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/science/dimensional-analysis/`); await page.waitForTimeout(600);
  const t = (c) => page.textContent('.dac ' + c), wait = () => page.waitForTimeout(150);
  check((await t('.da-big')) === 'Balances: every side is kg m² s⁻² (J)' && (await t('.da-sides')).includes('Left side: E'), 'dim: kinetic energy example balances');
  await page.selectOption('.dac .da-ex', 'drag'); await wait();
  check((await t('.da-big')) === 'Does not balance: kg m s⁻² ≠ kg s⁻¹', 'dim: drag force mistake caught');
  await page.fill('.dac .da-eq', 'F = 1/2*rho*v^2*C_d*A'); await wait();
  check((await t('.da-big')).startsWith('Balances') && (await page.inputValue('.dac .da-ex')) === 'own', 'dim: corrected drag force balances');
  await page.selectOption('.dac .da-ex', 'pend'); await wait();
  check((await t('.da-big')) === 'Balances: every side is s (s)' && (await t('.da-probs')).includes('g (gravitational acceleration'), 'dim: pendulum with a built-in constant');
  await page.click('.dac .da-const'); await wait();
  check((await t('.da-big')) === 'Give a unit for g' && (await t('.da-probs')).includes('"g = m"'), 'dim: constants switched off');
  await page.click('.dac .da-const'); await page.selectOption('.dac .da-ex', 'gas'); await wait();
  check((await t('.da-big')).startsWith('Balances: every side is kg m² s⁻²'), 'dim: ideal gas law');
  await page.selectOption('.dac .da-ex', 'osc'); await wait();
  check((await t('.da-big')) === 'Balances: every side is m (m)', 'dim: damped oscillation with exp and cos');
  await page.fill('.dac .da-eq', 'x = x0 + v*t'); await page.fill('.dac .da-decl', 'x = m\nx0 = m\nv = m/s\nt = s^2'); await wait();
  check((await t('.da-big')) === 'Does not balance: a term inside does not fit' && (await t('.da-probs')).includes('cannot add m s to m') && (await t('.da-sides')).includes('v·t: m s'), 'dim: bad term named');
  await page.fill('.dac .da-eq', 'x = exp(t)'); await wait();
  check((await t('.da-probs')).includes('argument of exp must be dimensionless'), 'dim: function argument');
  await page.fill('.dac .da-eq', 'x*v'); await wait();
  check((await t('.da-big')) === 'Dimensions: m² s⁻¹' && (await t('.da-sides')).includes('Expression'), 'dim: single expression');
  await page.fill('.dac .da-decl', 'x = furlong'); await wait();
  check((await t('.da-err')).includes('"furlong" is not a unit'), 'dim: unknown unit message');
  await page.fill('.dac .da-decl', 'x = m'); await page.fill('.dac .da-eq', 'x = (v'); await wait();
  check((await t('.da-err')).startsWith('Equation:'), 'dim: bad equation message');
  await page.fill('.dac .da-eq', 'x = 2*x'); await wait();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dac .dl button[data-f=png]')]); check((await d.suggestedFilename()) === 'dimensional-analysis.png', 'dim: image report'); }
  check((await t('.da-ubig')) === 'V/m = kg m s⁻³ A⁻¹', 'dim: unit box example');
  await page.fill('.dac .da-u', 'kWh'); await wait(); check((await t('.da-unote')).includes('Same dimensions as J'), 'dim: unit box named unit');
  await page.fill('.dac .da-u', 'zz'); await wait(); check((await t('.da-unote')).includes('not a unit'), 'dim: unit box bad unit');
};
