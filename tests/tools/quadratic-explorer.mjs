// #1151 Quadratic explorer
export const path = '/learn/quadratic-explorer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/quadratic-explorer/`); await page.waitForSelector('.qx .qx-vtx');
  const R = '.qx ';
  const txt = (s) => page.textContent(R + s);
  const setv = async (cls, v) => { await page.fill(R + cls, String(v)); await page.waitForTimeout(80); };
  // Example x² − 5x + 6.
  check((await txt('.qx-eq')) === 'y = x² − 5x + 6', 'quadratic: example equation');
  { const f = await txt('.qx-facts'); check(f.includes('(2.5, −0.25)') && f.includes('x = 2 and x = 3') && f.includes('x = 2.5'), `quadratic: example vertex, roots, axis (${f})`); }
  check((await txt('.qx-d')).includes('= 1') && (await txt('.qx-kind')).includes('two different real roots'), 'quadratic: example discriminant 1, two roots');
  check((await page.$$(R + '.qx-root')).length === 2, 'quadratic: two root dots on the graph');
  { const s = await txt('.qx-split'); check(s.includes('−3 and −2') && s.includes('= (x − 2)(x − 3)'), `quadratic: split the middle term (${s})`); }
  { const s = await txt('.qx-cs'); check(s.includes('(x − 2.5)² = 0.25') && s.includes('x = 2 or x = 3'), 'quadratic: completing the square steps'); }
  check((await txt('.qx-ans')) === 'x² − 5x + 6 = 0 has roots x = 2 and x = 3.', `quadratic: answer sentence (${await txt('.qx-ans')})`);
  await page.evaluate(() => document.querySelectorAll('.qx details').forEach((d) => (d.open = true)));
  await page.click(R + '.qx-w[data-w="surd"]'); await page.waitForTimeout(100);
  check((await txt('.qx-ans')) === '2x² + 3x − 7 = 0 has roots x = −2.766 and x = 1.266. Exact: x = (−3 ± √65) / 4.' && (await txt('.qx-wnote')).includes('D = 65'), `quadratic: surd example (${await txt('.qx-ans')})`);
  await page.click(R + '.qx-w[data-w="rect"]'); await page.waitForTimeout(100);
  check((await txt('.qx-ans')).includes('x = −8 and x = 6') && (await txt('.qx-wnote')).includes('width is 6 m'), 'quadratic: rectangle word problem');
  await page.click(R + '.qx-w[data-w="stone"]'); await page.waitForTimeout(100);
  check((await txt('.qx-eq')) === 'y = −5x² + 20x − 15' && (await txt('.qx-ans')).includes('x = 1 and x = 3'), 'quadratic: stone example');
  // Right-hand side.
  await page.click(R + '.qx-pre[data-p="1,-5,6"]'); await setv('.qx-b', 2); await setv('.qx-c', 0); await setv('.qx-rhs', 15);
  check((await txt('.qx-eq')) === 'y = x² + 2x − 15' && (await txt('.qx-ans')).includes('x = −5 and x = 3'), `quadratic: x² + 2x = 15 (${await txt('.qx-ans')})`);
  await setv('.qx-rhs', 0);
  // Build from roots.
  check((await txt('.qx-fr')).includes('(x − 2)(x + 3) = 0') && (await txt('.qx-fr')).includes('x² + x − 6 = 0'), `quadratic: roots 2 and −3 (${await txt('.qx-fr')})`);
  await page.click(R + '.qx-build'); await page.waitForTimeout(100);
  check((await txt('.qx-eq')) === 'y = x² + x − 6' && (await txt('.qx-ans')).includes('x = −3 and x = 2'), 'quadratic: loaded from roots');
  await setv('.qx-r2', ''); check((await txt('.qx-fr')) === 'Type both roots.', 'quadratic: blank root');
  await setv('.qx-r2', -3);
  await setv('.qx-a', 0); await setv('.qx-b', 1); await setv('.qx-c', -6);
  check((await txt('.qx-err')).includes('x = 6'), 'quadratic: a = 0 gives the straight-line solution');
  await page.click(R + '.qx-pre[data-p="1,-5,6"]'); await page.waitForTimeout(100);
  // Presets.
  await page.click(R + '.qx-pre[data-p="1,-4,4"]'); await page.waitForTimeout(100);
  check((await txt('.qx-kind')).includes('D = 0') && (await txt('.qx-facts')).includes('x = 2 (twice)') && (await page.$$(R + '.qx-root')).length === 1, 'quadratic: touches preset, equal roots');
  await page.click(R + '.qx-pre[data-p="1,2,5"]'); await page.waitForTimeout(100);
  check((await txt('.qx-kind')).includes('no real roots') && (await txt('.qx-d')).includes('−16') && (await txt('.qx-facts')).includes('none'), 'quadratic: misses preset, D = −16');
  check((await txt('.qx-split')).includes('does not factor'), 'quadratic: no whole-number split for x² + 2x + 5');
  // Class 11 level shows complex roots.
  await page.click(R + '.qx-level button[data-l="11"]'); await page.waitForTimeout(100);
  check((await txt('.qx-facts')).includes('−1 ± 2i') && (await txt('.qx-formula')).includes('−1 ± 2i') && (await txt('.qx-facts')).includes('c/a = 5'), 'quadratic: Class 11 complex roots and sum/product');
  await page.click(R + '.qx-level button[data-l="10"]'); await page.waitForTimeout(100);
  check(!(await txt('.qx-facts')).includes('2i'), 'quadratic: Class 10 hides complex roots');
  await page.click(R + '.qx-pre[data-p="-1,2,3"]'); await page.waitForTimeout(100);
  check((await txt('.qx-facts')).includes('downwards') && (await txt('.qx-facts')).includes('x = −1 and x = 3'), 'quadratic: upside-down preset');
  // Typed values, non-integer, a = 0 message.
  await setv('.qx-a', 2); await setv('.qx-b', 1); await setv('.qx-c', -6);
  check((await txt('.qx-facts')).includes('x = −2 and x = 1.5') && (await txt('.qx-split')).includes('= (x + 2)(2x − 3)'), `quadratic: 2x² + x − 6 (${await txt('.qx-split')})`);
  check((await page.inputValue(R + '.qx-ar')) === '2', 'quadratic: number box moves the slider');
  await setv('.qx-b', 1.5);
  check((await txt('.qx-split')).includes('whole numbers'), 'quadratic: split needs whole numbers');
  await setv('.qx-a', 0);
  check(await page.isVisible(R + '.qx-err') && (await txt('.qx-err')).includes('straight line'), 'quadratic: a = 0 message');
  // Slider.
  await page.click(R + '.qx-pre[data-p="1,-5,6"]');
  await page.locator(R + '.qx-cr').fill('4'); await page.waitForTimeout(100);
  check((await page.inputValue(R + '.qx-c')) === '4' && (await txt('.qx-eq')) === 'y = x² − 5x + 4', 'quadratic: slider moves the number box');
  // Drag the vertex to (0, −4): with a = 1, b = 0 and c = −4.
  const fig = page.locator(R + '.qx-fig'); await fig.scrollIntoViewIfNeeded();
  { const v = await page.locator(R + '.qx-vtx').boundingBox(); const b = await fig.boundingBox();
    const sx = b.width / 340, sy = b.height / 320;
    await page.mouse.move(v.x + v.width / 2, v.y + v.height / 2); await page.mouse.down();
    await page.mouse.move(b.x + 170 * sx, b.y + (310 - 6 * 15) * sy, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(150);
    const e = await txt('.qx-eq'); check(e === 'y = x² − 4', `quadratic: drag the vertex to (0, −4) (${e})`); }
  // Tiles drawn with the missing corner.
  check((await page.$$(R + '.qx-tiles rect')).length >= 1, 'quadratic: tiles drawn');
  await page.click(R + '.qx-pre[data-p="1,-5,6"]');
  check((await page.$$(R + '.qx-corner')).length === 1 && (await txt('.qx-tiles')).includes('missing corner 6.25'), 'quadratic: missing corner 6.25');
  // Quiz: answer with the worked answers, one wrong.
  const qs = await page.$$(R + '.sm-q'); check(qs.length === 4, 'quadratic: four quiz questions');
  await page.fill(R + '.sm-q:nth-child(2) .sm-qin', '99999'); await page.click(R + '.sm-q:nth-child(2) .sm-qcheck');
  check((await txt('.sm-q:nth-child(2) .sm-qres')).includes('Not quite'), 'quadratic: wrong answer marked');
  // Read the vertex question's numbers from its worked answer and type them.
  await page.click(R + '.sm-q:nth-child(3) .sm-qshow');
  { const w = await txt('.sm-q:nth-child(3) .sm-qwork'); const m = /Vertex \((\S+), (\S+)\)/.exec(w); await page.fill(R + '.sm-q:nth-child(3) .sm-qin', `${m[1]}, ${m[2]}`.replace(/−/g, '-'));
    await page.click(R + '.sm-q:nth-child(3) .sm-qcheck'); check((await txt('.sm-q:nth-child(3) .sm-qres')) === 'Right!', `quadratic: right vertex answer (${w})`); }
  await page.click(R + '.sm-q:nth-child(1) .sm-qshow');
  { const w = await txt('.sm-q:nth-child(1) .sm-qwork'); const m = /x = (\S+) or x = (\S+)\.$/.exec(w); await page.fill(R + '.sm-q:nth-child(1) .sm-qin', `${m[2]} and ${m[1]}`.replace(/−/g, '-'));
    await page.click(R + '.sm-q:nth-child(1) .sm-qcheck'); check((await txt('.sm-q:nth-child(1) .sm-qres')) === 'Right!', `quadratic: roots in any order (${w})`); }
  check((await txt('.sm-qscore')).includes('2 of 4'), 'quadratic: score');
  const before = await txt('.sm-q:nth-child(1) .sm-qt'); let changed = false;
  for (let i = 0; i < 5 && !changed; i++) { await page.click(R + '.sm-qnew'); changed = (await txt('.sm-q:nth-child(1) .sm-qt')) !== before; }
  check(changed && (await txt('.sm-qscore')) === '', 'quadratic: new questions');
};
