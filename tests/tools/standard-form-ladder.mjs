// #1237 Standard form and powers-of-ten ladder
export const path = '/learn/standard-form-ladder/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/standard-form-ladder/`); await page.waitForSelector('.sf .sf-lad text');
  const R = '.sf ';
  const txt = (s) => page.textContent(R + s);
  check((await txt('.sf-big')) === '3.844 × 10⁸', 'stdform: example 3.844 × 10⁸');
  check((await txt('.sf-f1')).includes('move the decimal point 8 places left') && (await page.$$(R + '.sf-hop .sf-arc')).length === 8, 'stdform: 8 hops left');
  check((await txt('.sf-f2')).includes('3.844 × 100,000,000 = 384,400,000'), 'stdform: check line');
  check((await txt('.sf-where')).includes('bigger than the Earth (across)') && (await txt('.sf-where')).includes('smaller than the Sun (across)') && (await txt('.sf-where')).includes('size of the Earth to Moon distance'), 'stdform: place on ladder');
  check(await page.isHidden(R + '.sf-f11'), 'stdform: Class 11 line hidden');
  await page.click(R + '.sf-level button[data-l="11"]'); await page.waitForTimeout(100);
  check((await txt('.sf-f11')).includes('Significant figures: 4') && (await txt('.sf-f11')).includes('10⁹'), 'stdform: Class 11 sig figs and order of magnitude');
  await page.fill(R + '.sf-x', '0.00072'); await page.waitForTimeout(100);
  check((await txt('.sf-big')) === '7.2 × 10⁻⁴' && (await txt('.sf-f1')).includes('4 places right') && (await txt('.sf-f1')).includes('negative: −4'), 'stdform: small number');
  await page.fill(R + '.sf-x', '12000.0'); await page.waitForTimeout(100);
  check((await txt('.sf-f11')).includes('Significant figures: 6'), 'stdform: 12000.0 has 6 sig figs');
  await page.fill(R + '.sf-x', '6.02 × 10^23'); await page.waitForTimeout(100);
  check((await txt('.sf-big')) === '6.02 × 10²³' && (await txt('.sf-where')).includes('Milky Way'), 'stdform: typed × 10^ form');
  await page.fill(R + '.sf-x', 'hello'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.sf-err'), 'stdform: bad input message');
  await page.fill(R + '.sf-x', '0'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.sf-err') && (await txt('.sf-f1')).includes('Zero has no standard form'), 'stdform: zero');
  await page.locator(R + '.sf-lad g[data-i="1"]').scrollIntoViewIfNeeded();
  await page.click(R + '.sf-lad g[data-i="1"] .sf-hitr'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.sf-x')) === '1e-10' && (await txt('.sf-big')) === '1 × 10⁻¹⁰' && (await page.$$(R + '.sf-on')).length === 1, 'stdform: tap atom on ladder');
  check((await txt('.sf-bf')).endsWith('= 0.0000025'), 'stdform: back again 2.5 × 10⁻⁶');
  await page.fill(R + '.sf-a', '7.05'); await page.fill(R + '.sf-n', '4'); await page.waitForTimeout(100);
  check((await txt('.sf-bf')).endsWith('= 70,500'), 'stdform: back again 7.05 × 10⁴');
  await page.fill(R + '.sf-a', '12'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.sf-berr'), 'stdform: a must be under 10');
  check((await txt('.sf-cf')).includes('≈ 3.89 × 10²') && (await txt('.sf-cf')).includes('about 389 times'), 'stdform: compare Sun and Moon distances');
  await page.selectOption(R + '.sf-c1', '15'); await page.selectOption(R + '.sf-c2', '0'); await page.waitForTimeout(100);
  check((await txt('.sf-cf')).includes('5.2 × 10⁴¹'), 'stdform: universe vs proton');
  check((await page.$$(R + '.sm-q')).length === 5, 'stdform: five questions');
  const res = [/a = ([\d.]+) and n = (-?\d+)/, /a = ([\d.]+) and n = (-?\d+)/, /answer is (\d+)\./, /a = ([\d.]+) and n = (-?\d+)/, /answer is (\d+)\./];
  for (let i = 1; i <= 5; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = res[i - 1].exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m.slice(1).join(', ') : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `stdform: quiz question ${i} (${w})`);
  }
};
