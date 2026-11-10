// #1283 Clock and turn angles
export const path = '/learn/clock-angles/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/clock-angles/`); await page.waitForSelector('.ck .ck-fig .ck-mh', { state: 'attached' });
  const R = '.ck ', txt = (s) => page.textContent(R + s);
  check((await txt('.ck-big')) === '3:30: 75° (acute)' && (await txt('.ck-steps')).includes('30 × 3 + 0.5 × 30 = 105°') && (await txt('.ck-steps')).includes('= 285°'), 'clock: 3:30 is 75°');
  await page.fill(R + '.ck-h', '10'); await page.fill(R + '.ck-m', '10'); check((await txt('.ck-big')) === '10:10: 115° (obtuse)' && (await txt('.ck-steps')).includes('more than 180°'), 'clock: 10:10 is 115°');
  await page.fill(R + '.ck-h', '3'); await page.fill(R + '.ck-m', '0'); check((await txt('.ck-big')) === '3:00: 90° (right angle)', 'clock: 3:00 right angle');
  await page.fill(R + '.ck-h', '6'); check((await txt('.ck-big')) === '6:00: 180° (straight angle)', 'clock: 6:00 straight');
  await page.fill(R + '.ck-h', '12'); check((await txt('.ck-big')) === '12:00: 0° (zero angle)', 'clock: 12:00 zero');
  check((await txt('.ck-times')).startsWith('22 times in 12 hours: 12:16:22, 12:49:05,'), 'clock: right-angle times');
  await page.fill(R + '.ck-a', '0'); check((await txt('.ck-times')).startsWith('11 times in 12 hours: 12:00, 1:05:27,'), 'clock: 11 overlaps');
  await page.fill(R + '.ck-a', '200'); check((await txt('.ck-times')) === 'Type an angle from 0° to 180°.', 'clock: bad angle');
  // Drag the minute hand from 12 to 3 (a quarter turn): 12:00 becomes 12:15.
  await page.setViewportSize({ width: 1280, height: 1400 });
  const fig = page.locator(R + '.ck-fig'); await fig.scrollIntoViewIfNeeded();
  { const f = await fig.boundingBox(), sc = f.width / 340, cx = f.x + 170 * sc, cy = f.y + 130 * sc, r = 86 * sc;
    await page.mouse.move(cx, cy - r); await page.mouse.down(); await page.mouse.move(cx + r * 0.7, cy - r * 0.7, { steps: 4 }); await page.mouse.move(cx + r, cy, { steps: 4 }); await page.mouse.up(); await page.waitForTimeout(80);
    check((await page.inputValue(R + '.ck-m')) === '15' && (await page.inputValue(R + '.ck-h')) === '12' && (await txt('.ck-big')) === '12:15: 82.5° (acute)', `clock: drag to 12:15 (${await txt('.ck-big')})`);
    // Keep going past 12: the hour moves on to 1.
    await page.mouse.move(cx + r, cy); await page.mouse.down(); await page.mouse.move(cx, cy + r, { steps: 4 }); await page.mouse.move(cx - r, cy, { steps: 4 }); await page.mouse.move(cx - r * 0.5, cy - r * 0.86, { steps: 4 }); await page.mouse.move(cx + r * 0.5, cy - r * 0.86, { steps: 4 }); await page.mouse.up(); await page.waitForTimeout(80);
    check((await page.inputValue(R + '.ck-h')) === '1' && (await page.inputValue(R + '.ck-m')) === '5', `clock: dragging past 12 moves the hour on (${await txt('.ck-big')})`); }
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.click(R + '.ck-mode button[data-m="turn"]');
  check(await page.isVisible(R + '.ck-rose') && await page.isHidden(R + '.ck-fig'), 'clock: turns mode');
  check((await txt('.ck-tbig')) === 'Now facing east' && (await txt('.ck-tsteps')).includes('a quarter turn clockwise'), 'clock: quarter turn from north');
  await page.fill(R + '.ck-t', '630'); check((await txt('.ck-tbig')) === 'Now facing west' && (await txt('.ck-tsteps')).includes('1 ¾ turns clockwise') && (await txt('.ck-tsteps')).includes('only 270° clockwise (or 90° anticlockwise)'), 'clock: 630° is west');
  await page.click(R + '.ck-q[data-d="-90"]'); check((await txt('.ck-tbig')) === 'Now facing west' && (await txt('.ck-tsteps')).includes('anticlockwise: a quarter turn anticlockwise'), 'clock: quarter anticlockwise');
  await page.selectOption(R + '.ck-start', '90'); await page.fill(R + '.ck-t', '135'); check((await txt('.ck-tbig')) === 'Now facing south-west', 'clock: from east, 135° to south-west');
  await page.fill(R + '.ck-t', '30'); check((await txt('.ck-tbig')) === 'Now facing 120° from north', 'clock: in-between bearing');
  await page.click(R + '.ck-q[data-d="360"]'); check((await txt('.ck-tbig')) === 'Now facing east' && (await txt('.ck-tsteps')).includes('1 turn clockwise'), 'clock: full turn');
  check((await page.$$(R + '.sm-q')).length === 4, 'clock: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`), m = /(?:is|=|get) ([\d.]*\d)°?(?::|\.$)/.exec(w.split(';').pop());
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `clock: quiz ${i} (${w})`);
  }
};
