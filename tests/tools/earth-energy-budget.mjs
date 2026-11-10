// #1278 Earth's energy budget
export const path = '/learn/earth-energy-budget/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/earth-energy-budget/`); await page.waitForSelector('.eb .eb-fig line');
  const R = '.eb ', txt = (s) => page.textContent(R + s);
  check((await txt('.eb-big')) === 'Surface 14.9 °C', 'energy: today 14.9 °C');
  check((await txt('.eb-steps')).includes('about −18.6 °C; with it, 14.9 °C: 33.5 degrees warmer'), 'energy: Class 9 steps');
  check((await page.$$(R + '.eb-fig line')).length === 6, 'energy: six arrows');
  await page.click(R + '.eb-lvl button[data-l="11"]');
  const s = await txt('.eb-steps');
  check(s.includes('1361/4 = 340.25 W/m²') && s.includes('= 102.08 W/m²') && s.includes('= 254.6 K = −18.6 °C') && s.includes('= 288.1 K = 14.9 °C') && s.includes('85.9 (straight out) + 152.3') && s.includes('= 238.2 W/m² out'), `energy: Class 11 steps (${s})`);
  check((await txt('.eb-fig')).includes('sunlight in 340 W/m²'), 'energy: W/m² labels');
  await page.click(R + '.eb-pre button:text-is("No greenhouse")');
  check((await txt('.eb-big')) === 'Surface −18.6 °C' && (await page.$$(R + '.eb-fig line')).length === 3, 'energy: no greenhouse −18.6 °C, no air arrows');
  await page.click(R + '.eb-pre button:text-is("More CO₂")'); check((await txt('.eb-big')) === 'Surface 18.6 °C', 'energy: more CO₂ warmer');
  await page.click(R + '.eb-pre button:text-is("Snowball Earth")'); check((await txt('.eb-big')) === 'Surface −22.7 °C', 'energy: snowball −22.7 °C');
  await page.fill(R + '.eb-a', '0.3336'); await page.fill(R + '.eb-e', '0.84'); check((await txt('.eb-big')) === 'Surface 15 °C', 'energy: albedo 0.3336 with ε 0.84 gives 15 °C');
  check((await page.$$(R + '.sm-q')).length === 4, 'energy: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const wk = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = /= (−?[\d.]+) (W\/m²|degrees)\.$/.exec(wk);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `energy: quiz ${i} (${wk})`);
  }
};
