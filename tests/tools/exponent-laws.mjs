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
};
