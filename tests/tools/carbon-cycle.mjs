// #1271 Carbon cycle sandbox
export const path = '/learn/carbon-cycle/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/carbon-cycle/`); await page.waitForSelector('.cc .cc-fig rect');
  const R = '.cc ', txt = (s) => page.textContent(R + s);
  check((await txt('.cc-big')) === '2025: CO₂ 428 ppm', 'carbon: starts at 428 ppm in 2025');
  check((await txt('.cc-fig')).includes('Fossil fuels') && (await txt('.cc-fig')).includes('a huge amount'), 'carbon: five stores in words (Class 9)');
  await page.click(R + '.cc-lvl button[data-l="2"]');
  check(/Air \(CO₂\)\d+ GtC/.test((await txt('.cc-fig')).replace(/\s/g, '')) || (await txt('.cc-fig')).includes('GtC'), 'carbon: Class 11 shows GtC');
  await page.click(R + '.cc-one');
  const w = await txt('.cc-where');
  check((await txt('.cc-big')).startsWith('2026: CO₂ 43') && w.includes('10 GtC burned') && /(4[0-9]|5[0-9])% of what people released stayed in the air/.test(w), `carbon: one year, about half stays (${w})`);
  await page.click(R + '.cc-ten'); check((await txt('.cc-big')).startsWith('2036'), 'carbon: ten more years');
  await page.click(R + '.cc-all'); await page.waitForFunction(() => document.querySelector('.cc .cc-big').textContent.startsWith('2100'), null, { timeout: 8000 });
  const bau = Number(/CO₂ (\d+)/.exec(await txt('.cc-big'))[1]);
  check(bau > 580 && bau < 660, `carbon: as today to 2100 gives ${bau} ppm`);
  check((await page.$$eval(R + '.cc-gr polyline', (p) => p[0].getAttribute('points').split(' ').length)) === 76, 'carbon: graph has 76 years');
  await page.click(R + '.cc-reset');
  for (const s of ['.cc-burn', '.cc-clear']) await page.fill(R + s, '0');
  await page.click(R + '.cc-all'); await page.waitForFunction(() => document.querySelector('.cc .cc-big').textContent.startsWith('2100'), null, { timeout: 8000 });
  const stop = Number(/CO₂ (\d+)/.exec(await txt('.cc-big'))[1]);
  check(stop > 370 && stop < 400 && (await txt('.cc-where')).includes('−'), `carbon: stopping to 2100 gives ${stop} ppm, the air loses carbon`);
  await page.click(R + '.cc-lvl button[data-l="1"]');
  check((await txt('.cc-where')).includes('the air lost carbon'), 'carbon: Class 9 words');
  check((await page.$$(R + '.sm-q')).length === 4, 'carbon: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const wk = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = /(=|≈) (−?[\d.]+)/.exec(wk.split('=').length > 2 ? wk.slice(wk.lastIndexOf('=') - 1) : wk);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[2].replace('−', '-') : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `carbon: quiz ${i} (${wk})`);
  }
};
