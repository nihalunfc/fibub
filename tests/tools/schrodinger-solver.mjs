// #923 1D Schrödinger solver
export const path = '/science/schrodinger-solver/';
export default async ({ page, check, OUT, BASE, readFileSync }) => {
  await page.goto(`${BASE}/science/schrodinger-solver/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.sch .sc-big'), tab = () => page.textContent('.sch .sc-tab');
  const set = async (sel, v) => { await page.fill(`.sch ${sel}`, v); await page.waitForTimeout(450); };
  check((await big()) === 'E₀ = 0.499992, E₁ = 1.49996', 'schrodinger: harmonic example levels');
  { const t = await tab(); check(t.includes('Exact') && t.includes('0.5') && t.includes('0.7071') && (await page.textContent('.sch .sc-facts')).includes('Gap E₁ − E₀0.99997'), 'schrodinger: table with exact levels, Δx and the gap'); }
  check(await page.isVisible('.sch .sc-fig'), 'schrodinger: picture shown');
  await page.selectOption('.sch .sc-show', 'prob'); await page.waitForTimeout(400);
  check(await page.isVisible('.sch .sc-fig'), 'schrodinger: probability picture');
  await page.selectOption('.sch .sc-pre', 'box'); await page.waitForTimeout(300);
  check((await big()).startsWith('E₀ = 4.93480') && (await tab()).includes('4.934802'), 'schrodinger: box levels near π²/2');
  await page.selectOption('.sch .sc-pre', 'finite'); await page.waitForTimeout(300);
  check((await big()).startsWith('E₀ = −9.1737') && (await tab()).includes('−9.18026') && (await page.textContent('.sch .sc-facts')).includes('Bound states (exact)3') && (await tab()).includes(' *'), 'schrodinger: finite well, 3 bound states, box states starred');
  await page.selectOption('.sch .sc-pre', 'double'); await page.waitForTimeout(300);
  check((await big()) === 'E₀ = 1.95665, E₁ = 1.99967', 'schrodinger: double well tunnelling pair');
  await page.selectOption('.sch .sc-pre', 'morse'); await page.waitForTimeout(300);
  check((await big()).startsWith('E₀ = 1.0867') && (await tab()).includes('1.086784'), 'schrodinger: Morse levels');
  await page.selectOption('.sch .sc-pre', 'linear'); await page.waitForTimeout(300);
  check((await big()).startsWith('E₀ = 1.8557') && (await tab()).includes('1.855757'), 'schrodinger: linear well and Airy zeros');
  await page.selectOption('.sch .sc-pre', 'poschl'); await page.waitForTimeout(300);
  check((await big()).startsWith('E₀ = −8.000') && (await tab()).includes('−4.5'), 'schrodinger: Pöschl–Teller levels');
  await page.selectOption('.sch .sc-pre', 'formula'); await page.waitForTimeout(300);
  await set('.sc-f', '0.5*x^2'); await set('.sc-x0', '-8'); await set('.sc-x1', '8');
  check((await big()) === 'E₀ = 0.499992, E₁ = 1.49996', 'schrodinger: formula 0.5*x^2');
  await set('.sc-f', '0.5*y^2'); check((await page.textContent('.sch .sc-err')).includes('only use x') && await page.isHidden('.sch .sc-out'), 'schrodinger: bad formula message');
  await set('.sc-f', '0.5*x^2');
  await page.selectOption('.sch .sc-n', '4000'); await page.waitForTimeout(500);
  check((await big()).startsWith('E₀ = 0.500000'), 'schrodinger: finer grid is more accurate');
  await page.selectOption('.sch .sc-pre', 'draw'); await page.waitForTimeout(400);
  const b1 = await big();
  await page.locator('.sch .sc-pad').scrollIntoViewIfNeeded();
  { const bb = await page.locator('.sch .sc-pad').boundingBox(); await page.mouse.move(bb.x + bb.width * 0.3, bb.y + bb.height * 0.9); await page.mouse.down(); await page.mouse.move(bb.x + bb.width * 0.7, bb.y + bb.height * 0.9, { steps: 12 }); await page.mouse.up(); await page.waitForTimeout(300); }
  check((await big()) !== b1 && (await big()).startsWith('E₀ = '), `schrodinger: drawing changes the levels (${b1} → ${await big()})`);
  await page.click('.sch .sc-clear'); await page.waitForTimeout(300);
  check((await big()).startsWith('E₀ = 0.049'), `schrodinger: flat drawing gives the box of width 10 (${await big()})`);
  await page.selectOption('.sch .sc-u', 'electron'); await page.waitForTimeout(300);
  await page.selectOption('.sch .sc-pre', 'harmonic'); await page.waitForTimeout(300);
  check((await big()).startsWith('E₀ = 0.0500') && (await big()).includes(' eV') && (await page.textContent('.sch .sc-facts')).includes('photon wavelength'), 'schrodinger: electron units in eV with a photon wavelength');
  await set('.sc-m', '0.067'); await set('.sc-x0', '-20'); await set('.sc-x1', '20'); check((await big()).startsWith('E₀ = 0.0500'), 'schrodinger: effective mass keeps ħω levels');
  await page.selectOption('.sch .sc-pre', 'finite'); await page.waitForTimeout(300); await set('.sc-m', '0.067');
  check((await page.textContent('.sch .sc-tab')).includes('(eV)') && (await page.textContent('.sch .sc-t1')).includes('(eV)'), 'schrodinger: electron finite well labels');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.sch .sc-csv')]); const f = OUT + 'sch.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 7 && r[0].startsWith('n,E (eV),Exact'), 'schrodinger: levels CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.sch .sc-wcsv')]); const f = OUT + 'schw.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 4001 && r[0] === 'x,V,psi_0,psi_1,psi_2,psi_3,psi_4,psi_5', `schrodinger: wavefunctions CSV (${r.length} rows, ${r[0]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.sch .dl [data-f=pdf]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'schrodinger: PDF report'); }
  await set('.sc-x1', '-10'); check((await page.textContent('.sch .sc-err')).includes('right wall'), 'schrodinger: wall order message');
  await set('.sc-x1', '4'); await set('.sc-k', '40'); check((await page.textContent('.sch .sc-err')).includes('between 1 and 30'), 'schrodinger: level count message');
  await set('.sc-k', '6'); await set('.sc-m', '0'); check((await page.textContent('.sch .sc-err')).includes('mass'), 'schrodinger: mass message');
  await set('.sc-m', '1'); await set('.sc-p1', '-1'); check((await page.textContent('.sch .sc-err')).includes('greater than 0'), 'schrodinger: depth message');
};
