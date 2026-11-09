// #1152 Pythagoras proof playground
export const path = '/learn/pythagoras-proofs/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/pythagoras-proofs/`); await page.waitForSelector('.py .py-ha');
  const R = '.py ';
  const txt = (s) => page.textContent(R + s);
  check((await txt('.py-sum')) === 'a² + b² = 9 + 16 = 25 = c²' && (await txt('.py-c')).includes('c = √25 = 5 (a whole number'), 'pythagoras: example 3, 4, 5');
  { const f = await txt('.py-fig'); check(f.includes('a² = 9') && f.includes('b² = 16') && f.includes('c² = 25'), 'pythagoras: squares labelled'); }
  // Proofs.
  check((await page.$$(R + '.py-pf .py-tri')).length === 4 && (await txt('.py-steps')).includes('area 49') && (await txt('.py-pf')).includes('c² = 25'), 'pythagoras: rearrangement start');
  await page.locator(R + '.py-t').fill('1'); await page.waitForTimeout(100);
  check((await txt('.py-tv')) === 'end' && (await txt('.py-pf')).includes('a²') && (await txt('.py-pf')).includes('b²'), 'pythagoras: rearrangement end shows a² and b²');
  await page.click(R + '.py-proof button[data-p="bhaskara"]'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.py-trow') && (await txt('.py-steps')).includes('4 × 6 + 1 = 25 = 9 + 16'), `pythagoras: Bhaskara steps (${await txt('.py-steps')})`);
  await page.click(R + '.py-proof button[data-p="similar"]'); await page.waitForTimeout(100);
  { const s = await txt('.py-steps'); check(s.includes('p = 1.8') && s.includes('q = 3.2') && s.includes('5 × 1.8 = 9'), `pythagoras: similar triangles steps (${s.slice(0, 120)})`); }
  await page.click(R + '.py-proof button[data-p="baudhayana"]'); await page.waitForTimeout(100);
  check((await txt('.py-steps')).includes('twice the area: 18') && (await page.$$(R + '.py-dsq')).length === 1, 'pythagoras: Baudhayana doubles 9 to 18');
  // Typed values.
  await page.fill(R + '.py-a', '6'); await page.fill(R + '.py-b', '7'); await page.waitForTimeout(100);
  check((await txt('.py-c')) === 'c = √85 = 9.22' && (await page.inputValue(R + '.py-br')) === '7', 'pythagoras: 6, 7 gives √85, slider follows');
  await page.fill(R + '.py-a', '-2'); await page.waitForTimeout(100);
  check(await page.isVisible(R + '.py-err'), 'pythagoras: negative side message');
  await page.fill(R + '.py-a', '3'); await page.fill(R + '.py-b', '4'); await page.waitForTimeout(100);
  check(await page.isHidden(R + '.py-err'), 'pythagoras: message clears');
  // Drag corner a to 8 (scale is fixed during the drag; the result is read after).
  const fig = page.locator(R + '.py-fig'); await fig.scrollIntoViewIfNeeded();
  { const h = await page.locator(R + '.py-ha').boundingBox(); const b = await fig.boundingBox(); const k = b.width / 340;
    await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2); await page.mouse.down();
    await page.mouse.move(h.x + h.width / 2 + 40 * k, h.y + h.height / 2, { steps: 5 }); await page.mouse.up(); await page.waitForTimeout(150);
    const a = Number(await page.inputValue(R + '.py-a')); check(a > 3 && (await txt('.py-sum')).startsWith(`a² + b² = ${a * a} + 16`), `pythagoras: dragging a corner changes a (${a})`); }
  // Triples.
  check((await txt('.py-tcount')) === '20 triples with c up to 50.' && (await txt('.py-mrule')).includes('8² + 15² = 289 = 17²'), `pythagoras: triples to 50 (${await txt('.py-tcount')})`);
  await page.check(R + '.py-prim'); await page.waitForTimeout(100);
  check((await txt('.py-tcount')) === '7 primitive triples with c up to 50.', 'pythagoras: primitive only');
  await page.fill(R + '.py-max', '100'); await page.waitForTimeout(100);
  check((await txt('.py-tcount')) === '16 primitive triples with c up to 100.', 'pythagoras: 16 primitive to 100');
  await page.click(R + '.py-tab tr[data-i="20,21"]'); await page.waitForTimeout(100);
  check((await txt('.py-c')).includes('c = √841 = 29'), 'pythagoras: tap a triple to draw it');
  await page.fill(R + '.py-m', '6'); await page.waitForTimeout(100);
  check((await txt('.py-mrule')).includes('12² + 35² = 1369 = 37²'), 'pythagoras: Class 8 rule m = 6');
  // Quiz.
  check((await page.$$(R + '.sm-q')).length === 4, 'pythagoras: four questions');
  await page.click(R + '.sm-q:nth-child(1) .sm-qshow');
  { const w = await txt('.sm-q:nth-child(1) .sm-qwork'); const m = /c = √\d+ = (\d+) cm/.exec(w); await page.fill(R + '.sm-q:nth-child(1) .sm-qin', m[1]); await page.click(R + '.sm-q:nth-child(1) .sm-qcheck');
    check((await txt('.sm-q:nth-child(1) .sm-qres')) === 'Right!', 'pythagoras: hypotenuse answer accepted'); }
  await page.click(R + '.sm-q:nth-child(3) .sm-qshow');
  { const w = await txt('.sm-q:nth-child(3) .sm-qwork'); const m = /≈ (\S+) cm/.exec(w); await page.fill(R + '.sm-q:nth-child(3) .sm-qin', m[1]); await page.click(R + '.sm-q:nth-child(3) .sm-qcheck');
    check((await txt('.sm-q:nth-child(3) .sm-qres')) === 'Right!', `pythagoras: diagonal to 2 dp accepted (${m[1]})`); }
  await page.fill(R + '.sm-q:nth-child(2) .sm-qin', '1'); await page.click(R + '.sm-q:nth-child(2) .sm-qcheck');
  check((await txt('.sm-q:nth-child(2) .sm-qres')).includes('Not quite'), 'pythagoras: wrong answer');
};
