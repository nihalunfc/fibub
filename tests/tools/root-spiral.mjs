// #1276 Square root spiral
export const path = '/learn/root-spiral/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/root-spiral/`); await page.waitForSelector('.rs .rs-fig polygon');
  const R = '.rs ', txt = (s) => page.textContent(R + s);
  check((await page.$$(R + '.rs-fig polygon')).length === 5 && (await txt('.rs-big')) === 'Newest spoke: √6 ≈ 2.4495', 'spiral: five triangles, newest √6');
  const st = await txt('.rs-steps');
  check(st.includes('√((√5)² + 1²) = √(5 + 1) = √6') && st.includes('24.09°') && st.includes('turn 160.92°'), `spiral: steps (${st})`);
  check((await txt('.rs-fig')).includes('√5') && (await txt('.rs-fig')).includes('2'), 'spiral: spokes labelled');
  await page.fill(R + '.rs-n', '17');
  check((await page.$$(R + '.rs-fig polygon')).length === 17 && (await txt('.rs-steps')).includes('364.78°, more than one full turn') && (await txt('.rs-big')).includes('√18'), 'spiral: 17 triangles pass a full turn');
  await page.fill(R + '.rs-n', '3'); check((await txt('.rs-big')) === 'Newest spoke: √4 = 2', 'spiral: √4 = 2');
  await page.click(R + '.rs-mode button[data-m="line"]');
  const s2 = await txt('.rs-steps');
  check(s2.includes('AB = 3.5') && s2.includes('radius OC = 2.25') && s2.includes('5.0625 − 1.5625 = 3.5') && (await txt('.rs-big')) === '√3.5 ≈ 1.8708', `spiral: semicircle for 3.5 (${s2})`);
  { const f = (await txt('.rs-fig')).replace(/\s/g, ''); check(['A', 'B', 'C', 'D', 'E', 'O', '√3.5'].every((l) => f.includes(l)) && (await page.$$(R + '.rs-arc')).length === 1, 'spiral: construction labels and arc'); }
  await page.fill(R + '.rs-x', '9'); check((await txt('.rs-big')) === '√9 = 3', 'spiral: √9 = 3');
  await page.fill(R + '.rs-x', '0.5'); check((await txt('.rs-big')) === '√0.5 ≈ 0.7071', 'spiral: √0.5');
  check((await page.$$(R + '.sm-q')).length === 4, 'spiral: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const wk = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    const ans = i === 1 ? /≈ ([\d.]+)\.$/.exec(wk)[1] : i === 2 ? /k = (\d+)\.$/.exec(wk)[1] : i === 3 ? /= (\d+)√(\d+)\.$/.exec(wk).slice(1, 3).join(', ') : /÷ 2 = ([\d.]+);/.exec(wk)[1];
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, ans); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `spiral: quiz ${i} (${wk})`);
  }
};
