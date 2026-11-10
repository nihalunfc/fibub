// #1228 Water cycle simulator
export const path = '/learn/water-cycle-sim/';
export default async ({ page, check, BASE }) => {
  const R = '.wc ';
  const t = (s) => page.textContent(R + s);
  await page.goto(BASE + path); await page.waitForSelector(R + '.wc-bars rect');
  check((await t('.wc-clock')) === 'Day 1, hour 0: dry' && (await page.$$(R + '.wc-tree')).length === 5, 'water cycle: opens on day 1 with a forest');
  await page.click(R + '.wc-day'); await page.waitForTimeout(100);
  check((await t('.wc-clock')).startsWith('Day 2, hour 0') && (await t('.wc-f2')).includes('only 17.2 mm') && (await t('.wc-f1')).startsWith('Rain 0.4 mm'), 'water cycle: one day, first rain');
  await page.click(R + '.wc-day'); await page.click(R + '.wc-day'); await page.waitForTimeout(100);
  check((await t('.wc-f1')).startsWith('Rain 11.9 mm = ran off 1.8 mm + soaked in 10.1 mm') && (await t('.wc-f3')).endsWith('✓.'), 'water cycle: 3 days, budget balances');
  check((await page.$$(R + '.wc-cl')).length === 1, 'water cycle: cloud drawn');
  await page.click(R + '.wc-ground [data-v="city"]'); await page.click(R + '.wc-reset'); await page.waitForTimeout(100);
  check((await t('.wc-clock')).startsWith('Day 1, hour 0') && (await page.$$(R + '.wc-bld')).length === 5, 'water cycle: reset with a city');
  for (let i = 0; i < 3; i++) await page.click(R + '.wc-day');
  await page.waitForTimeout(100);
  check((await t('.wc-f1')).startsWith('Rain 11.4 mm = ran off 9.1 mm + soaked in 2.3 mm'), 'water cycle: city sheds 80%');
  check(await page.isHidden(R + '.wc-f4'), 'water cycle: Tetens hidden at Class 6 to 8');
  await page.click(R + '.wc-level [data-v="9"]'); await page.waitForTimeout(100);
  check((await t('.wc-f4')).includes('3.17 kPa at 25.0 °C') && (await t('.wc-f5')).includes('23.0 g of water at 25.0 °C'), 'water cycle: Class 9 to 12 numbers');
  await page.$eval(R + '.wc-wr', (e) => { e.value = '0'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.click(R + '.wc-reset'); await page.click(R + '.wc-day'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.wc-w')) === '0' && (await t('.wc-f1')).startsWith('Rain 0.0 mm') && (await page.textContent(R + '.wc-fig')).includes('calm'), 'water cycle: calm day, no rain');
  await page.fill(R + '.wc-t', '40'); await page.fill(R + '.wc-s', '0'); await page.waitForTimeout(100);
  check((await t('.wc-f2')).includes('At 40.0 °C'), 'water cycle: typed temperature');
  const play = page.locator(R + '.wc-play');
  await play.click(); await page.waitForTimeout(700);
  check((await play.textContent()) === 'Pause' && !(await t('.wc-clock')).startsWith('Day 2, hour 0'), 'water cycle: play runs the clock');
  await play.click(); check((await play.textContent()) === 'Play', 'water cycle: pause');
  check((await page.$$(R + '.sm-q')).length === 5, 'water cycle: five questions');
  const res = [/= ([\d.]+) mm\.$/, /= (\d+) mm soaked/, /= (\d+) g condense/, /= (\d+) litres/, /= (\d+) m³/];
  for (let i = 1; i <= 5; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await t(`.sm-q:nth-child(${i}) .sm-qwork`); const m = res[i - 1].exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await t(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `water cycle: quiz ${i} (${w})`);
  }
};
