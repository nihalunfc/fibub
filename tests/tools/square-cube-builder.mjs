// #1229 Square and cube builder
export const path = '/learn/square-cube-builder/';
export default async ({ page, check, BASE }) => {
  const R = '.sq ';
  const t = (s) => page.textContent(R + s);
  await page.goto(BASE + path); await page.waitForSelector(R + '.sq-cell');
  check((await page.$$(R + '.sq-cell')).length === 25 && (await t('.sq-f1')) === '1 + 3 + 5 + 7 + 9 = 25 = 5²' && (await t('.sq-f2')).includes('16 + 9 = 25'), 'squares: 5 × 5 from odd L-shapes');
  check((await page.$$(R + '.sq-tab tr')).length === 7 && (await t('.sq-tab')).includes('125'), 'squares: table of n, n², n³');
  await page.click(R + '.sq-st[data-d="1"]'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.sq-n')) === '6' && (await page.$$(R + '.sq-cell')).length === 36, 'squares: + 1 gives 36 squares');
  await page.click(R + '.sq-mode [data-v="3"]'); await page.fill(R + '.sq-n', '5'); await page.waitForTimeout(100);
  check((await t('.sq-big')) === '5 × 5 × 5 = 125 unit cubes' && (await page.$$(R + '.sq-face')).length === 75 && (await t('.sq-f2')).includes('= 61 cubes: 64 + 61 = 125'), 'squares: cube of 5 and its shell of 61');
  await page.$eval(R + '.sq-nr', (e) => { e.value = '12'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await t('.sq-big')) === '12 × 12 × 12 = 1728 unit cubes', 'squares: slider to 12');
  check((await t('.sq-x1')) === '1,008 = 2⁴ × 3² × 7' && (await t('.sq-x2')).includes('between 961 = 31² and 1,024 = 32²') && (await t('.sq-x4')).includes('× 7 = 7,056 = 84²') && (await t('.sq-x4')).includes('multiply by 588 (= 84³)'), 'squares: 1008 worked example');
  await page.fill(R + '.sq-x', '5832'); await page.waitForTimeout(100);
  check((await t('.sq-x3')).includes('∛5,832 = 18') && (await t('.sq-x2')).startsWith('Not a perfect square'), 'squares: 5832 is 18³');
  await page.fill(R + '.sq-x', '4097'); await page.waitForTimeout(100);
  check((await t('.sq-x2')).includes('no square ends in 7'), 'squares: last digit 7 rule');
  await page.fill(R + '.sq-x', '0'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.sq-err'), 'squares: 0 message');
  await page.fill(R + '.sq-x', '144'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.sq-err') && (await t('.sq-x2')).includes('√144 = 12'), 'squares: 144 is 12²');
  check((await t('.sq-tx')) === 'Taxicab number 1: 1,729 = 1³ + 12³ = 9³ + 10³' && (await t('.sq-ty1')).includes('2 ways'), 'squares: 1729');
  await page.click(R + '.sq-next'); await page.waitForTimeout(100);
  check((await t('.sq-tx')).includes('4,104 = 2³ + 16³ = 9³ + 15³') && (await page.inputValue(R + '.sq-ty')) === '4104', 'squares: next taxicab 4104');
  await page.click(R + '.sq-first'); await page.fill(R + '.sq-ty', '35'); await page.waitForTimeout(100);
  check((await t('.sq-ty1')).includes('35 = 2³ + 3³: one way') && (await t('.sq-tx')).includes('1,729'), 'squares: 35 one way, back to 1729');
  check((await page.$$(R + '.sm-q')).length === 5, 'squares: five questions');
  const res = [/= (\d+)\.$/, /= (\d+)\.$/, /= (\d+)\.$/, /= (\d+)\.$/, /to (\d+), so/];
  for (let i = 1; i <= 5; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await t(`.sm-q:nth-child(${i}) .sm-qwork`); const m = res[i - 1].exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await t(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `squares: quiz ${i} (${w})`);
  }
};
