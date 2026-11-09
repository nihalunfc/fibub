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
  await page.setViewportSize({ width: 375, height: 800 }); await page.waitForTimeout(200);
  await page.locator('.brin').screenshot({ path: OUT + 'brine-375.png' }); await page.setViewportSize({ width: 1280, height: 800 });
};
