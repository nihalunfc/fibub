// #766 Rubric grade calculator: the made-up example, editing the rubric, students, saving and clearing, CSV, print, bad input.
export const path = '/science/rubric-grade-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(BASE + path);
  await page.evaluate(() => { try { localStorage.removeItem('fibub-rubric-v1'); } catch {} });
  await page.reload();
  await page.waitForSelector('.rb-stu tbody tr');
  const TXT = (sel) => [...document.querySelectorAll(sel + ' tr')].map((r) => [...r.cells].map((c) => c.textContent).join(' ')).join(' | ');
  const tots = () => page.$$eval('.rb-stu .rb-tot', (e) => e.map((x) => x.textContent));
  check(JSON.stringify(await tots()) === JSON.stringify(['91.3 %', '72.5 %', '56.3 %', '100.0 %', '43.8 %', '76.3 %']), `rubric: weighted totals (${await tots()})`);
  check((await page.$$eval('.rb-stu .rb-gr', (e) => e.map((x) => x.textContent).join(''))) === 'ABCADB', 'rubric: grades');
  const f = await page.textContent('.rb-facts');
  check(/6 of 6/.test(f) && /Mean73\.3 %/.test(f) && /Median74\.4 %/.test(f) && /SD21\.0/.test(f), `rubric: class summary (${f})`);
  check(/A 85 % and up 2 33 %/.test(await page.evaluate(TXT, '.rb-gt')) && /Content 40 % 2\.83 70\.8 %/.test(await page.evaluate(TXT, '.rb-ct')), 'rubric: grade counts and criteria');
  check(/lowest criterion on average is Content/.test(await page.textContent('.rb-note')), 'rubric: weakest criterion');
  // Change a level.
  await page.selectOption('.rb-stu tbody tr:nth-child(5) td:nth-child(2) select', '4');
  await page.waitForFunction(() => document.querySelectorAll('.rb-stu .rb-tot')[4].textContent === '73.8 %');
  check(true, 'rubric: picking a level updates the total');
  // Add a student: not finished until marked.
  await page.click('.rb-adds');
  check((await tots())[6] === 'not finished' && /6 of 7/.test(await page.textContent('.rb-facts')), 'rubric: new student not finished');
  // Change weights and bands.
  await page.fill('.rb-crit .rb-crow:nth-child(1) .rb-cw', '10');
  await page.waitForFunction(() => /Weights add up to 70\./.test(document.querySelector('.rb-wsum').textContent));
  check((await tots())[0] !== '91.3 %', 'rubric: weights change totals');
  await page.fill('.rb-crit .rb-crow:nth-child(1) .rb-cw', '40');
  await page.fill('.rb-bands', 'Pass: 50\nFail: 0');
  await page.waitForFunction(() => /Pass/.test(document.querySelector('.rb-gt').textContent));
  check((await page.$$eval('.rb-stu .rb-gr', (e) => e.map((x) => x.textContent).join(','))) === 'Pass,Pass,Pass,Pass,Pass,Pass,–', 'rubric: own grade bands');
  // Add and remove a criterion.
  await page.click('.rb-addc');
  check((await page.locator('.rb-stu thead th').count()) === 9, 'rubric: criterion added');
  await page.click('.rb-crit .rb-crow:nth-child(5) .rb-x');
  check((await page.locator('.rb-stu thead th').count()) === 8, 'rubric: criterion removed');
  // CSV
  const [d] = await Promise.all([page.waitForEvent('download'), page.click('.rb-csv')]);
  const fc = OUT + 'rb.csv'; await d.saveAs(fc);
  const c = readFileSync(fc, 'utf8').trim().split('\n');
  check(c[0] === 'Student,Content (points),Organisation (points),Evidence (points),Language (points),Total %,Grade' && c[1] === 'Student 1,4,3,4,3,91.25,Pass' && c[7] === 'Student 7,,,,,,', `rubric: CSV (${c[1]} | ${c[7]})`);
  const [w] = await Promise.all([page.waitForEvent('download'), page.click('.rb .dl button[data-f=docx]')]);
  check(/\.docx$/.test(w.suggestedFilename()), 'rubric: Word report');
  // Nothing saved until ticked; saved after; cleared by Clear.
  check(await page.evaluate(() => localStorage.getItem('fibub-rubric-v1') === null), 'rubric: nothing saved by default');
  await page.check('.rb-remember');
  await page.fill('.rb-stu tbody tr:nth-child(1) .rb-sname', 'Ana');
  await page.waitForFunction(() => /"Ana"/.test(localStorage.getItem('fibub-rubric-v1') || ''));
  await page.reload();
  await page.waitForSelector('.rb-stu tbody tr');
  check((await page.inputValue('.rb-stu tbody tr:nth-child(1) .rb-sname')) === 'Ana' && (await page.isChecked('.rb-remember')) && (await page.locator('.rb-stu tbody tr').count()) === 7, 'rubric: remembered after reload');
  await page.click('.rb-clear');
  check(await page.evaluate(() => localStorage.getItem('fibub-rubric-v1') === null) && (await page.inputValue('.rb-stu tbody tr:nth-child(1) .rb-sname')) === 'Student 1' && !(await page.isChecked('.rb-remember')), 'rubric: Clear deletes saved data');
  // Bad input
  await page.fill('.rb-levels', 'Good');
  await page.waitForFunction(() => /needs a name and points/.test(document.querySelector('.rb-rerr').textContent) && !document.querySelector('.rb-rerr').hidden);
  check(await page.isHidden('.rb-out'), 'rubric: bad level line');
  await page.fill('.rb-levels', 'Excellent = 4\nGood = 3\nDeveloping = 2\nBeginning = 1');
  await page.fill('.rb-bands', 'A: 120');
  await page.waitForFunction(() => /100 % or less/.test(document.querySelector('.rb-rerr').textContent));
  check(true, 'rubric: bad cut-off');
  await page.fill('.rb-bands', 'A: 85\nF: 0');
  await page.fill('.rb-crit .rb-crow:nth-child(1) .rb-cw', '-5');
  await page.waitForFunction(() => /0 or more/.test(document.querySelector('.rb-rerr').textContent));
  check(true, 'rubric: negative weight');
  await page.fill('.rb-crit .rb-crow:nth-child(1) .rb-cw', '40');
};
