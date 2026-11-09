// #748 Likert chart: example summary (pandas numbers), sorting, scales, counts mode, PNG/SVG/CSV, errors.
export const path = '/science/likert-chart/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const vp = page.viewportSize();
  page.setDefaultTimeout(120000);
  await page.goto(BASE + path);
  await page.waitForSelector('.lk-out:not([hidden])');
  const cell = (r, c) => page.textContent(`.lk-tab tbody tr:nth-child(${r}) td:nth-child(${c})`);
  check((await cell(1, 1)) === 'I feel part of a team' && (await cell(1, 5)) === '72.0 %' && (await cell(1, 6)) === '4', `likert: top statement 72.0 % agree, median 4 (${await cell(1, 1)} ${await cell(1, 5)})`);
  check((await cell(7, 1)) === 'Pay is fair for my role' && (await cell(7, 2)) === '148' && (await cell(7, 3)) === '58.8 %', 'likert: pay item 148 answers, 58.8 % disagree');
  check((await page.locator('.lk-items input').count()) === 9 && !(await page.locator('.lk-items input[value="respondent"]').isChecked()), 'likert: respondent column left unticked');
  const h = await page.$eval('.lk-fig', (c) => c.height);
  check(h > 200, `likert: chart drawn (${h} px)`);
  // Sorting.
  await page.selectOption('.lk-sort', 'disagree'); await page.waitForTimeout(150);
  check((await cell(1, 1)) === 'Pay is fair for my role', 'likert: most disagreement first');
  await page.selectOption('.lk-sort', 'none'); await page.waitForTimeout(150);
  check((await cell(1, 1)) === 'My manager listens to me', 'likert: data order');
  await page.selectOption('.lk-sort', 'mean'); await page.waitForTimeout(150);
  check((await cell(1, 1)) === 'I feel part of a team' && /3\.97/.test(await cell(1, 7)), 'likert: highest mean first');
  await page.selectOption('.lk-sort', 'agree');
  // Untick, title, downloads.
  await page.locator('.lk-items input[value="I feel part of a team"]').uncheck(); await page.waitForTimeout(150);
  check((await page.locator('.lk-tab tbody tr').count()) === 7, 'likert: unticked statement removed');
  await page.fill('.lk-title', 'Staff survey 2026'); await page.waitForTimeout(500);
  for (const [b, ext] of [['.lk-png', 'png'], ['.lk-svg', 'svg'], ['.lk-csv', 'csv']]) {
    const [d] = await Promise.all([page.waitForEvent('download'), page.click(b)]);
    const name = d.suggestedFilename(), body = readFileSync(await d.path());
    const ok = name === `staff-survey-2026.${ext}` && (ext === 'png' ? body[1] === 0x50 : ext === 'svg' ? /<svg[\s\S]*Staff survey 2026[\s\S]*Pay is fair/.test(body.toString()) : /^statement,n,Strongly disagree \(count\)/.test(body.toString()) && body.toString().trim().split('\n').length === 8);
    check(ok, `likert: ${ext} download (${name})`);
  }
  for (const f of ['png', 'pdf', 'docx']) {
    const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.lk .dl button[data-f="${f}"]`)]);
    check(d.suggestedFilename() === `staff-survey-2026.${f}`, `likert: report ${f}`);
  }
  // Labels and scale size.
  await page.fill('.lk-labels', 'Never, Rarely, Sometimes, Often, Always'); await page.waitForTimeout(500);
  check(/1 \(Never\) to 5 \(Always\)/.test(await page.textContent('.lk-note')), 'likert: custom labels');
  await page.selectOption('.lk-k', '4'); await page.waitForTimeout(200);
  check(/answer "5", which is not 1 to 4/.test(await page.textContent('.lk-err')), `likert: answers outside a 4-point scale explained (${await page.textContent('.lk-err')})`);
  await page.selectOption('.lk-k', '7'); await page.waitForTimeout(200);
  check(!(await page.isHidden('.lk-out')) && /7 \(Strongly agree\)/.test(await page.textContent('.lk-note')), 'likert: 7-point scale with default labels');
  await page.selectOption('.lk-k', '5'); await page.waitForTimeout(200);
  // Counts mode.
  await page.click('.lk-mode button[data-m="counts"]'); await page.waitForTimeout(200);
  check((await cell(1, 1)) === 'The course was well organised' && (await cell(1, 5)) === '72.0 %', `likert: counts mode (${await cell(1, 1)} ${await cell(1, 5)})`);
  await page.selectOption('.lk-k', '4'); await page.waitForTimeout(200);
  check(/has 5 counts but the scale has 4/.test(await page.textContent('.lk-err')), 'likert: wrong number of counts explained');
  await page.selectOption('.lk-k', '5'); await page.waitForTimeout(200);
  await page.click('.lk-mode button[data-m="raw"]'); await page.waitForTimeout(200);
  await page.fill('.lk-in', 'Q1,Q2\n1,2\n3,maybe'); await page.waitForTimeout(500);
  check(/"Q2" has the answer "maybe"/.test(await page.textContent('.lk-err')), 'likert: text answer explained');
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(BASE + path);
  await page.waitForSelector('.lk-out:not([hidden])');
  await page.screenshot({ path: OUT + 'likert-chart.png', fullPage: true });
  await page.setViewportSize(vp);
  page.setDefaultTimeout(30000);
};
