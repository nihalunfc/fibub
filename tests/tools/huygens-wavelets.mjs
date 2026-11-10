// #1423 Huygens wavelets
export const path = '/learn/huygens-wavelets/';
export default async ({ page, check, BASE, OUT }) => {
  const R = '.hyg ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.hyg-big'), facts = () => page.textContent(R + '.hyg-facts'), formula = () => page.textContent(R + '.hyg-formula');
  const set = (c, v) => page.$eval(R + c, (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  check((await big()) === 'Refracted wavefront at r = 25.4°', `huygens: example (${await big()})`);
  { const f = await facts(); check(f.includes('2.998 × 10⁸') && f.includes('1.999 × 10⁸') && f.includes('towards the normal') && f.includes('0.667 × wavelength'), `huygens: example facts ${f}`); }
  check((await formula()).includes('= 0.4285') && (await formula()).includes('1.00 sin 40° = 1.50 sin 25.4°'), `huygens: working ${await formula()}`);
  const inked = () => page.evaluate(() => { const el = document.querySelector('.hyg-fig'); const d = el.getContext('2d').getImageData(0, 0, el.width, el.height).data; let n = 0; for (let i = 0; i < d.length; i += 16) if (d[i] !== d[0] || d[i + 1] !== d[1] || d[i + 2] !== d[2]) n++; return n; });
  check((await inked()) > 500, 'huygens: picture drawn');
  await page.locator(R + '.hyg-out').screenshot({ path: OUT + 'huygens.png' });
  await set('.hyg-t', 0.5); await set('.hyg-n', 10); await page.waitForTimeout(50);
  check((await page.textContent(R + '.hyg-tv')) === '50% of τ' && (await page.textContent(R + '.hyg-nv')) === '11' && (await big()) === 'Refracted wavefront at r = 25.4°', 'huygens: time and wavelets change the picture, not the angle');
  await page.locator(R + '.hyg-fig').screenshot({ path: OUT + 'huygens-half.png' });
  await page.selectOption(R + '.hyg-m1', '1.33'); await page.selectOption(R + '.hyg-m2', '1.00'); await set('.hyg-i', 60); await page.waitForTimeout(50);
  check((await big()) === 'No refracted wave: totally reflected' && !(await page.$eval(R + '.hyg-err', (e) => e.hidden)) && (await facts()).includes('48.8°'), `huygens: total internal reflection (${await big()})`);
  await set('.hyg-i', 30); await page.waitForTimeout(50);
  check((await facts()).includes('away from the normal'), 'huygens: into a faster medium bends away');
  await page.click(R + '.hyg-mode [data-m=reflect]'); await page.waitForTimeout(50);
  check((await big()) === 'Angle of reflection r = 30° = i', `huygens: reflection (${await big()})`);
  await page.click(R + '.hyg-play'); await page.waitForTimeout(300);
  check((await page.textContent(R + '.hyg-play')) === 'Stop', 'huygens: play runs');
  await page.click(R + '.hyg-play'); await page.waitForTimeout(50);
  check((await page.textContent(R + '.hyg-play')) === 'Play', 'huygens: play stops');
  await page.click(R + '.hyg-mode [data-m=refract]'); await page.selectOption(R + '.hyg-m1', '1.00'); await page.selectOption(R + '.hyg-m2', '1.50'); await set('.hyg-i', 40); await set('.hyg-t', 1); await set('.hyg-n', 6); await page.waitForTimeout(50);
  check((await big()) === 'Refracted wavefront at r = 25.4°', 'huygens: back to the example');
  check((await page.$$(R + '.hyg-quiz .sq-q')).length === 4, 'huygens: four questions');
  await page.fill(`${R} .sq-q:nth-child(1) .sq-in`, '9999'); await page.click(`${R} .sq-q:nth-child(1) .sq-check`);
  check((await page.textContent(`${R} .sq-q:nth-child(1) .sq-res`)) === 'Not quite', 'huygens: wrong answer');
  for (let round = 0; round < 3; round++) {
    for (let i = 1; i <= 4; i++) {
      const work = await page.textContent(`${R} .sq-q:nth-child(${i}) .sq-work`);
      const ans = [...work.matchAll(/= (−?[\d.]+)/g)].map((m) => m[1]).at(-1);
      await page.fill(`${R} .sq-q:nth-child(${i}) .sq-in`, ans ?? 'x'); await page.click(`${R} .sq-q:nth-child(${i}) .sq-check`);
      check((await page.textContent(`${R} .sq-q:nth-child(${i}) .sq-res`)) === 'Correct', `huygens: question ${i} answer (${ans}) is correct`);
    }
    await page.click(R + '.sq-new'); await page.waitForTimeout(100);
  }
};
