// #1247 Time, speed and distance race track
export const path = '/learn/race-track/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/race-track/`); await page.waitForSelector('.rt .rt-graph .rt-meet');
  const R = '.rt ', txt = (s) => page.textContent(R + s);
  check((await txt('.rt-big')) === 'They meet at 20 s, 160 m along.' && (await txt('.rt-steps')).includes('8 − 6 = 2 m/s') && (await txt('.rt-steps')).includes('28.8 km/h'), 'rt: catch up after 20 s at 160 m');
  check((await txt('.rt-steps')).includes('400 ÷ 8 = 50 s') && (await page.getAttribute(R + '.rt-t', 'max')) === '60', 'rt: finish times, slider to 60 s');
  await page.$eval(R + '.rt-t', (e) => { e.value = '20'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(80);
  check((await txt('.rt-now')) === 'At 20 s: A is at 160 m, B is at 160 m, 0 m apart.', 'rt: scrub to 20 s');
  await page.click(R + '.rt-play'); await page.waitForTimeout(1200);
  const mid = Number((await txt('.rt-clock')).replace(/[^\d.]/g, ''));
  check(mid > 20 && (await txt('.rt-play')) === 'Pause', `rt: play moves time on (${mid} s)`);
  await page.click(R + '.rt-play'); await page.waitForTimeout(80);
  check((await txt('.rt-play')) === 'Play', 'rt: pause');
  await page.fill(R + '.rt-a', '6'); await page.waitForTimeout(80);
  check((await txt('.rt-big')) === 'A never catches B.' && (await page.$$(R + '.rt-meet')).length === 0, 'rt: equal speeds never meet');
  await page.fill(R + '.rt-a', '7'); await page.fill(R + '.rt-h', '100'); await page.waitForTimeout(80);
  check((await txt('.rt-big')) === 'B finishes first.', 'rt: catch-up after the finish');
  await page.fill(R + '.rt-h', '500'); await page.waitForTimeout(80);
  check(await page.isVisible(R + '.rt-err'), 'rt: head start longer than track message');
  await page.click(R + '.rt-dir button[data-d="towards"]'); await page.fill(R + '.rt-len', '600'); await page.fill(R + '.rt-b', '5'); await page.waitForTimeout(80);
  check(await page.isHidden(R + '.rt-err') && await page.isHidden(R + '.rt-hrow') && (await txt('.rt-big')) === 'They meet at 50 s, 350 m along.' && (await txt('.rt-steps')).includes('7 + 5 = 12 m/s'), 'rt: towards each other 50 s at 350 m');
  check((await page.$$(R + '.rt-graph polyline')).length === 2, 'rt: two lines on the graph');
  check((await page.$$(R + '.sm-q')).length === 4, 'rt: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`), m = /= ([\d.]+) (?:m\/s|s)\b/.exec(w.split(' ').length ? w.slice(w.lastIndexOf('= ')) : w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `rt: quiz question ${i} (${w})`);
  }
};
