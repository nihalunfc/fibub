// #1288 Mid-point theorem
export const path = '/learn/midpoint-theorem/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/midpoint-theorem/`); await page.waitForSelector('.mp .mp-fig .mp-de');
  const R = '.mp ';
  const txt = (s) => page.textContent(R + s);
  const vp = page.viewportSize(); await page.setViewportSize({ width: 1280, height: 1600 });
  const drag = async (from, to) => {
    await page.locator(R + '.mp-fig').scrollIntoViewIfNeeded();
    const b = await page.locator(R + '.mp-fig').boundingBox(), k = b.width / 340;
    await page.mouse.move(b.x + from[0] * 20 * k, b.y + from[1] * 20 * k); await page.mouse.down();
    await page.mouse.move(b.x + to[0] * 20 * k, b.y + to[1] * 20 * k, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(100);
  };
  const L = await txt('.mp-lines');
  check(L.includes('DE = 6.52 cm') && L.includes('BC = 13.04 cm') && L.includes('= 0.5') && L.includes('63.8°'), 'midpoint: example DE 6.52, BC 13.04, ratio 0.5, angles 63.8');
  check((await txt('.mp-verdict')).includes('is 0°') && await page.isVisible(R + '.mp-proof'), 'midpoint: parallel verdict and proof');
  await drag([6, 2], [9, 1]);
  const L2 = await txt('.mp-lines');
  check(!L2.includes('63.8°') && L2.includes('DE = 6.52') && L2.includes('= 0.5') && (await txt('.mp-verdict')).includes('is 0°'), 'midpoint: dragging A keeps ratio 0.5');
  await page.click(R + '.mp-pre[data-p="right"]'); await page.waitForTimeout(100);
  check((await txt('.mp-lines')).includes('DE = 6 cm') && (await txt('.mp-lines')).includes('BC = 12 cm'), 'midpoint: right-angle preset 6 and 12');
  await page.click(R + '.mp-pre[data-p="thin"]'); await page.waitForTimeout(100);
  check((await txt('.mp-lines')).includes('= 0.5'), 'midpoint: thin preset');
  await page.click(R + '.mp-pre[data-p="obtuse"]'); await page.waitForTimeout(100);
  check((await txt('.mp-lines')).includes('DE = 4.5 cm'), 'midpoint: obtuse preset');
  await page.click(R + '.mp-mode button[data-m="conv"]'); await page.waitForTimeout(100);
  check((await txt('.mp-lines')).includes('AF ÷ AC = 0.5') && await page.isHidden(R + '.mp-proof'), 'midpoint: converse F is the mid-point');
  await page.click(R + '.mp-mode button[data-m="quad"]'); await page.waitForTimeout(100);
  const Q = await txt('.mp-lines');
  check(Q.includes('27.74 cm = AC + BD') && Q.includes('47.5 cm²') && Q.includes('95 cm²') && (await page.$$(R + '.mp-par')).length === 1, 'midpoint: Varignon example');
  check(await page.isHidden(R + '.mp-pre[data-p="right"]'), 'midpoint: presets hidden for quadrilateral');
  await drag([14, 11], [15, 13]);
  check(!(await txt('.mp-lines')).includes('27.74'), 'midpoint: drag a quadrilateral corner');
  await page.setViewportSize(vp);
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    const m = /= ([\d.]+) cm\.$/.exec(w.trim());
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `midpoint: quiz ${i} (${w})`);
  }
};
