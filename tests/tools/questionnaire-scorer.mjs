// #723 Questionnaire scorer: the made-up example, every option, CSV, report download, bad input messages.
export const path = '/science/questionnaire-scorer/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(BASE + path);
  await page.waitForSelector('.qs-out:not([hidden])');
  const TXT = (sel) => [...document.querySelectorAll(sel + ' tr')].map((r) => [...r.cells].map((c) => c.textContent).join(' ')).join(' | ');
  const sum = () => page.evaluate(TXT, '.qs-sum');
  let s = await sum();
  check(/Calm 4 13 of 14 10\.92 4\.443 5 20 0\.903 0\.766 to 0\.969 12/.test(s), `questionnaire: Calm summary (${s.slice(0, 160)})`);
  check(/Focus 4 13 of 14 12\.69 3\.860 4 18 0\.848/.test(s), 'questionnaire: Focus summary');
  const p04 = (await page.evaluate(TXT, '.qs-people')).split(' | ')[4];
  check(p04 === 'P04 8 13 3/4 4/4', `questionnaire: P04 prorated to 8 (${p04})`);
  check(/prorated/.test(await page.textContent('.qs-note')) && /P11|1 person/.test(await page.textContent('.qs-note')), 'questionnaire: note on missing and prorated');
  check((await page.locator('.qs-people td.qs-miss').count()) === 2, 'questionnaire: two missing scores marked');
  // Means
  await page.selectOption('.qs-method', 'mean');
  await page.waitForFunction(() => /Calm 4 13 of 14 2\.731/.test([...document.querySelectorAll('.qs-sum td')].map((c) => c.textContent).join(' ')));
  check(true, 'questionnaire: mean scoring');
  // 100 % rule
  await page.fill('.qs-need', '100');
  await page.waitForFunction(() => /Calm 4 12 of 14/.test([...document.querySelectorAll('.qs-sum td')].map((c) => c.textContent).join(' ')));
  check(true, 'questionnaire: 100 % rule');
  await page.fill('.qs-need', '75');
  await page.selectOption('.qs-method', 'sum');
  // No reverse keying lowers alpha.
  await page.fill('.qs-rev', '');
  await page.waitForFunction(() => !/0\.903/.test(document.querySelector('.qs-sum').textContent));
  check(true, 'questionnaire: reverse keying off changes alpha');
  await page.fill('.qs-rev', 'I3, 7');
  await page.waitForFunction(() => /0\.903/.test(document.querySelector('.qs-sum').textContent));
  // One total when subscales are empty.
  await page.fill('.qs-scales', '');
  await page.waitForFunction(() => /Total 8/.test([...document.querySelectorAll('.qs-sum td')].map((c) => c.textContent).join(' ')));
  check(true, 'questionnaire: empty subscales give a total');
  await page.fill('.qs-scales', 'Calm: I1-I4\nFocus: I5-I8');
  await page.waitForFunction(() => /Focus/.test(document.querySelector('.qs-sum').textContent));
  // CSV
  const [d] = await Promise.all([page.waitForEvent('download'), page.click('.qs-csv')]);
  const f = OUT + 'qs.csv'; await d.saveAs(f);
  const c = readFileSync(f, 'utf8').trim().split('\n');
  check(c[0] === 'ID,Calm,Focus,Calm answered,Focus answered' && c[4] === 'P04,8,13,3,4' && c[11] === 'P11,,12,2,4' && c.length === 15, `questionnaire: CSV (${c[4]} | ${c[11]})`);
  const [w] = await Promise.all([page.waitForEvent('download'), page.click('.qs .dl button[data-f=docx]')]);
  check(/\.docx$/.test(w.suggestedFilename()), 'questionnaire: Word report');
  // Bad input
  await page.fill('.qs-rev', 'Q9');
  await page.waitForSelector('.qs-err:not([hidden])');
  check(/"Q9" is not a column/.test(await page.textContent('.qs-err')), 'questionnaire: unknown item named');
  await page.fill('.qs-rev', 'I3, I7');
  await page.fill('.qs-max', '4');
  await page.waitForFunction(() => /outside the answer range/.test(document.querySelector('.qs-err').textContent) && !document.querySelector('.qs-err').hidden);
  check(true, 'questionnaire: out of range answer reported');
  await page.fill('.qs-max', '5');
  await page.fill('.qs-scales', 'Calm I1-I4');
  await page.waitForFunction(() => /needs a name, a colon/.test(document.querySelector('.qs-err').textContent) && !document.querySelector('.qs-err').hidden);
  check(true, 'questionnaire: subscale line without colon');
  await page.fill('.qs-in', 'A\tB\n1\tx');
  await page.fill('.qs-scales', '');
  await page.waitForFunction(() => /"x" for Row 1 \(B\) is not a number/.test(document.querySelector('.qs-err').textContent));
  check(true, 'questionnaire: text in answers reported');
};
