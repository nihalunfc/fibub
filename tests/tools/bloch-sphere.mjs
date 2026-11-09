// #926 spin and Bloch sphere
export const path = '/science/bloch-sphere/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/bloch-sphere/`); await page.waitForTimeout(1200);
  const big = () => page.textContent('.blo .bl-big'), facts = () => page.textContent('.blo .bl-facts'), rbig = () => page.textContent('.blo .bl-rbig'), rf = () => page.textContent('.blo .bl-rfacts');
  check((await big()) === '0.9239 |0⟩ + (0.3827) |1⟩', 'bloch: example state');
  check((await facts()).includes('(0.7071, 0, 0.7071)') && (await facts()).includes('45°, 0°') && (await facts()).includes('0.8536, 0.1464'), 'bloch: example Bloch vector and probabilities');
  check((await page.textContent('.blo .bl-tab')).includes('Rx(90)') && await page.isVisible('.blo .bl-sph'), 'bloch: steps table and sphere');
  await page.click('.blo .bl-add [data-g="X"]'); await page.waitForTimeout(200);
  check((await page.inputValue('.blo .bl-gates')) === 'H; T; Rx(90); X' && (await facts()).includes('(0.7071, 0, −0.7071)'), 'bloch: X button');
  await page.click('.blo .bl-undo'); await page.waitForTimeout(200);
  check((await page.inputValue('.blo .bl-gates')) === 'H; T; Rx(90)', 'bloch: undo');
  await page.click('.blo .bl-clr'); await page.click('.blo .bl-add [data-g="Ry(90)"]'); await page.click('.blo .bl-add [data-g="S"]'); await page.waitForTimeout(200);
  check((await facts()).includes('(0, 1, 0)'), 'bloch: Ry(90) then S lands on |+i⟩');
  await page.fill('.blo .bl-gates', 'Rx(pi/2)'); await page.waitForTimeout(400);
  check((await facts()).includes('(0, −1, 0)'), 'bloch: angle in radians');
  await page.fill('.blo .bl-gates', 'R(120, 1, 1, 1)'); await page.selectOption('.blo .bl-start', '+'); await page.waitForTimeout(400);
  check((await facts()).includes('(0, 1, 0)'), 'bloch: 120° about (1,1,1) takes x to y');
  await page.selectOption('.blo .bl-start', 'ang'); await page.fill('.blo .bl-gates', 'Z'); await page.waitForTimeout(400);
  check((await facts()).includes('60°, −135°'), 'bloch: start from angles, then Z');
  await page.fill('.blo .bl-gates', 'H; Q'); await page.waitForTimeout(400);
  check((await page.textContent('.blo .bl-err')).includes('"Q"') && await page.isHidden('.blo .bl-gout'), 'bloch: unknown gate message');
  await page.fill('.blo .bl-th', 'x'); await page.fill('.blo .bl-gates', 'H'); await page.waitForTimeout(400);
  check((await page.textContent('.blo .bl-err')).includes('angles'), 'bloch: bad angle message');
  // Rabi
  check((await rbig()) === 'P(1) at 3 µs = 0.6434' && (await rf()).includes('0.5 µs') && (await rf()).includes('1.118 MHz') && (await rf()).includes('0.8'), 'bloch: Rabi example');
  await page.fill('.blo .bl-T1', '2'); await page.fill('.blo .bl-T2', '1.5'); await page.waitForTimeout(500);
  check((await rf()).includes('Steady state P(1)0.4181') && (await rbig()) === 'P(1) at 3 µs = 0.4501', 'bloch: T1 and T2 damping (SciPy 0.45006)');
  await page.fill('.blo .bl-D', '0'); await page.fill('.blo .bl-T1', ''); await page.fill('.blo .bl-T2', ''); await page.fill('.blo .bl-t', '0.5'); await page.waitForTimeout(500);
  check((await rbig()) === 'P(1) at 0.5 µs = 1', 'bloch: resonant π pulse');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.blo .bl-csv')]); const f = OUT + 'rabi.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r[0] === 't_us,P1,x,y,z' && r.length > 1000, 'bloch: Rabi CSV'); }
  await page.fill('.blo .bl-az', '60'); await page.dispatchEvent('.blo .bl-az', 'input'); check(await page.isVisible('.blo .bl-rsph'), 'bloch: turn view');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.blo .dl [data-f=pdf]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'bloch: PDF report'); }
  await page.fill('.blo .bl-T1', '1'); await page.fill('.blo .bl-T2', '3'); await page.waitForTimeout(500);
  check((await page.textContent('.blo .bl-rerr')).includes('2 × T1') && await page.isHidden('.blo .bl-rout'), 'bloch: T2 > 2T1 message');
  await page.fill('.blo .bl-T2', ''); await page.fill('.blo .bl-W', '0'); await page.waitForTimeout(500);
  check((await page.textContent('.blo .bl-rerr')).includes('Rabi frequency'), 'bloch: Rabi frequency message');
  await page.fill('.blo .bl-W', '1'); await page.fill('.blo .bl-t', '5000'); await page.waitForTimeout(500);
  check((await page.textContent('.blo .bl-rerr')).includes('2,000 oscillations'), 'bloch: too long message');
};
