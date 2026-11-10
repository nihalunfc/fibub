// #1293 Flowchart runner
export const path = '/learn/flowchart-runner/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/flowchart-runner/`); await page.waitForSelector('.fc .fc-fig .fc-box');
  const R = '.fc ';
  const txt = (s) => page.textContent(R + s);
  const click = async (s) => { await page.click(R + s); await page.waitForTimeout(60); };
  check((await page.$$(R + '.fc-box')).length === 6 && (await page.$$(R + '.fc-on')).length === 1 && (await txt('.fc-note')).includes('Box 1 of 5'), 'flow: even or odd chart at Start');
  await click('.fc-end');
  check((await txt('.fc-out')) === 'Output: odd' && await page.isDisabled(R + '.fc-step'), 'flow: 7 is odd');
  await page.fill(R + '.fc-in-n', '10'); await page.waitForTimeout(100); await click('.fc-end');
  check((await txt('.fc-out')) === 'Output: even', 'flow: 10 is even');
  await page.selectOption(R + '.fc-pick', 'sum'); await page.waitForTimeout(100);
  check((await txt('.fc-note')).includes('of 21') && (await page.$$(R + '.fc-in')).length === 1, 'flow: add 1 to 5 is 21 boxes');
  for (let i = 0; i < 3; i++) await click('.fc-step');
  check((await txt('.fc-note')).includes('i ≤ n: yes') && (await txt('.fc-vars')).includes('s0') && (await page.$$(R + '.fc-taken')).length === 1, 'flow: diamond says yes, arrow marked');
  await click('.fc-back');
  check((await txt('.fc-note')).includes('Now s = 0, i = 1'), 'flow: back');
  await click('.fc-end');
  check((await txt('.fc-out')) === 'Output: 15' && (await page.$$(R + '.fc-table tr')).length === 22, 'flow: says 15 with a 21-row trace');
  await page.fill(R + '.fc-in-n', '300'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.fc-err'), 'flow: n too big message');
  await page.fill(R + '.fc-in-n', '3'); await page.waitForTimeout(100);
  await click('.fc-play'); await page.waitForTimeout(9000);
  check((await txt('.fc-out')) === 'Output: 6' && (await txt('.fc-play')) === 'Play', 'flow: play runs n = 3 to 6');
  await page.selectOption(R + '.fc-pick', 'hcf'); await page.waitForTimeout(100); await click('.fc-end');
  check((await txt('.fc-out')) === 'Output: 12', 'flow: HCF of 168 and 60 is 12');
  await page.selectOption(R + '.fc-pick', 'leap'); await page.waitForTimeout(100); await click('.fc-end');
  check((await txt('.fc-out')) === 'Output: not a leap year', 'flow: 1900 is not leap');
  await page.fill(R + '.fc-in-y', '2000'); await page.waitForTimeout(100); await click('.fc-end');
  check((await txt('.fc-out')) === 'Output: leap year', 'flow: 2000 is leap');
  await page.selectOption(R + '.fc-pick', 'largest'); await page.waitForTimeout(100); await click('.fc-end');
  check((await txt('.fc-out')) === 'Output: 31' && (await page.$$(R + '.fc-in')).length === 3, 'flow: largest of 12, 31, 25');
  await page.selectOption(R + '.fc-pick', 'collatz'); await page.fill(R + '.fc-in-n', '27'); await page.waitForTimeout(150); await click('.fc-end');
  check((await txt('.fc-out')) === 'Output: 111', 'flow: 27 takes 111 steps');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    const m = /(?:= |: |is |a = )(\d+)(?: steps)?\.$/.exec(w.trim()) || /says a = (\d+)/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `flow: quiz ${i} (${w})`);
  }
};
