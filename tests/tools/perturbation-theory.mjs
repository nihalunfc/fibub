// #928 perturbation theory checker
export const path = '/science/perturbation-theory/';
export default async ({ page, check, OUT, BASE, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/perturbation-theory/`); await page.waitForTimeout(1200);
  const big = () => page.textContent('.ptb .pt-big'), tab = () => page.textContent('.ptb .pt-tab'), facts = () => page.textContent('.ptb .pt-facts');
  check((await big()) === 'Lowest level: exact 0.03609767, second order 0.03624', 'pert: three-level example');
  { const t = await tab(); check(t.includes('−0.094') && t.includes('−0.01724') && t.includes('0.9796523') && t.includes('2.56425'), 'pert: example corrections and exact levels'); }
  check((await facts()).includes('0.06') && await page.isVisible('.ptb .pt-fig'), 'pert: coupling ratio and plot');
  await page.selectOption('.ptb .pt-pre', 'x4'); await page.waitForTimeout(800);
  check((await big()) === 'Lowest level: exact 0.5072562, second order 0.5072375' && (await tab()).includes('0.75') && (await tab()).includes('−2.625') && (await tab()).includes('20.8125'), 'pert: anharmonic oscillator series');
  await page.selectOption('.ptb .pt-pre', 'deg'); await page.waitForTimeout(600);
  { const t = await tab(); check(t.includes('×3') && t.includes('−0.0625') && t.includes('0.145') && t.includes('1.04937'), 'pert: degenerate levels'); }
  await page.selectOption('.ptb .pt-pre', 'deg2'); await page.waitForTimeout(600);
  check((await tab()).includes('−0.009950494') && (await tab()).includes('×2'), 'pert: second-order splitting');
  await page.selectOption('.ptb .pt-pre', 'cplx'); await page.waitForTimeout(600);
  check((await big()) === 'Lowest level: exact 0.01661854, second order 0.01785', 'pert: complex couplings');
  await page.fill('.ptb .pt-lam', '3'); await page.waitForTimeout(700);
  check((await facts()).includes('unreliable'), 'pert: large λ warning');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ptb .pt-csv')]); const f = OUT + 'pt.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 4 && r[0].startsWith('n,E0,set,E1,E2,E3'), 'pert: levels CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ptb .pt-ccsv')]); const f = OUT + 'ptc.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 122 && r[0] === 'lambda,exact_0,exact_1,exact_2', 'pert: curves CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.ptb .dl [data-f=docx]')]); check((await d.suggestedFilename()).endsWith('.docx'), 'pert: Word report'); }
  writeFileSync(OUT + 'v.csv', '0,0.1\n0.1,0\n'); writeFileSync(OUT + 'h0.csv', '0,0\n0,1\n');
  await page.setInputFiles('.ptb .dfb[data-target=".pt-h0"] .dfb-in', OUT + 'h0.csv'); await page.setInputFiles('.ptb .dfb[data-target=".pt-v"] .dfb-in', OUT + 'v.csv'); await page.fill('.ptb .pt-lam', '1'); await page.waitForTimeout(800);
  check((await big()) === 'Lowest level: exact −0.009901951, second order −0.01', 'pert: matrices opened from files (two-level, exact (1 − √1.04)/2)');
  await page.fill('.ptb .pt-v', '0 1\n2 0'); await page.waitForTimeout(600);
  check((await page.textContent('.ptb .pt-err')).includes('Hermitian') && await page.isHidden('.ptb .pt-out'), 'pert: non-Hermitian message');
  await page.fill('.ptb .pt-v', '0 1 2\n1 0 1\n2 1 0'); await page.waitForTimeout(600);
  check((await page.textContent('.ptb .pt-err')).includes('same size'), 'pert: size mismatch message');
  await page.fill('.ptb .pt-v', '0 x\nx 0'); await page.waitForTimeout(600);
  check((await page.textContent('.ptb .pt-err')).includes('not a number'), 'pert: bad entry message');
  await page.fill('.ptb .pt-v', '0 0.1\n0.1 0'); await page.fill('.ptb .pt-lam', '0'); await page.waitForTimeout(600);
  check((await page.textContent('.ptb .pt-err')).includes('λ'), 'pert: λ message');
};
