// #1239 Divisibility test machine
export const path = '/learn/divisibility-tests/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/divisibility-tests/`); await page.waitForSelector('.dv .dv-chips button.yes');
  const R = '.dv ';
  const txt = (s) => page.textContent(R + s);
  const chips = async () => (await page.$$eval(R + '.dv-chips button', (b) => b.map((x) => x.textContent))).join('|');
  check((await chips()) === '2 ✓|3 ✓|4 ✓|5 ✗|6 ✓|7 ✗|8 ✓|9 ✗|10 ✗|11 ✓', 'divis: chips for 98736');
  check((await txt('.dv-h')) === 'Is 98,736 divisible by 9? No' && (await txt('.dv-why')).includes('= 33') && (await txt('.dv-rem')).includes('9 × 10,970 + 6'), 'divis: rule for 9 with division check');
  check((await page.$$(R + '.dv-fig .dv-sure')).length === 4 && (await page.$$(R + '.dv-fig .dv-plus')).length === 33, 'divis: nines picture: 4 blue parts, 33 dots');
  await page.click(R + '.dv-chips button[data-d="11"]'); await page.waitForTimeout(100);
  check((await txt('.dv-why')).includes('= 11,') && (await page.$$(R + '.dv-fig .dv-minus')).length === 11 && (await page.$$(R + '.dv-fig .dv-plus')).length === 22, 'divis: 11 picture with + and − dots');
  await page.click(R + '.dv-chips button[data-d="8"]'); await page.waitForTimeout(100);
  check((await txt('.dv-why')).includes('736') && (await page.$$(R + '.dv-fig .dv-test')).length === 3 && (await txt('.dv-cap')).includes('1000 = 8 × 125'), 'divis: rule for 8, last three digits');
  await page.click(R + '.dv-chips button[data-d="7"]'); await page.waitForTimeout(100);
  check((await txt('.dv-why')).includes('9873 − 2 × 6 = 9861') && await page.isHidden(R + '.dv-fig') && (await txt('.dv-cap')).includes('21b'), 'divis: rule for 7 chain');
  await page.click(R + '.dv-chips button[data-d="6"]'); await page.waitForTimeout(100);
  check((await txt('.dv-h')).endsWith('Yes') && (await txt('.dv-why')).includes('Even? yes'), 'divis: rule for 6');
  check((await txt('.dv-dr')).includes('98,736 → 33 → 6') && (await txt('.dv-dr')).includes('dividing by 9: 6'), 'divis: digital root chain');
  check((await txt('.dv-c9')).includes('45,122,352') && (await txt('.dv-c9')).includes('✓'), 'divis: casting out nines');
  check((await page.$$(R + '.dv-tab tr')).length === 11, 'divis: remainder table');
  await page.click(R + '.dv-pre[data-n="2520"]'); await page.waitForTimeout(100);
  check((await chips()) === '2 ✓|3 ✓|4 ✓|5 ✓|6 ✓|7 ✓|8 ✓|9 ✓|10 ✓|11 ✗', 'divis: 2520 passes 2 to 10');
  await page.fill(R + '.dv-x', '123,456,789,123,456,789,123,456,789'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.dv-err') && (await txt('.dv-h')).includes('123,456,789,123,456,789,123,456,789'), 'divis: 27 digits with commas');
  await page.fill(R + '.dv-x', '12.5'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.dv-err'), 'divis: decimal message');
  await page.fill(R + '.dv-x', '918082'); await page.fill(R + '.dv-y', 'x'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.dv-err') && await page.isVisible(R + '.dv-yerr'), 'divis: bad second number message');
  await page.fill(R + '.dv-y', '12'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.dv-yerr'), 'divis: message clears');
  check((await page.$$(R + '.sm-q')).length === 5, 'divis: five questions');
  const res = [/remainder is (\d+)\./, /digital root is (\d+)\./, /digit is (\d+)\./, /answer is (-?\d+)\./, /answer is (\d+)\./];
  for (let i = 1; i <= 5; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = res[i - 1].exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `divis: quiz question ${i} (${w})`);
  }
};
