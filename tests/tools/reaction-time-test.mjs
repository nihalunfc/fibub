// #1303 Reflex arc and reaction time
export const path = '/learn/reaction-time-test/';
export default async ({ page, check, BASE }) => {
  const R = '.rtt ';
  await page.goto(`${BASE}/learn/reaction-time-test/`); await page.waitForSelector(R + '.rtt-bars text');
  const tap = async (sel) => { await page.locator(R + sel).first().scrollIntoViewIfNeeded(); await page.locator(R + sel).first().click(); await page.waitForTimeout(150); };
  const txt = (s) => page.textContent(R + s);
  check((await txt('.rtt-f1')) === 'Travel time = L ÷ v = 1 m ÷ 60 m/s = 0.0167 s = 16.7 ms', `reaction: travel formula (${await txt('.rtt-f1')})`);
  check((await txt('.rtt-f3')).endsWith('= 0.175 s = 175 ms'), `reaction: ruler 15 cm (${await txt('.rtt-f3')})`);
  check((await txt('.rtt-f2')).includes('= 26.7 ms'), 'reaction: reflex Class 10');
  // early tap
  await tap('.rtt-pad');
  check((await page.getAttribute(R + '.rtt-pad', 'data-state')) === 'wait', 'reaction: waiting state');
  await tap('.rtt-pad');
  check((await page.getAttribute(R + '.rtt-pad', 'data-state')) === 'early' && (await txt('.rtt-pad')).startsWith('Too soon'), 'reaction: early tap caught');
  // real tries
  for (let i = 0; i < 2; i++) {
    await tap('.rtt-pad');
    await page.waitForSelector(R + '.rtt-pad[data-state="go"]', { timeout: 6000 });
    await page.locator(R + '.rtt-pad').click(); await page.waitForTimeout(100);
  }
  const tries = await page.$$eval(R + '.rtt-tries li', (l) => l.map((x) => parseFloat(x.textContent)));
  check(tries.length === 2 && tries.every((t) => t > 0 && t < 2000), `reaction: two times recorded (${tries})`);
  check((await txt('.rtt-stats')).includes('Tries2') && (await txt('.rtt-say')).includes('times the travel time') && (await txt('.rtt-f4')).includes('a ruler would fall'), 'reaction: stats and comparison');
  await page.keyboard.press('Tab');
  await tap('.rtt-clear');
  check((await page.$$(R + '.rtt-tries li')).length === 0 && (await txt('.rtt-f4')) === '', 'reaction: clear');
  // sliders
  await page.fill(R + '.rtt-v', '1'); await page.waitForTimeout(100);
  check((await txt('.rtt-f1')).endsWith('= 1000 ms') && (await txt('.rtt-f2')).includes('= 1600 ms'), 'reaction: slow nerve 1 m/s');
  await page.fill(R + '.rtt-v', '60');
  await page.fill(R + '.rtt-d', '20'); await page.waitForTimeout(100);
  check((await txt('.rtt-f3')).endsWith('= 0.202 s = 202 ms'), 'reaction: ruler 20 cm');
  await tap('.rtt-level button[data-v="11"]');
  check((await txt('.rtt-f2')).includes('2 synapses') && (await txt('.rtt-f2')).endsWith('= 27.7 ms') && (await txt('.rtt-arc')).includes('2 synapses'), 'reaction: Class 11 synapses');
  await tap('.rtt-fire'); await page.waitForTimeout(700);
  check((await page.$$(R + '.rtt-pulse')).length === 1 && (await page.$$(R + '.rtt-steps li.on')).length === 1, 'reaction: pulse runs round the arc');
  await page.waitForTimeout(2200);
  check((await txt('.rtt-steps li.on')).startsWith('Effector'), 'reaction: pulse reaches the muscle');
  check((await page.$$(R + '.sm-q')).length === 4, 'reaction: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    const m = [/= (\S+) s\.$/, /= (\S+) cm\.$/, /= (\S+) ms\.$/, /^(\d):/][i - 1].exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `reaction: quiz ${i} (${w})`);
  }
};
