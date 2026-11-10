// #1252 Pick's theorem on a dot grid
export const path = '/learn/picks-theorem/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/picks-theorem/`); await page.waitForSelector('.pk .pk-poly');
  const R = '.pk ', txt = (s) => page.textContent(R + s);
  const facts = async () => [await txt('.pk-i'), await txt('.pk-b'), await txt('.pk-p'), await txt('.pk-a')].join(' ');
  check((await facts()) === '8 16 15 15' && (await page.$$(R + '.pk-fig .pk-in')).length === 8 && (await page.$$(R + '.pk-fig .pk-on')).length === 16 && (await txt('.pk-f')).includes('they agree'), 'pick: rectangle 8, 16, 15');
  await page.click(R + '.pk-pre [data-p=tri]');
  check((await facts()) === '16 3 16.5 16.5', `pick: triangle (${await facts()})`);
  await page.click(R + '.pk-pre [data-p=arrow]');
  check((await facts()) === '13 16 20 20', `pick: arrow (${await facts()})`);
  await page.click(R + '.pk-clear');
  check((await facts()) === '– – – –' && (await txt('.pk-err')).includes('three dots'), 'pick: cleared');
  await page.setViewportSize({ width: 1280, height: 1400 }); await page.locator(R + '.pk-fig').scrollIntoViewIfNeeded();
  const box = await page.locator(R + '.pk-fig').boundingBox(), sc = box.width / 340;
  const dot = async (x, y) => { await page.mouse.click(box.x + (20 + x * 30) * sc, box.y + (260 - y * 30) * sc); await page.waitForTimeout(60); };
  await dot(0, 0); await dot(4, 0); await dot(0, 4);
  check((await facts()) === '3 12 8 8', `pick: tapped right triangle 4, 4 (${await facts()})`);
  await dot(4, 4);
  check((await txt('.pk-err')).includes('cross') && await page.$(R + '.pk-poly.bad') !== null, 'pick: crossing edges refused');
  await page.click(R + '.pk-undo');
  // Drag the corner (0, 4) to (0, 6).
  await page.mouse.move(box.x + 20 * sc, box.y + (260 - 4 * 30) * sc); await page.mouse.down();
  await page.mouse.move(box.x + 20 * sc, box.y + (260 - 6 * 30) * sc, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(80);
  check((await txt('.pk-a')) === '12', `pick: dragged corner, area 12 (${await facts()})`);
  await page.setViewportSize({ width: 1280, height: 720 });
  for (let i = 1; i <= 4; i++) {
    const w = await page.textContent(`${R}.sm-q:nth-child(${i}) .sm-qwork`);
    const m = i === 2 ? /B = 2 × \(\d+ \+ \d+\) = (\d+)/.exec(w) : i === 4 ? /^½ × \d+ × \d+ = (\d+(?:\.\d+)?)/.exec(w) : /= (-?[\d.]+)\.$/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await page.textContent(`${R}.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `pick: quiz ${i} (${w})`);
  }
};
