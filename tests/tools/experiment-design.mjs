// #567 Design of experiments generator
export const path = '/science/experiment-design/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const txt = (s) => page.textContent(`.de ${s}`);
  const wait = (ms = 700) => page.waitForTimeout(ms);
  const fake = async () => { await page.click('.de .de-fake'); await wait(400); };
  const firstRun = async () => (await page.$$eval('.de .de-runs tbody tr:first-child td', (t) => t.map((x) => x.textContent))).join('|');
  await page.goto(`${BASE}${path}`); await wait(1000);

  // Default: 2^(5−1), resolution V, best generators.
  check((await txt('.de-big')) === '16 runs: 2^(5−1) fractional factorial, resolution V', `doe: default half fraction (${await txt('.de-big')})`);
  { const f = await txt('.de-facts'); check(f.includes('E=ABCD') && f.includes('A5 = 1'), `doe: generator and word-length pattern (${f})`); }
  check((await txt('.de-rel')).includes('I = ABCDE') && (await txt('.de-alias')).includes('ABCDE'), 'doe: defining relation and alias table');
  check((await firstRun()) === '1|13|150|30|2|1.5|400', `doe: seeded run order (${await firstRun()})`);
  { await page.locator('.de .de-csv').scrollIntoViewIfNeeded(); const [dl] = await Promise.all([page.waitForEvent('download'), page.click('.de .de-csv')]); const f = OUT + 'doe-runs.csv'; await dl.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n');
    check(r[0] === 'run,std_order,block,type,A_coded,B_coded,C_coded,D_coded,E_coded,Temperature,Time,Pressure,Catalyst,Stirring,response' && r.length === 17 && r[1].startsWith('1,13,1,factorial,-1,-1,1,1,1,150,30,2,1.5,400'), `doe: run sheet CSV (${r[0]} / ${r[1]})`); }

  // Made-up responses, unreplicated: Lenth's method.
  await fake();
  check((await txt('.de-an-big')) === "4 of 15 effects stand out (Lenth's margin of error 1.123)", `doe: Lenth analysis (${await txt('.de-an-big')})`);
  { const t = await txt('.de-eff'); check(t.includes('AC = BDE') && t.includes('12.004') && t.includes('−6.5862') && (await txt('.de-an-facts')).includes("Lenth's PSE0.4369"), 'doe: effects table'); }
  check(await page.isVisible('.de .de-c-a') && await page.isVisible('.de .de-c-b'), 'doe: Pareto and half-normal plots');
  await page.selectOption('.de .de-yorder', 'std'); await wait();
  check(!(await txt('.de-an-big')).includes('1.123'), 'doe: responses read in standard order instead');
  await page.selectOption('.de .de-yorder', 'run'); await wait();

  // Centre runs: t tests and curvature.
  await page.fill('.de .de-c0', '4'); await wait();
  check((await txt('.de-an-err')).includes('There are 20 runs but 16 responses'), 'doe: response count must match');
  await fake();
  check((await txt('.de-an-big')) === '4 of 15 effects significant at 5 % (t tests, 3 residual df)' && (await txt('.de-an-facts')).includes('p = 0.0024: the response bends'), `doe: centre runs give t tests and curvature (${await txt('.de-an-facts')})`);
  await page.fill('.de .de-y', '1\n2\nx'); await wait();
  check((await txt('.de-an-err')).includes('must be a number'), 'doe: text in the responses refused');
  await page.fill('.de .de-y', ''); await page.fill('.de .de-c0', '0');
  // Seed and randomisation.
  await page.fill('.de .de-seed', '7'); await wait();
  check((await firstRun()) !== '1|13|150|30|2|1.5|400', 'doe: another seed, another order');
  await page.uncheck('.de .de-rand'); await wait();
  check((await firstRun()) === '1|1|150|30|1|0.5|400', `doe: standard order when not randomised (${await firstRun()})`);
  await page.check('.de .de-rand'); await page.fill('.de .de-seed', '-1'); await wait();
  check((await txt('.de-err')).includes('seed') && await page.isHidden('.de .de-out'), 'doe: bad seed refused');
  await page.fill('.de .de-seed', '1');

  // Seven factors in 16 runs: best and own generators.
  await page.fill('.de .de-k', '7'); await wait(); await page.selectOption('.de .de-p', '3'); await wait();
  check((await txt('.de-big')) === '16 runs: 2^(7−3) fractional factorial, resolution IV' && (await txt('.de-facts')).includes('A4 = 7'), `doe: 2^(7−3) minimum aberration (${await txt('.de-facts')})`);
  await page.selectOption('.de .de-genmode', 'custom'); await page.fill('.de .de-gens', 'E=AB, F=AC, G=BC'); await wait();
  check((await txt('.de-big')).includes('resolution III') && (await txt('.de-alias')).includes('AB'), 'doe: own generators, resolution III');
  await page.fill('.de .de-gens', 'E=ABC, F=ABC, G=ABD'); await wait();
  check((await txt('.de-err')).includes('same interaction'), 'doe: repeated generator refused');
  await page.fill('.de .de-gens', 'E=ABC'); await wait();
  check((await txt('.de-err')).includes('Give 3 generators'), 'doe: wrong number of generators refused');
  await page.selectOption('.de .de-genmode', 'best'); await wait();

  // Plackett–Burman.
  await page.selectOption('.de .de-type', 'pb'); await page.fill('.de .de-k', '11'); await wait();
  check((await txt('.de-big')) === '12 runs: 12-run Plackett–Burman design' && await page.isHidden('.de .de-aliasbox'), `doe: 12-run Plackett–Burman (${await txt('.de-big')})`);
  await fake();
  check((await txt('.de-an-big')).includes('stand out') && (await txt('.de-eff')).includes('Temperature'), 'doe: screening analysis');
  await page.fill('.de .de-k', '7'); await wait(); await page.selectOption('.de .de-N', '20'); await page.fill('.de .de-rep', '2'); await wait();
  check((await txt('.de-big')) === '40 runs: 20-run Plackett–Burman design' && (await txt('.de-facts')).includes('12 (kept as dummy'), 'doe: replicated 20-run design');
  await fake();
  check((await txt('.de-an-big')).includes('t tests') && (await txt('.de-eff')).includes('dummy 12'), 'doe: replicated screening uses t tests');
  await page.fill('.de .de-rep', '1');

  // Central composite.
  await page.selectOption('.de .de-type', 'ccd'); await page.fill('.de .de-k', '3'); await wait();
  check((await txt('.de-big')) === '19 runs: Central composite design (CCC)' && (await txt('.de-facts')).includes('α1.6818'), `doe: rotatable CCD (${await txt('.de-facts')})`);
  await fake();
  check((await txt('.de-an-big')) === 'Quadratic model: R² = 0.9913, adjusted 0.9825' && (await txt('.de-an-facts')).includes('saddle point') && (await txt('.de-eff')).includes('Temperature·Pressure'), `doe: quadratic fit (${await txt('.de-an-big')})`);
  await page.selectOption('.de .de-face', 'faced'); await wait();
  check((await txt('.de-facts')).includes('α1 (coded'), 'doe: face-centred CCD');
  await page.selectOption('.de .de-face', 'circumscribed'); await page.selectOption('.de .de-alpha', 'orthogonal'); await wait();
  check(!(await txt('.de-facts')).includes('α1.6818'), 'doe: orthogonal-block α');
  await page.fill('.de .de-k', '5'); await wait();
  check(await page.isVisible('.de .de-half'), 'doe: half-fraction option for 5 factors');
  await page.check('.de .de-half'); await wait();
  check((await txt('.de-facts')).includes('half fraction, resolution V'), 'doe: CCD with a half-fraction core');
  await page.uncheck('.de .de-half');
  const lo = page.locator('.de .de-flo').first(); await lo.fill('cold'); await wait();
  check((await txt('.de-err')).includes('need numbers'), 'doe: CCD needs numeric settings');
  await lo.fill('150'); await wait();

  // Box–Behnken.
  await page.selectOption('.de .de-type', 'bbd'); await page.fill('.de .de-k', '3'); await page.fill('.de .de-y', ''); await wait();
  check((await txt('.de-big')) === '15 runs: Box–Behnken design', `doe: Box–Behnken (${await txt('.de-big')})`);
  await fake();
  check((await txt('.de-an-big')) === 'Quadratic model: R² = 0.9875, adjusted 0.965', `doe: Box–Behnken fit (${await txt('.de-an-big')})`);
  await page.fill('.de .de-k', '6'); await wait();
  check((await txt('.de-facts')).includes('every pair'), 'doe: note for 6 or more factors');

  // Full factorial with several levels.
  await page.selectOption('.de .de-type', 'full'); await page.fill('.de .de-k', '3'); await page.fill('.de .de-y', ''); await wait();
  check((await txt('.de-big')) === '8 runs: 2^3 full factorial', 'doe: 2^3 full factorial');
  await page.locator('.de .de-flv').nth(0).fill('150, 165, 180'); await page.locator('.de .de-flv').nth(2).fill('glass, steel, PTFE, nylon'); await wait();
  check((await txt('.de-big')) === '24 runs: 3 × 2 × 4 full factorial' && (await txt('.de-runs')).includes('PTFE'), 'doe: mixed-level full factorial with named levels');
  await fake();
  check((await txt('.de-an-big')) === 'Main effects: R² = 0.6378 with 17 residual df' && (await txt('.de-eff')).includes('Pressure3'), `doe: main-effects ANOVA (${await txt('.de-an-big')})`);
  await page.fill('.de .de-c0', '2'); await wait();
  check((await txt('.de-err')).includes('every factor has 2 levels'), 'doe: no centre runs with more levels');
  await page.fill('.de .de-c0', '0'); await page.locator('.de .de-flv').nth(1).fill('30'); await wait();
  check((await txt('.de-err')).includes('2 to 6 levels'), 'doe: one level refused');
  await page.locator('.de .de-flv').nth(1).fill('30, 60'); await page.locator('.de .de-fn').nth(1).fill('Temperature'); await wait();
  check((await txt('.de-err')).includes('different name'), 'doe: duplicate names refused');
  await page.locator('.de .de-fn').nth(1).fill('Time'); await wait();
  await page.setViewportSize({ width: 375, height: 900 }); await wait(); await page.screenshot({ path: OUT + 'experiment-design-375.png', fullPage: true }); await page.setViewportSize({ width: 1280, height: 900 });

  // Downloads.
  for (const f of ['png', 'pdf', 'docx']) { await page.locator(`.de .dl button[data-f="${f}"]`).scrollIntoViewIfNeeded(); const [dl] = await Promise.all([page.waitForEvent('download'), page.click(`.de .dl button[data-f="${f}"]`)]); check(dl.suggestedFilename() === `experiment-design.${f}`, `doe: ${f} download`); }

  // Bad factor count.
  await page.fill('.de .de-k', '0'); await wait();
  check((await txt('.de-err')).includes('number of factors'), 'doe: bad factor count');
};
