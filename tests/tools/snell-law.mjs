// #1003 Refraction and Snell's law
export const path = '/learn/snell-law/';
export default async ({ page, check, BASE, OUT }) => {
  const R = '.snl ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.snl-big'), facts = () => page.textContent(R + '.snl-facts'), formula = () => page.textContent(R + '.snl-formula');
  const setI = (v) => page.$eval(R + '.snl-i', (e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
  check((await big()) === 'r = 25°: the ray bends towards the normal', `snell: example (${await big()})`);
  check((await formula()).includes('= 0.4229') && (await facts()).includes('15°') && (await facts()).includes('1.52'), `snell: example working ${await formula()}`);
  const inked = () => page.evaluate(() => { const c = document.querySelector('.snl-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 16) if (d[i] !== d[0] || d[i + 1] !== d[1] || d[i + 2] !== d[2]) n++; return n; });
  check((await inked()) > 500, 'snell: picture drawn');
  await page.locator(R + '.snl-fig').screenshot({ path: OUT + 'snell-edge.png' });
  await page.click(R + '.snl-swap'); await page.waitForTimeout(100);
  check((await big()) === 'r = 77.7°: the ray bends away from the normal' && (await facts()).includes('41.1°'), `snell: swapped, glass to air (${await big()})`);
  await setI(42); await page.waitForTimeout(100);
  check((await big()) === 'Totally reflected: i = 42° is more than the critical angle 41.1°' && (await formula()).includes('1.017'), `snell: total internal reflection (${await big()})`);
  await page.locator(R + '.snl-fig').screenshot({ path: OUT + 'snell-tir.png' });
  await page.selectOption(R + '.snl-m1', '2.42'); await setI(30); await page.waitForTimeout(100);
  check((await big()).startsWith('Totally reflected') && (await facts()).includes('24.4°'), 'snell: diamond critical angle 24.4°');
  await page.click(R + '.snl-level [data-l="12"]'); await page.waitForTimeout(100);
  check((await facts()).includes('1.239 × 10⁸ m/s') && (await formula()).includes('sin C = n₂/n₁ = 1/2.42'), `snell: class 12 speeds ${await facts()}`);
  await page.click(R + '.snl-level [data-l="10"]');
  // Own index.
  await page.check(R + '.snl-own'); await page.fill(R + '.snl-n1', '1'); await page.fill(R + '.snl-n2', '1.33'); await setI(60); await page.waitForTimeout(100);
  check((await big()) === 'r = 40.6°: the ray bends towards the normal', `snell: own index water at 60° (${await big()})`);
  await page.fill(R + '.snl-n2', '9'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.snl-err')).includes('from 1 to 4') && await page.isHidden(R + '.snl-out'), 'snell: bad index message');
  await page.fill(R + '.snl-n2', '1.33'); await page.uncheck(R + '.snl-own');
  // Drag to aim: a point straight above the hit point gives i = 0.
  await page.selectOption(R + '.snl-m1', '1.00'); await page.selectOption(R + '.snl-m2', '1.52');
  await page.locator(R + '.snl-fig').scrollIntoViewIfNeeded();
  { const b = await page.locator(R + '.snl-fig').boundingBox(), k = b.width / 400;
    await page.mouse.move(b.x + 200 * k, b.y + 40 * k); await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(100);
    check((await big()) === 'r = 0°: the ray bends towards the normal' || (await big()).startsWith('r = 0°'), `snell: aim straight down (${await big()})`);
    await page.mouse.move(b.x + 100 * k, b.y + 40 * k); await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(100);
    check((await page.inputValue(R + '.snl-i')) === '45', `snell: aim at 45° (${await page.inputValue(R + '.snl-i')})`);
  }
  // Slab.
  await page.click(R + '.snl-mode [data-m=slab]'); await setI(40); await page.waitForTimeout(100);
  check((await big()) === 'Lateral shift d = 1.43 cm' && (await facts()).includes('25°') && await page.isVisible(R + '.snl-t') && await page.isHidden(R + '.snl-swap'), `snell: slab (${await big()})`);
  await page.locator(R + '.snl-fig').screenshot({ path: OUT + 'snell-slab.png' });
  await page.$eval(R + '.snl-t', (e) => { e.value = '10'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await big()) === 'Lateral shift d = 2.85 cm', 'snell: thicker slab, twice the shift');
  await page.click(R + '.snl-level [data-l="12"]'); await page.waitForTimeout(100);
  check((await facts()).includes('11 cm'), 'snell: class 12 path inside slab');
  await page.click(R + '.snl-level [data-l="10"]');
  // Depth.
  await page.click(R + '.snl-mode [data-m=depth]'); await page.waitForTimeout(100);
  check((await big()) === 'Seems 75.2 cm deep (really 100 cm)' && (await facts()).includes('24.8 cm') && await page.isHidden(R + '.snl-i'), `snell: apparent depth (${await big()})`);
  await page.locator(R + '.snl-fig').screenshot({ path: OUT + 'snell-depth.png' });
  await page.$eval(R + '.snl-d', (e) => { e.value = '200'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.selectOption(R + '.snl-m2', '1.52'); await page.waitForTimeout(100);
  check((await big()) === 'Seems 132 cm deep (really 200 cm)', `snell: glass block depth (${await big()})`);
  await page.click(R + '.snl-mode [data-m=edge]'); await page.waitForTimeout(100);
  // Quiz.
  check((await page.$$(R + '.snl-quiz .sq-q')).length === 4, 'snell: four questions');
  await page.fill(`${R} .sq-q:nth-child(1) .sq-in`, '9999'); await page.click(`${R} .sq-q:nth-child(1) .sq-check`);
  check((await page.textContent(`${R} .sq-q:nth-child(1) .sq-res`)) === 'Not quite', 'snell: wrong answer');
  for (let round = 0; round < 3; round++) {
    for (let i = 1; i <= 4; i++) {
      const work = await page.textContent(`${R} .sq-q:nth-child(${i}) .sq-work`);
      const ans = [...work.matchAll(/= (−?[\d.]+)/g)].map((m) => m[1]).at(-1);
      await page.fill(`${R} .sq-q:nth-child(${i}) .sq-in`, ans ?? 'x'); await page.click(`${R} .sq-q:nth-child(${i}) .sq-check`);
      check((await page.textContent(`${R} .sq-q:nth-child(${i}) .sq-res`)) === 'Correct', `snell: question ${i} answer (${ans}) is correct`);
    }
    await page.click(R + '.sq-new'); await page.waitForTimeout(100);
  }
};
