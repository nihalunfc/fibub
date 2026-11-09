// #1001 Mirror ray diagram
export const path = '/learn/mirror-ray-diagram/';
export default async ({ page, check, BASE, OUT }) => {
  const R = '.mrd ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(600);
  const big = () => page.textContent(R + '.mrd-big'), facts = () => page.textContent(R + '.mrd-facts'), formula = () => page.textContent(R + '.mrd-formula');
  const row = () => page.textContent(R + '.mrd-table tr.on');
  check((await big()) === 'Real and inverted, same size, at C', `mirror: example at C (${await big()})`);
  { const f = await formula(); check(f.includes('1/v = 1/f − 1/u = 1/(−15) − 1/(−30)') && f.includes('v = −30 cm') && f.includes('m = −v/u = −(−30)/(−30) = −1'), `mirror: formula with signs ${f}`); }
  check((await row()).startsWith('At C') && (await page.getAttribute(R + '.mrd-pos button:nth-child(3)', 'aria-pressed')) === 'true', 'mirror: table row and position button at C');
  // Painted: the canvas has ink.
  const inked = () => page.evaluate(() => { const c = document.querySelector('.mrd-fig'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 16) if (d[i] !== d[0] || d[i + 1] !== d[1] || d[i + 2] !== d[2]) n++; return n; });
  check((await inked()) > 500, 'mirror: ray diagram drawn');
  await page.screenshot({ path: OUT + 'mirror-c.png', fullPage: false });
  const pos = async (n) => { await page.click(`${R}.mrd-pos button:nth-child(${n})`); await page.waitForTimeout(150); };
  await pos(2); check((await big()) === 'Real and inverted, diminished, between F and C' && (await formula()).includes('v = −22.5 cm') && (await facts()).includes('−0.5'), `mirror: beyond C (${await big()})`);
  await pos(4); check((await formula()).includes('v = −45 cm') && (await formula()).includes('= −2'), 'mirror: between C and F gives v −45, m −2');
  await pos(5); check((await big()).includes('at infinity') && (await formula()).includes('v = ∞'), 'mirror: at F, image at infinity');
  await pos(6); check((await big()) === 'Virtual and erect, enlarged, behind the mirror' && (await formula()).includes('v = 15 cm') && (await formula()).includes('= 2'), `mirror: between F and P (${await big()})`);
  await page.screenshot({ path: OUT + 'mirror-virtual.png' });
  await pos(1); check((await big()).includes('point-sized') && (await formula()).includes('v = f = −15 cm') && (await page.inputValue(R + '.mrd-ut')) === 'infinity', 'mirror: at infinity');
  // Convex.
  await page.click(R + '.mrd-kind [data-k=convex]'); await page.waitForTimeout(150);
  check((await page.$$(R + '.mrd-pos button')).length === 2 && (await page.$$(R + '.mrd-table tbody tr')).length === 2, 'mirror: convex has two positions');
  await pos(2); check((await big()).startsWith('Virtual and erect, diminished') && (await formula()).includes('v = 9 cm') && (await formula()).includes('= 0.4'), `mirror: convex f 15 at 22.5 cm (${await formula()})`);
  // Typed numbers and sliders.
  await page.click(R + '.mrd-kind [data-k=concave]');
  await page.fill(R + '.mrd-ft', '10'); await page.fill(R + '.mrd-ut', '25'); await page.waitForTimeout(150);
  check((await formula()).includes('v = −16.67 cm') && (await page.inputValue(R + '.mrd-f')) === '10', `mirror: typed f 10, u 25 (${await formula()})`);
  await page.fill(R + '.mrd-ft', 'abc'); await page.waitForTimeout(100);
  check((await page.textContent(R + '.mrd-err')).includes('focal length') && await page.isVisible(R + '.mrd-err'), 'mirror: bad focal length message');
  await page.fill(R + '.mrd-ft', '15'); await page.fill(R + '.mrd-ut', '30'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.mrd-err') && (await big()) === 'Real and inverted, same size, at C', 'mirror: back to the example');
  await page.$eval(R + '.mrd-u', (e) => { e.value = '45'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await formula()).includes('v = −22.5 cm') && (await page.inputValue(R + '.mrd-ut')) === '45', 'mirror: distance slider');
  await page.$eval(R + '.mrd-f', (e) => { e.value = '20'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.mrd-ut')) === '60' && (await formula()).includes('v = −30 cm'), 'mirror: focal slider keeps the position (beyond C)');
  // Drag on the picture: tap near C (u = 2f = 40 cm) snaps to C.
  await page.locator(R + '.mrd-fig').scrollIntoViewIfNeeded();
  { const box = await page.locator(R + '.mrd-fig').boundingBox(); const s = box.width / (3.8 * 20 + 2.3 * 20), x0 = 3.8 * 20 * s;
    await page.mouse.move(box.x + x0 - 39.5 * s, box.y + box.height / 2); await page.mouse.down(); await page.mouse.up(); await page.waitForTimeout(150);
    check((await big()) === 'Real and inverted, same size, at C' && (await page.inputValue(R + '.mrd-ut')) === '40', `mirror: tap near C snaps there (${await page.inputValue(R + '.mrd-ut')})`);
    await page.mouse.move(box.x + x0 - 60 * s, box.y + box.height / 2); await page.mouse.down(); await page.mouse.move(box.x + x0 - 10 * s, box.y + box.height / 2, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(150);
    check((await page.inputValue(R + '.mrd-ut')) === '10' && (await big()).startsWith('Virtual'), `mirror: drag to 10 cm (${await page.inputValue(R + '.mrd-ut')})`);
  }
  // Class 12.
  await page.click(R + '.mrd-level [data-l="12"]'); await page.waitForTimeout(150);
  { const f = await facts(); check(f.includes('R = 2f') && f.includes('−40 cm') && f.includes('−5 D') && await page.isVisible(R + '.mrd-ht') && f.includes('4 cm'), `mirror: class 12 extras ${f}`); }
  await page.fill(R + '.mrd-ht', '3'); await page.waitForTimeout(100);
  check((await formula()).includes('h′ = m × h = 2 × 3 = 6 cm'), 'mirror: image height from object height');
  await page.click(R + '.mrd-level [data-l="10"]'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.mrd-ht'), 'mirror: class 10 hides the extras');
  // Check yourself.
  const qs = await page.$$(R + '.mrd-quiz .sq-q');
  check(qs.length === 4, 'mirror: four questions');
  await page.fill(`${R} .sq-q:nth-child(1) .sq-in`, '12345'); await page.click(`${R} .sq-q:nth-child(1) .sq-check`);
  check((await page.textContent(`${R} .sq-q:nth-child(1) .sq-res`)) === 'Not quite' && await page.isVisible(`${R} .sq-q:nth-child(1) .sq-work`), 'mirror: wrong answer shows working');
  for (let i = 1; i <= 4; i++) {
    const work = await page.textContent(`${R} .sq-q:nth-child(${i}) .sq-work`);
    const nums = [...work.matchAll(/= (−?[\d.]+)/g)].map((m) => m[1]);
    const ans = nums.at(-1);
    await page.fill(`${R} .sq-q:nth-child(${i}) .sq-in`, ans ?? 'x'); await page.click(`${R} .sq-q:nth-child(${i}) .sq-check`);
    check((await page.textContent(`${R} .sq-q:nth-child(${i}) .sq-res`)) === 'Correct', `mirror: question ${i} answer from its working (${ans}) is correct`);
  }
  await page.click(R + '.sq-new'); await page.waitForTimeout(100);
  check((await page.$$(R + '.sq-q .sq-res:not([hidden])')).length === 0, 'mirror: new questions');
};
