// #332 Coral cover point count
export const path = '/science/coral-cover-calculator/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.ccv ';
  const big = () => page.textContent(R + '.cc-big'), tab = () => page.textContent(R + '.cc-tab');
  const tapPhoto = async (x, y) => {
    const pt = await page.evaluate(([x, y]) => { const c = document.querySelector('.ccv .cc-photo'); let r = c.getBoundingClientRect(); window.scrollBy(0, r.top + (y / c.height) * r.height - innerHeight / 2); r = c.getBoundingClientRect(); return [r.left + (x / c.width) * r.width, r.top + (y / c.height) * r.height]; }, [x, y]);
    await page.mouse.click(pt[0], pt[1]); await page.waitForTimeout(60);
  };
  const dl = async (sel, f) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + sel)]); await d.saveAs(OUT + f); return readFileSync(OUT + f, 'utf8').trim().split('\n'); };
  await page.goto(BASE + path); await page.waitForTimeout(900);
  check((await big()) === 'Sand: 53.1 % (95 % CI 39.4 to 66.3 %)', `coral: example (${await big()})`);
  check((await tab()).includes('Hard coral1326.516.2 – 40.3') && (await tab()).includes('Soft coral00.00.0 – 7.3') && !(await tab()).includes('Shadow'), 'coral: example cover table');
  check((await page.textContent(R + '.cc-facts')).includes('49') && (await page.textContent(R + '.cc-facts')).includes('1 left out (Shadow or tape)'), 'coral: tape point left out');
  await page.selectOption(R + '.cc-lvl', '0.9'); await page.waitForTimeout(80);
  check((await big()).startsWith('Sand: 53.1 % (90 % CI 41.5 to 64.3 %)'), `coral: 90 % interval (${await big()})`);
  await page.selectOption(R + '.cc-lvl', '0.95');
  await page.fill(R + '.cc-skip', ''); await page.waitForTimeout(500);
  check((await tab()).includes('Shadow or tape1') && (await page.textContent(R + '.cc-facts')).includes('50'), 'coral: nothing left out');
  await page.fill(R + '.cc-skip', 'Shadow or tape'); await page.waitForTimeout(500);
  // Points CSV, then relabel point 1 of photo 2 by tapping it and a category button.
  let pts = await dl('.cc-pcsv', 'points.csv');
  check(pts.length === 51 && pts[0] === 'photo,point,x_px,y_px,category' && pts[1].startsWith('example-quadrat-1,1,') && pts[1].endsWith('Shadow or tape'), 'coral: every point CSV');
  await page.selectOption(R + '.cc-photo-sel', '1'); await page.waitForTimeout(80);
  { const c = pts[27].split(','); await tapPhoto(Number(c[2]), Number(c[3])); }
  check((await page.textContent(R + '.cc-where')).startsWith('Point 2 of 25: Algae'), `coral: tap picks a point (${await page.textContent(R + '.cc-where')})`);
  await page.click(R + '.cc-cats button[data-c="Soft coral"]'); await page.waitForTimeout(80);
  check((await tab()).includes('Soft coral12.0') && (await tab()).includes('Algae612.2'), 'coral: label a point with a button');
  await page.click(R + '.cc-prev'); await page.click(R + '.cc-unl'); await page.waitForTimeout(80);
  check((await page.textContent(R + '.cc-facts')).includes('1 not labelled yet') && (await tab()).includes('Soft coral00.0'), 'coral: clear a label');
  await page.locator(R + '.cc-cats').scrollIntoViewIfNeeded(); await page.keyboard.press('2'); await page.waitForTimeout(80);
  check((await tab()).includes('Soft coral12.0') && (await page.textContent(R + '.cc-facts')).includes('0 not labelled yet'), 'coral: number key labels the point');
  // Categories: add one.
  await page.fill(R + '.cc-catlist', ['Hard coral', 'Soft coral', 'Algae', 'Sand', 'Rubble', 'Shadow or tape', 'Sponge'].join('\n')); await page.waitForTimeout(500);
  check(await page.isVisible(R + '.cc-cats button[data-c="Sponge"]') && (await tab()).includes('Sponge00.0'), 'coral: new category');
  { const r = await dl('.cc-csv', 'cover.csv'); check(r.length === 7 && r[0].startsWith('category,points,cover_percent,ci95_low,ci95_high,photo_1_example-quadrat-1_percent') && r[1].startsWith('Hard coral,13,26.531'), 'coral: cover CSV'); }
  // Two new photos with a 2 × 3 grid.
  await page.selectOption(R + '.cc-mode', 'grid'); await page.fill(R + '.cc-rows', '0');
  const mk = async (f, col) => { const b64 = await page.evaluate((col) => { const c = document.createElement('canvas'); c.width = 600; c.height = 400; const x = c.getContext('2d'); x.fillStyle = col; x.fillRect(0, 0, 600, 400); return c.toDataURL('image/png').split(',')[1]; }, col); writeFileSync(OUT + f, Buffer.from(b64, 'base64')); };
  await mk('q1.png', '#c08070'); await mk('q2.png', '#d8c8a0');
  await page.setInputFiles(R + '.cc-file', [OUT + 'q1.png', OUT + 'q2.png']); await page.waitForTimeout(800);
  check((await page.textContent(R + '.cc-err')).includes('rows and columns') && (await page.$$eval(R + '.cc-photo-sel option', (o) => o.length)) === 2, 'coral: bad layout message, no photo added');
  await page.fill(R + '.cc-rows', '2'); await page.fill(R + '.cc-cols', '3');
  await page.setInputFiles(R + '.cc-file', [OUT + 'q1.png', OUT + 'q2.png']); await page.waitForTimeout(800);
  check((await page.$$eval(R + '.cc-photo-sel option', (o) => o.map((x) => x.textContent))).join('|').endsWith('3. q1 (0 of 6)|4. q2 (0 of 6)'), 'coral: two photos added with 6 grid points');
  await page.click(R + '.cc-where');
  for (let i = 0; i < 6; i++) await page.keyboard.press('4');
  await page.selectOption(R + '.cc-photo-sel', '2'); await page.waitForTimeout(80);
  await page.click(R + '.cc-where');
  for (let i = 0; i < 6; i++) await page.keyboard.press('1');
  check((await tab()).includes('Hard coral1931.1') && (await tab()).includes('Sand3252.5'), `coral: four photos pooled (${(await tab()).slice(0, 120)})`);
  check((await page.textContent(R + '.cc-ptab')).includes('3. q16100.0'), 'coral: per-photo table');
  await page.click(R + '.cc-del'); await page.waitForTimeout(80);
  check((await page.$$eval(R + '.cc-photo-sel option', (o) => o.length)) === 3 && (await tab()).includes('Hard coral1323.6'), 'coral: remove a photo');
  await page.click(R + '.cc-replace'); await page.waitForTimeout(80);
  check((await page.textContent(R + '.cc-where')).startsWith('Point 1 of 6: not labelled'), 'coral: place points again clears that photo');
};
