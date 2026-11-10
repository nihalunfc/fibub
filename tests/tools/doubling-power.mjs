// #1234 Power of doubling
export const path = '/learn/doubling-power/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/doubling-power/`); await page.waitForSelector('.dp .dp-fig text');
  const R = '.dp ';
  const txt = (s) => page.textContent(R + s);
  check((await txt('.dp-big')) === '10 folds: 1,024 layers, 10.24 cm thick', 'doubling: example 10 folds');
  check((await txt('.dp-f1')).includes('0.1 mm × 1,024 = 10.24 cm') && (await txt('.dp-f2')).includes('hand width'), 'doubling: formula and passed landmark');
  check((await txt('.dp-f3')).includes('person (1.7 m) you need 15 folds'), 'doubling: next landmark 15 folds');
  check((await page.$$(R + '.dp-layer')).length === 0 && (await page.$$(R + '.dp-passed')).length === 3, 'doubling: 1024 layers too many to draw; 3 landmarks ticked');
  await page.fill(R + '.dp-n', '4'); await page.waitForTimeout(100);
  check((await page.$$(R + '.dp-layer')).length === 15 && (await page.inputValue(R + '.dp-nr')) === '4', 'doubling: 4 folds draw 16 layers, slider follows box');
  await page.fill(R + '.dp-n', '42'); await page.waitForTimeout(100);
  check((await txt('.dp-f2')).includes('Moon') && (await txt('.dp-big')).includes('439,805 km'), 'doubling: 42 folds pass the Moon');
  check(await page.isHidden(R + '.dp-l11'), 'doubling: Class 11 line hidden at Class 8');
  await page.click(R + '.dp-level button[data-l="11"]'); await page.waitForTimeout(100);
  check((await txt('.dp-l11')).includes('= 41.8') && (await txt('.dp-l11')).endsWith('is 42.'), 'doubling: Class 11 log2 working');
  await page.fill(R + '.dp-t', '0.2'); await page.waitForTimeout(100);
  check((await txt('.dp-l11')).endsWith('is 41.'), 'doubling: thicker sheet needs one fold fewer');
  await page.fill(R + '.dp-t', '0'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.dp-err'), 'doubling: zero thickness message');
  await page.fill(R + '.dp-t', '0.1'); await page.fill(R + '.dp-n', '2.5'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.dp-err'), 'doubling: fractional folds message');
  await page.fill(R + '.dp-n', '10'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.dp-err'), 'doubling: message clears');
  // Chessboard.
  await page.click(R + '.dp-mode button[data-m="chess"]'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.dp-board') && await page.isHidden(R + '.dp-fig'), 'doubling: chessboard mode');
  check((await txt('.dp-c1')).endsWith('= 512') && (await txt('.dp-c2')).endsWith('= 1,023'), 'doubling: square 10 holds 512, total 1023');
  await page.locator(R + '.dp-sq[data-i="64"]').scrollIntoViewIfNeeded();
  await page.click(R + '.dp-sq[data-i="64"]'); await page.waitForTimeout(100);
  check((await txt('.dp-c1')).endsWith('9,223,372,036,854,775,808') && (await txt('.dp-c2')).endsWith('18,446,744,073,709,551,615') && (await page.inputValue(R + '.dp-k')) === '64', 'doubling: tap square 64, exact counts');
  check((await txt('.dp-c3')).includes('3.69 × 10¹¹ tonnes'), 'doubling: whole-board mass');
  check((await txt('.dp-c11')).includes('(2⁶⁴ − 1)/(2 − 1)'), 'doubling: Class 11 geometric series line');
  await page.fill(R + '.dp-g', '-1'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.dp-gerr'), 'doubling: bad grain mass message');
  await page.fill(R + '.dp-g', '0.02'); await page.waitForTimeout(100);
  // Quiz.
  check((await page.$$(R + '.sm-q')).length === 4, 'doubling: four questions');
  const res = [/= ([\d.]+) mm\.$/, /= ([\d,]+)\.$/, /= ([\d,]+)\.$/, /so (\d+) folds/];
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = res[i - 1].exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1].replace(/,/g, '') : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `doubling: quiz question ${i} (${w})`);
  }
  check((await txt('.sm-qscore')).includes('4 of 4'), 'doubling: score 4 of 4');
};
