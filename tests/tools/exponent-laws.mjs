// #1236 Exponent laws with tiles
export const path = '/learn/exponent-laws/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/exponent-laws/`); await page.waitForSelector('.el .el-fig rect');
  const R = '.el ';
  const txt = (s) => page.textContent(R + s);
  check((await txt('.el-big')) === '2³ × 2⁴ = 2³⁺⁴ = 2⁷', 'exp: example big line');
  check((await page.$$(R + '.el-fig rect')).length === 14 && (await page.$$(R + '.el-fig .el-x')).length === 0, 'exp: 3 + 4 tiles and 7 left, nothing crossed');
  check((await txt('.el-f2')).includes('8 × 16 = 128, and 2⁷ = 128 ✓'), 'exp: value check 128');
  await page.click(R + '.el-law button[data-w="quotient"]'); await page.waitForTimeout(100);
  check((await txt('.el-big')).endsWith('= 2⁻¹') && (await page.$$(R + '.el-fig .el-x')).length === 12 && (await txt('.el-f2')).includes('8 ÷ 16 = 1/2'), 'exp: quotient 2³ ÷ 2⁴ = 2⁻¹, 3 pairs crossed');
  await page.click(R + '.el-law button[data-w="power"]'); await page.waitForTimeout(100);
  check((await txt('.el-big')).endsWith('= 2¹²') && (await page.$$(R + '.el-fig rect')).length === 12 && (await txt('.el-f2')).includes('4,096 ✓'), 'exp: power (2³)⁴ = 2¹², 12 tiles');
  await page.click(R + '.el-law button[data-w="bases"]'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.el-brow') && await page.isHidden(R + '.el-nrow'), 'exp: b slider shown, n hidden');
  check((await txt('.el-big')) === '2³ × 5³ = (2 × 5)³ = 10³' && (await txt('.el-f2')).includes('8 × 125 = 1,000'), 'exp: bases 2³ × 5³ = 10³');
  await page.fill(R + '.el-b', '3'); await page.waitForTimeout(100);
  check((await txt('.el-big')).endsWith('6³') && (await page.inputValue(R + '.el-br')) === '3', 'exp: typed b = 3');
  await page.fill(R + '.el-m', '-2'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.el-err') && (await txt('.el-err')).includes('Class 9'), 'exp: negative exponent at Class 8 asks for Class 9');
  await page.click(R + '.el-level button[data-l="9"]'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.el-err') && (await txt('.el-f2')).includes('1/4 × 1/9 = 1/36'), 'exp: Class 9 negative bases law');
  await page.click(R + '.el-law button[data-w="product"]'); await page.waitForTimeout(100);
  check((await txt('.el-big')).endsWith('= 2²') && (await page.$$(R + '.el-fig .el-x')).length === 8, 'exp: 2⁻² × 2⁴ = 2², 2 pairs cancel');
  await page.fill(R + '.el-m', '3'); await page.fill(R + '.el-n', '2'); await page.waitForTimeout(100);
  check((await txt('.el-f9')).includes('2^(3/2)') && (await txt('.el-f9')).includes('2.8284'), 'exp: Class 9 fractional exponent line');
  await page.click(R + '.el-level button[data-l="8"]'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.el-f9'), 'exp: fractional line hidden at Class 8');
  await page.fill(R + '.el-a', '3'); await page.waitForTimeout(100);
  check((await txt('.el-lad')).includes('1/9') && (await txt('.el-lt')).includes('3 ÷ 3 = 1 = 3⁰'), 'exp: ladder for a = 3');
  await page.fill(R + '.el-a', '11'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.el-err'), 'exp: base too big message');
  await page.fill(R + '.el-a', '2'); await page.waitForTimeout(100);
  check((await page.$$(R + '.sm-q')).length === 5, 'exp: five questions');
  const res = [/so \d+(\S+)\.$/, /so \d+(\S+)\.$/, /so \d+(\S+)\.$/, /= ([\d.]+)\.$/, /= (\d+)\.$/];
  const fromSup = (s) => s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(c));
  for (let i = 1; i <= 5; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = res[i - 1].exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? fromSup(m[1]) : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `exp: quiz question ${i} (${w})`);
  }
  // Solve your own numbers (shared card, src/lib/learn/solvecard-b.ts)
  await page.goto(`${BASE}/learn/exponent-laws/`); await page.waitForTimeout(600);
  {
  const S = '.el-solve ', ans = () => page.textContent(S + '.sv-answer'), work = () => page.textContent(S + '.sv-work');
  const pre = async (n) => { await page.selectOption(S + '[data-k="sv-example"]', ''); await page.selectOption(S + '[data-k="sv-example"]', String(n)); await page.waitForTimeout(60); };
  const fill = async (k, v) => { await page.fill(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  const sel = async (k, v) => { await page.selectOption(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  const is = async (want, label) => check((await ans()) === want, `exponent solve: ${label} (${await ans()})`);
  const has = async (want, label) => check((await ans()).includes(want), `exponent solve: ${label} (${await ans()})`);
  const wk = async (want, label) => check((await work()).includes(want), `exponent solve working: ${label}`);
  await pre(0); await is('2⁵ × 2³ = 2⁸ = 256.', 'product'); await wk('32 × 8 = 256', 'product check');
  await pre(1); await is('5⁷ ÷ 5⁴ = 5³ = 125.', 'quotient'); await wk('78,125 ÷ 625 = 125', 'quotient check');
  await pre(2); await is('(3²)⁴ = 3⁸ = 6,561.', 'power of a power');
  await pre(3); await is('2³ × 5³ = 10³ = 1,000.', 'same exponent');
  await pre(4); await is('4⁻² = 1/16 = 0.0625.', 'negative exponent'); await wk('1 ÷ 4² = 1 ÷ 16', 'reciprocal');
  await pre(5); await is('x = 6.', 'unknown exponent'); await wk('x + 3 = 9', 'unknown working');
  await pre(6); await is('x = 4, because 3⁴ = 81.', 'power giving 81');
  await pre(0); await fill('a', '0'); await fill('m', '0'); await fill('n', '0'); await has('not defined', '0⁰');
  await fill('m', '1'); await fill('n', '-3'); await has('negative power', '0 to a negative power');
  await fill('a', '-2'); await fill('m', '3'); await fill('n', '2'); await is('(−2)³ × (−2)² = (−2)⁵ = −32.', 'negative base');
  await fill('m', '2.5'); await has('whole number', 'decimal exponent');
  await fill('a', '2'); await fill('m', '900'); await fill('n', '900'); await has('too large', 'huge result');
  await pre(6); await fill('a', '2'); await fill('N', '0.125'); await is('x = −3, because 2⁻³ = 0.125.', 'fraction as a power');
  await fill('N', '10'); await has('never equals 10', 'not a whole power');
  await fill('a', '1'); await has('not 1', 'base 1');
  await pre(5); await fill('a', '1'); await has('must not be 0, 1 or', 'unknown with base 1');
  }
};
