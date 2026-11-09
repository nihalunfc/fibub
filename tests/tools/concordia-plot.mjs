// #874 concordia plot
export const path = '/science/concordia-plot/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/concordia-plot/`); await page.waitForTimeout(800);
  const R = '.cnc ', wait = (ms = 450) => page.waitForTimeout(ms), big = () => page.textContent(R + '.cc-big'), facts = () => page.textContent(R + '.cc-facts');
  check((await big()) === 'Intercepts at 1852.4 ± 6.9 and 307 ± 13 Ma', `concordia: example discordia intercepts (${await big()})`);
  { const f = await facts(); check(f.includes('MSWD 0.592') && f.includes('York regression, n = 8, probability of fit 0.74') && f.includes('±230 Ma with √MSWD'), 'concordia: discordia MSWD; √MSWD shown for the scattered concordia age'); }
  { const t = await page.textContent(R + '.cc-tab'); check((await page.$$(R + '.cc-tab tr')).length === 9 && t.includes('Z1') && t.includes('Z8'), 'concordia: analyses table'); }
  check(await page.isVisible(R + '.cc-fig'), 'concordia: diagram drawn');
  await page.click(R + '.cc-exc'); await wait();
  check((await big()) === 'Concordia age 418.0 ± 2.4 Ma (n = 7)', `concordia: concordant example (${await big()})`);
  { const f = await facts(); check(f.includes('MSWD (concordance + equivalence) 0.69') && f.includes('probability 0.77'), 'concordia: concordia age MSWD and probability'); }
  await page.selectOption(R + '.cc-main', 'wm'); await wait();
  check((await big()) === 'Weighted mean ²⁰⁶Pb/²³⁸U age 418.0 ± 2.4 Ma', `concordia: weighted mean 206/238 (${await big()})`);
  // Untick one analysis.
  await page.selectOption(R + '.cc-main', 'conc');
  await page.uncheck(R + '.cc-tab input >> nth=0'); await wait();
  check((await big()).endsWith('(n = 6)') && (await page.textContent(R + '.cc-tab')).includes('A1'), 'concordia: unticked analysis left out');
  await page.check(R + '.cc-tab input >> nth=0'); await wait();
  // Errors as 1σ halve the age error.
  await page.selectOption(R + '.cc-err', '1a'); await wait();
  check((await big()) === 'Concordia age 418.0 ± 4.8 Ma (n = 7)', 'concordia: the same numbers read as 1σ double the errors');
  await page.selectOption(R + '.cc-err', '2a');
  // Tera-Wasserburg diagram and TW input give the same answers.
  await page.selectOption(R + '.cc-dia', 'tw'); await wait();
  check((await page.getAttribute(R + '.cc-fig', 'aria-label')).startsWith('Tera-Wasserburg'), 'concordia: Tera-Wasserburg diagram');
  await page.selectOption(R + '.cc-k', '2.4477'); await wait();
  check((await page.getAttribute(R + '.cc-fig', 'aria-label')).includes('95 %'), 'concordia: 95 % ellipses');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.cc-csv')]); const f = OUT + 'cc.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 8 && rows[0].startsWith('label,used,pb207_u235') && rows[1].startsWith('A1,yes,0.50651,0.0061,0.066275,0.00053,0.6,'), 'concordia: CSV'); }
  const tw = readFileSync(OUT + 'cc.csv', 'utf8').trim().split('\n').slice(1).map((r) => { const c = r.split(','); return [c[0], c[7], 2 * c[8], c[9], 2 * c[10], c[11]].join('\t'); }).join('\n');
  await page.selectOption(R + '.cc-in', 'tw'); await page.fill(R + '.cc-data', tw); await wait(600);
  check((await big()) === 'Concordia age 418.0 ± 2.4 Ma (n = 7)' && (await page.textContent(R + '.cc-colh')).includes('238U/206Pb'), 'concordia: Tera-Wasserburg input gives the same age');
  await page.selectOption(R + '.cc-u', '137.88'); await wait();
  check((await page.textContent(R + '.cc-tab')).length > 0 && (await big()).startsWith('Concordia age 41'), 'concordia: older 238/235 ratio');
  await page.selectOption(R + '.cc-u', '137.818');
  // Percent errors.
  await page.selectOption(R + '.cc-in', 'w'); await page.selectOption(R + '.cc-err', '2p');
  await page.fill(R + '.cc-data', 'A\t0.5\t2.4\t0.0665\t1.6\t0.6\nB\t0.51\t2.4\t0.0670\t1.6\t0.6'); await wait(600);
  check((await big()).startsWith('Concordia age') && (await big()).endsWith('(n = 2)'), 'concordia: errors in percent');
  await page.selectOption(R + '.cc-main', 'dis'); await wait();
  check((await big()) === 'Discordia needs at least three analyses', 'concordia: discordia needs three');
  await page.fill(R + '.cc-data', 'A\t0.5\t0\t0.0665\t1.6'); await wait(600);
  check((await page.textContent(R + '.cc-perr')).includes('errors must be above zero') && await page.isHidden(R + '.cc-out'), 'concordia: zero error refused');
  await page.fill(R + '.cc-data', 'A\t0.5\t2\t0.0665\t1.6\t1.2'); await wait(600);
  check((await page.textContent(R + '.cc-perr')).includes('between −1 and 1'), 'concordia: bad correlation refused');
  await page.click(R + '.cc-exd'); await wait();
  check((await big()).startsWith('Intercepts at 1852.4'), 'concordia: back to the example');
};
