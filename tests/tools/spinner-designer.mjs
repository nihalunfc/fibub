// #1282 Probability spinner designer
export const path = '/learn/spinner-designer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/spinner-designer/`); await page.waitForSelector('.sp .sp-sec');
  const R = '.sp ', txt = (s) => page.textContent(R + s);
  check((await page.$$(R + '.sp-sec')).length === 4 && (await txt('.sp-tab')).includes('1/3 = 0.333') && (await txt('.sp-tab')).includes('1/12 = 0.083'), 'spinner: four sectors, 1/3 and 1/12');
  check((await txt('.sp-tot')).includes('add up to 360°') && (await txt('.sp-big')) === 'Not spun yet.', 'spinner: starts at 360°, not spun');
  await page.click(R + '.sp-spin[data-n="1"]'); await page.waitForTimeout(1300);
  check((await txt('.sp-big')).startsWith('Last spin:') && (await txt('.sp-big')).includes('1 spin so far'), 'spinner: one animated spin');
  await page.click(R + '.sp-spin[data-n="1000"]'); await page.waitForTimeout(150);
  const cells = await page.$$eval('.sp .sp-tab tr', (rs) => rs.slice(1).map((r) => [...r.children].map((c) => c.textContent)));
  const landed = cells.map((c) => Number(c[3])), sum = landed.reduce((a, b) => a + b, 0);
  check(sum === 1001 && Math.abs(landed[0] / 1001 - 1 / 3) < 0.06 && Math.abs(landed[3] / 1001 - 1 / 12) < 0.04, `spinner: 1001 spins near theory (${landed})`);
  check((await txt('.sp-out')).includes('After 1001 spins'), 'spinner: comparison sentence');
  await page.click(R + '.sp-clear'); await page.waitForTimeout(100);
  check((await txt('.sp-big')) === 'Not spun yet.', 'spinner: tally cleared');
  await page.fill(R + '.sp-row:nth-child(1) .sp-deg', '200'); await page.waitForTimeout(100);
  check((await txt('.sp-tot')).includes('440°'), 'spinner: total off 360 warned');
  await page.click(R + '.sp-fit'); await page.waitForTimeout(100);
  check((await txt('.sp-tot')).includes('add up to 360°'), 'spinner: fit to 360');
  await page.click(R + '.sp-pre[data-p="180,120,60"]'); await page.waitForTimeout(100);
  check((await page.$$(R + '.sp-row')).length === 3 && (await txt('.sp-tab')).includes('1/2 = 0.5') && (await txt('.sp-tab')).includes('1/6 = 0.167'), 'spinner: half, third, sixth');
  await page.click(R + '.sp-add'); await page.waitForTimeout(100);
  check((await page.$$(R + '.sp-row')).length === 4 && (await txt('.sp-tot')).includes('420°'), 'spinner: add a sector');
  await page.click(R + '.sp-eq'); await page.waitForTimeout(100);
  check((await txt('.sp-tab')).includes('1/4 = 0.25'), 'spinner: make all equal');
  await page.click(R + '.sp-row:nth-child(4) .sp-del'); await page.waitForTimeout(100);
  check((await page.$$(R + '.sp-row')).length === 3, 'spinner: remove a sector');
  check(await page.isHidden(R + '.sp-row .sp-pts'), 'spinner: points hidden at class 9');
  await page.click(R + '.sp-pre[data-p="300,60"]'); await page.click(R + '.sp-lvl button[data-l="12"]'); await page.waitForTimeout(100);
  await page.fill(R + '.sp-row:nth-child(1) .sp-pts', '1'); await page.fill(R + '.sp-row:nth-child(2) .sp-pts', '7'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.sp-row .sp-pts') && (await txt('.sp-out')).includes('= 2.') && (await txt('.sp-tab')).includes('P × points'), `spinner: expected value 2 (${await txt('.sp-out')})`);
  await page.click(R + '.sp-spin[data-n="10"]'); await page.waitForTimeout(100);
  check((await txt('.sp-out')).includes('points per spin on average'), 'spinner: average score shown');
  check((await page.$$(R + '.sm-q')).length === 4, 'spinner: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, w.match(/\d+(?:\.\d+)?/g).at(-1)); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `spinner: quiz ${i} (${w})`);
  }
};
