// #1245 Mental multiplication with the area picture
export const path = '/learn/multiplication-area/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/multiplication-area/`); await page.waitForSelector('.ma .ma-fig .ma-term');
  const R = '.ma ', txt = (s) => page.textContent(R + s);
  check((await txt('.ma-big')) === '103 × 97 = 9,991' && (await page.inputValue(R + '.ma-base')) === '100', 'ma: 103 × 97, base 100');
  check((await txt('.ma-steps')).includes('10,000 + 300 − 300 − 9 = 9,991') && (await txt('.ma-trick')).includes('100² − 3² = 10,000 − 9 = 9,991'), 'ma: steps and squares shortcut');
  check((await page.$$(R + '.ma-neg')).length === 2 && (await page.$$(R + '.ma-pos2')).length === 1, 'ma: one strip added, strip and corner taken away');
  await page.click(R + '.ma-pre[data-p="98,96"]'); await page.waitForTimeout(80);
  check((await txt('.ma-steps')).includes('10,000 − 200 − 400 + 8 = 9,408') && (await txt('.ma-steps')).includes('added back') && (await page.$$(R + '.ma-neg')).length === 2, 'ma: 98 × 96 corner added back');
  await page.click(R + '.ma-pre[data-p="52,48"]'); await page.waitForTimeout(80);
  check((await page.inputValue(R + '.ma-base')) === '50' && (await txt('.ma-trick')).includes('50² − 2²'), 'ma: 52 × 48 around 50');
  await page.fill(R + '.ma-base', '60'); await page.waitForTimeout(80);
  check((await txt('.ma-steps')).includes('= 2,496') && (await txt('.ma-trick')).includes('Set the base to 50'), 'ma: own base 60 still right');
  await page.click(R + '.ma-auto'); await page.waitForTimeout(80);
  check((await page.inputValue(R + '.ma-base')) === '50', 'ma: pick for me');
  await page.click(R + '.ma-pre[data-p="999,999"]'); await page.waitForTimeout(80);
  check((await txt('.ma-big')) === '999 × 999 = 998,001' && (await page.inputValue(R + '.ma-base')) === '1000', 'ma: 999 × 999 base 1000');
  await page.click(R + '.ma-pre[data-p="23,47"]'); await page.click(R + '.ma-m button[data-m="grid"]'); await page.waitForTimeout(80);
  check(await page.isHidden(R + '.ma-brow'), 'ma: base box hidden for place value');
  check((await page.$$(R + '.ma-term')).length === 4 && (await txt('.ma-steps')).includes('800 + 140 + 120 + 21 = 1,081'), 'ma: 23 × 47 grid');
  await page.fill(R + '.ma-a', '147'); await page.waitForTimeout(80);
  check((await page.$$(R + '.ma-term')).length === 6 && (await txt('.ma-big')) === '147 × 47 = 6,909', 'ma: 147 × 47 grid of 6');
  await page.fill(R + '.ma-a', '0'); await page.waitForTimeout(80);
  check(await page.isVisible(R + '.ma-err'), 'ma: 0 message');
  await page.fill(R + '.ma-a', '12'); await page.waitForTimeout(80);
  check(await page.isHidden(R + '.ma-err'), 'ma: message clears');
  check((await page.$$(R + '.sm-q')).length === 4, 'ma: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`), m = /= (\d+)\.(?: \(|$)/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `ma: quiz question ${i} (${w})`);
  }
};
