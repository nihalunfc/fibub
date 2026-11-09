// #908 Lagrangian helper
export const path = '/science/lagrangian-helper/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  // Compare with combining dots decomposed: ẍ may be one character or x plus a combining mark.
  const has = (t, s) => t.normalize('NFD').includes(s.normalize('NFD'));
  await page.goto(`${BASE}/science/lagrangian-helper/`); await page.waitForTimeout(700);
  const big = () => page.textContent('.lgh .lg-big'), eqs = () => page.textContent('.lgh .lg-eqs'), sf = () => page.textContent('.lgh .lg-sfacts'), err = () => page.textContent('.lgh .lg-err');
  check((await big()) === '1 equation of motion, for θ', 'lagrange: pendulum headline');
  { const e = await eqs(); check(has(e, 'l²·m·θ″ + g·l·m·sin(θ) = 0') && has(e, 'θ″ = −g·sin(θ)/l') && has(e, 'l²·m·θ′') && has(e, 'h is conserved'), 'lagrange: pendulum equation, acceleration, momentum, energy'); }
  check((await page.inputValue('.lgh .lg-plain')).includes('thetaddot = -g*sin(theta)/l'), 'lagrange: plain text for SymPy');
  { const s = await sf(); check(s.includes('−0.46325') && s.includes('2.6365') && s.includes('× 10⁻¹'), 'lagrange: numerical run and energy check'); }
  check(await page.isVisible('.lgh .lg-fig'), 'lagrange: run chart');
  await page.selectOption('.lgh .lg-pre', 'cart'); await page.waitForTimeout(400);
  { const e = await eqs(); check((await big()) === '2 coupled equations of motion, for x, θ' && has(e, 'M·ẍ + l·m·cos(θ)·θ″ + m·ẍ − l·m·sin(θ)·θ′² = 0') && has(e, 'M = [ M + m | l·m·cos(θ) ; l·m·cos(θ) | l²·m ]'), 'lagrange: cart and pendulum, mass matrix'); }
  check((await page.$$('.lgh .lg-params input')).length === 4 && (await page.$$('.lgh .lg-init input')).length === 4, 'lagrange: a box per parameter and per coordinate');
  await page.selectOption('.lgh .lg-pre', 'double'); await page.waitForTimeout(500);
  check(has(await eqs(), 'cos(th₁ − th₂)') && has(await eqs(), 'th₁″') && (await sf()).includes('kept to'), 'lagrange: double pendulum with primes for long names');
  await page.selectOption('.lgh .lg-pre', 'shaken'); await page.waitForTimeout(500);
  check(has(await eqs(), 'not conserved') && (await sf()).includes('not conserved'), 'lagrange: explicit time dependence noticed');
  await page.selectOption('.lgh .lg-pre', 'spring'); await page.waitForTimeout(400);
  check(has(await eqs(), 'k·r') || has(await eqs(), 'k·L₀'), 'lagrange: spring pendulum');
  await page.selectOption('.lgh .lg-pre', 'hoop'); await page.waitForTimeout(400);
  check(has(await eqs(), 'w²') && (await big()).includes('θ'), 'lagrange: bead on a hoop');
  await page.fill('.lgh .lg-T', "1/2 m (x'^2 + y'^2)"); await page.fill('.lgh .lg-V', 'm g y'); await page.fill('.lgh .lg-q', 'x, y'); await page.waitForTimeout(400);
  check(await page.inputValue('.lgh .lg-pre') === 'custom' && has(await eqs(), 'm·ÿ + g·m = 0') && has(await eqs(), 'm·ẍ = 0'), 'lagrange: custom free fall');
  await page.fill('.lgh .lg-q', 'x'); await page.waitForTimeout(300);
  check((await err()).includes('ydot is not the rate'), 'lagrange: rate of an unlisted coordinate message');
  await page.fill('.lgh .lg-q', 'x, y'); await page.fill('.lgh .lg-T', '1/2 m (x^2 +'); await page.waitForTimeout(300);
  check((await err()).startsWith('Kinetic energy T:') && await page.isHidden('.lgh .lg-out'), 'lagrange: syntax error message');
  await page.fill('.lgh .lg-T', "1/2 m abs(x')^2"); await page.waitForTimeout(300);
  check((await err()).includes('not supported'), 'lagrange: unsupported function message');
  await page.fill('.lgh .lg-T', "1/2 m (x'^2 + y'^2)"); await page.fill('.lgh .lg-q', 'x, 2y'); await page.waitForTimeout(300);
  check((await err()).includes('cannot be a coordinate name'), 'lagrange: bad coordinate name message');
  await page.fill('.lgh .lg-q', 'x, y'); await page.waitForTimeout(300);
  await page.fill('.lgh .lg-params input >> nth=0', 'q'); await page.waitForTimeout(200);
  check((await page.textContent('.lgh .lg-serr')).includes('Give a number for'), 'lagrange: bad parameter message');
  await page.fill('.lgh .lg-params input >> nth=0', '9.81'); await page.fill('.lgh .lg-dur', '1'); await page.fill('.lgh .lg-init input >> nth=3', '5'); await page.waitForTimeout(300);
  check((await sf()).includes('rate −4.81'), 'lagrange: free fall run (thrown up at 5 m/s, after 1 s rate 5 − g)');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.lgh .lg-txt')]); const f = OUT + 'el.txt'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.includes('EL_y: m*yddot + g*m = 0') && t.includes('L = '), 'lagrange: TXT download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.lgh .lg-csv')]); const f = OUT + 'lag.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 't_s,x,xdot,y,ydot,h' && rows.length === 4002, 'lagrange: run CSV'); }
  for (const [f, n] of [['png', 'Image'], ['pdf', 'PDF'], ['docx', 'Word']]) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.lgh .dl [data-f=${f}]`)]); check(d.suggestedFilename().endsWith('.' + f), `lagrange: ${n} download`); }
};
