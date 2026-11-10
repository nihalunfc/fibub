// #1284 Factorising with identities, step by step
export const path = '/learn/factorise-steps/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/factorise-steps/`); await page.waitForSelector('.fs .fs-pos');
  const R = '.fs ', txt = (s) => page.textContent(R + s);
  check((await txt('.fs-expr')) === '6x² − 5x − 6' && (await txt('.fs-ans')) === '= (2x − 3)(3x + 2)', 'factor: 6x² − 5x − 6');
  check((await txt('.fs-steps')).includes('−9 and 4') && (await txt('.fs-steps')).includes('3x(2x − 3) + 2(2x − 3)'), 'factor: split and grouped');
  check((await txt('.fs-num')).includes('gives 8, and') && (await txt('.fs-num')).includes('They agree'), 'factor: number check x = 2');
  check((await page.$$(R + '.fs-pos')).length + (await page.$$(R + '.fs-neg')).length === 4 && (await page.$$(R + '.fs-neg')).length === 2, 'factor: area picture with two negative parts');
  const set = async (a, b, c) => { await page.fill(R + '.fs-a', String(a)); await page.fill(R + '.fs-b', String(b)); await page.fill(R + '.fs-c', String(c)); await page.waitForTimeout(80); };
  await set(9, 12, 4);
  check((await txt('.fs-ans')) === '= (3x + 2)²' && (await txt('.fs-steps')).includes('(a + b)²'), 'factor: perfect square spotted');
  await set(1, 1, 1);
  check((await txt('.fs-ans')).startsWith('Does not factorise') && (await txt('.fs-steps')).includes('−3') && await page.isHidden(R + '.fs-piccard'), 'factor: x² + x + 1 does not split');
  await set(3, 6, 3);
  check((await txt('.fs-ans')) === '= 3(x + 1)²' && (await txt('.fs-steps')).includes('common factor 3'), 'factor: common factor first');
  await set(1, -5, 0);
  check((await txt('.fs-ans')) === '= x(x − 5)', 'factor: no number term');
  await set(0, 2, 3);
  check(await page.isVisible(R + '.fs-err'), 'factor: a = 0 rejected');
  await set(2, 7, 3);
  check(await page.isHidden(R + '.fs-err') && (await txt('.fs-ans')) === '= (2x + 1)(x + 3)', 'factor: message clears');
  await page.click(R + '.fs-mode button[data-m="d"]'); await page.waitForTimeout(80);
  check((await txt('.fs-ans')) === '= (7x + 4)(7x − 4)' && (await txt('.fs-num')).includes('They agree'), 'factor: 49x² − 16');
  await page.fill(R + '.fs-dp', '5'); await page.waitForTimeout(80);
  check((await txt('.fs-ans')).startsWith('Does not factorise'), 'factor: 5x² − 16 has no whole-number squares');
  await page.click(R + '.fs-mode button[data-m="c"]'); await page.waitForTimeout(80);
  check((await txt('.fs-ans')) === '= (2x + 3)(4x² − 6x + 9)' && (await txt('.fs-num')).includes('gives 91') && (await txt('.fs-num')).includes('They agree'), 'factor: 8x³ + 27');
  await page.selectOption(R + '.fs-cs', '-'); await page.waitForTimeout(80);
  check((await txt('.fs-ans')) === '= (2x − 3)(4x² + 6x + 9)', 'factor: 8x³ − 27');
  for (const m of ['c', 'd', 'q']) {
    await page.click(R + `.fs-mode button[data-m="${m}"]`);
    for (let i = 0; i < 4; i++) { await page.click(R + '.fs-rand'); await page.waitForTimeout(40); if (!(await txt('.fs-num')).includes('They agree')) check(false, `factor: random ${m} agrees (${await txt('.fs-expr')})`); }
  }
  check((await txt('.fs-num')).includes('They agree'), 'factor: random examples all factorise and check');
  check((await page.$$(R + '.sm-q')).length === 4, 'factor: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    const two = /: (−?\d+) and (−?\d+)\./.exec(w);
    const ans = i === 1 && two ? `${two[1]}, ${two[2]}`.replace(/−/g, '-') : w.match(/\d+(?:\.\d+)?/g).at(-1);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, ans); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `factor: quiz ${i} (${w})`);
  }
};
