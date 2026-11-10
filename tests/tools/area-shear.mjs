// #1251 Shear and area
export const path = '/learn/area-shear/';
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/learn/area-shear/`); await page.waitForSelector('.sh .sh-hd');
  const R = '.sh ', txt = (s) => page.textContent(R + s);
  check((await txt('.sh-big')) === 'Area = 24 square units' && (await txt('.sh-f')) === 'Area = base × height = 6 × 4 = 24' && (await txt('.sh-note')).includes('Perimeter now 20.94'), 'shear: start 6 × 4 = 24');
  await page.fill(R + '.sh-s', '6'); await page.waitForTimeout(60);
  check((await txt('.sh-big')) === 'Area = 24 square units' && (await txt('.sh-note')).includes('Perimeter now 26.42'), 'shear: slide to 6 keeps the area, perimeter grows');
  await page.fill(R + '.sh-s', '2');
  await page.locator(R + '.sh-t').fill('1'); await page.waitForTimeout(60);
  check((await page.$$(R + '.sh-fig .sh-pc')).length === 1 && (await txt('.sh-note')).includes('now a 6 × 4 rectangle'), 'shear: cut and slide makes a rectangle');
  await page.fill(R + '.sh-s', '8'); await page.waitForTimeout(60);
  check((await txt('.sh-note')).includes("one cut can't"), 'shear: too far for one cut');
  await page.locator(R + '.sh-t').fill('0'); await page.fill(R + '.sh-s', '2');
  // Drag the corner sideways: area stays 24, s changes.
  await page.setViewportSize({ width: 1280, height: 1400 }); await page.locator(R + '.sh-fig').scrollIntoViewIfNeeded();
  { const h = await page.locator(R + '.sh-hd').boundingBox();
    await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2); await page.mouse.down(); await page.mouse.move(h.x + h.width / 2 + 90, h.y + h.height / 2, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(100);
    const s = Number(await page.inputValue(R + '.sh-s'));
    check(s > 3 && (await txt('.sh-big')) === 'Area = 24 square units', `shear: drag moves the top (s ${s}), area 24`); }
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.click(R + '.sh-shape [data-s=tri]');
  check((await txt('.sh-big')) === 'Area = 12 square units' && await page.isHidden(R + '.sh-cut') && await page.isVisible(R + '.sh-copyl'), 'shear: triangle ½ × 6 × 4 = 12');
  await page.check(R + '.sh-copy');
  check((await page.$$(R + '.sh-fig .sh-cp')).length === 1 && (await txt('.sh-note')).includes('area 24. The triangle is half: 12'), 'shear: triangle turned copy');
  await page.click(R + '.sh-shape [data-s=trap]');
  check((await txt('.sh-big')) === 'Area = 18 square units' && (await txt('.sh-note')).includes('a + b = 9') && await page.isVisible(R + '.sh-arow'), 'shear: trapezium 18 with copy');
  await page.fill(R + '.sh-a', '5'); await page.fill(R + '.sh-h', '3'); await page.waitForTimeout(60);
  check((await txt('.sh-f')) === 'Area = ½ × (a + b) × h = ½ × (5 + 6) × 3 = 16.5', 'shear: trapezium formula live');
  for (let i = 1; i <= 4; i++) {
    const w = await page.textContent(`${R}.sm-q:nth-child(${i}) .sm-qwork`);
    const m = /= ([\d.]+) (cm²|m²|cm)\./.exec(w);
    await page.fill(`${R}.sm-q:nth-child(${i}) .sm-qin`, m ? m[1] : 'x'); await page.click(`${R}.sm-q:nth-child(${i}) .sm-qcheck`);
    check((await page.textContent(`${R}.sm-q:nth-child(${i}) .sm-qres`)) === 'Right!', `shear: quiz ${i} (${w})`);
  }
};
