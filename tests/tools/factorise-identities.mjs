// #1285 Factorise with identities
export const path = '/learn/factorise-identities/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/factorise-identities/`); await page.waitForSelector('.fz .fz-steps li');
  const R = '.fz ', txt = (s) => page.textContent(R + s);
  check((await txt('.fz-big')) === '6x² + 5x − 6 = (2x + 3)(3x − 2)' && (await txt('.fz-steps')).includes('−4 and 9'), 'factorise: start example');
  check((await txt('.fz-check')).includes('6x² + 5x − 6 ✓') && (await txt('.fz-check')).includes('also gives 28'), 'factorise: check by multiplying and x = 2');
  check(await page.isVisible(R + '.fz-fig') && (await page.locator(R + '.fz-fig rect').count()) === 4 && (await txt('.fz-fig')).includes('6x²'), 'factorise: area model');
  const go = async (e) => { await page.fill(R + '.fz-in', e); await page.waitForTimeout(50); return txt('.fz-big'); };
  check((await go('9x^2 - 25')) === '9x² − 25 = (3x + 5)(3x − 5)' && (await txt('.fz-steps')).includes('a² − b²'), 'factorise: a² − b²');
  check((await go('x^2 - 10x + 25')) === 'x² − 10x + 25 = (x − 5)²' && (await txt('.fz-steps')).includes('(a − b)²'), 'factorise: perfect square');
  check((await go('2x^2 - 18')) === '2x² − 18 = 2(x + 3)(x − 3)' && (await txt('.fz-steps')).includes('Common factor first') && await page.isHidden(R + '.fz-fig'), 'factorise: common factor first');
  check((await go('8x³ − 27')) === '8x³ − 27 = (2x − 3)(4x² + 6x + 9)' && (await txt('.fz-steps')).includes('a³ − b³'), 'factorise: difference of cubes');
  check((await go('x^3 - 6x^2 + 11x - 6')) === 'x³ − 6x² + 11x − 6 = (x − 1)(x − 2)(x − 3)' && (await txt('.fz-steps')).includes('Factor theorem'), 'factorise: factor theorem');
  check((await go('x^2 + 9')) === 'x² + 9 does not factorise with whole numbers', 'factorise: sum of squares');
  check((await go('x^5 + 1')) === '' && await page.isVisible(R + '.fz-err'), 'factorise: degree 5 refused');
  check((await go('2y + 1')) === '' && await page.isVisible(R + '.fz-err'), 'factorise: other letters refused');
  await page.click(R + '.fz-chip[data-e="x⁴ − 16"]'); check((await txt('.fz-big')) === 'x⁴ − 16 = (x + 2)(x − 2)(x² + 4)' && await page.isHidden(R + '.fz-err'), 'factorise: chip x⁴ − 16');
  for (const k of ['sq', 'ps', 'split', 'cube', 'ft']) {
    await page.click(`${R}.fz-rand button[data-k="${k}"]`);
    check((await txt('.fz-check')).includes('✓') && (await txt('.fz-big')).includes('='), `factorise: random ${k} (${await txt('.fz-big')})`);
  }
  check((await page.$$(R + '.sm-q')).length === 4, 'factorise: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    const m = i === 1 ? /: (\d+) and (\d+)\./.exec(w) : /= (\d+)\.$/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? (i === 1 ? `${m[1]}, ${m[2]}` : m[1]) : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `factorise: quiz ${i} (${w})`);
  }
};
