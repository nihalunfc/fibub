// #1154 Heights and distances
export const path = '/learn/heights-distances/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/heights-distances/`); await page.waitForSelector('.hd .hd-p0');
  const R = '.hd ';
  const txt = (s) => page.textContent(R + s);
  check((await txt('.hd-ans')) === 'Height ≈ 51.96 m' && (await txt('.hd-steps')).includes('30 × 1.7321'), 'heights: example 30 m at 60°');
  check((await page.inputValue(R + '.hd-h')) === '51.96' && await page.isHidden(R + '.hd-row[data-v="s"]'), 'heights: found height filled in; gap hidden');
  await page.fill(R + '.hd-e', '1.5'); await page.waitForTimeout(100);
  check((await txt('.hd-ans')) === 'Height ≈ 53.46 m' && (await txt('.hd-steps')).includes('Add the eye height'), 'heights: eye height adds 1.5 m');
  await page.fill(R + '.hd-e', '0');
  // Find distance and angle.
  await page.click(R + '.hd-find button[data-f="distance"]'); await page.fill(R + '.hd-h', '50'); await page.fill(R + '.hd-a', '30'); await page.waitForTimeout(100);
  check((await txt('.hd-ans')) === 'Distance ≈ 86.6 m', `heights: distance for 50 m at 30° (${await txt('.hd-ans')})`);
  await page.click(R + '.hd-find button[data-f="angle"]'); await page.fill(R + '.hd-h', '20'); await page.fill(R + '.hd-d', '20'); await page.waitForTimeout(100);
  check((await txt('.hd-ans')) === 'Angle ≈ 45°' && (await page.inputValue(R + '.hd-a')) === '45', 'heights: angle for 20 m, 20 m is 45°');
  await page.fill(R + '.hd-e', '25'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.hd-err'), 'heights: eye above the tower message');
  await page.fill(R + '.hd-e', '0'); await page.waitForTimeout(100);
  // Drag the person away: d grows, angle shrinks.
  await page.click(R + '.hd-find button[data-f="height"]'); await page.fill(R + '.hd-d', '30'); await page.fill(R + '.hd-a', '45'); await page.waitForTimeout(100);
  const fig = page.locator(R + '.hd-fig'); await fig.scrollIntoViewIfNeeded();
  { const p = await page.locator(R + '.hd-p0').boundingBox();
    await page.mouse.move(p.x + p.width / 2, p.y + p.height / 2 - 10); await page.mouse.down();
    await page.mouse.move(p.x + p.width / 2 + 60, p.y + p.height / 2 - 10, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(150);
    const d = Number(await page.inputValue(R + '.hd-d')); const h = Number(await page.inputValue(R + '.hd-h'));
    check(d < 30 && d > 5 && Math.abs(h - d) < 0.01, `heights: drag the person closer (d ${d}, h ${h} at 45°)`); }
  // Two observers.
  await page.click(R + '.hd-mode button[data-m="same"]'); await page.waitForTimeout(100);
  check((await txt('.hd-ans')) === 'Height ≈ 17.32 m' && (await txt('.hd-steps')).includes('= 10 m') && (await txt('.hd-steps')).includes('30 m away'), 'heights: same side 60°, 30°, 20 m');
  check((await page.$$(R + '.hd-person')).length === 2, 'heights: two people drawn');
  await page.fill(R + '.hd-b', '70'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.hd-err') && (await txt('.hd-err')).includes('bigger angle'), 'heights: same side needs θ > φ');
  await page.click(R + '.hd-mode button[data-m="opp"]'); await page.waitForTimeout(100);
  check((await txt('.hd-ans')) === 'Height ≈ 34.64 m' && (await txt('.hd-steps')).includes('= 20 m') && (await txt('.hd-steps')).includes('60 m away'), 'heights: opposite sides 60°, 30°, 80 m');
  await page.click(R + '.hd-mode button[data-m="down"]'); await page.waitForTimeout(100);
  check((await txt('.hd-ans')) === 'Distance ≈ 129.9 m' && (await page.$$(R + '.hd-obj')).length === 1 && await page.isHidden(R + '.hd-findrow'), 'heights: looking down from 75 m at 30°');
  // Quiz.
  check((await page.$$(R + '.sm-q')).length === 4, 'heights: four questions');
  await page.click(R + '.sm-q:nth-child(1) .sm-qshow');
  { const w = await txt('.sm-q:nth-child(1) .sm-qwork'); const m = /= (\S+) m\.$/.exec(w); await page.fill(R + '.sm-q:nth-child(1) .sm-qin', m[1]); await page.click(R + '.sm-q:nth-child(1) .sm-qcheck');
    check((await txt('.sm-q:nth-child(1) .sm-qres')) === 'Right!', `heights: height answer (${m[1]})`); }
  await page.click(R + '.sm-q:nth-child(3) .sm-qshow');
  { const w = await txt('.sm-q:nth-child(3) .sm-qwork'); const m = /≈ (\S+) m\.$/.exec(w); await page.fill(R + '.sm-q:nth-child(3) .sm-qin', m[1]); await page.click(R + '.sm-q:nth-child(3) .sm-qcheck');
    check((await txt('.sm-q:nth-child(3) .sm-qres')) === 'Right!', `heights: two-observer answer (${m[1]})`); }
  await page.fill(R + '.sm-q:nth-child(4) .sm-qin', '1'); await page.click(R + '.sm-q:nth-child(4) .sm-qcheck');
  check((await txt('.sm-q:nth-child(4) .sm-qres')).includes('Not quite'), 'heights: wrong answer');
};
