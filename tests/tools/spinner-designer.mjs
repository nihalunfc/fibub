// #1282 Probability spinner designer
export const path = '/learn/spinner-designer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/spinner-designer/`); await page.waitForSelector('.sp .sp-wheel path');
  const R = '.sp ', txt = (s) => page.textContent(R + s);
  const ps = async () => page.locator(R + '.sp-p').allTextContents();
  { const p = await ps(); check(p[0] === '1/3 = 33.3%' && p[1] === '1/2 = 50%' && p[2] === '1/6 = 16.7%' && p[3] === '—', `spinner: start probabilities (${p.join(' | ')})`); }
  check((await page.locator(R + '.sp-wheel path').count()) === 3 && (await txt('.sp-wheel')).includes('1/3'), 'spinner: three sectors drawn with fractions');
  await page.click(R + '.sp-many[data-n="1000"]');
  { const n = (await page.locator(R + '.sp-tab tbody tr td:nth-child(2)').allTextContents()).map(Number);
    check(n.reduce((a, b) => a + b, 0) === 1000 && Math.abs(n[1] - 500) < 80 && (await txt('.sp-big')) === '1000 spins so far', `spinner: 1000 spins (${n.join(', ')})`); }
  check((await page.locator(R + '.sp-bars rect').count()) === 3 && (await page.locator(R + '.sp-bars .sp-th').count()) === 3, 'spinner: bars and theory lines');
  await page.locator(R + '.sp-one').scrollIntoViewIfNeeded(); await page.click(R + '.sp-one'); await page.waitForTimeout(1300);
  check(/^(Red|Blue|Green)! \(1001 spins so far\)$/.test(await txt('.sp-big')), `spinner: one animated spin (${await txt('.sp-big')})`);
  await page.click(R + '.sp-reset'); check((await txt('.sp-big')) === 'Press Spin.' && (await txt('.sp-tab')).includes('—'), 'spinner: reset');
  await page.click(R + '.sp-plus[data-i="3"]'); await page.click(R + '.sp-plus[data-i="3"]');
  { const p = await ps(); check(p[3] === '1/4 = 25%' && p[0] === '1/4 = 25%' && (await page.locator(R + '.sp-wheel path').count()) === 4, `spinner: yellow added (${p.join(' | ')})`); }
  await page.click(R + '.sp-minus[data-i="3"]'); await page.click(R + '.sp-minus[data-i="3"]'); await page.click(R + '.sp-minus[data-i="3"]');
  check((await page.inputValue(R + '.sp-share[data-i="3"]')) === '0', 'spinner: shares never below 0');
  for (const i of [0, 1, 2]) await page.fill(`${R}.sp-share[data-i="${i}"]`, '0');
  check(await page.isVisible(R + '.sp-err'), 'spinner: empty spinner message');
  await page.fill(R + '.sp-share[data-i="1"]', '1'); check(await page.isHidden(R + '.sp-err') && (await page.locator(R + '.sp-wheel circle').count()) >= 2 && (await ps())[1] === '1 = 100%', 'spinner: one colour fills the circle');
  // Challenge: read the goal, set shares using the hint, check.
  await page.click(R + '.sp-gcheck'); const hint = await txt('.sp-gres');
  check(hint.startsWith('Not yet. Hint: use'), 'spinner: wrong try gives a hint');
  const L = Number(/use (\d+) shares/.exec(hint)[1]), parts = [...hint.matchAll(/(Red|Blue|Green|Yellow) gets (\d+)/g)];
  const idx = { Red: 0, Blue: 1, Green: 2, Yellow: 3 };
  for (let i = 0; i < 6; i++) await page.fill(`${R}.sp-share[data-i="${i}"]`, '0');
  for (const m of parts) await page.fill(`${R}.sp-share[data-i="${idx[m[1]]}"]`, m[2]);
  await page.click(R + '.sp-gcheck');
  check((await txt('.sp-gres')).startsWith('Right!') && L > 0, `spinner: challenge met (${hint})`);
  await page.click(R + '.sp-gnew'); check((await txt('.sp-gres')) === '' && (await txt('.sp-goal')).startsWith('Make a spinner where'), 'spinner: new challenge');
  check((await page.$$(R + '.sm-q')).length === 4, 'spinner: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`), m = /= ([\d./]+)°?\.$/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `spinner: quiz ${i} (${w})`);
  }
};
