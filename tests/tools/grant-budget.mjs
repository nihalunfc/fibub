// #822 grant budget builder
export const path = '/science/grant-budget/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/grant-budget/`); await page.evaluate(() => localStorage.removeItem('fibub-grant-budget-v1')); await page.reload(); await page.waitForTimeout(400);
  const big = () => page.textContent('.gbt .gb-big');
  const tab = () => page.textContent('.gbt .gb-tab');
  const wait = () => page.waitForTimeout(400);
  check((await big()) === 'Total 715,236 over 3 years' && !(await page.isChecked('.gbt .gb-remember')), 'grant budget: example total, remember off');
  { const f = await page.textContent('.gbt .gb-facts'); check(f.includes('Direct costs503,490') && f.includes('Indirect costs211,746') && f.includes('Effective indirect rate42.1 %'), 'grant budget: facts'); }
  { const t = await tab(); check(t.includes('Lead researcher: salary (20 %)18,00018,54019,096') && t.includes('Graduate student: salary (50/50/100 %)') && t.includes('147,400128,077148,013') && t.includes('Partner lab subaward (capped in base)') && t.includes('Student tuition (not in base)'), 'grant budget: table rows'); }
  check(await page.isVisible('.gbt .gb-fig') && await page.isVisible('.gbt .gb-mod'), 'grant budget: chart and exclusion options');
  await page.selectOption('.gbt .gb-base', 'tdc'); await wait();
  check((await big()) === 'Total 755,236 over 3 years' && await page.isHidden('.gbt .gb-mod'), 'grant budget: total direct cost base');
  await page.fill('.gbt .gb-rate', '50/52/54'); await wait();
  check((await tab()).includes('Indirect costs (50/52/54 %)89,70086,88084,787'), 'grant budget: a rate per year');
  await page.selectOption('.gbt .gb-base', 'salaries'); await page.fill('.gbt .gb-rate', '40'); await wait();
  check((await tab()).includes('Indirect costs (40 %)35,20036,19643,463'), 'grant budget: salaries base');
  await page.selectOption('.gbt .gb-base', 'salfringe'); await wait();
  check((await tab()).includes('Indirect costs (40 %)44,560'), 'grant budget: salaries and fringe base');
  await page.selectOption('.gbt .gb-base', 'none'); await wait();
  check((await big()) === 'Total 503,490 over 3 years' && !(await tab()).includes('Indirect'), 'grant budget: no indirect costs');
  await page.selectOption('.gbt .gb-base', 'modified'); await page.fill('.gbt .gb-rate', '50'); await page.fill('.gbt .gb-cap', ''); await wait();
  check((await tab()).includes('152,400158,077148,013') && (await page.textContent('.gbt .gb-note')).includes('no cap is set'), 'grant budget: no cap set');
  await page.fill('.gbt .gb-cap', '25000'); await page.uncheck('.gbt .gb-excl input[value=equipment]'); await wait();
  check((await tab()).includes('165,400128,077'), 'grant budget: equipment back in the base');
  await page.check('.gbt .gb-excl input[value=equipment]'); await page.uncheck('.gbt .gb-round'); await wait();
  check((await tab()).includes('18,000.0018,540.0019,096.20'), 'grant budget: no rounding shows cents');
  await page.check('.gbt .gb-round'); await page.fill('.gbt .gb-cur', '£'); await wait();
  check((await big()) === 'Total £715,236 over 3 years', 'grant budget: currency label');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.gbt .gb-csv')]); const f = OUT + 'gb.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').replace(/^﻿/, '').trim().split('\r\n');
    check(rows[0] === 'Line,Year 1,Year 2,Year 3,Total' && rows.includes('Lead researcher: salary (20 %),18000,18540,19096,55636') && rows[rows.length - 1] === 'Total,253100,231116,231020,715236', 'grant budget: CSV for Excel'); }
  for (const f of ['pdf', 'docx', 'png']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.gbt .dl [data-f=${f}]`)]); const p = OUT + 'gb.' + f; await d.saveAs(p); check(readFileSync(p).length > 2000, `grant budget: ${f} download`); }
  // Errors.
  await page.fill('.gbt .gb-years', '2'); await wait();
  check((await page.textContent('.gbt .gb-err')).includes('has 3 yearly amounts, but the budget has 2 years') && await page.isHidden('.gbt .gb-out'), 'grant budget: more amounts than years');
  await page.fill('.gbt .gb-years', '4'); await wait();
  check((await big()).includes('over 4 years') && (await page.textContent('.gbt .gb-note')).includes('year 4'), 'grant budget: four years, missing year noted');
  await page.fill('.gbt .gb-people', 'PI, 80000, 150'); await wait();
  check((await page.textContent('.gbt .gb-err')).includes('effort is a percent'), 'grant budget: bad effort');
  await page.fill('.gbt .gb-people', 'PI, 80000, 50, 25'); await page.fill('.gbt .gb-lines', 'food, Pizza, 50'); await wait();
  check((await page.textContent('.gbt .gb-err')).includes('start with a category'), 'grant budget: bad category');
  await page.fill('.gbt .gb-lines', ''); await page.fill('.gbt .gb-rate', ''); await wait();
  check((await page.textContent('.gbt .gb-err')).includes('Type your indirect cost rate'), 'grant budget: missing rate');
  await page.fill('.gbt .gb-rate', '10'); await page.selectOption('.gbt .gb-base', 'tdc'); await wait();
  check((await big()) === 'Total £220,000 over 4 years', 'grant budget: one person, four years');
  // Open a CSV file of cost lines.
  writeFileSync(OUT + 'lines.csv', 'Category,Item,Y1,Y2\ntravel,Trip,1000,2000\nconsumables,Tips,500,500\n');
  await page.setInputFiles('.gbt .gb-lines + .dfb .dfb-in, .gbt .dfb >> nth=1 >> .dfb-in', OUT + 'lines.csv').catch(async () => { await page.locator('.gbt .dfb-in').nth(1).setInputFiles(OUT + 'lines.csv'); }); await wait();
  check((await page.inputValue('.gbt .gb-lines')).includes('travel\tTrip\t1000\t2000') && (await big()) === 'Total £224,400 over 4 years', 'grant budget: opens a CSV of cost lines');
  // Remember.
  await page.check('.gbt .gb-remember'); await wait(); await page.reload(); await wait();
  check(await page.isChecked('.gbt .gb-remember') && (await big()) === 'Total £224,400 over 4 years', 'grant budget: remembered in this browser');
  await page.uncheck('.gbt .gb-remember'); await page.reload(); await wait();
  check(!(await page.isChecked('.gbt .gb-remember')) && (await big()) === 'Total 715,236 over 3 years', 'grant budget: unticking forgets');
  await page.click('.gbt .gb-empty'); await wait();
  check((await page.textContent('.gbt .gb-err')).includes('Add at least one person'), 'grant budget: start empty');
  await page.click('.gbt .gb-ex'); await wait();
};
