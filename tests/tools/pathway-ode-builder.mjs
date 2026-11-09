// #986 pathway ODE builder
export const path = '/science/pathway-ode-builder/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.pob ';
  const t = (s) => page.textContent(R + s);
  const set = async (sel, v) => { await page.fill(R + sel, v); await page.waitForTimeout(500); };
  await page.goto(`${BASE}/science/pathway-ode-builder/`); await page.waitForTimeout(800);
  check((await t('.po-big')) === '3 species, 3 reactions, 4 parameters', 'ODE: example parsed');
  { const e = await page.$$eval(R + '.po-eq li', (l) => l.map((x) => x.textContent)); check(e[0] === 'd[S]/dt = −Vmax1·[S]/(Km1 + [S])' && e[1] === 'd[I]/dt = Vmax1·[S]/(Km1 + [S]) − k2·[I]' && e[2] === 'd[P]/dt = k2·[I] − k3·[P]', 'ODE: equations shown'); }
  { const f = await t('.po-facts'); check(f.includes('10 → 0.0004539') && f.includes('0 → 0.003547') && f.includes('peaks at 1.449 near t = 6') && f.includes('0 → 1.41'), 'ODE: final amounts match solve_ivp (S 0.000454, I 0.00355, P 1.410 at t = 30)'); }
  check(await page.isVisible(R + '.po-sim'), 'ODE: time course chart');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.po-csv')]); const f = OUT + 'pc.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 302 && r[0] === 't,S,I,P' && r[1] === '0,10,0,0' && r[301].startsWith('30,0.000453'), 'ODE: time course CSV'); }
  check((await page.$$eval(R + '.po-boxes input', (b) => b.map((x) => x.value + (x.checked ? '*' : '')).join())) === 'Vmax1*,Km1,k2*,k3', 'fit: parameter boxes, Vmax1 and k2 ticked');
  await page.click(R + '.po-fit'); await page.waitForTimeout(1200);
  check((await t('.po-fbig')) === 'Vmax1 = 1.17, k2 = 0.4012', 'fit: Vmax1 1.170, k2 0.4012 (curve_fit)');
  { const rows = await page.$$eval(R + '.po-ftab tbody tr', (r) => r.map((x) => [...x.cells].map((c) => c.textContent).join('|'))); check(rows[0] === 'Vmax1|1|1.17|0.01001' && rows[1] === 'k2|0.5|0.4012|0.005686', 'fit: standard errors 0.01001, 0.005686 (curve_fit)'); }
  { const f = await t('.po-ffacts'); check(f.includes('0.05361') && f.includes('20 data points') && f.includes('0.9986') && f.includes('converged'), 'fit: SSE 0.05361, R² 0.9986'); }
  check(await page.isVisible(R + '.po-fig'), 'fit: chart');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.po-fcsv')]); const f = OUT + 'pf.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r[0] === 'parameter,start,fitted,std_error' && r[1].startsWith('Vmax1,1,1.170') && r.includes('n,20'), 'fit: CSV'); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl button[data-f=${fmt}]`)]); check(d.suggestedFilename() === `pathway-model.${fmt}`, `ODE: ${fmt} download`); }
  await page.click(R + '.po-use'); await page.waitForTimeout(600);
  { const m = await page.inputValue(R + '.po-model'); check(m.includes('Vmax1 = 1.17001') && m.includes('k2 = 0.401181') && (await page.isHidden(R + '.po-fout')), 'fit: fitted values put into the model'); }
  check((await t('.po-facts')).includes('peaks at'), 'ODE: model re-simulated with the fitted values');
  // Fit only k2: Vmax1 stays at its new value.
  await page.uncheck(R + '.po-boxes input[value=Vmax1]');
  await page.click(R + '.po-fit'); await page.waitForTimeout(1000);
  check((await t('.po-fbig')).startsWith('k2 = 0.401'), 'fit: one parameter');
  // End time option.
  await set('.po-end', '10');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.po-csv')]); const f = OUT + 'pc2.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r[301].startsWith('10,'), 'ODE: end time option'); }
  // Data from a file, reversible and second-order reactions.
  await set('.po-model', 'A <-> B : kf, kr\n2 B -> C : kd\nkf = 1\nkr = 0.3\nkd = 0.2\nA = 5');
  check((await t('.po-big')) === '3 species, 2 reactions, 3 parameters' && (await page.$$eval(R + '.po-eq li', (l) => l[1].textContent)) === 'd[B]/dt = (kf·[A] − kr·[B]) − 2·kd·[B]^2', 'ODE: reversible and 2B -> C equations');
  writeFileSync(OUT + 'ab.csv', 'time,A,C\n1,2.1,0.3\n2,1.4,0.8\n4,1.0,1.4\n6,0.9,1.6\n');
  await page.setInputFiles(R + '.dfb-in', OUT + 'ab.csv'); await page.waitForTimeout(800);
  await page.check(R + '.po-boxes input[value=kf]');
  await page.click(R + '.po-fit'); await page.waitForTimeout(1200);
  check((await page.isVisible(R + '.po-fout')) && (await t('.po-fbig')).startsWith('kf = '), 'fit: data opened from a CSV file, fit kept after leaving the model box');
  // Bad input messages.
  await set('.po-data', 't\tQ\n1\t2');
  await page.click(R + '.po-fit'); await page.waitForTimeout(300);
  check((await t('.po-ferr')).includes('not a species of the model'), 'fit: unknown species message');
  await set('.po-data', 't\tA\n1\tx');
  await page.click(R + '.po-fit'); await page.waitForTimeout(300);
  check((await t('.po-ferr')).includes('not a number'), 'fit: bad cell message');
  await set('.po-data', 't\tA\n1\t2\n2\t1');
  await page.uncheck(R + '.po-boxes input[value=kf]');
  await page.click(R + '.po-fit'); await page.waitForTimeout(300);
  check((await t('.po-ferr')).includes('Tick at least one'), 'fit: no parameter message');
  await set('.po-model', 'A -> B : k');
  check((await t('.po-err')).includes('value for the parameter k') && await page.isHidden(R + '.po-out'), 'ODE: missing value message');
  await set('.po-model', 'A -> B');
  check((await t('.po-err')).includes('colon'), 'ODE: missing rate message');
  await set('.po-model', 'A -> B : k\nk = 1');
  await set('.po-end', '0');
  check((await t('.po-err')).includes('end time'), 'ODE: end time message');
};
