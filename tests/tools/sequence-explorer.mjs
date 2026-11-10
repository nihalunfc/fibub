// #1280 Growing patterns and sequences
export const path = '/learn/sequence-explorer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/sequence-explorer/`); await page.waitForSelector('.sq .sq-stick', { state: 'attached' });
  const R = '.sq ', txt = (s) => page.textContent(R + s);
  check((await txt('.sq-big')) === 'Step 5: 16 sticks', 'seq: matchsticks step 5 is 16');
  check((await page.$$(R + '.sq-tab tr')).length === 3, 'seq: table has n, term, difference');
  check((await txt('.sq-out')).includes('3 × 5 + 1 = 16') && (await txt('.sq-out')).includes('add 3 each step'), 'seq: rule 3n + 1 worked');
  await page.selectOption(R + '.sq-pat', 'triangle'); await page.waitForTimeout(100);
  check((await txt('.sq-big')) === 'Step 5: 15 dots' && (await page.$$(R + '.sq-dot')).length === 1 + 3 + 6 + 15, 'seq: triangle step 5 drawn with 15 dots');
  check((await page.$$(R + '.sq-dot.new')).length === 2 + 3 + 5, 'seq: new dots marked');
  await page.click(R + '.sq-lvl button[data-l="11"]'); await page.waitForTimeout(100);
  check((await page.$$(R + '.sq-tab tr')).length === 4 && (await txt('.sq-out')).includes('quadratic rule') && (await txt('.sq-out')).includes('Sum of the first 5 terms: 35'), 'seq: class 11 second differences and sum 35');
  await page.fill(R + '.sq-n', '100'); await page.waitForTimeout(100);
  check((await txt('.sq-big')) === 'Step 100: 5050 dots' && (await txt('.sq-fig')).includes('too big to draw'), 'seq: step 100 is 5050');
  await page.selectOption(R + '.sq-pat', 'double'); await page.waitForTimeout(100);
  check((await txt('.sq-big')).includes('30 digits'), `seq: 2⁹⁹ has 30 digits (${await txt('.sq-big')})`);
  await page.fill(R + '.sq-n', '6'); await page.waitForTimeout(100);
  check((await txt('.sq-big')) === 'Step 6: 32 cells' && (await txt('.sq-out')).includes('2⁵ = 32') && (await txt('.sq-out')).includes('= 63'), 'seq: doubling step 6, sum 63');
  await page.selectOption(R + '.sq-pat', 'pentagon'); await page.waitForTimeout(100);
  check((await txt('.sq-big')) === 'Step 6: 51 dots' && (await page.$$(R + '.sq-dot')).length === 1 + 5 + 12 + 51, 'seq: pentagonal step 6 is 51');
  await page.fill(R + '.sq-n', '0'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.sq-err'), 'seq: n = 0 message');
  await page.fill(R + '.sq-n', '4'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.sq-err'), 'seq: message clears');
  check((await txt('.sq-rule')).includes('nth term = 4n + 1') && (await txt('.sq-rule')).includes('Next term: 21'), 'seq: own list 5, 9, 13, 17');
  await page.click(R + '.sq-ex[data-s="2, 5, 10, 17, 26"]'); await page.waitForTimeout(100);
  check((await txt('.sq-rule')).includes('n² + 1') && (await txt('.sq-rule')).includes('Next term: 37'), 'seq: own quadratic');
  await page.click(R + '.sq-ex[data-s="3, 6, 12, 24"]'); await page.waitForTimeout(100);
  check((await txt('.sq-rule')).includes('Geometric') && (await txt('.sq-rule')).includes('Next term: 48'), 'seq: own geometric');
  await page.click(R + '.sq-ex[data-s="1, 1, 2, 3, 5, 8"]'); await page.waitForTimeout(100);
  check((await txt('.sq-rule')).includes('No linear, quadratic'), 'seq: Fibonacci has no simple rule');
  await page.fill(R + '.sq-own', '1, x, 3'); await page.waitForTimeout(100);
  check((await txt('.sq-rule')).includes('Use only numbers'), 'seq: bad list message');
  check((await page.$$(R + '.sm-q')).length === 4, 'seq: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, w.match(/−?\d+(?:\.\d+)?/g).at(-1).replace('−', '-')); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `seq: quiz ${i} (${w})`);
  }
};
