// #1164 Heron's formula explorer
export const path = '/learn/herons-formula/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/herons-formula/`); await page.waitForSelector('.hf .hf-h');
  const R = '.hf ';
  const txt = (s) => page.textContent(R + s);
  { const s = await txt('.hf-steps'); check(s.includes('= 21') && s.includes('s − a = 8,  s − b = 6,  s − c = 7') && s.includes('= 7056') && s.includes('Area = √7056 = 84'), 'heron: example 13, 15, 14 → 84'); }
  check((await txt('.hf-big')) === 'Area ≈ 84 square units' && (await txt('.hf-check')).includes('½ × 14 × 12 = 84'), 'heron: base × height check');
  check((await txt('.hf-kind')).includes('scalene, acute'), 'heron: kind');
  for (const [k, v] of [['.hf-a', 10], ['.hf-b', 10], ['.hf-c', 10]]) await page.fill(R + k, String(v));
  await page.waitForTimeout(100);
  check((await txt('.hf-big')) === 'Area ≈ 43.3 square units' && (await txt('.hf-kind')).includes('equilateral'), 'heron: equilateral 10');
  await page.fill(R + '.hf-a', '3'); await page.fill(R + '.hf-b', '4'); await page.fill(R + '.hf-c', '5'); await page.waitForTimeout(100);
  check((await txt('.hf-big')) === 'Area ≈ 6 square units' && (await txt('.hf-kind')).includes('right'), 'heron: 3-4-5 right, area 6');
  await page.fill(R + '.hf-c', '9'); await page.waitForTimeout(100);
  check((await txt('.hf-kind')).includes('Not a triangle') && (await txt('.hf-fig')).includes("can't make a triangle") && (await txt('.hf-big')) === '' && (await txt('.hf-steps')).includes('no area'), 'heron: 3, 4, 9 is not a triangle');
  // New options: presets, units, blank input, angles / heights / circles, cost.
  { const K = (k) => `${R}[data-k="${k}"]`;
    await page.selectOption(R + '.hf-pre', '4'); await page.waitForTimeout(100);
    check((await txt('.hf-big')) === 'Area ≈ 1452.37 m²' && (await page.inputValue(K('a'))) === '120', `heron: park preset in metres (${await txt('.hf-big')})`);
    await page.selectOption(R + '.hf-pre', '3'); await page.waitForTimeout(100);
    check((await txt('.hf-big')) === 'Area ≈ 12 square units' && (await page.inputValue(R + '.hf-unit')) === '', 'heron: 5, 5, 6 preset gives 12 and resets the unit');
    await page.fill(K('a'), '13'); await page.fill(K('b'), '15'); await page.fill(K('c'), '14'); await page.selectOption(R + '.hf-unit', 'cm'); await page.waitForTimeout(100);
    check((await txt('.hf-big')) === 'Area ≈ 84 cm²' && (await txt('.hf-check')) !== '', 'heron: unit cm gives cm²');
    await page.evaluate(() => document.querySelectorAll('.tool-ui details').forEach((d) => { d.open = true; }));
    { const f = await txt('.hf-facts'); check(f.includes('Perimeter = a + b + c = 42 cm') && f.includes('A = 53.13°, B = 67.38°, C = 59.49°') && f.includes('= 84 / 21 = 4 cm') && f.includes('= 2730 / 336 = 8.125 cm') && f.includes('on c = 12 cm'), `heron: more options (${f})`); }
    await page.fill(K('price'), '2'); await page.fill(K('fence'), '3'); await page.waitForTimeout(100);
    { const c = await txt('.hf-cost'); check(c.includes('84 × 2 = 168') && c.includes('42 × 3 = 126'), `heron: cost (${c})`); }
    await page.fill(K('a'), ''); await page.waitForTimeout(100);
    check((await txt('.hf-kind')).includes('side a') && (await txt('.hf-big')) === '', 'heron: blank side gives a message');
    await page.fill(K('a'), '-4'); await page.waitForTimeout(100);
    check((await txt('.hf-kind')).includes('above 0') && (await txt('.hf-steps')) === '', 'heron: negative side gives a message');
    await page.fill(K('a'), '13'); await page.selectOption(R + '.hf-unit', ''); await page.fill(K('price'), ''); await page.fill(K('fence'), '');
  }
  await page.fill(R + '.hf-a', '13'); await page.fill(R + '.hf-b', '15'); await page.fill(R + '.hf-c', '14'); await page.waitForTimeout(100);
  // Drag C straight sideways: the height (12) stays, so the area stays 84.
  const fig = page.locator(R + '.hf-fig'); await page.setViewportSize({ width: 1280, height: 1600 }); await fig.scrollIntoViewIfNeeded();
  { const h = await page.locator(R + '.hf-h').boundingBox();
    await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2); await page.mouse.down(); await page.mouse.move(h.x + h.width / 2 + 30, h.y + h.height / 2, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(150);
    const a = Number(await page.inputValue(R + '.hf-a')), b = Number(await page.inputValue(R + '.hf-b')), area = /≈ (\S+)/.exec(await txt('.hf-big'))[1];
    check(a < 13 && b > 15 && Math.abs(Number(area) - 84) < 0.6, `heron: dragging C sideways keeps the area near 84 (a ${a}, b ${b}, area ${area})`); }
  await page.setViewportSize({ width: 1280, height: 720 });
  check((await page.$$(R + '.sm-q')).length === 4, 'heron: four questions');
  for (const [i, re] of [[1, /= (\d+) cm²\.$/], [2, /≈ (\S+) cm²\.$/], [3, /= (\d+) cm²\.$/]]) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = re.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `heron: quiz ${i} (${w})`);
  }
  await page.fill(R + '.sm-q:nth-child(4) .sm-qin', '0'); await page.click(R + '.sm-q:nth-child(4) .sm-qcheck');
  check((await txt('.sm-q:nth-child(4) .sm-qres')) === 'Right!', 'heron: quiz 4 (not a triangle)');
};
