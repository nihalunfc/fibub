// #404 Artefact measurement scale tool
export const path = '/science/artefact-scale-tool/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/artefact-scale-tool/`); await page.waitForTimeout(600);
  check(await page.isHidden('.asc .as-work'), 'artscale: waits for a photo');
  await page.click('.asc .as-ex'); await page.waitForTimeout(300);
  const tab = () => page.textContent('.asc .as-tab');
  { const t = await tab(); check(t.includes('L162.5 mm0.3') && t.includes('A141.7°') && t.includes('P1822 mm²6') && t.includes('perimeter 135.1 mm'), `artscale: example measurements (${t})`); }
  check((await page.textContent('.asc .as-facts')).includes('8 px per mm') && (await page.textContent('.asc .as-persp')).includes('agree to within 0.0 % (90° apart)'), 'artscale: scale and perspective check');
  // Tap on the canvas in image pixels.
  const tap = async (x, y) => { const cv = page.locator('.asc .as-cv'); await cv.scrollIntoViewIfNeeded(); const b = await cv.boundingBox(); const W = await page.evaluate(() => document.querySelector('.asc .as-cv').width); await page.mouse.click(b.x + (x * b.width) / W, b.y + (y * b.width) / W); };
  await page.click('.asc [data-m=length]'); await tap(100, 100); await tap(500, 100); await page.waitForTimeout(150);
  { const t = await tab(); check(/L2(49\.\d|50\.\d) mm/.test(t), `artscale: tapped length about 50 mm (${t.match(/L2[^m]*mm/)})`); }
  await page.click('.asc [data-m=angle]'); await tap(900, 100); await tap(800, 100); await tap(800, 200); await page.waitForTimeout(150);
  check(/A2(89\.\d|90\.\d)°/.test(await tab()), 'artscale: tapped right angle');
  await page.click('.asc [data-m=area]'); await tap(800, 300); await tap(1000, 300); await tap(1000, 460); await page.click('.asc .as-finish'); await page.waitForTimeout(150);
  check(/P2(24\d|25\d) mm²/.test(await tab()), 'artscale: tapped triangle 250 mm² (200 × 160 px / 2 at 8 px/mm)');
  await page.click('.asc .as-undo'); await page.waitForTimeout(100);
  check(!(await tab()).includes('P2'), 'artscale: undo');
  await page.locator('.asc .as-tab button').first().click(); await page.waitForTimeout(100);
  check(!(await tab()).includes('L162.5'), 'artscale: delete a row');
  await page.fill('.asc .as-len2', '30'); await page.waitForTimeout(150);
  check((await page.textContent('.asc .as-persp')).includes('disagree by 18.2 %') && await page.$eval('.asc .as-persp', (e) => e.classList.contains('warn')), 'artscale: perspective warning');
  await page.fill('.asc .as-len', '5'); await page.selectOption('.asc .as-unit', '10'); await page.waitForTimeout(150);
  check((await page.textContent('.asc .as-facts')).includes('8 px per mm'), 'artscale: scale in cm');
  await page.fill('.asc .as-r', '3'); await page.waitForTimeout(150);
  { const t = await tab(); check(/L2(49\.\d|50\.\d) mm0\.[78]/.test(t), 'artscale: click accuracy changes the ±'); }
  { await page.locator('.asc .as-csv').scrollIntoViewIfNeeded(); const [d] = await Promise.all([page.waitForEvent('download'), page.click('.asc .as-csv')]); const f = OUT + 'artscale.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('label,kind,value,unit,plus_minus') && t.includes('A1,angle,41.709,degrees') && t.includes('scale_px_per_mm,8,scale_bar_mm,50'), 'artscale: CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.asc .as-png')]); const f = OUT + 'artscale.png'; await d.saveAs(f); const b = readFileSync(f); check(b.subarray(1, 4).toString() === 'PNG' && b.readUInt32BE(16) === 1200 && b.readUInt32BE(20) === 800, 'artscale: annotated PNG at photo size'); }
  await page.click('.asc .as-clear'); await page.waitForTimeout(100);
  check(await page.isHidden('.asc .as-res'), 'artscale: clear measurements');
  // A real file: a 1000 × 600 PNG with a 300 px bar; measure before the scale is set.
  { const b64 = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 1000; c.height = 600; const x = c.getContext('2d'); x.fillStyle = '#eee'; x.fillRect(0, 0, 1000, 600); x.fillStyle = '#000'; x.fillRect(100, 500, 300, 10); return c.toDataURL('image/png').split(',')[1]; }); writeFileSync(OUT + 'artscale-photo.png', Buffer.from(b64, 'base64')); }
  await page.setInputFiles('.asc .as-file', OUT + 'artscale-photo.png'); await page.waitForTimeout(500);
  check((await page.textContent('.asc .as-facts')).includes('not set') && (await page.getAttribute('.asc [data-m=scale]', 'aria-pressed')) === 'true', 'artscale: opened photo, scale mode');
  await page.click('.asc [data-m=length]'); await tap(10, 10);
  check((await page.textContent('.asc .as-hint')).startsWith('Set the scale first'), 'artscale: asks for the scale first');
  await page.click('.asc [data-m=scale]'); await page.fill('.asc .as-len', '30'); await page.selectOption('.asc .as-unit', '1'); await tap(100, 505); await tap(400, 505); await page.waitForTimeout(150);
  check(/(9\.9\d*|10\.0\d*|10) px per mm/.test(await page.textContent('.asc .as-facts')) && (await page.getAttribute('.asc [data-m=length]', 'aria-pressed')) === 'true', 'artscale: scale set by taps, then length mode');
  writeFileSync(OUT + 'artscale-bad.txt', 'not a photo');
  await page.setInputFiles('.asc .as-file', OUT + 'artscale-bad.txt'); await page.waitForTimeout(200);
  check((await page.textContent('.asc .as-err')).includes('not a photo'), 'artscale: not-a-photo message');
};
