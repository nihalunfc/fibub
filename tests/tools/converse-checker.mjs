// #1281 Statement and converse checker
export const path = '/learn/converse-checker/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/converse-checker/`); await page.waitForSelector('.cv .cv-s');
  const R = '.cv ', txt = (s) => page.textContent(R + s);
  check((await txt('.cv-s')) === 'If a quadrilateral is a square, then its diagonals are equal.' && (await txt('.cv-c')) === 'If its diagonals are equal, then a quadrilateral is a square.', 'converse: statement and converse written');
  await page.click(R + '.cv-ts');
  check((await txt('.cv-tally')).startsWith('All 50 of 50') && (await txt('.cv-big')).startsWith('Example 1: yes') && (await page.locator(R + '.cv-fig polygon').count()) === 1, 'converse: square statement passes 50 tests');
  check((await txt('.cv-why')).startsWith('The statement is always true.'), 'converse: why (statement)');
  { const d = await txt('.cv-desc'); const m = /diagonals ([\d.]+) and ([\d.]+)/.exec(d); check(m && m[1] === m[2], `converse: square example has equal diagonals (${d})`); }
  await page.click(R + '.cv-next'); check((await txt('.cv-big')).startsWith('Example 2'), 'converse: next example');
  await page.click(R + '.cv-prev'); check((await txt('.cv-big')).startsWith('Example 1') && await page.isDisabled(R + '.cv-prev'), 'converse: previous');
  await page.click(R + '.cv-tc');
  check((await txt('.cv-tally')).includes('the converse is false') && (await txt('.cv-why')).includes('isosceles trapezium'), 'converse: square converse fails');
  if (await page.isVisible(R + '.cv-jump')) await page.click(R + '.cv-jump');
  check((await txt('.cv-big')).includes('counterexample!') && (await page.locator(R + '.cv-fig .cv-bad').count()) === 1, 'converse: counterexample drawn in red');
  for (const [id, sOK, cOK] of [['para', true, true], ['rhombus', true, false], ['iso', true, true], ['pyth', true, true], ['four', true, false], ['prime', true, false], ['zero', true, false]]) {
    await page.selectOption(R + '.cv-pick', id);
    check((await txt('.cv-big')) === 'Press a Test button.' && await page.isHidden(R + '.cv-verdict'), `converse: ${id} resets`);
    await page.click(R + '.cv-ts'); const a = await txt('.cv-tally');
    await page.click(R + '.cv-tc'); const b = await txt('.cv-tally');
    check(a.startsWith('All 50') === sOK && b.startsWith('All 50') === cOK, `converse: ${id} statement ${sOK}, converse ${cOK}`);
  }
  await page.selectOption(R + '.cv-pick', 'four'); await page.click(R + '.cv-tc');
  if (await page.isVisible(R + '.cv-jump')) await page.click(R + '.cv-jump');
  { const n = Number(/n = (\d+)/i.exec(await txt('.cv-desc'))[1]); check(n % 2 === 0 && n % 4 === 2 && (await txt('.cv-fig')).includes(`${n}`), `converse: even number not divisible by 4 (${n})`); }
  check((await page.$$(R + '.sm-q')).length === 4, 'converse: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, w.startsWith('True') ? '1' : '0'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `converse: quiz ${i}`);
  }
};
