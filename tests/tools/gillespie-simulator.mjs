// #988 Gillespie stochastic simulator
export const path = '/science/gillespie-simulator/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.gsp ';
  const t = (s) => page.textContent(R + s);
  const pick = async (sel, v, w = 600) => { await page.selectOption(R + sel, v); await page.waitForTimeout(w); };
  const set = async (sel, v, w = 700) => { await page.fill(R + sel, v); await page.waitForTimeout(w); };
  const pixels = () => page.$eval(R + '.gs-fig', (c) => c.toDataURL());
  await page.goto(`${BASE}/science/gillespie-simulator/`); await page.waitForTimeout(1000);
  check((await t('.gs-big')) === 'X at t = 10: mean 9.99, SD 3.05', 'SSA: birth-death example, mean ≈ k0/kd = 10');
  { const f = await t('.gs-facts'); check(f.includes('38,327 reactions') && f.includes('0.932') && f.includes('5 to 15') && f.includes('lowest 4, highest 18') && f.includes('ODE value10') && f.includes('−0.00455'), 'SSA: facts (Fano ≈ 1 as for Poisson, ODE 10)'); }
  check(await page.isVisible(R + '.gs-fig') && await page.isVisible(R + '.gs-hist'), 'SSA: time course and histogram');
  const p0 = await pixels();
  await page.uncheck(R + '.gs-ode'); await page.waitForTimeout(500);
  check(!(await t('.gs-facts')).includes('ODE value') && (await pixels()) !== p0, 'SSA: ODE curve off');
  await page.check(R + '.gs-ode'); await page.waitForTimeout(500);
  await set('.gs-tr', '0');
  check((await pixels()) !== p0, 'SSA: no single runs drawn');
  await set('.gs-tr', '5');
  check((await pixels()) === p0, 'SSA: same seed, same picture');
  await set('.gs-seed', '2');
  check((await t('.gs-big')) !== 'X at t = 10: mean 9.99, SD 3.05' && (await t('.gs-big')).startsWith('X at t = 10: mean '), 'SSA: another seed');
  await set('.gs-seed', '1'); await set('.gs-runs', '50');
  check((await t('.gs-facts')).includes('Runs50'), 'SSA: number of runs');
  await set('.gs-runs', '200'); await set('.gs-end', '5');
  check((await t('.gs-big')).startsWith('X at t = 5: '), 'SSA: end time');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.gs-csv')]); const f = OUT + 'gs.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 102 && r[0] === 't,mean_X,sd_X,p5_X,p95_X,ode_X' && r[1] === '0,0,0,0,0,0' && r[101].startsWith('5,'), 'SSA: mean and spread CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.gs-fcsv')]); const f = OUT + 'gf.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 201 && r[0] === 'run,X' && /^1,\d+$/.test(r[1]), 'SSA: final counts CSV'); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl button[data-f=${fmt}]`)]); check(d.suggestedFilename() === `gillespie.${fmt}`, `SSA: ${fmt} download`); }
  await pick('.gs-ex', 'ge', 3000);
  { const b = await t('.gs-big'), f = await t('.gs-facts'); check(b === 'P at t = 80: mean 99.7, SD 25.9' && f.includes('6.75') && f.includes('ODE value99.9'), 'SSA: gene expression, protein mean ≈ 100 and Fano ≫ 1 (bursts)'); }
  await pick('.gs-sp', 'M', 2500);
  check((await t('.gs-big')).startsWith('M at t = 80: mean '), 'SSA: species choice');
  await pick('.gs-ex', 'dim', 1200);
  check((await t('.gs-big')).startsWith('A at t = 20: ') && (await page.$$eval(R + '.gs-sp option', (o) => o.map((x) => x.value).join())) === 'A,B', 'SSA: dimerisation example');
  await pick('.gs-ex', 'sw', 2000);
  check((await t('.gs-big')) === 'X at t = 30: mean 13, SD 10.5' && (await t('.gs-facts')).includes('ODE value1.02'), 'SSA: toggle, runs leave the ODE low state');
  await set('.gs-model', 'A -> : k\nk = 1\nA = 2.5');
  check((await t('.gs-err')).includes('whole number') && await page.isHidden(R + '.gs-out'), 'SSA: whole-number start message');
  await set('.gs-model', '-> X : k0\nX -> : kd\nk0 = 10\nkd = 1'); await set('.gs-runs', '0');
  check((await t('.gs-err')).includes('runs from 1 to 2,000'), 'SSA: runs message');
  await set('.gs-runs', '200'); await set('.gs-tr', '50');
  check((await t('.gs-err')).includes('0 to 20'), 'SSA: single runs message');
  await set('.gs-tr', '5'); await set('.gs-seed', '1.5');
  check((await t('.gs-err')).includes('seed'), 'SSA: seed message');
  await set('.gs-seed', '1'); await set('.gs-end', '1000000', 4000);
  check((await t('.gs-err')).includes('More than 5,000,000 reactions'), 'SSA: too many reactions message');
  await set('.gs-end', '10'); await set('.gs-model', 'X -> Y');
  check((await t('.gs-err')).includes('colon'), 'SSA: bad model message');
};
