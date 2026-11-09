// #959 potential flow builder
export const path = '/science/potential-flow/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.pfb ';
  await page.goto(`${BASE}/science/potential-flow/`); await page.waitForTimeout(800);
  const big = () => page.textContent(R + '.pf-big'), facts = () => page.textContent(R + '.pf-facts');
  check((await big()) === '2 stagnation points: (−1, 0), (1, 0)', 'potential: cylinder example stagnation points');
  check((await facts()).includes('0 N/m along x, 0 N/m along y') && await page.isVisible(R + '.pf-fig'), 'potential: no force on the cylinder; picture drawn');
  // Probe the top of the cylinder: canvas maps x −3..3, y −2..2 onto the plot area above a 22 px caption.
  await page.locator(R + '.pf-fig').scrollIntoViewIfNeeded();
  const tap = async (x, y) => { const bb = await page.locator(R + '.pf-fig').boundingBox(), ph = bb.height * (253.333 / 275.333); await page.mouse.click(bb.x + ((x + 3) / 6) * bb.width, bb.y + ((2 - y) / 4) * ph); await page.waitForTimeout(200); };
  await tap(0, 1.2);
  { const t = await facts(); const m = t.match(/Flow at \(([−\d.]+), ([−\d.]+)\)/); check(!!m && t.includes('Cp = 1 − (V/U)²'), `potential: probe reads the flow (${m?.[0]})`); }
  await page.selectOption(R + '.pf-pre', 'lift'); await page.waitForTimeout(200);
  check((await big()) === '2 stagnation points: (−0.866, −0.5), (0.866, −0.5)' && (await facts()).includes('7.7 N/m along y'), `potential: spinning cylinder (${await big()})`);
  await page.selectOption(R + '.pf-pre', 'half'); await page.waitForTimeout(200);
  check((await big()) === '1 stagnation point: (−1, 0)' && (await facts()).includes('−ρUQ'), 'potential: Rankine half-body');
  await page.selectOption(R + '.pf-pre', 'oval'); await page.waitForTimeout(200);
  check((await big()) === '2 stagnation points: (−1.73, 0), (1.73, 0)', 'potential: Rankine oval');
  await page.selectOption(R + '.pf-pre', 'pair'); await page.waitForTimeout(200);
  check((await facts()).includes('uniform flow of 0 m/s'), 'potential: source-sink pair without a stream');
  await page.selectOption(R + '.pf-pre', 'vpair'); await page.waitForTimeout(200);
  check((await page.locator(R + '.pf-row').count()) === 2, 'potential: vortex pair');
  await page.selectOption(R + '.pf-tap', 'ccw'); await tap(1.5, 1); 
  check((await page.locator(R + '.pf-row').count()) === 3 && (await page.inputValue(R + '.pf-pre')) === 'own' && (await page.textContent(R + '.pf-list')).includes('3. Vortex Γ ↺'), 'potential: tapping adds a vortex');
  for (const t of ['source', 'sink', 'cw', 'doublet']) { await page.selectOption(R + '.pf-tap', t); await tap(-1.5, -1); }
  check((await page.locator(R + '.pf-row').count()) === 7 && (await page.textContent(R + '.pf-list')).includes('Sink Q') && (await page.textContent(R + '.pf-list')).includes('Doublet κ'), 'potential: tapping adds a source, sink, vortex and doublet');
  await page.click(R + '.pf-row:nth-child(7) .pf-rm'); check((await page.locator(R + '.pf-row').count()) === 6, 'potential: remove an element');
  await page.click(R + '.pf-clear'); await page.fill(R + '.pf-u', '1'); await page.click(R + '.pf-add'); await page.waitForTimeout(200);
  { const inp = page.locator(R + '.pf-row input').first(); await inp.fill(String(2 * Math.PI)); await page.waitForTimeout(200); check((await big()) === '1 stagnation point: (−1, 0)', 'potential: built a half-body by hand'); }
  await page.fill(R + '.pf-al', '90'); await page.waitForTimeout(200);
  check((await big()) === '1 stagnation point: (0, −1)', `potential: stream turned to 90° (${await big()})`);
  await page.uncheck(R + '.pf-shade'); await page.fill(R + '.pf-w', '5'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.pf-out')).length > 0 && await page.isVisible(R + '.pf-fig'), 'potential: wider view without shading');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pf-csv')]); const f = OUT + 'pf.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'x_m,y_m,u_m_s,v_m_s,psi,phi,Cp' && rows.length === 652, 'potential: velocity field CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=docx]')]); check(d.suggestedFilename() === 'potential-flow.docx', 'potential: Word download'); }
  await page.fill(R + '.pf-u', '-1'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.pf-err')).includes('speed') && await page.isHidden(R + '.pf-out'), 'potential: negative speed message');
  await page.fill(R + '.pf-u', '1'); await page.locator(R + '.pf-row input').nth(1).fill('abc'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.pf-err')).includes('not a number'), 'potential: bad element position message');
  await page.click(R + '.pf-clear'); await page.fill(R + '.pf-u', '0'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.pf-err')).includes('at least one element'), 'potential: empty flow message');
};
