// #1002 Lens ray diagram
export const path = '/learn/lens-ray-diagram/';
export default async ({ page, check, BASE, OUT }) => {
  const R = '.lrd ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.lrd-big'), facts = () => page.textContent(R + '.lrd-facts'), formula = () => page.textContent(R + '.lrd-formula');
  check((await big()) === 'Real and inverted, same size, at 2F₂', `lens: example at 2F₁ (${await big()})`);
  { const f = await formula(); check(f.includes('1/v = 1/f + 1/u = 1/10 + 1/(−20)') && f.includes('1/v = 0.05') && f.includes('v = 20 cm') && f.includes('m = v/u = 20/(−20) = −1') && f.includes('= 10 D'), `lens: formula with signs ${f}`); }
  check((await page.textContent(R + '.lrd-table tr.on')).startsWith('At 2F₁') && (await page.getAttribute(R + '.lrd-pos button:nth-child(3)', 'aria-pressed')) === 'true', 'lens: table row and position button');
  const inked = () => page.evaluate(() => { const c = document.querySelector('.lrd-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 16) if (d[i] !== d[0] || d[i + 1] !== d[1] || d[i + 2] !== d[2]) n++; return n; });
  check((await inked()) > 500, 'lens: ray diagram drawn');
  await page.screenshot({ path: OUT + 'lens-2f.png' });
  const pos = async (n) => { await page.click(`${R}.lrd-pos button:nth-child(${n})`); await page.waitForTimeout(150); };
  await pos(2); check((await big()) === 'Real and inverted, diminished, between F₂ and 2F₂' && (await formula()).includes('v = 15 cm') && (await facts()).includes('−0.5'), `lens: beyond 2F₁ (${await big()})`);
  await pos(4); check((await formula()).includes('v = 30 cm') && (await formula()).includes('= −2'), 'lens: between F₁ and 2F₁');
  await pos(5); check((await big()).includes('at infinity') && (await formula()).includes('v = ∞'), 'lens: at F₁');
  await pos(6); check((await big()) === 'Virtual and erect, enlarged, on the same side as the object' && (await formula()).includes('v = −10 cm') && (await formula()).includes('= 2'), `lens: magnifying glass (${await big()})`);
  await page.screenshot({ path: OUT + 'lens-virtual.png' });
  await pos(1); check((await big()).includes('at F₂') && (await formula()).includes('v = f = 10 cm'), 'lens: at infinity');
  await page.click(R + '.lrd-kind [data-k=concave]'); await page.waitForTimeout(150);
  check((await page.$$(R + '.lrd-pos button')).length === 2, 'lens: concave has two positions');
  await pos(2); check((await big()).startsWith('Virtual and erect, diminished') && (await formula()).includes('v = −6 cm') && (await formula()).includes('= 0.4') && (await formula()).includes('= −10 D'), `lens: concave f 10 at 15 cm (${await formula()})`);
  await page.screenshot({ path: OUT + 'lens-concave.png' });
  await page.click(R + '.lrd-kind [data-k=convex]');
  await page.fill(R + '.lrd-ft', '25'); await page.fill(R + '.lrd-ut', '100'); await page.waitForTimeout(150);
  check((await formula()).includes('v = 33.33 cm') && (await formula()).includes('= 4 D'), `lens: typed f 25, u 100 (${await formula()})`);
  await page.fill(R + '.lrd-ut', '-'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.lrd-err')).includes('object distance'), 'lens: bad distance message');
  await page.fill(R + '.lrd-ft', '10'); await page.fill(R + '.lrd-ut', '20'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.lrd-err') && (await big()) === 'Real and inverted, same size, at 2F₂', 'lens: back to the example');
  await page.$eval(R + '.lrd-u', (e) => { e.value = '15'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await formula()).includes('v = 30 cm') && (await page.inputValue(R + '.lrd-ut')) === '15', 'lens: distance slider');
  await page.$eval(R + '.lrd-f', (e) => { e.value = '20'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.lrd-ut')) === '30' && (await formula()).includes('v = 60 cm'), 'lens: focal slider keeps the position');
  await page.locator(R + '.lrd-fig').scrollIntoViewIfNeeded();
  { const box = await page.locator(R + '.lrd-fig').boundingBox(); const s = box.width / (7.6 * 20), x0 = 3.8 * 20 * s;
    await page.mouse.move(box.x + x0 - 19.5 * s, box.y + box.height / 2); await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(150);
    check((await page.inputValue(R + '.lrd-ut')) === '20' && (await big()).includes('at infinity'), `lens: tap near F₁ snaps there (${await page.inputValue(R + '.lrd-ut')})`);
    await page.mouse.move(box.x + x0 - 60 * s, box.y + box.height / 2); await page.mouse.down(); await page.mouse.move(box.x + x0 - 10 * s, box.y + box.height / 2, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(150);
    check((await page.inputValue(R + '.lrd-ut')) === '10' && (await big()).startsWith('Virtual'), `lens: drag to 10 cm (${await page.inputValue(R + '.lrd-ut')})`);
  }
  // Class 12: image height and two lenses in contact.
  await page.fill(R + '.lrd-ft', '10'); await page.fill(R + '.lrd-ut', '20');
  await page.click(R + '.lrd-level [data-l="12"]'); await page.waitForTimeout(150);
  check(await page.isVisible(R + '.lrd-ht') && (await facts()).includes('−2 cm'), 'lens: class 12 image height');
  { const c = await page.textContent(R + '.lrd-combo'); check(c.includes('P₂ = 100/f₂ = 100/(−20) = −5 D') && c.includes('P = P₁ + P₂ = 5 D') && c.includes('f = 100/P = 20 cm: converging'), `lens: lenses in contact ${c}`); }
  await page.fill(R + '.lrd-f2', '-10'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.lrd-combo')).includes('flat glass'), 'lens: equal and opposite lenses cancel');
  await page.fill(R + '.lrd-f2', 'x'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.lrd-err2') && await page.isHidden(R + '.lrd-combo'), 'lens: bad second lens message');
  await page.fill(R + '.lrd-f2', '-20');
  await page.click(R + '.lrd-level [data-l="10"]'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.lrd-f2'), 'lens: class 10 hides the extras');
  check((await page.$$(R + '.lrd-quiz .sq-q')).length === 4, 'lens: four questions');
  await page.fill(`${R} .sq-q:nth-child(1) .sq-in`, '12345'); await page.click(`${R} .sq-q:nth-child(1) .sq-check`);
  check((await page.textContent(`${R} .sq-q:nth-child(1) .sq-res`)) === 'Not quite' && await page.isVisible(`${R} .sq-q:nth-child(1) .sq-work`), 'lens: wrong answer shows working');
  for (let round = 0; round < 3; round++) {
    for (let i = 1; i <= 4; i++) {
      const work = await page.textContent(`${R} .sq-q:nth-child(${i}) .sq-work`);
      const ans = [...work.matchAll(/= (−?[\d.]+)/g)].map((m) => m[1]).at(-1);
      await page.fill(`${R} .sq-q:nth-child(${i}) .sq-in`, ans ?? 'x'); await page.click(`${R} .sq-q:nth-child(${i}) .sq-check`);
      check((await page.textContent(`${R} .sq-q:nth-child(${i}) .sq-res`)) === 'Correct', `lens: question ${i} answer from its working (${ans}) is correct`);
    }
    await page.click(R + '.sq-new'); await page.waitForTimeout(100);
  }
};
