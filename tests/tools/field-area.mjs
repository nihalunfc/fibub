// #1283 Field area by triangles
export const path = '/learn/field-area/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/field-area/`); await page.waitForSelector('.fa .fa-poly');
  const R = '.fa ', txt = (s) => page.textContent(R + s);
  check((await txt('.fa-big')) === 'Area 12750 m²' && (await txt('.fa-sub')).includes('1.275 hectare') && (await txt('.fa-sub')).includes('438.37 m'), 'field: five-sided field 12750 m²');
  check((await page.$$(R + '.fa-t0, ' + R + '.fa-t1, ' + R + '.fa-t2')).length === 3 && (await txt('.fa-out')).includes('= 4500 m²') && (await txt('.fa-out')).includes('= 5400 m²') && (await txt('.fa-out')).includes('= 2850 m²'), 'field: three Heron triangles');
  check((await txt('.fa-out')).includes('Total: 4500 + 5400 + 2850 = 12750 m²'), 'field: triangles add up');
  await page.click(R + '.fa-lvl button[data-l="11"]'); await page.waitForTimeout(100);
  check((await txt('.fa-out')).includes('Shoelace') && (await txt('.fa-out')).includes('= 12750 m², the same answer') && (await txt('.fa-out')).includes('A(10, 10)'), 'field: shoelace check');
  await page.click(R + '.fa-pre[data-p="10,10 150,10 150,60 70,60 70,140 10,140"]'); await page.waitForTimeout(100);
  check((await txt('.fa-big')) === 'Area 11800 m²' && (await txt('.fa-out')).includes('4 triangles'), 'field: L-shaped plot with a dent');
  await page.click(R + '.fa-pre[data-p="20,20 150,20 60,130"]'); await page.waitForTimeout(100);
  check((await txt('.fa-big')) === 'Area 7150 m²' && await page.isDisabled(R + '.fa-del'), 'field: triangle 7150 m²; cannot remove below 3');
  await page.click(R + '.fa-add'); await page.waitForTimeout(100);
  check((await page.$$(R + '.sm-handle, ' + R + '.fa-sel')).length === 4 && (await txt('.fa-big')) === 'Area 7150 m²', 'field: adding a corner on a side keeps the area');
  await page.click(R + '.fa-del'); await page.waitForTimeout(100);
  check((await page.$$(R + '.sm-handle, ' + R + '.fa-sel')).length === 3, 'field: corner removed');
  // Drag C(60, 130) to (100, 100) on a big viewport: area of (20,20),(150,20),(100,100) = 5200.
  const vp = page.viewportSize(); await page.setViewportSize({ width: 1280, height: 1600 });
  const f = page.locator(R + '.fa-fig'); await f.scrollIntoViewIfNeeded(); const b = await f.boundingBox(), k = b.width / 340;
  await page.mouse.move(b.x + (10 + 60 * 2) * k, b.y + (290 - 130 * 2) * k); await page.mouse.down();
  await page.mouse.move(b.x + (10 + 100 * 2) * k, b.y + (290 - 100 * 2) * k, { steps: 6 }); await page.mouse.up();
  await page.setViewportSize(vp);
  check((await txt('.fa-big')) === 'Area 5200 m²', `field: drag a corner (${await txt('.fa-big')})`);
  // A bow-tie: drag (150, 20) up past the opposite side.
  await page.click(R + '.fa-pre[data-p="10,10 150,10 150,60 70,60 70,140 10,140"]'); await page.waitForTimeout(100);
  await page.setViewportSize({ width: 1280, height: 1600 }); await f.scrollIntoViewIfNeeded(); const b2 = await f.boundingBox();
  await page.mouse.move(b2.x + (10 + 10 * 2) * k, b2.y + (290 - 140 * 2) * k); await page.mouse.down();
  await page.mouse.move(b2.x + (10 + 120 * 2) * k, b2.y + (290 - 20 * 2) * k, { steps: 6 }); await page.mouse.up();
  await page.setViewportSize(vp);
  check(await page.isVisible(R + '.fa-err') && (await txt('.fa-big')).startsWith('No area'), 'field: crossing sides reported');
  check((await page.$$(R + '.sm-q')).length === 4, 'field: four questions');
  for (let i = 1; i <= 4; i++) {
    await page.click(`${R}.sm-q:nth-child(${i}) .sm-qshow`);
    const w = await txt(`.sm-q:nth-child(${i}) .sm-qwork`);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, w.match(/\d+(?:\.\d+)?/g).at(-1)); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await txt(`.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `field: quiz ${i} (${w})`);
  }
};
