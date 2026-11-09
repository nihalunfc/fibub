// #674 load flow
export const path = '/science/load-flow/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/load-flow/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.lfw .lf-big');
  check((await big()) === 'Converged in 4 iterations (Newton-Raphson); losses 4.562 MW', `load flow: example solves by Newton-Raphson (${await big()})`);
  { const t = await page.textContent('.lfw .lf-facts'); check(t.includes('114.56 MW, 35.72 Mvar') && t.includes('0.9514 pu') && t.includes('bus 5'), 'load flow: slack power and lowest voltage'); }
  { const t = await page.textContent('.lfw .lf-btab'); check(t.includes('0.9628') && t.includes('−6.270') && t.includes('32.76'), 'load flow: bus table'); }
  { const t = await page.textContent('.lfw .lf-ltab'); check(t.includes('77.99') && t.includes('−76.26') && t.includes('1.722'), 'load flow: line table'); }
  check(await page.isVisible('.lfw .lf-sld') && await page.isVisible('.lfw .lf-conv'), 'load flow: single-line diagram and convergence chart');
  await page.selectOption('.lfw .lf-m', 'gs'); await page.waitForTimeout(200);
  { const b = await big(); const n = Number(b.match(/in (\d+) it/)?.[1]); check(/Gauss-Seidel/.test(b) && n > 20 && n < 500 && b.endsWith('4.562 MW') && await page.inputValue('.lfw .lf-max') === '500' && await page.isVisible('.lfw .lf-acc'), `load flow: Gauss-Seidel gives the same losses (${b})`); }
  await page.fill('.lfw .lf-acc', '1'); await page.waitForTimeout(400);
  { const b = await big(); check(b.endsWith('4.562 MW') && Number(b.match(/in (\d+) it/)?.[1]) > 30, `load flow: Gauss-Seidel without acceleration takes longer (${b})`); }
  await page.fill('.lfw .lf-max', '5'); await page.waitForTimeout(400);
  check((await big()).startsWith('Did not converge after 5 iterations'), 'load flow: not converged message');
  await page.selectOption('.lfw .lf-m', 'nr'); await page.fill('.lfw .lf-max', '20'); await page.waitForTimeout(400);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.lfw .lf-bcsv')]); const f = OUT + 'lf-bus.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 6 && rows[0].startsWith('bus,type,V_pu') && rows[5].startsWith('5,PQ,0.951354'), 'load flow: buses CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.lfw .lf-lcsv')]); const f = OUT + 'lf-line.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 7 && rows[3].startsWith('2,3,77.986'), 'load flow: lines CSV'); }
  // Base 50 MVA: same MW now twice as many per unit, so losses go up.
  await page.fill('.lfw .lf-base', '200'); await page.waitForTimeout(400);
  check(/losses [\d.]+ MW/.test(await big()) && !(await big()).includes('4.562'), 'load flow: base power changes the per-unit network');
  await page.fill('.lfw .lf-base', '100'); await page.waitForTimeout(300);
  // An opened CSV file of lines (with tabs).
  writeFileSync(OUT + 'lines.csv', 'from\tto\tR\tX\tB\n1\t2\t0.015\t0.08\t0.04\n1\t4\t0.03\t0.12\t0.03\n2\t3\t0.025\t0.10\t0.02\n2\t4\t0.04\t0.15\t0.025\n3\t5\t0.02\t0.09\t0.02\n4\t5\t0.035\t0.14\t0.03\n');
  await page.setInputFiles('.lfw .dfb[data-target=".lf-line"] .dfb-in', OUT + 'lines.csv'); await page.waitForTimeout(600);
  check((await big()).endsWith('4.562 MW'), 'load flow: line file opened');
  // Bad inputs.
  const bus = await page.inputValue('.lfw .lf-bus');
  await page.fill('.lfw .lf-bus', bus.replace('1, slack', '1, PQ')); await page.waitForTimeout(400);
  check((await page.textContent('.lfw .lf-err')).includes('must be the slack') && await page.isHidden('.lfw .lf-out'), 'load flow: no slack message');
  await page.fill('.lfw .lf-bus', bus.replace('4, PQ', '4, gen2')); await page.waitForTimeout(400);
  check((await page.textContent('.lfw .lf-err')).includes('slack, PV or PQ'), 'load flow: bad type message');
  await page.fill('.lfw .lf-bus', bus + '\n6, PQ, 10, 2, 0, 1'); await page.waitForTimeout(400);
  check((await page.textContent('.lfw .lf-err')).includes('Bus 6 is not connected'), 'load flow: island message');
  await page.fill('.lfw .lf-bus', bus); await page.fill('.lfw .lf-base', '0'); await page.waitForTimeout(400);
  check((await page.textContent('.lfw .lf-err')).includes('base power'), 'load flow: base power message');
  await page.fill('.lfw .lf-base', '100'); await page.waitForTimeout(400);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.lfw .dl [data-f=pdf]')]); const f = OUT + 'lf.pdf'; await d.saveAs(f); check(readFileSync(f).subarray(0, 4).toString() === '%PDF', 'load flow: PDF report'); }
};
