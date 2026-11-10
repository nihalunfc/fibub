// #1284 Field area by triangles
export const path = '/learn/field-area/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/field-area/`); await page.waitForSelector('.fa .fa-fig .sm-handle');
  const R = '.fa ', txt = (s) => page.textContent(R + s);
  check((await txt('.fa-big')) === 'Area 569 m² = 0.0569 hectare' && (await page.locator(R + '.fa-fig .fa-tri').count()) === 3, 'field: five-sided field 569 m², 3 triangles');
  check((await txt('.fa-steps')).includes('area = √[s(s − a)(s − b)(s − c)]') && (await txt('.fa-steps')).includes('Total = T1 + T2 + T3 = 569 m²'), 'field: Heron steps add up');
  await page.selectOption(R + '.fa-pre', 'L');
  check((await txt('.fa-big')) === 'Area 408 m² = 0.0408 hectare' && (await page.locator(R + '.fa-fig .fa-tri').count()) === 4 && (await txt('.fa-check')).includes('Perimeter (fencing) 104 m'), 'field: L-shape 408 m², perimeter 104');
  check((await txt('.fa-steps')).includes('Total = T1 + T2 + T3 + T4 = 408 m²'), 'field: L-shape triangles add up');
  await page.click(R + '.fa-lvl button[data-l="10"]');
  check((await txt('.fa-steps')).includes('½|') && (await txt('.fa-steps')).includes('= 408 m²'), 'field: Class 10 coordinate formula');
  await page.selectOption(R + '.fa-pre', 'trap'); check((await txt('.fa-big')).startsWith('Area 400 m²'), 'field: trapezium 400');
  await page.click(R + '.fa-add'); check((await page.locator(R + '.fa-fig .sm-handle').count()) === 5 && (await txt('.fa-big')).startsWith('Area 400 m²') && (await page.locator(R + '.fa-fig .fa-tri').count()) === 3, 'field: added corner on a side keeps the area');
  await page.selectOption(R + '.fa-pre', 'L'); await page.selectOption(R + '.fa-pre', 'trap'); await page.click(R + '.fa-del'); check((await page.locator(R + '.fa-fig .sm-handle').count()) === 3 && (await txt('.fa-check')).includes('3 corners, so 1 triangle.') && (await txt('.fa-big')).startsWith('Area 256 m²'), 'field: remove a corner');
  await page.click(R + '.fa-del'); check((await page.locator(R + '.fa-fig .sm-handle').count()) === 3, 'field: at least 3 corners stay');
  // Drag a corner of the four-sided field across to make the sides cross.
  await page.selectOption(R + '.fa-pre', 'quad');
  await page.setViewportSize({ width: 1280, height: 1400 });
  const fig = page.locator(R + '.fa-fig'); await fig.scrollIntoViewIfNeeded();
  const f = await fig.boundingBox(), sc = f.width / 340, at = (x, y) => [f.x + (10 + 8 * x) * sc, f.y + (250 - 8 * y) * sc];
  { const [x0, y0] = at(5, 6), [x1, y1] = at(36, 12);
    await page.mouse.move(x0, y0); await page.mouse.down(); await page.mouse.move(x1, y1, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(80);
    check(await page.isVisible(R + '.fa-err') && (await txt('.fa-big')) === '' && (await page.locator(R + '.fa-fig .fa-bad').count()) === 1, 'field: crossing sides warning');
    await page.mouse.move(x1, y1); await page.mouse.down(); await page.mouse.move(...at(3, 3), { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(80);
    check(await page.isHidden(R + '.fa-err') && (await txt('.fa-fig')).includes('A(3, 3)'), `field: dragged back, snapped to A(3, 3)`); }
  await page.setViewportSize({ width: 1280, height: 720 });
  check((await page.$$(R + '.sm-q')).length === 4, 'field: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`), m = /([\d.]+) m²\.$/.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `field: quiz ${i} (${w})`);
  }
};
