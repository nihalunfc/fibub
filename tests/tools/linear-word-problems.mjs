// #1319 Linear equation word problems
export const path = '/learn/linear-word-problems/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/linear-word-problems/`); await page.waitForSelector('.lw .lw-l2');
  const R = '.lw ', txt = (s) => page.textContent(R + s);
  check((await txt('.lw-text')).includes('add up to') && (await page.$$(R + '.lw-steps > li')).length === 0, 'word: ages story, no steps yet');
  await page.click(R + '.lw-next');
  check((await page.$$(R + '.lw-steps > li')).length === 1 && (await txt('.lw-steps')).includes("Let x = ") && (await page.$$(R + '.lw-dot')).length === 0, 'word: step 1 names the unknowns');
  // Boat: read the story's numbers and check the page's answer.
  await page.click(R + '.lw-pick button[data-s="boat"]'); await page.waitForTimeout(80);
  { const t = await txt('.lw-text'), m = /goes (\d+) km downstream in (\d+) hours? and (\d+) km upstream in (\d+) hours?/.exec(t);
    const down = m[1] / m[2], up = m[3] / m[4], x = (down + up) / 2, y = (down - up) / 2;
    await page.click(R + '.lw-all'); await page.waitForTimeout(80);
    const s = await txt('.lw-steps');
    check(s.includes(`x + y = ${m[1]} ÷ ${m[2]} = ${down}`) && s.includes(`x = ${x}, so the speed of the boat in still water is ${x} km/h`) && s.includes(`y = ${y}, so the speed of the stream is ${y} km/h`), `word: boat ${m[0]} → ${x}, ${y}`);
    check((await page.$$(R + '.lw-steps > li')).length === 4 && (await txt('.lw-steps')).includes('Solve by elimination') && (await page.$$(R + '.lw-dot')).length === 1 && (await txt('.lw-fig')).includes(`(${x}, ${y})`), 'word: four steps, crossing marked');
    await page.click(R + '.lw-m button[data-m="sub"]'); await page.waitForTimeout(80);
    check((await txt('.lw-steps')).includes('Solve by substitution') && (await txt('.lw-steps')).includes('From (1): y ='), 'word: substitution steps');
    check(await page.isDisabled(R + '.lw-next'), 'word: next disabled at the end'); }
  await page.click(R + '.lw-hide');
  check((await page.$$(R + '.lw-steps > li')).length === 0 && (await page.$$(R + '.lw-dot')).length === 0, 'word: hide steps');
  // Tickets and notes stories solve consistently.
  for (const k of ['tickets', 'notes', 'rectangle', 'ages']) {
    await page.click(`${R}.lw-pick button[data-s="${k}"]`); await page.click(R + '.lw-new'); await page.click(R + '.lw-all'); await page.waitForTimeout(80);
    const s = await txt('.lw-steps');
    check(s.includes('Check:') && s.includes('✓') && !s.includes('NaN') && !s.includes('undefined'), `word: ${k} story steps complete`);
  }
  { const t = await txt('.lw-text'), m = /add up to (\d+) years\. In (\d+) years, \S+ will be (\d) times/.exec(t), S = +m[1], n = +m[2], k = +m[3];
    const y = (S - (k - 1) * n) / (k + 1), x = S - y;
    check((await txt('.lw-steps')).includes(`x = ${x}, so`) && (await txt('.lw-steps')).includes(`y = ${y}, so`), `word: ages ${m[0]} → ${x}, ${y}`); }
  check((await page.$$(R + '.sm-q')).length === 4, 'word: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = /x = (\d+), y = (\d+)/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? `${m[1]}, ${m[2]}` : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `word: quiz ${i}`);
  }
  // Swapped order is marked wrong.
  await page.click(`${R}.sm-q:nth-child(1) .sm-qshow`);
  { const w = await txt('.sm-q:nth-child(1) .sm-qwork'), m = /x = (\d+), y = (\d+)/.exec(w);
    if (m[1] !== m[2]) { await page.fill(`${R}.sm-q:nth-child(1) .sm-qin`, `${m[2]}, ${m[1]}`); await page.click(`${R}.sm-q:nth-child(1) .sm-qcheck`); check((await txt('.sm-q:nth-child(1) .sm-qres')) !== 'Right!', 'word: order matters'); } }
};
