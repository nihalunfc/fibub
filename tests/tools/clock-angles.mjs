// #1285 Clock hand angles
export const path = '/learn/clock-angles/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/clock-angles/`); await page.waitForSelector('.ck .ck-knob');
  const R = '.ck ', txt = (s) => page.textContent(R + s);
  check((await txt('.ck-big')) === '3:30: the hands are 75° apart', 'clock: 3:30 is 75°');
  check((await txt('.ck-out')).includes('= 105° from 12') && (await txt('.ck-out')).includes('|30 × 3 − 5.5 × 30| = 75°'), 'clock: working shows 105° and the shortcut');
  check((await txt('.ck-when')).includes('22 times') && (await txt('.ck-when')).includes('12:16 and 22 s') && (await txt('.ck-when')).includes('44 times'), 'clock: right angles 22 times');
  await page.click(R + '.ck-pre[data-t="9,45"]'); await page.waitForTimeout(100);
  check((await txt('.ck-big')) === '9:45: the hands are 22.5° apart' && (await txt('.ck-sub')).includes('337.5°'), 'clock: 9:45 is 22.5°, reflex 337.5°');
  await page.click(R + '.ck-pre[data-t="6,0"]'); await page.waitForTimeout(100);
  check((await txt('.ck-sub')).includes('straight line'), 'clock: 6:00 straight');
  await page.fill(R + '.ck-want', '0'); await page.waitForTimeout(100);
  check((await txt('.ck-when')).includes('11 times') && (await txt('.ck-when')).includes('next one after 6:00 is 6:32 and 44 s'), 'clock: overlaps 11 times; next after 6:00');
  await page.click(R + '.ck-next'); await page.waitForTimeout(100);
  check((await txt('.ck-big')).includes('0° apart'), 'clock: jumps to the overlap');
  await page.click(R + '.ck-pre[data-t="2,20"]'); await page.click(R + '.ck-step[data-d="60"]'); await page.click(R + '.ck-step[data-d="-5"]'); await page.waitForTimeout(100);
  check((await txt('.ck-big')).startsWith('3:15:') && (await txt('.ck-big')).includes('7.5°'), 'clock: steps to 3:15, 7.5°');
  await page.fill(R + '.ck-h', '15'); await page.fill(R + '.ck-m', '0'); await page.waitForTimeout(100);
  check((await txt('.ck-big')).startsWith('3:00') && (await txt('.ck-big')).includes('90°'), 'clock: 15:00 is 3:00');
  await page.fill(R + '.ck-m', '75'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.ck-err'), 'clock: 75 minutes rejected');
  await page.fill(R + '.ck-m', '0'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.ck-err'), 'clock: message clears');
  await page.fill(R + '.ck-want', '200'); await page.waitForTimeout(100);
  check((await txt('.ck-when')).startsWith('Type an angle'), 'clock: 200° rejected');
  // Drag the minute hand from 12 to 3 (a quarter turn): 3:00 → 3:15.
  const vp = page.viewportSize(); await page.setViewportSize({ width: 1280, height: 1600 });
  const face = page.locator(R + '.ck-face'); await face.scrollIntoViewIfNeeded();
  const b = await face.boundingBox(), k = b.width / 300;
  await page.mouse.move(b.x + 150 * k, b.y + 30 * k); await page.mouse.down();
  await page.mouse.move(b.x + 230 * k, b.y + 60 * k, { steps: 5 }); await page.mouse.move(b.x + 270 * k, b.y + 150 * k, { steps: 5 }); await page.mouse.up();
  await page.setViewportSize(vp);
  check((await txt('.ck-big')).startsWith('3:15:'), `clock: dragging the minute hand (${await txt('.ck-big')})`);
  check((await page.$$(R + '.sm-q')).length === 4, 'clock: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, w.match(/\d+(?:\.\d+)?/g).at(-1)); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `clock: quiz ${i} (${w})`);
  }
  // Solve your own numbers (shared card, src/lib/learn/solvecard-b.ts)
  await page.goto(`${BASE}/learn/clock-angles/`); await page.waitForTimeout(600);
  {
  const S = '.ck-solve ', ans = () => page.textContent(S + '.sv-answer'), work = () => page.textContent(S + '.sv-work');
  const pre = async (n) => { await page.selectOption(S + '[data-k="sv-example"]', ''); await page.selectOption(S + '[data-k="sv-example"]', String(n)); await page.waitForTimeout(60); };
  const fill = async (k, v) => { await page.fill(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  const sel = async (k, v) => { await page.selectOption(S + `[data-k="sv-${k}"]`, v); await page.waitForTimeout(40); };
  const is = async (want, label) => check((await ans()) === want, `clock solve: ${label} (${await ans()})`);
  const has = async (want, label) => check((await ans()).includes(want), `clock solve: ${label} (${await ans()})`);
  const wk = async (want, label) => check((await work()).includes(want), `clock solve working: ${label}`);
  await pre(0); await is('At 3:40 the angle between the hands is 130° (230° the other way round).', '3:40'); await wk('30 × 3 + 0.5 × 40 = 110°', 'hour hand'); await wk('= 130°', 'difference');
  await pre(1); await is('At 9:15 the angle between the hands is 172.5° (187.5° the other way round).', '9:15'); await wk('360° − 187.5° = 172.5°', 'over 180');
  await pre(2); await is('Between 4 and 5 the hands are 0° apart (together) at 21 9/11 minutes past 4.', 'hands meet after 4'); await wk('4:21:49', 'time in seconds');
  await pre(3); await is("Between 3 and 4 the hands are 90° apart (a right angle) at 3 o'clock exactly and 32 8/11 minutes past 3.", 'right angle after 3');
  await pre(4); await is('Between 2 and 3 the hands are 180° apart (opposite) at 43 7/11 minutes past 2.', 'opposite after 2');
  await pre(3); await fill('h', '7'); await sel('t-unit', 'radians'); await fill('t', '1.5708'); await is('Between 7 and 8 the hands are 90° apart (a right angle) at 21 9/11 minutes past 7 and 54 6/11 minutes past 7.', 'angle in radians');
  await pre(3); await fill('t', '200'); await has('from 0° to 180°', 'angle over 180');
  await fill('t', '90'); await fill('h', '0'); await has('1 to 12', 'hour 0');
  await fill('h', '12'); await fill('t', '0'); await is("Between 12 and 1 the hands are 0° apart (together) at 12 o'clock exactly.", "twelve o'clock");
  await pre(0); await fill('m', '60'); await has('but not including', 'minutes 60');
  await fill('h', '13'); await fill('m', '30'); await is('At 1:30 the angle between the hands is 135° (225° the other way round).', '24-hour style hour');
  await fill('h', '6'); await fill('m', '0'); await is('At 6:00 the angle between the hands is 180° (180° the other way round).', '6:00');
  await fill('h', '2.5'); await has('whole number', 'decimal hour');
  }
};
