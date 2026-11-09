// #907 coupled oscillators and normal modes
export const path = '/science/coupled-oscillators/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/coupled-oscillators/`); await page.waitForTimeout(700);
  const big = () => page.textContent('.cpo .co-big'), tab = () => page.textContent('.cpo .co-tab'), facts = () => page.textContent('.cpo .co-facts'), err = () => page.textContent('.cpo .co-err');
  check((await big()) === '3 normal modes: 0.272, 0.672, 1.01 Hz', 'coupled: example frequencies');
  { const t = await tab(); check(t.includes('1.708') && t.includes('4.221') && t.includes('6.333') && t.includes('3.679') && t.includes('0.9922'), 'coupled: table of ω and periods'); }
  check(await page.isVisible('.cpo .co-fig') && await page.isVisible('.cpo .co-fig2') && await page.isVisible('.cpo .co-live'), 'coupled: shape chart, motion chart and animation');
  check((await facts()).includes('100 %'), 'coupled: mode 1 start holds all the energy');
  { const t1 = await page.textContent('.cpo .co-clock'); await page.waitForTimeout(500); check(t1 !== await page.textContent('.cpo .co-clock'), 'coupled: animation runs'); }
  await page.click('.cpo .co-play'); await page.waitForTimeout(100);
  { const t1 = await page.textContent('.cpo .co-clock'); await page.waitForTimeout(400); check(t1 === await page.textContent('.cpo .co-clock'), 'coupled: pause'); }
  await page.selectOption('.cpo .co-start', 'pull'); await page.waitForTimeout(200);
  { const f = await facts(); check(f.includes('1.35 %') && f.includes('13.2 %') && f.includes('85.5 %'), 'coupled: pulling mass 1 shares energy between modes'); }
  await page.selectOption('.cpo .co-start', 'custom'); await page.fill('.cpo .co-x0', '1, 2'); await page.waitForTimeout(200);
  check((await facts()).includes('give 3 numbers') && await page.isVisible('.cpo .co-x0'), 'coupled: custom start needs one number per mass');
  await page.fill('.cpo .co-x0', '0.7071, 1, 0.7071'); await page.fill('.cpo .co-m', '1'); await page.fill('.cpo .co-k', '10'); await page.waitForTimeout(200);
  check((await tab()).includes('0.707, 1.000, 0.707') && (await tab()).includes('1.000, 0, -1.000') && (await facts()).includes('under 0.001 %') && /Mode 1 share of the energy100 %/.test(await facts()), 'coupled: equal masses give the textbook shapes; starting in that shape is pure mode 1 ');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cpo .co-csv')]); const f = OUT + 'coupled.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 't_s,x1,x2,x3' && rows.length === 602 && rows[1].startsWith('0,0.7071,1,0.7071'), 'coupled: motion CSV'); }
  await page.selectOption('.cpo .co-ends', 'free-free'); await page.waitForTimeout(200);
  check((await tab()).includes('rigid drift') && (await page.textContent('.cpo .co-kn')) === '2', 'coupled: floating chain has a rigid mode and needs 2 springs');
  await page.selectOption('.cpo .co-ends', 'fixed-free'); await page.fill('.cpo .co-n', '5'); await page.waitForTimeout(200);
  check((await big()).startsWith('5 normal modes') && (await page.textContent('.cpo .co-kn')) === '5', 'coupled: 5 masses, one wall');
  await page.fill('.cpo .co-k', '10, 10'); await page.waitForTimeout(150);
  check((await err()).includes('Give 5 spring constants') && await page.isHidden('.cpo .co-out'), 'coupled: wrong number of springs message');
  await page.fill('.cpo .co-k', '10'); await page.fill('.cpo .co-m', '1, -2, 1, 1, 1'); await page.waitForTimeout(150);
  check((await err()).includes('Give 5 masses'), 'coupled: bad mass message');
  await page.fill('.cpo .co-m', '1'); await page.fill('.cpo .co-n', '20'); await page.waitForTimeout(150);
  check((await err()).includes('1 to 12'), 'coupled: too many masses message');
  await page.fill('.cpo .co-n', '3'); await page.selectOption('.cpo .co-ends', 'fixed-fixed'); await page.fill('.cpo .co-m', '1, 2, 1.5'); await page.fill('.cpo .co-k', '10, 20, 15, 5'); await page.waitForTimeout(200);
  check((await big()) === '3 normal modes: 0.272, 0.672, 1.01 Hz', 'coupled: back to the example');
  for (const [f, n] of [['png', 'Image'], ['pdf', 'PDF'], ['docx', 'Word']]) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`.cpo .dl [data-f=${f}]`)]); check(d.suggestedFilename().endsWith('.' + f), `coupled: ${n} download`); }
};
