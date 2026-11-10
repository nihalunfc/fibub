// #1230 Plane mirror lab
export const path = '/learn/plane-mirror-lab/';
export default async ({ page, check, BASE }) => {
  const R = '.pm ';
  const t = (s) => page.textContent(R + s);
  await page.goto(BASE + path); await page.waitForSelector(R + '.pm-lfig .sm-handle');
  check((await t('.pm-lbig')) === 'i = 35°, r = 35°' && (await t('.pm-l1')).includes('90° − 35° = 55°') && (await t('.pm-l2')).includes('12.3 cm'), 'mirror: opening 35°');
  // Drag the laser to the right of the normal, nearer the mirror.
  await page.locator(R + '.pm-lfig').scrollIntoViewIfNeeded();
  const box = await page.locator(R + '.pm-lfig').boundingBox(), s = box.width / 340;
  const lx = 170 - 150 * Math.sin(35 * Math.PI / 180), ly = 210 - 150 * Math.cos(35 * Math.PI / 180);
  await page.mouse.move(box.x + lx * s, box.y + ly * s); await page.mouse.down();
  await page.mouse.move(box.x + 200 * s, box.y + 120 * s, { steps: 4 }); await page.mouse.move(box.x + 270 * s, box.y + 110 * s, { steps: 4 }); await page.mouse.up(); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.pm-i')) === '45' && (await t('.pm-lbig')) === 'i = 45°, r = 45°', `mirror: drag to 45° on the right (${await page.inputValue(R + '.pm-i')})`);
  await page.fill(R + '.pm-i', '0'); await page.waitForTimeout(100);
  check((await t('.pm-lbig')) === 'i = 0°, r = 0°', 'mirror: straight down');
  await page.click(R + '.pm-mode [data-v="two"]'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.pm-tfig') && await page.isHidden(R + '.pm-lfig'), 'mirror: two-mirror view');
  check((await t('.pm-tbig')) === '5 images at 60°' && (await page.$$(R + '.pm-im')).length === 5 && (await t('.pm-t1')).includes('even, so images = 6 − 1 = 5'), 'mirror: 60° gives 5');
  await page.click(R + '.pm-pre[data-t="90"]'); await page.waitForTimeout(100);
  check((await t('.pm-tbig')) === '3 images at 90°', 'mirror: 90° gives 3');
  await page.click(R + '.pm-pre[data-t="72"]'); await page.waitForTimeout(100);
  check((await t('.pm-tbig')) === '5 images at 72°' && (await t('.pm-t1')).includes('off the middle line'), 'mirror: 72° off the bisector gives 5');
  await page.fill(R + '.pm-p', '50'); await page.waitForTimeout(100);
  check((await t('.pm-tbig')) === '4 images at 72°' && (await t('.pm-t1')).includes('on the middle line'), 'mirror: 72° on the bisector gives 4');
  await page.fill(R + '.pm-t', '100'); await page.waitForTimeout(100);
  check((await t('.pm-t1')).includes('not a whole number'), 'mirror: 100° rule does not apply');
  await page.click(R + '.pm-mode [data-v="peri"]'); await page.waitForTimeout(100);
  check((await t('.pm-pbig')) === 'Light gets through' && (await t('.pm-p1')).includes('straight'), 'mirror: periscope at 45°');
  await page.$eval(R + '.pm-gr', (e) => { e.value = '40'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await t('.pm-pbig')) === 'Light hits the tube wall' && (await t('.pm-p1')).includes('10° off straight'), 'mirror: periscope at 40° fails');
  check((await page.$$(R + '.sm-q')).length === 5, 'mirror: five questions');
  const res = [/incidence: (\d+)°/, /= (\d+)°\.$/, /= (\d+)\.$/, /= ([\d.]+) m from it/, /= ([\d.]+)°\.$/];
  for (let i = 1; i <= 5; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await t(`.sm-q:nth-child(${i}) .sm-qwork`); const m = res[i - 1].exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await t(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `mirror: quiz ${i} (${w})`);
  }
};
