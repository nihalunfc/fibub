// #652 column buckling (maths checked against NumPy/SciPy in tests/sci-tools/column-buckling.mjs)
export const path = '/science/column-buckling/';
export default async ({ page, check, BASE }) => {
  const R = '.ckb ';
  await page.goto(`${BASE}/science/column-buckling/`); await page.waitForTimeout(500);
  check((await page.textContent(R + '.ck-big')) === 'Critical load 645.4 kN (Johnson, intermediate column)', `buckling: example (${await page.textContent(R + '.ck-big')})`);
  { const f = await page.textContent(R + '.ck-facts'); check(f.includes('Slenderness KL/r107.7') && f.includes('Cc125.7') && f.includes('158.2 MPa') && f.includes('694.4 kN') && f.includes('1020 kN') && f.includes('322.7 kN') && f.includes('A 4080 mm²') && f.includes('ry 37.14 mm') && f.includes('weak (y) axis'), `buckling: facts (${f})`); }
  check(await page.isVisible(R + '.ck-sec') && await page.isVisible(R + '.ck-fig'), 'buckling: section and column curve');
  await page.selectOption(R + '.ck-ends', '0.5'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.ck-K')) === '0.5' && (await page.textContent(R + '.ck-facts')).includes('227 MPa'), 'buckling: fixed ends');
  await page.selectOption(R + '.ck-ends', '2'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ck-big')).includes('Euler, slender column'), 'buckling: flagpole is Euler');
  await page.fill(R + '.ck-K', '0.8'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.ck-ends')) === '', 'buckling: own K');
  await page.selectOption(R + '.ck-ends', '1');
  await page.fill(R + '.ck-P', '400'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ck-facts')).includes('MORE than the allowed load'), 'buckling: applied load too high');
  await page.fill(R + '.ck-P', '300'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ck-facts')).includes('within the allowed load'), 'buckling: applied load fine');
  await page.selectOption(R + '.ck-shape', 'rect'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.ck-b') && await page.isHidden(R + '.ck-tf') && (await page.textContent(R + '.ck-facts')).includes('A 15000 mm²'), 'buckling: rectangle');
  await page.selectOption(R + '.ck-shape', 'circle'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ck-facts')).includes('any axis'), 'buckling: circle');
  await page.selectOption(R + '.ck-shape', 'tube'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ck-facts')).includes('A 1492 mm²'), 'buckling: tube');
  await page.fill(R + '.ck-t1', '60'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ck-err')).includes('wall is too thick') && await page.isHidden(R + '.ck-out'), 'buckling: bad tube message');
  await page.fill(R + '.ck-t1', '5'); await page.fill(R + '.ck-fy', '300000'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.ck-err')).includes('less than E'), 'buckling: bad fy message');
  await page.fill(R + '.ck-fy', '250'); await page.waitForTimeout(100);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=docx]')]); check((await d.suggestedFilename()) === 'column-buckling.docx', 'buckling: Word report'); }
};
