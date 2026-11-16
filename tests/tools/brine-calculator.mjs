// #394 brine, cure and fermentation salt calculator
export const path = '/science/brine-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const S = '.brin ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(500);
  check((await page.textContent(S + '.br-big1')) === '52.6 g salt in 1,000 g water', 'brine: default 5 % brine');
  check((await page.textContent(S + '.br-big5')) === '' && await page.isHidden(S + '.br-err5'), 'brine: no nitrite amount suggested by default');
  await page.click(S + '.br-ex'); await page.waitForTimeout(100);
  check((await page.textContent(S + '.br-n1')).includes('5.26 % of the water, 18.9 °SAL'), 'brine: strength notes');
  check((await page.textContent(S + '.br-big2')) === '6.00 % of the brine, 6.38 % of the water, 22.7 °SAL', 'brine: check a brine');
  check((await page.textContent(S + '.br-big3')) === '30.0 g salt for 1,500 g of vegetables and water', 'brine: equilibrium ferment');
  check((await page.textContent(S + '.br-big4')) === '50.0 g salt and 20.0 g sugar for 2,000 g meat', 'brine: dry cure');
  check((await page.inputValue(S + '.br-np')) === '' && (await page.inputValue(S + '.br-nt')) === '', 'brine: example leaves the nitrite boxes empty');
  await page.selectOption(S + '.br-basis', 'water'); await page.waitForTimeout(50);
  check((await page.textContent(S + '.br-big1')) === '50.0 g salt in 1,000 g water', 'brine: % of water basis');
  await page.fill(S + '.br-p', '30'); await page.selectOption(S + '.br-basis', 'total'); await page.waitForTimeout(50);
  check((await page.textContent(S + '.br-err1')).includes('stronger than saturated'), 'brine: over-saturated warning');
  await page.fill(S + '.br-cs', ''); await page.fill(S + '.br-cw', ''); await page.fill(S + '.br-sal', '50'); await page.waitForTimeout(50);
  check((await page.textContent(S + '.br-big2')).startsWith('50° SAL = 13.20 % salt'), 'brine: salinometer to %');
  await page.fill(S + '.br-sal', '120');
  check((await page.textContent(S + '.br-err2')).includes('0 to 100'), 'brine: bad salinometer reading');
  await page.fill(S + '.br-nm', '2000'); await page.fill(S + '.br-nt', '100'); await page.waitForTimeout(50);
  check((await page.textContent(S + '.br-err5')).includes('Nitrite in the cure must be'), 'brine: cure needs its nitrite %');
  await page.fill(S + '.br-np', '10'); await page.fill(S + '.br-nc', '3'); await page.waitForTimeout(50);
  check((await page.textContent(S + '.br-big5')) === '2.00 g cure for 100 ppm (200.0 mg sodium nitrite); 3 g cure gives 150 ppm', 'brine: cure grams and ppm');
  check((await page.textContent(S + '.br-safe')).includes('does not suggest an amount'), 'brine: safety note');
  await page.fill(S + '.br-m', ''); await page.fill(S + '.br-ms', ''); await page.fill(S + '.br-mg', '1'); await page.fill(S + '.br-m', '5'); await page.waitForTimeout(50);
  check((await page.textContent(S + '.br-err4')).includes('meat weight and the salt %'), 'brine: dry cure without a salt %');
  await page.fill(S + '.br-ms', '2.5'); await page.fill(S + '.br-m', '2000');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(S + '.br-csv')]); const f = OUT + 'brine.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('section,item,value') && t.includes('Curing salt,Cure needed (g),2.00') && t.includes('Dry cure,Salt (g),50.0') && t.includes('Vegetable ferment,Salt (g),30.0'), 'brine: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(S + '.dl [data-f=pdf]')]); check((await d.suggestedFilename()) === 'brine-and-cure.pdf', 'brine: PDF download'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(S + '.dl [data-f=png]')]); check((await d.suggestedFilename()) === 'brine-and-cure.png', 'brine: PNG download'); }
  // more options: water unit, slider, strength table, fix a brine
  await page.evaluate(() => document.querySelectorAll('.brin details').forEach((d) => { d.open = true; }));
  await page.fill(S + '.br-p', '5'); await page.selectOption(S + '.br-wu', 'lb'); await page.fill(S + '.br-w', '2'); await page.waitForTimeout(80);
  check((await page.textContent(S + '.br-big1')) === '47.7 g salt (1.7 oz) in 2 lb water', 'brine: pounds of water');
  check((await page.textContent(S + '.br-wk')).startsWith('Working:'), 'brine: working line');
  check((await page.textContent(S + '.br-tab')).includes('10 %'), 'brine: strength table');
  await page.selectOption(S + '.br-wu', 'g'); await page.fill(S + '.br-w', '1000');
  await page.evaluate(() => { const r = document.querySelector('.brin .br-ps'); r.value = '10'; r.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(80);
  check((await page.inputValue(S + '.br-p')) === '10' && (await page.textContent(S + '.br-big1')) === '111 g salt in 1,000 g water', 'brine: slider sets the strength');
  await page.fill(S + '.br-tw', '1000'); await page.fill(S + '.br-tc', '3'); await page.fill(S + '.br-tt', '5'); await page.waitForTimeout(80);
  check((await page.textContent(S + '.br-big6')) === 'Stir in 21.1 g salt (0.7 oz) to reach 5 %', 'brine: add salt');
  await page.fill(S + '.br-tc', '10'); await page.waitForTimeout(80);
  check((await page.textContent(S + '.br-big6')) === 'Add 1,000 g water to reach 5 %', 'brine: add water');
  await page.fill(S + '.br-tt', '30'); await page.waitForTimeout(80);
  check((await page.textContent(S + '.br-err6')).includes('saturated'), 'brine: too strong target');
  await page.fill(S + '.br-w', '-5'); await page.waitForTimeout(80);
  check(!(await page.textContent(S + '.br-big1')).includes('NaN'), 'brine: negative water has no NaN');
  await page.fill(S + '.br-w', '1000');
  const vp0 = page.viewportSize(); await page.setViewportSize({ width: 375, height: 800 }); await page.waitForTimeout(200);
  await page.locator('.brin').screenshot({ path: OUT + 'brine-375.png' }); await page.setViewportSize(vp0);
};
