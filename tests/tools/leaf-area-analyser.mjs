// #323 Leaf area and canopy cover
export const path = '/science/leaf-area-analyser/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.laa ';
  const big = () => page.textContent(R + '.la-big');
  const tapPhoto = async (x, y) => { // x, y in photo pixels; scroll that point to the middle of the screen, clear of the header and tab bar
    const pt = await page.evaluate(([x, y]) => { const c = document.querySelector('.laa .la-photo'); let r = c.getBoundingClientRect(); window.scrollBy(0, r.top + (y / c.height) * r.height - innerHeight / 2); r = c.getBoundingClientRect(); return [r.left + (x / c.width) * r.width, r.top + (y / c.height) * r.height]; }, [x, y]);
    await page.mouse.click(pt[0], pt[1]);
  };
  const upload = async (file, draw, w, h) => {
    const b64 = await page.evaluate(([src, w, h]) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); new Function('x', src)(x); return c.toDataURL('image/png').split(',')[1]; }, [draw, w, h]);
    writeFileSync(OUT + file, Buffer.from(b64, 'base64'));
    await page.setInputFiles(R + '.la-file', OUT + file); await page.waitForTimeout(700);
  };
  await page.goto(BASE + path); await page.waitForTimeout(800);
  check((await big()) === 'Leaf area: 7.195 cm² (3 leaves)', `leaf area: example scan (${await big()})`);
  { const t = await page.textContent(R + '.la-tab'); check(t.includes('1.728') && t.includes('3.206') && t.includes('2.261'), 'leaf area: example leaf table'); }
  check((await page.textContent(R + '.la-facts')).includes('100 px per cm') && (await page.textContent(R + '.la-facts')).includes('56'), 'leaf area: scale and Otsu threshold shown');
  await page.check(R + '.la-fill'); await page.waitForTimeout(150);
  check((await big()) === 'Leaf area: 7.288 cm² (3 leaves)', 'leaf area: fill holes');
  await page.uncheck(R + '.la-fill');
  await page.fill(R + '.la-len', '10'); await page.selectOption(R + '.la-unit', 'mm'); await page.waitForTimeout(400);
  check((await big()) === 'Leaf area: 719.5 mm² (3 leaves)', 'leaf area: square in mm');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.la-csv')]); const f = OUT + 'leaf.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 5 && rows[0].startsWith('leaf,area_mm2') && rows[4].startsWith('total,719.46'), 'leaf area: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=png]')]); check((await d.suggestedFilename()) === 'example-leaves-leaf-area.png', 'leaf area: PNG report'); }
  await page.fill(R + '.la-len', '1'); await page.selectOption(R + '.la-unit', 'cm');
  await page.fill(R + '.la-t', '300'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.la-err')).includes('0 to 255') && await page.isHidden(R + '.la-out'), 'leaf area: bad threshold message');
  await page.fill(R + '.la-t', '120'); await page.waitForTimeout(400);
  { const b = await big(); const v = parseFloat(b.split(': ')[1]); check(Math.abs(v / 7.1946 - 1) < 0.02, `leaf area: typed threshold 120 (${b})`); }
  await page.fill(R + '.la-t', '');
  await page.fill(R + '.la-min', '20000'); await page.waitForTimeout(400);
  check((await big()) === 'Leaf area: 5.467 cm² (2 leaves)', 'leaf area: specks limit drops the small leaf');
  await page.fill(R + '.la-min', '50'); await page.waitForTimeout(400);
  // Scale line drawn along the top of the 1 cm square (100 px).
  await page.selectOption(R + '.la-scale', 'line'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.la-err')).includes('Draw the scale line'), 'leaf area: asks for a scale line');
  await page.click(R + '.la-tap'); await tapPhoto(40, 30); await tapPhoto(140, 30); await page.waitForTimeout(200);
  { const b = await big(); const v = parseFloat(b.split(': ')[1]); check(b.endsWith('(4 leaves)') && Math.abs(v / 8.1946 - 1) < 0.03, `leaf area: scale line, the square now counts as a leaf (${b})`); }
  // Back to the square; a tap on the background is refused.
  await page.selectOption(R + '.la-scale', 'square'); await page.click(R + '.la-tap'); await tapPhoto(300, 20); await page.waitForTimeout(200);
  check((await page.textContent(R + '.la-err')).includes('landed on the background'), `leaf area: tap on background message (${await page.textContent(R + '.la-err')})`);
  // A dark-background photo: a white 2 cm square (80 × 80 px), a green 200 × 120 px rectangle and a 100 × 50 px one.
  await page.selectOption(R + '.la-bg', 'dark'); await page.fill(R + '.la-len', '2');
  await upload('dark.png', "x.fillStyle='#000';x.fillRect(0,0,900,600);x.fillStyle='#fff';x.fillRect(50,50,80,80);x.fillStyle='#3a9a30';x.fillRect(300,100,200,120);x.fillRect(300,400,100,50);", 900, 600);
  check((await page.textContent(R + '.la-tap')).includes('Tap inside the square'), 'leaf area: opening a photo asks for the square');
  await tapPhoto(90, 90); await page.waitForTimeout(300);
  check((await big()) === 'Leaf area: 18.13 cm² (2 leaves)', `leaf area: dark background photo, 2 cm square (${await big()})`);
  // Canopy cover
  await page.locator(R + '.la-mode').scrollIntoViewIfNeeded(); await page.click(R + '.la-mode button[data-m=canopy]'); await page.waitForTimeout(500);
  check((await big()) === 'Canopy cover: 27.0 %' && (await page.textContent(R + '.la-facts')).includes('0.106'), `canopy: example (${await big()})`);
  await page.fill(R + '.la-t', '5'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.la-err')).includes('−1 to 2'), 'canopy: bad threshold message');
  await page.fill(R + '.la-t', '0.5'); await page.waitForTimeout(400);
  { const v = parseFloat((await big()).split(': ')[1]); check(v < 27 && v > 1, 'canopy: typed threshold 0.5 counts only strong green'); }
  await page.fill(R + '.la-t', '');
  await upload('crop.png', "x.fillStyle='rgb(130,100,70)';x.fillRect(0,0,400,300);x.fillStyle='rgb(70,150,50)';x.fillRect(0,0,400,105);x.fillRect(0,195,400,15);", 400, 300);
  check((await big()) === 'Canopy cover: 40.0 %', `canopy: photo with 40 % green (${await big()})`);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.la-csv')]); const f = OUT + 'canopy.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 2 && rows[1].startsWith('crop,40.000,48000,120000'), 'canopy: CSV'); }
};
