// #548 ODE solver with phase portraits
export const path = '/science/ode-solver/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.odes ';
  const txt = (c) => page.textContent(R + c);
  const dl = async (sel, name) => { await page.locator(R + sel).scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + sel)]); const f = OUT + name; await d.saveAs(f); return readFileSync(f, 'utf8').trim().split('\n'); };
  await page.goto(`${BASE}/science/ode-solver/`); await page.waitForTimeout(900);
  check((await txt('.od-big')) === 'x(30) = −2.00791, y(30) = 0.0519762', 'ode: Van der Pol example solved by RK45');
  check((await txt('.od-facts')).includes('262 (+92 rejected)') && (await txt('.od-facts')).includes('tolerance 1e-6'), 'ode: steps and rejected steps');
  { const t = await txt('.od-eqtab'); check(t.includes('0.5000 + 0.8660i') && t.includes('unstable spiral (focus)'), `ode: origin is an unstable spiral (${t})`); }
  check(await page.isVisible(R + '.od-tfig') && await page.isVisible(R + '.od-pfig'), 'ode: time plot and phase portrait drawn');
  { const rows = await dl('.od-csv', 'ode.csv'); check(rows.length === 1002 && rows[0] === 't,x,y' && rows[1] === '0,2,0', 'ode: solution CSV'); }
  // Tolerance and RK4.
  await page.selectOption(R + '.od-tol', '1e-3'); await page.waitForTimeout(300);
  check((await txt('.od-facts')).includes('tolerance 1e-3') && !(await txt('.od-facts')).includes('262'), 'ode: looser tolerance takes fewer steps');
  await page.selectOption(R + '.od-m', 'rk4'); await page.waitForTimeout(300);
  { const b = await txt('.od-big'), x = Number(b.split(',')[0].split('= ')[1].replace('−', '-')); check((await txt('.od-facts')).includes('RK4, step 0.01') && Math.abs(x + 2.00791) < 1e-4 && await page.isVisible(R + '.od-n'), `ode: RK4 with 3000 steps agrees (${b})`); }
  await page.fill(R + '.od-n', '5'); await page.waitForTimeout(500);
  check((await txt('.od-err')).includes('between 10 and 1,000,000 steps'), 'ode: RK4 step count checked');
  await page.fill(R + '.od-n', '3000'); await page.selectOption(R + '.od-m', 'rk45'); await page.selectOption(R + '.od-tol', '1e-6'); await page.waitForTimeout(300);
  // Tap the phase portrait to add a path, then clear it.
  await page.locator(R + '.od-pfig').scrollIntoViewIfNeeded();
  { const bb = await page.locator(R + '.od-pfig').boundingBox(); await page.mouse.click(bb.x + bb.width * 0.55, bb.y + bb.height * 0.45); await page.waitForTimeout(400); }
  check(await page.isVisible(R + '.od-clear') && (await page.inputValue(R + '.od-x0')) !== '', 'ode: tap adds a path and fixes the window');
  await page.click(R + '.od-clear'); await page.waitForTimeout(300);
  check(await page.isHidden(R + '.od-clear'), 'ode: added paths cleared');
  await page.fill(R + '.od-x0', '-1'); await page.fill(R + '.od-x1', '1'); await page.fill(R + '.od-y0w', '-1'); await page.fill(R + '.od-y1w', '1'); await page.waitForTimeout(500);
  await page.uncheck(R + '.od-field'); await page.uncheck(R + '.od-null'); await page.waitForTimeout(200);
  check(!(await txt('.od-phelp')).includes('nullcline') && (await txt('.od-eqtab')).includes('unstable spiral'), 'ode: typed window, field and nullclines off');
  await page.check(R + '.od-field'); await page.check(R + '.od-null');
  // Bifurcation diagram over mu.
  await page.fill(R + '.od-bn', '1'); await page.click(R + '.od-bgo'); await page.waitForTimeout(300);
  check((await txt('.od-berr')).includes('between 2 and 400'), 'ode: bifurcation value count checked');
  await page.fill(R + '.od-bn', '41'); await page.click(R + '.od-bgo'); await page.waitForTimeout(3000);
  check((await txt('.od-bnote')).startsWith('41 values of mu') && await page.isVisible(R + '.od-bfig'), `ode: bifurcation diagram (${await txt('.od-bnote')})`);
  { const rows = await dl('.od-bcsv', 'bif.csv'); const big = rows.slice(1).map((r) => r.split(',')).filter((r) => Number(r[0]) > 2 && r[2] === 'max'); check(rows[0] === 'mu,x,kind' && big.length > 10 && big.every((r) => Math.abs(Number(r[1]) - 2.02) < 0.02), 'ode: bifurcation CSV, limit cycle size about 2 for mu > 2'); }
  // Downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=png]')]); check(d.suggestedFilename() === 'ode-solver.png', 'ode: report image download'); }
  // Lorenz preset: three equilibria.
  await page.selectOption(R + '.od-pre', { label: 'Lorenz system (chaos)' }); await page.waitForTimeout(800);
  { const t = await txt('.od-eqtab'); check((t.match(/saddle-focus/g) || []).length === 2 && t.includes('saddle (unstable)') && t.includes('8.48528') && (await page.inputValue(R + '.od-x0')) === '', `ode: Lorenz equilibria (${t.slice(0, 120)})`); }
  check((await page.$eval(R + '.od-py', (s) => s.selectedOptions[0].textContent)) === 'z' && (await page.$$(R + '.od-y0 input')).length === 3, 'ode: Lorenz plots x and z, three start values');
  // Logistic: one equation, phase line.
  await page.selectOption(R + '.od-pre', { label: 'Logistic growth (one equation)' }); await page.waitForTimeout(600);
  { const t = await txt('.od-eqtab'); check(t.includes('unstable (repelling)') && t.includes('stable (attracting)') && t.includes('100') && await page.isHidden(R + '.od-pyw'), 'ode: logistic phase line, N = 0 unstable and N = K stable'); }
  // Own equations and errors.
  await page.fill(R + '.od-sys', "x' = k*x"); await page.waitForTimeout(500);
  check((await txt('.od-err')).includes('uses k') && await page.isHidden(R + '.od-out'), 'ode: unknown name message');
  check((await page.inputValue(R + '.od-pre')) === 'own', 'ode: typing switches to My own equations');
  await page.fill(R + '.od-sys', "x' = k*x\nk = -0.5"); await page.waitForTimeout(500);
  { const b = await txt('.od-big'), m = /^x\(30\) = (3\.\d+) × 10⁻⁷$/.exec(b); check(m && Math.abs(Number(m[1]) - 3.05902) < 0.005, `ode: own equation x' = −0.5x gives e^(−15) = 3.059 × 10⁻⁷ within the tolerance (${b})`); }
  await page.fill(R + '.od-t1', '-1'); await page.waitForTimeout(500);
  check((await txt('.od-err')).includes('after the start time'), 'ode: end time before start');
  await page.fill(R + '.od-t1', '30'); await page.fill(R + '.od-sys', "x' = 1/x"); await page.fill(R + '.od-v-0', '0'); await page.waitForTimeout(600);
  check((await txt('.od-err')).includes('not a number'), 'ode: division by zero at the start');
  // PDE playground.
  check((await txt('.od-pbig')) === 'r = D·Δt/Δx² = 0.2500' && (await txt('.od-pst')).startsWith('Stable'), 'ode: heat equation stable at r = 0.25');
  { const rows = await dl('.od-pcsv', 'heat.csv'); const last = rows[26].split(','); check(rows.length === 52 && rows[0].startsWith('x,u at t=0') && Math.abs(Number(last.at(-1)) - 0.6104484575) < 1e-9, 'ode: heat CSV, middle 0.61045 at t = 0.5'); }
  await page.fill(R + '.od-pdt', '0.0025'); await page.waitForTimeout(500);
  check((await txt('.od-pst')).includes('Unstable') && (await txt('.od-pst')).includes('blew up'), 'ode: too large a step blows up');
  await page.click(R + '.od-pmax'); await page.waitForTimeout(300);
  check((await page.inputValue(R + '.od-pdt')) === '0.0018' && (await txt('.od-pst')).startsWith('Stable'), 'ode: 90 % of the largest stable step');
  await page.selectOption(R + '.od-pbc', 'free'); await page.waitForTimeout(300);
  check(await page.isHidden(R + '.od-pl') && (await txt('.od-pst')).startsWith('Stable'), 'ode: insulated ends');
  await page.selectOption(R + '.od-pk', 'wave'); await page.waitForTimeout(400);
  check((await txt('.od-pbig')) === 'Courant number c·Δt/Δx = 0.8000' && await page.isVisible(R + '.od-pv0') && (await txt('.od-pfacts')).includes('Leapfrog'), 'ode: wave equation, Courant 0.8');
  await page.fill(R + '.od-pu0', 'sin(y)'); await page.waitForTimeout(500);
  check((await txt('.od-perr')).includes('only x and L') && await page.isHidden(R + '.od-pout'), 'ode: bad start shape message');
  await page.fill(R + '.od-pu0', 'sin(pi*x/L)'); await page.fill(R + '.od-pnx', '2'); await page.waitForTimeout(500);
  check((await txt('.od-perr')).includes('between 5 and 2001'), 'ode: grid size checked');
};
