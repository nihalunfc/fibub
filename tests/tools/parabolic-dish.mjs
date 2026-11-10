// #1380 Parabolic dish
export const path = '/learn/parabolic-dish/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/parabolic-dish/`); await page.waitForSelector('.pd .pd-par');
  const R = '.pd ';
  const txt = (s) => page.textContent(R + s);
  check((await txt('.pd-eq')).includes('x² = 4ay = 8y') && (await txt('.pd-eq')).includes('F = (0, 2)') && (await txt('.pd-lr')).includes('= 8.'), 'dish: x² = 8y, F (0, 2), latus rectum 8');
  check((await txt('.pd-depth')).includes('= 2, so F is level with the rim') && (await txt('.pd-why')).includes('PF = 3.805') && (await txt('.pd-why')).includes('y + a = 3.805'), 'dish: depth 2 and focus-directrix check');
  check((await page.$$(R + '.pd-out')).length === 8 && (await page.$$(R + '.pd-in')).length === 8 && (await page.$$(R + '.pd-cir')).length === 0, 'dish: 8 rays in and out, no circle');
  // Every reflected parabola ray passes (on screen) through F.
  const thruF = await page.$$eval(R + '.pd-out', (ls) => { const F = document.querySelector('.pd .pd-F'); const fx = +F.getAttribute('cx'), fy = +F.getAttribute('cy');
    return ls.every((l) => { const x1 = +l.getAttribute('x1'), y1 = +l.getAttribute('y1'), x2 = +l.getAttribute('x2'), y2 = +l.getAttribute('y2'); return Math.abs((x2 - x1) * (fy - y1) - (y2 - y1) * (fx - x1)) / Math.hypot(x2 - x1, y2 - y1) < 0.5; }); });
  check(thruF, 'dish: every reflected ray passes through F');
  await page.click(R + '.pd-shape [data-s=both]'); await page.waitForTimeout(100);
  check((await page.$$(R + '.pd-cir')).length === 1 && (await page.$$(R + '.pd-outc')).length === 8 && (await txt('.pd-circ')).includes('4.405 below F'), `dish: circle rays fall short (${await txt('.pd-circ')})`);
  check(await page.isVisible(R + '.pd-err'), 'dish: circle width note when the dish is as wide as the circle');
  await page.click(R + '.pd-shape [data-s=circle]'); await page.fill(R + '.pd-w', '2'); await page.waitForTimeout(100);
  check((await page.$$(R + '.pd-par')).length === 0 && await page.isHidden(R + '.pd-err') && (await txt('.pd-circ')).includes('below F'), 'dish: circle only, narrow');
  await page.click(R + '.pd-shape [data-s=parabola]'); await page.check(R + '.pd-torch'); await page.waitForTimeout(100);
  const up = await page.$$eval(R + '.pd-out', (ls) => ls.every((l) => Math.abs(+l.getAttribute('x1') - +l.getAttribute('x2')) < 0.01 && +l.getAttribute('y2') < +l.getAttribute('y1')));
  check(up, 'dish: light from the focus leaves straight up');
  await page.fill(R + '.pd-a', '0.5'); await page.waitForTimeout(100);
  check((await txt('.pd-depth')).includes('inside the bowl'), 'dish: small a puts F inside the bowl');
  check((await txt('.pd-f')).includes('3600/96 = 37.5'), 'receiver: 60 by 6 gives 37.5');
  await page.fill(R + '.pd-d', '0'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.pd-derr'), 'receiver: bad depth message');
  check((await page.$$(R + '.sm-q')).length === 4, 'dish: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = /.*= ([\d.]+)\.$/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `dish: quiz ${i} (${w})`);
  }
};
