// #1126 Natural selection with peppered moths
export const path = '/learn/natural-selection/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.nsl ';
  await page.goto(`${BASE}/learn/natural-selection/?seed=5`); await page.waitForTimeout(600);
  const tap = async (sel) => { await page.locator(R + sel).first().scrollIntoViewIfNeeded(); await page.locator(R + sel).first().click(); await page.waitForTimeout(250); };
  const slide = async (sel, v) => { await page.$eval(R + sel, (el, v) => { el.value = String(v); el.dispatchEvent(new Event('input', { bubbles: true })); }, v); await page.waitForTimeout(250); };
  const big = () => page.textContent(R + '.nsl-big'), facts = () => page.textContent(R + '.nsl-facts');
  check((await page.textContent(R + '.nsl-pv')).includes('10 % of moths are dark') || (await page.textContent(R + '.nsl-pv')).includes('(so 10 %'), `moths: start label (${await page.textContent(R + '.nsl-pv')})`);
  check((await page.getAttribute(R + '.nsl-n button[data-v="5000"]', 'aria-pressed')) === 'true' && (await page.getAttribute(R + '.nsl-mu button[data-v="0.0001"]', 'aria-pressed')) === 'true' && (await page.textContent(R + '.nsl-muhelp')).startsWith('Mutation:'), 'moths: defaults 5000 moths, mutation 1 in 10,000, explained');
  check(Number((await big()).split(' ')[0]) > 80, `moths: soot story with 5000 moths ends mostly dark (${await big()})`);
  // Small population, no mutation, light bark: the dark allele is lost by drift and the page says so
  await tap('.nsl-bark button[data-v=light]'); await tap('.nsl-n button[data-v="50"]'); await tap('.nsl-mu button[data-v="0"]');
  check((await page.textContent(R + '.nsl-say')).includes('lost by chance') && (await page.textContent(R + '.nsl-say')).includes('can never come back'), `moths: drift loss explained (${(await page.textContent(R + '.nsl-say')).slice(-160)})`);
  await tap('.nsl-mu button[data-v="0.0001"]'); await tap('.nsl-n button[data-v="5000"]'); await tap('.nsl-bark button[data-v=soot]');
  // Expected path (no chance)
  await tap('.nsl-n button[data-v=inf]');
  check((await big()) === '99 % dark moths in generation 60' && (await page.textContent(R + '.nsl-formula')).includes('= 98.9 %'), `moths: soot, no chance (${await big()})`);
  await slide('.nsl-g', 10);
  check((await big()) === '0 % dark moths in generation 10' && (await facts()).includes('4 per 1000'), `moths: generation 10 (${await big()})`);
  await slide('.nsl-g', 30);
  check((await big()) === '74 % dark moths in generation 30', `moths: generation 30 (${await big()})`);
  const pic = await page.$eval(R + '.nsl-fig', (c) => c.toDataURL().length);
  check(pic > 5000, 'moths: trunk drawn');
  // Class 12 detail
  await tap('.nsl-level button[data-v="12"]');
  { const f = await facts(); check(f.includes('Genotypes CC : Cc : cc') && f.includes('p (C) and q (c)0.492 and 0.508') && f.includes('matches exactly'), `moths: Class 12 facts (${f.slice(0, 220)})`); }
  check((await page.textContent(R + '.nsl-formula')).includes('p² + 2pq + q² = ') && (await page.textContent(R + '.nsl-formula')).endsWith('= 1'), 'moths: Hardy-Weinberg formula');
  // No birds: nothing changes without chance
  await slide('.nsl-s', 0);
  check((await page.textContent(R + '.nsl-say')).includes('by mutation alone') && (await big()) === '10 % dark moths in generation 30', `moths: no selection (${await big()})`);
  await slide('.nsl-s', 30);
  // Random population: counts add up and HW check shown
  await tap('.nsl-n button[data-v="500"]');
  { const f = await facts(); const m = f.match(/Dark moths(\d+)(\d+) eaten.*Light moths(\d+)/); check(/χ² = [\d.]+, p = /.test(f), `moths: random run with HW chi-square (${f.slice(-120)})`); }
  { const t = await page.textContent(R + '.nsl-formula'); const m = t.match(/÷ (\d+) =/); check(m && m[1] === '1000', `moths: 500 moths have 1000 alleles (${m && m[1]})`); }
  const a = await big(); await tap('.nsl-run'); await tap('.nsl-run');
  check(typeof a === 'string', 'moths: new run');
  // Bark options
  await tap('.nsl-bark button[data-v=light]'); await tap('.nsl-n button[data-v=inf]');
  check((await page.textContent(R + '.nsl-say')).includes('On light bark, light moths are hidden'), 'moths: light bark favours light moths');
  await tap('.nsl-bark button[data-v=clean]'); await slide('.nsl-p', 90); await slide('.nsl-g', 5);
  check((await page.textContent(R + '.nsl-say')).includes('On dark bark'), 'moths: clean air starts dark');
  await slide('.nsl-g', 60);
  check((await page.textContent(R + '.nsl-say')).includes('On light bark'), 'moths: then light');
  // Play
  await tap('.nsl-play'); await page.waitForTimeout(500);
  check(Number((await page.textContent(R + '.nsl-gv')).split(' ')[0]) > 0, 'moths: play moves the generation');
  await page.waitForTimeout(7600);
  check((await page.textContent(R + '.nsl-gv')) === '60 of 60', 'moths: play ends at 60');
  // Downloads
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.nsl-csv')]); const f = OUT + 'moths.csv'; await d.saveAs(f); const l = readFileSync(f, 'utf8').trim().split('\n');
    check(l[0].startsWith('generation,bark,allele_C,CC') && l.length === 62 && l[1].startsWith('0,dark,0.9,'), `moths: CSV (${l[1]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); const f = OUT + 'moths.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'moths: image report'); }
  // Check yourself
  for (const lv of ['12', '10']) {
    await tap(`.nsl-level button[data-v="${lv}"]`);
    const n = await page.$$eval(R + '.nsl-qs li', (l) => l.length);
    await tap('.nsl-check');
    check((await page.textContent(R + '.nsl-score')) === `0 of ${n} right.`, `moths: Class ${lv} blanks wrong`);
    await page.$$eval(R + '.nsl-qs li', (lis) => lis.forEach((li) => { li.querySelector('.nsl-ans').value = li.dataset.a; }));
    await tap('.nsl-check');
    check((await page.textContent(R + '.nsl-score')) === `${n} of ${n} right.` && n === (lv === '12' ? 5 : 4), `moths: Class ${lv} quiz (${n})`);
  }

  // ---- Solve my numbers (phys-e.ts) ----
  const PS = '.ps-host ';
  const psAns = () => page.textContent(PS + '.ps-ans'), psWork = () => page.textContent(PS + '.ps-work');
  const psSolve = async (prob, vals, units = {}) => {
    await page.selectOption(PS + '[data-k="prob"]', prob);
    await page.$$eval(PS + `label[data-p="${prob}"] select`, (ss, u) => ss.forEach((s) => { const k = s.dataset.k; const want = u[k]; s.value = want ?? s.options[0].value; }), Object.fromEntries(Object.entries(units).map(([k, v]) => [`${prob}-${k}-u`, v])));
    for (const [k, v] of Object.entries(vals)) await page.fill(PS + `[data-k="${prob}-${k}"]`, v);
    await page.waitForTimeout(80);
  };
  const psCase = async (name, prob, vals, ans, work, units) => {
    await psSolve(prob, vals, units);
    const a = await psAns(), w = await psWork();
    check(a === ans && (!work || w.includes(work)) && !/NaN|Infinity/.test(a + w), `solve ${name}: ${a}${work && !w.includes(work) ? ' / working: ' + w : ''}`);
  };
  check((await page.getAttribute(PS + '.ps-out', 'aria-live')) === 'polite', 'solve: answer is a polite live region');

  await psCase('allele counts', 'cnt', { AA: '30', Aa: '50', aa: '20' }, 'The frequency of A is p = 0.55 and of a is q = 0.45.', 'p = (2 × 30 + 50) ÷ 200 = 0.55');
  await psCase('no individuals', 'cnt', { AA: '0', Aa: '0', aa: '0' }, 'Enter at least one individual.', null);
  await psCase('Hardy-Weinberg from q2', 'hwq', { q2: '0.04' }, 'q = 0.2, p = 0.8; carriers (Aa) make up 32 % of the population.', 'Check: 0.64 + 0.32 + 0.04 = 1');
  await psCase('q2 as a percentage', 'hwq', { q2: '4' }, 'q = 0.2, p = 0.8; carriers (Aa) make up 32 % of the population.', 'Convert to base units', { q2: '%' });
  await psCase('frequency above 1', 'hwq', { q2: '1.5' }, '"Frequency of the recessive phenotype (aa), q²" cannot be more than 1.', null);
  await psCase('Hardy-Weinberg from p', 'hwp', { p: '0.7' }, 'q = 0.3; AA 49 %, Aa 42 %, aa 9 %.', 'Aa = 2pq = 2 × 0.7 × 0.3 = 0.42');
  await psCase('carriers', 'car', { q2: '0.0004', N: '10000' }, 'About 392 carriers (4 with the trait).', 'Carrier frequency 2pq = 2 × 0.98 × 0.02 = 0.0392');
  await psCase('selection', 'sel', { q: '0.5', s: '0.2' }, 'After one generation q falls from 0.5 to 0.474 (a change of −0.0263).', 'Mean fitness w̄ = 1 − s q² = 1 − 0.2 × 0.5² = 0.95');
  await psCase('everyone dies', 'sel', { q: '1', s: '1' }, 'Everyone would die out with those numbers. Lower s.', null);
  await psCase('relative fitness', 'fit', { o: '8', best: '10' }, 'Relative fitness w = 0.8, so s = 0.2.', 'w = 8 ÷ 10 = 0.8');
  await psSolve('fit', { o: '8', best: '0' }); check((await psAns()).includes('must be more than 0') && !/NaN|Infinity/.test(await psAns()), 'solve: zero fittest gives a friendly message');
  await page.click(PS + '.ps-pre button:has-text("Selection")'); await page.waitForTimeout(80);
  check((await psAns()).startsWith('After one generation q falls from 0.5 to 0.474') && (await page.textContent(PS + '.ps-tip')).includes('Common mistake'), 'solve: preset Selection and tip');
};
