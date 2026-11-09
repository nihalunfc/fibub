// #1166 Quadrilateral explorer
export const path = '/learn/quadrilateral-explorer/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/quadrilateral-explorer/`); await page.waitForSelector('.qx .qx-hA');
  const R = '.qx ';
  const txt = (s) => page.textContent(R + s);
  const fam = async () => (await page.$$eval(R + '.qx-fam span.on', (e) => e.map((x) => x.textContent))).join(',');
  { const f = await txt('.qx-facts'); check((await txt('.qx-name')) === 'Parallelogram' && f.includes('∠A = 56.3°') && f.includes('∠B = 123.7°') && f.includes('Sum = 360°') && f.includes('Area = 18 square units') && f.includes('cut each other in half') && f.includes('AB = 6') && f.includes('BC = √13'), 'quad: parallelogram start'); }
  check((await fam()) === 'Quadrilateral,Trapezium,Parallelogram', `quad: parallelogram families (${await fam()})`);
  // Type C(7, 4) and D(1, 4): rectangle.
  await page.fill(R + '.qx-cx', '7'); await page.fill(R + '.qx-dx', '1'); await page.waitForTimeout(100);
  check((await txt('.qx-name')) === 'Rectangle' && (await txt('.qx-facts')).includes('(equal)') && (await fam()) === 'Quadrilateral,Trapezium,Parallelogram,Rectangle', 'quad: typing makes a rectangle');
  await page.click(R + '.qx-pre button[data-p="square"]'); await page.waitForTimeout(100);
  check((await txt('.qx-name')) === 'Square' && (await fam()) === 'Quadrilateral,Trapezium,Parallelogram,Rectangle,Rhombus,Square,Kite' && (await txt('.qx-facts')).includes('Area = 16'), 'quad: square is in every family');
  await page.click(R + '.qx-pre button[data-p="rhombus"]'); await page.waitForTimeout(100);
  check((await txt('.qx-name')) === 'Rhombus' && (await txt('.qx-facts')).includes('cross at 90°') && (await txt('.qx-facts')).includes('Area = 20'), 'quad: rhombus diagonals at 90°, area 20');
  await page.click(R + '.qx-pre button[data-p="kite"]'); await page.waitForTimeout(100);
  check((await txt('.qx-name')) === 'Kite' && (await txt('.qx-facts')).includes('Area = 14') && (await fam()) === 'Quadrilateral,Kite', 'quad: kite area 14');
  await page.click(R + '.qx-pre button[data-p="dart"]'); await page.waitForTimeout(100);
  check((await txt('.qx-name')) === 'Kite (concave)' && (await txt('.qx-facts')).includes('∠D = 233.1°') && (await txt('.qx-facts')).includes('Sum = 360°'), 'quad: dart has a reflex angle and still sums to 360');
  await page.click(R + '.qx-pre button[data-p="trapezium"]'); await page.waitForTimeout(100);
  check((await txt('.qx-name')) === 'Trapezium' && (await txt('.qx-facts')).includes('Area = 19.5') && (await txt('.qx-facts')).includes('One pair'), 'quad: trapezium area 19.5');
  await page.check(R + '.qx-mid'); await page.waitForTimeout(100);
  check((await page.$$(R + '.qx-mids')).length === 1 && (await txt('.qx-facts')).includes('area 9.75, half of 19.5'), 'quad: midpoint parallelogram has half the area');
  // Drag C of the trapezium (7, 4) over to (0, 0): AB and CD cross? Drag C to (1, 0) beyond: bow tie.
  const fig = page.locator(R + '.qx-fig'); await page.setViewportSize({ width: 1280, height: 1600 }); await fig.scrollIntoViewIfNeeded();
  const at = async (x, y) => { const b = await fig.boundingBox(), k = b.width / 340; return [b.x + (20 + x * 30) * k, b.y + (260 - y * 30) * k]; };
  { const [sx, sy] = await at(2, 4), [ex, ey] = await at(8, 4);   // D(2, 4) to (8, 4): sides BC and DA cross
    await page.mouse.move(sx, sy); await page.mouse.down(); await page.mouse.move(ex, ey, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(150);
    check((await page.inputValue(R + '.qx-dx')) === '8' && (await txt('.qx-name')).startsWith('Not a quadrilateral: two sides cross') && (await fam()) === '', `quad: drag D to make a bow tie (${await txt('.qx-name')})`); }
  { const [sx, sy] = await at(8, 4), [ex, ey] = await at(1, 4);
    await page.mouse.move(sx, sy); await page.mouse.down(); await page.mouse.move(ex, ey, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(150);
    check((await page.inputValue(R + '.qx-dx')) === '1' && (await txt('.qx-name')) === 'Trapezium' && (await txt('.qx-facts')).includes('Area = 21'), `quad: drag D back to (1, 4), area 21 (${await txt('.qx-name')})`); }
  await page.setViewportSize({ width: 1280, height: 720 });
  // Quiz.
  check((await page.$$(R + '.sm-q')).length === 4, 'quad: four questions');
  for (const [i, re] of [[1, /= (\d+)°\.$/], [2, /= (\d+)°\.$/], [3, /= (\d+) cm\.$/], [4, /= (\d+)°\.$/]]) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`); const m = re.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `quad: quiz ${i} (${w})`);
  }
};
