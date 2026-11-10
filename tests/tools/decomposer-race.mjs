// #1233 Decomposer race
export const path = '/learn/decomposer-race/';
export default async ({ page, check, BASE }) => {
  const R = '.dr ';
  const t = (s) => page.textContent(R + s);
  await page.goto(BASE + path); await page.waitForSelector(R + '.dr-lane-c .dr-out');
  check((await page.$$(R + '.dr-lane')).length === 3 && (await page.$$(R + '.dr-heap')).length === 3 && (await page.$$(R + '.dr-chart path')).length === 3, 'decomposer: three heaps, three curves');
  check((await t('.dr-lane-a .dr-out')).startsWith('After 30 days: 6.7 g of 100 g left') && (await t('.dr-lane-a .dr-out')).includes('after 7.7 days'), 'decomposer: heap A example');
  check((await t('.dr-lane-b .dr-out')).startsWith('After 30 days: 80.9 g') && (await t('.dr-lane-b .dr-out')).includes('98 days'), 'decomposer: heap B example');
  check((await t('.dr-lane-c .dr-out')).startsWith('Nothing breaks it down: all 100 g'), 'decomposer: plastic');
  check((await t('.dr-win')) === 'Day 30: heap A leads with 6.7 g left', 'decomposer: leader');
  check(await page.isHidden(R + '.dr-lane-a .dr-k'), 'decomposer: formula hidden at Class 7 to 8');
  await page.click(R + '.dr-level [data-v="11"]'); await page.waitForTimeout(100);
  check((await t('.dr-lane-a .dr-k')).includes('= 0.09 per day') && (await t('.dr-lane-a .dr-k')).includes('× 1.5 (worms)'), 'decomposer: Class 9 to 12 rate');
  await page.fill(R + '.dr-lane-b .dr-t', '20'); await page.fill(R + '.dr-lane-b .dr-m', '60'); await page.waitForTimeout(100);
  check((await t('.dr-lane-b .dr-out')).includes('after 23.1 days'), 'decomposer: B at 20 °C and 60%');
  await page.check(R + '.dr-lane-b .dr-w'); await page.waitForTimeout(100);
  check((await t('.dr-lane-b .dr-out')).includes('after 15.4 days'), 'decomposer: earthworms');
  await page.selectOption(R + '.dr-lane-c .dr-mat', 'peel'); await page.waitForTimeout(100);
  check((await page.$$(R + '.dr-heap')).length === 2 && (await t('.dr-win')).includes('heap C leads'), 'decomposer: peel in C rots fastest');
  await page.click(R + '.dr-zero'); await page.waitForTimeout(100);
  check((await t('.dr-win')) === 'Day 0: every heap has 100 g' && (await page.inputValue(R + '.dr-d')) === '0', 'decomposer: day 0');
  await page.click(R + '.dr-play'); await page.waitForTimeout(600); await page.click(R + '.dr-play');
  check(Number(await page.inputValue(R + '.dr-d')) > 0 && (await page.textContent(R + '.dr-play')) === 'Play', 'decomposer: play runs the days');
  check((await page.$$(R + '.sm-q')).length === 5, 'decomposer: five questions');
  const res = [/= ([\d.]+) days\.$/, /= ([\d.]+) g\.$/, /= (\d+) times/, /= ([\d.]+)%\.$/, /= ([\d.]+) days\.$/];
  for (let i = 1; i <= 5; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await t(`.sm-q:nth-child(${i}) .sm-qwork`); const m = res[i - 1].exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await t(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `decomposer: quiz ${i} (${w})`);
  }
};
