// #1226 Dissolving lab
export const path = '/learn/dissolving-lab/';
export default async ({ page, check, BASE }) => {
  const R = '.dl ';
  const t = (s) => page.textContent(R + s);
  await page.goto(BASE + path); await page.waitForSelector(R + '.dl-curve path');
  check((await t('.dl-state')) === 'Plain water: add a spoon' && (await t('.dl-f1')).includes('36.4 g per 100 g'), 'dissolving: opens with plain water, salt 36.4 g at 20 °C');
  await page.click(R + '.dl-add5'); await page.waitForTimeout(100);
  check((await t('.dl-state')) === 'Unsaturated: room for 11.4 g more', 'dissolving: 25 g unsaturated');
  await page.click(R + '.dl-add1'); await page.click(R + '.dl-add1'); await page.click(R + '.dl-add1'); await page.waitForTimeout(100);
  check((await t('.dl-state')) === 'Saturated: 3.6 g will not dissolve' && (await page.$$(R + '.dl-xtal')).length === 4 && (await page.$$(R + '.dl-over')).length === 1, 'dissolving: 40 g saturated, crystals and red dot');
  check(await page.isHidden(R + '.dl-f3'), 'dissolving: mass percent hidden at Class 8');
  await page.click(R + '.dl-level [data-v="9"]'); await page.waitForTimeout(100);
  check((await t('.dl-f3')).endsWith('= 26.7%.') && (await t('.dl-f4')).endsWith('= 6.22 mol/kg.'), 'dissolving: Class 9 to 12 mass percent and molality');
  await page.$eval(R + '.dl-tr', (e) => { e.value = '100'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.dl-t')) === '100' && (await t('.dl-state')).startsWith('Saturated: 1'), 'dissolving: heating to 100 °C dissolves a little more salt');
  await page.click(R + '.dl-sol [data-v="kno3"]'); await page.fill(R + '.dl-t', '60'); await page.fill(R + '.dl-g', '0'); await page.waitForTimeout(100);
  check((await t('.dl-cool')).includes('109.8 g − 31.4 g = 78.5 g'), 'dissolving: KNO3 cooling 60 → 20 °C gives 78.5 g crystals');
  await page.click(R + '.dl-water [data-v="200"]'); await page.waitForTimeout(100);
  check((await t('.dl-f1')).includes('can hold 109.8 × 200 / 100 = 219.7 g'), 'dissolving: 200 g of water holds twice as much');
  await page.click(R + '.dl-sol [data-v="sugar"]'); await page.click(R + '.dl-empty'); await page.waitForTimeout(100);
  check((await t('.dl-state')) === 'Plain water: add a spoon', 'dissolving: empty');
  await page.fill(R + '.dl-g', '-4'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.dl-err'), 'dissolving: negative grams message');
  await page.fill(R + '.dl-g', '10'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.dl-err'), 'dissolving: message clears');
  await page.click(R + '.dl-mode [data-v="gas"]'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.dl-tank') && (await t('.dl-o2')).includes('12.8 mg'), 'dissolving: gas view at 5 °C');
  await page.fill(R + '.dl-gt', '30'); await page.waitForTimeout(100);
  check((await t('.dl-o2')).includes('7.6 mg') && (await t('.dl-co2')).includes('1.61 g per litre fizz out'), 'dissolving: 30 °C less gas');
  await page.click(R + '.dl-mode [data-v="solid"]');
  // Quiz: read each worked answer and type the number it gives.
  check((await page.$$(R + '.sm-q')).length === 5, 'dissolving: five questions');
  const res = [/= ([\d.]+) g\.$/, /= ([\d.]+) g is left/, /= ([\d.]+) g of crystals/, /= ([\d.]+)%/, /= ([\d.]+) mol\/kg/];
  for (let i = 1; i <= 5; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await t(`.sm-q:nth-child(${i}) .sm-qwork`); const m = res[i - 1].exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await t(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `dissolving: quiz ${i} (${w})`);
  }
};
