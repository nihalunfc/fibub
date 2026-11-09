// Nash equilibrium solver: presets, typed payoffs, zero-sum, weak dominance, resizing, downloads and bad input.
export const path = '/science/nash-equilibrium-solver/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  page.setDefaultTimeout(120000); // pages load slowly when many builds share the machine; reset at the end
  const dl = async (sel) => { await page.locator(sel).scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click(sel)]); const f = OUT + d.suggestedFilename(); await d.saveAs(f); return f; };
  const big = () => page.textContent('.ne-big');
  const waitBig = (re) => page.waitForFunction((s) => new RegExp(s).test(document.querySelector('.ne-big')?.textContent || ''), re.source);
  await page.goto(BASE + path);
  check((await big()) === '3 equilibria: 2 pure, 1 mixed', `nash: battle of the sexes (${await big()})`);
  const eq = await page.textContent('.ne-eq');
  check(/Opera 3\/5, Football 2\/5/.test(eq) && /Opera 2\/5, Football 3\/5/.test(eq) && /1\.2/.test(eq), `nash: mixed equilibrium 3/5 and 2/5 (${eq})`);
  check((await page.locator('.ne-br td.ne-nash').count()) === 2, 'nash: two pure equilibria shaded');
  const csv = readFileSync(await dl('.ne-csv'), 'utf8');
  check(/^#,Row player plays,Column player plays/.test(csv) && /"Opera 3\/5, Football 2\/5"/.test(csv), 'nash: CSV download');
  check(readFileSync(await dl('.dl [data-f=png]')).slice(1, 4).toString() === 'PNG', 'nash: image report');
  await page.selectOption('.ne-pre', 'pd');
  await waitBig(/^One equilibrium, in pure strategies$/);
  const el = await page.textContent('.ne-elim');
  check(/Quiet is strictly dominated by Confess/.test(el) && /solved by dominance/.test(el) && (await page.locator('.ne-br td.ne-gone').count()) === 3, `nash: prisoner's dilemma by dominance (${el})`);
  await page.selectOption('.ne-pre', 'rps');
  await waitBig(/mixed strategies$/);
  check(/Rock 1\/3, Paper 1\/3, Scissors 1\/3/.test(await page.textContent('.ne-eq')) && await page.isVisible('.ne-zsbox') && /Value of the game \(to the row player\)0/.test(await page.textContent('.ne-zsf')), 'nash: rock paper scissors and zero-sum value 0');
  await page.selectOption('.ne-pre', 'm33');
  await waitBig(/^3 equilibria: 2 pure, 1 mixed$/);
  const m = await page.textContent('.ne-eq');
  check(/Top 1\/3, Middle 2\/3/.test(m) && /Centre 1\/3, Right 2\/3/.test(m) && /1\.667/.test(m), `nash: made-up 3 x 3 (${m})`);
  // Type a zero-sum 2 x 3 game: value from the LP.
  await page.selectOption('.ne-pre', 'mp');
  await waitBig(/mixed/);
  await page.selectOption('.ne-n', '3');
  await page.waitForFunction(() => document.querySelectorAll('.ne-cell').length === 6);
  await page.fill('.ne-cell[data-i="0"][data-j="2"]', '2'); await page.fill('.ne-cell[data-i="1"][data-j="2"]', '-3');
  await page.waitForFunction(() => /Value of the game \(to the row player\)−0\.1429/.test(document.querySelector('.ne-zsf')?.textContent || ''));
  check(/Value of the game \(to the row player\)−0\.1429/.test(await page.textContent('.ne-zsf')) && /Heads 4\/7, Tails 3\/7/.test(await page.textContent('.ne-zsf')) && /Tails 5\/7, C3 2\/7/.test(await page.textContent('.ne-zsf')), `nash: 2 x 3 zero-sum matches nashpy (−1/7) (${await page.textContent('.ne-zsf')})`);
  // Weak dominance.
  await page.uncheck('.ne-zs');
  await page.selectOption('.ne-pre', 'blank'); await page.selectOption('.ne-n', '2');
  await page.waitForFunction(() => document.querySelectorAll('.ne-cell').length === 4);
  for (const [i, j, v] of [[0, 0, '1, 1'], [0, 1, '1, 1'], [1, 0, '1, 1'], [1, 1, '0, 0']]) await page.fill(`.ne-cell[data-i="${i}"][data-j="${j}"]`, v);
  await page.waitForFunction(() => /degenerate/.test(document.querySelector('.ne-degen')?.textContent || '') && !document.querySelector('.ne-degen').hidden);
  check(/No strategy is strictly dominated/.test(await page.textContent('.ne-elim')), 'nash: weakly dominated game, strict elimination does nothing, degenerate note shown');
  await page.check('.ne-weak');
  await page.waitForFunction(() => /R2 is dominated by R1/.test(document.querySelector('.ne-elim')?.textContent || ''));
  check(true, 'nash: weak dominance removes R2');
  await page.fill('.ne-cell[data-i="0"][data-j="0"]', '1');
  await page.waitForSelector('.ne-err:not([hidden])');
  check(/two numbers/.test(await page.textContent('.ne-err')), 'nash: one number in a two-player cell is explained');
  await page.fill('.ne-cell[data-i="0"][data-j="0"]', '1, 1');
  await page.selectOption('.ne-m', '6'); await page.selectOption('.ne-n', '6');
  await page.waitForFunction(() => document.querySelectorAll('.ne-cell').length === 36);
  await waitBig(/equilibri/);
  check(true, 'nash: 6 x 6 table solves');
  page.setDefaultTimeout(30000);
};
