// #975 Significant figures checker
export const path = '/science/sig-fig-checker/';
export default async ({ page, check, OUT, BASE, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/sig-fig-checker/`); await page.waitForTimeout(600);
  const t = (c) => page.textContent('.sfc ' + c), fill = async (c, v) => { await page.fill('.sfc ' + c, v); await page.waitForTimeout(120); };
  check((await t('.sf-big')) === '4 significant figures' && (await t('.sf-facts')).includes('0.0046') && (await page.$$eval('.sfc .sf-digits .sf-s', (e) => e.map((x) => x.textContent).join(''))) === '4560', 'sigfig: example 0.004560');
  check((await t('.sf-why')).includes('Leading zeros') && (await t('.sf-why')).includes('Trailing zeros with a decimal point'), 'sigfig: rules listed');
  await fill('.sf-x', '1200'); check((await t('.sf-big')) === '2 to 4 significant figures (ambiguous)' && (await page.$$eval('.sfc .sf-digits .sf-q', (e) => e.length)) === 2 && (await t('.sf-facts')).includes('1.2 × 10³'), 'sigfig: ambiguous 1200');
  await fill('.sf-x', '6.02 × 10^23'); check((await t('.sf-big')) === '3 significant figures' && (await t('.sf-why')).includes('scientific notation'), 'sigfig: scientific notation');
  await fill('.sf-x', '2.675'); await fill('.sf-n', '3'); check((await t('.sf-facts')).includes('2.68'), 'sigfig: 2.675 half up to 2.68');
  await fill('.sf-x', '2.665'); await page.selectOption('.sfc .sf-mode', 'half-even'); await page.waitForTimeout(120);
  check((await t('.sf-facts')).includes('To 3 significant figures2.66'), 'sigfig: half to even');
  await fill('.sf-dp', '2'); check((await t('.sf-facts')).includes('To 2 decimal places2.66'), 'sigfig: decimal places');
  await page.selectOption('.sfc .sf-mode', 'half-up'); await fill('.sf-x', '0.5'); await fill('.sf-n', '3');
  check((await t('.sf-facts')).includes('only has 1 significant figure'), 'sigfig: no padding with zeros');
  await fill('.sf-x', 'abc'); check((await t('.sf-err')).includes('Type a number') && await page.isHidden('.sfc .sf-out1'), 'sigfig: bad number message');
  check((await t('.sf-big2')) === '(9.81 ± 0.03) m/s²' && (await t('.sf-note2')).includes('2 decimal places'), 'sigfig: value ± uncertainty example');
  await page.click('.sfc .sf-up'); await page.waitForTimeout(120); check((await t('.sf-big2')) === '(9.81 ± 0.04) m/s²', 'sigfig: round the uncertainty up');
  await page.click('.sfc .sf-up'); await fill('.sf-u', '0.0152'); await page.selectOption('.sfc .sf-rule', 'lead1'); await page.waitForTimeout(120);
  check((await t('.sf-big2')) === '(9.812 ± 0.015) m/s²', 'sigfig: two figures when the uncertainty starts with 1');
  await fill('.sf-unit', ''); await fill('.sf-v', '602214076000000000000000'); await fill('.sf-u', '120000000000000000');
  check((await t('.sf-big2')) === '(6.0221408 ± 0.0000012) × 10²³', 'sigfig: very large value');
  await fill('.sf-u', '0'); check((await t('.sf-err2')).includes('greater than 0'), 'sigfig: zero uncertainty message');
  check((await t('.sf-big3')) === '4.56 × 1.4 = 6.4' && (await t('.sf-note3')).includes('Exact 6.384'), 'sigfig: product rule example');
  await page.selectOption('.sfc .sf-op', 'add'); await fill('.sf-list', '12.11, 18.0, 1.013');
  check((await t('.sf-big3')) === '12.11 + 18.0 + 1.013 = 31.1' && (await t('.sf-note3')).includes('1 decimal place'), 'sigfig: sum rule');
  await page.selectOption('.sfc .sf-op', 'div'); await fill('.sf-list', '2.000\n3.00'); check((await t('.sf-big3')) === '2.000 ÷ 3.00 = 0.667', 'sigfig: division');
  await page.selectOption('.sfc .sf-op', 'sub'); await fill('.sf-list', '5.67 1.2'); check((await t('.sf-big3')) === '5.67 − 1.2 = 4.5', 'sigfig: subtraction');
  await fill('.sf-list', '5.67 x'); check((await t('.sf-err3')).includes('"x" is not a number'), 'sigfig: bad calculation message');
  await page.selectOption('.sfc .sf-rule', '1'); await page.waitForTimeout(120);
  check((await t('.sf-big4')) === '2 of 5 written correctly' && (await t('.sf-tab')).includes('3.142 ± 0.005') && (await t('.sf-tab')).includes('1530 ± 30'), 'sigfig: table example');
  await page.selectOption('.sfc .sf-rule', 'lead12'); await page.waitForTimeout(120);
  check((await t('.sf-big4')) === '3 of 5 written correctly', 'sigfig: table with the 1-or-2 rule');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.sfc .sf-csv')]); const f = OUT + 'sf.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n'); check(r.length === 6 && r[0] === '#,Label,As written,Suggested,Check' && r[1].includes('9.81 ± 0.03'), 'sigfig: table CSV'); }
  writeFileSync(OUT + 'sf-in.csv', 'name,value,uncertainty\ng,9.79,0.02\nL,1.2345,0.0123\n');
  await page.setInputFiles('.sfc .dfb-in', OUT + 'sf-in.csv'); await page.waitForTimeout(500);
  check((await t('.sf-tab')).includes('Label') && (await t('.sf-big4')) === '1 of 2 written correctly' && (await t('.sf-tab')).includes('1.235 ± 0.012'), 'sigfig: open a file with labels');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.sfc .dl button[data-f=docx]')]); check((await d.suggestedFilename()) === 'significant-figures.docx', 'sigfig: Word report'); }
  await fill('.sf-tab-in', '9.8 ± x'); check((await t('.sf-err4')).includes('Line 1'), 'sigfig: bad table line message');
};
