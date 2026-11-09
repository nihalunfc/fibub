// #582 linear and integer programming solver
export const path = '/science/lp-solver/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const vp0 = page.viewportSize();
  await page.goto(`${BASE}/science/lp-solver/`); await page.waitForTimeout(600);
  const big = () => page.textContent('.lps .lp-big');
  check((await big()) === 'Maximum profit = 720' && (await page.textContent('.lps .lp-pill')) === 'Optimal', 'lp: workshop example optimum');
  { const v = await page.textContent('.lps .lp-vars'), r = await page.textContent('.lps .lp-rows'); check(v.includes('tables9') && v.includes('chairs12') && r.includes('7.5') && r.includes('0 (binding)') && r.includes('Shadow price'), 'lp: variables and constraints tables with shadow prices'); }
  check(await page.isVisible('.lps .lp-fig'), 'lp: two-variable picture');
  await page.selectOption('.lps .lp-ex', 'workshop-int'); await page.waitForTimeout(300);
  check((await big()) === 'Maximum profit = 700' && (await page.textContent('.lps .lp-facts')).includes('Branch-and-bound nodes') && (await page.textContent('.lps .lp-facts')).includes('722.5') && !(await page.textContent('.lps .lp-rows')).includes('Shadow price'), 'lp: integer example by branch and bound');
  await page.selectOption('.lps .lp-ex', 'feed'); await page.waitForTimeout(300);
  check((await big()) === 'Minimum cost = 2.04076' && await page.isHidden('.lps .lp-gw') && (await page.textContent('.lps .lp-rows')).includes('−0.247834'), 'lp: feed mix, no picture for 3 variables, negative shadow price');
  await page.selectOption('.lps .lp-ex', 'projects'); await page.waitForTimeout(300);
  check((await big()) === 'Maximum value = 137' && (await page.textContent('.lps .lp-vars')).includes('0 to 1, yes/no'), 'lp: binary projects');
  await page.selectOption('.lps .lp-ex', 'transport'); await page.selectOption('.lps .lp-rule', 'bland'); await page.waitForTimeout(300);
  check((await big()) === 'Minimum cost = 620', "lp: transport with Bland's rule");
  await page.selectOption('.lps .lp-ex', 'workshop'); await page.check('.lps .lp-steps'); await page.waitForTimeout(300);
  { const n = await page.locator('.lps .lp-tabs table').count(); check(n >= 2 && (await page.textContent('.lps .lp-tabs')).includes('no reduced cost is negative') && await page.locator('.lps .lp-tabs td.pv').count() === n - 1, `lp: simplex tableaux shown (${n})`); }
  await page.selectOption('.lps .lp-ex', 'workshop-int'); await page.waitForTimeout(300);
  check((await page.textContent('.lps .lp-tnote')).includes('linear models only'), 'lp: no tableaux for integer models');
  await page.uncheck('.lps .lp-steps'); await page.selectOption('.lps .lp-ex', 'workshop'); await page.waitForTimeout(300);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.lps .lp-csv')]); const f = OUT + 'lp.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 7 && rows[1] === 'status,optimal,720,,,,' && rows[2] === 'variable,tables,9,0,,,' && rows[4].startsWith('constraint,wood,60,7.5,<=,60,0'), 'lp: solution CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.lps .lp-save')]); const f = OUT + 'model.txt'; await d.saveAs(f); check(readFileSync(f, 'utf8').startsWith('# A small workshop'), 'lp: save the model'); }
  writeFileSync(OUT + 'mine.lp', 'min 2a + 3b\nsubject to\n  need: a + b >= 4\n  a <= 1\n');
  await page.setInputFiles('.lps .lp-file', OUT + 'mine.lp'); await page.waitForTimeout(400);
  check((await big()) === 'Minimum objective = 11' && (await page.inputValue('.lps .lp-ex')) === 'own', 'lp: open a model file');
  await page.fill('.lps .lp-in', 'max x + y\nst\nx + y <= 2\nx + y >= 3'); await page.waitForTimeout(600);
  check((await page.textContent('.lps .lp-pill')) === 'Infeasible' && (await page.textContent('.lps .lp-note')).includes('clash'), 'lp: infeasible message');
  await page.fill('.lps .lp-in', 'max x + y\nst\nx - y <= 2'); await page.waitForTimeout(600);
  check((await page.textContent('.lps .lp-pill')) === 'Unbounded' && (await big()).includes('without limit') && await page.isVisible('.lps .lp-fig'), 'lp: unbounded message with picture');
  await page.fill('.lps .lp-in', 'max x\nst\nx + <= 3'); await page.waitForTimeout(600);
  check((await page.textContent('.lps .lp-err')).startsWith('Line 3') && await page.isHidden('.lps .lp-out'), 'lp: bad input message');
  await page.fill('.lps .lp-in', 'x + y <= 3'); await page.waitForTimeout(600);
  check((await page.textContent('.lps .lp-err')).includes('objective'), 'lp: missing objective message');
  await page.selectOption('.lps .lp-ex', 'workshop'); await page.waitForTimeout(300);
  await page.setViewportSize({ width: 375, height: 800 }); await page.locator('.lps .lp-fig').scrollIntoViewIfNeeded(); await page.screenshot({ path: OUT + 'lp-375.png', fullPage: false }); await page.setViewportSize(vp0);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.lps .dl [data-f=pdf]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'lp: PDF report'); }
};
