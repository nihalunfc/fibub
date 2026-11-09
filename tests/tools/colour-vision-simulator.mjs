// #497 Colour vision simulator: sample, types, severity, layouts, hover colours, PNG, open image, bad input.
export const path = '/science/colour-vision-simulator/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/colour-vision-simulator/`); await page.waitForTimeout(800);
  const R = '.cvs ', txt = (s) => page.textContent(R + s);
  check((await txt('.cvs-med')).includes('For study and teaching, not medical advice.'), 'cvd sim: medical note at the top');
  check((await txt('.cvs-name')) === 'Deuteranopia' && (await page.$$(R + '.cvs-grid canvas')).length === 2 && (await txt('.cvs-grid')).includes('Original'), 'cvd sim: sample, deuteranopia side by side');
  // A simulated pixel: the red bar (sample's chart) becomes olive #85850a.
  const pix = (i, x, y) => page.evaluate(([i, x, y]) => [...document.querySelectorAll('.cvs-grid canvas')[i].getContext('2d').getImageData(x, y, 1, 1).data].slice(0, 3), [i, x, y]);
  check((await pix(0, 420, 400)).join() === '214,39,40' && (await pix(1, 420, 400)).join() === '133,133,10' && (await pix(1, 466, 400)).join() === '135,135,52', 'cvd sim: red and green bars both turn olive (#85850a, #878734)');
  { const c = page.locator(R + '.cvs-grid canvas').nth(1); await c.scrollIntoViewIfNeeded(); const bb = await c.boundingBox(); await page.mouse.move(bb.x + bb.width * 422 / 900, bb.y + bb.height * 400 / 560); await page.waitForTimeout(100);
    check((await txt('.cvs-px')) === '#d62728 looks like #85850a with deuteranopia', `cvd sim: hover readout (${await txt('.cvs-px')})`); }
  await page.selectOption(R + '.cvs-kind', 'protan'); await page.waitForTimeout(200);
  check((await txt('.cvs-name')) === 'Protanopia' && (await pix(1, 420, 400)).join() === '102,102,37', 'cvd sim: protanopia');
  await page.selectOption(R + '.cvs-kind', 'tritan'); await page.waitForTimeout(200);
  check((await txt('.cvs-name')) === 'Tritanopia' && (await pix(1, 466, 400)).join() === '73,151,151', 'cvd sim: tritanopia');
  await page.selectOption(R + '.cvs-kind', 'achromat'); await page.waitForTimeout(200);
  { const p = await pix(1, 420, 400); check((await txt('.cvs-name')) === 'Achromatopsia (no colour)' && p[0] === p[1] && p[1] === p[2], 'cvd sim: achromatopsia is grey'); }
  await page.selectOption(R + '.cvs-kind', 'deutan');
  await page.fill(R + '.cvs-sev', '50'); await page.dispatchEvent(R + '.cvs-sev', 'input'); await page.waitForTimeout(400);
  check((await txt('.cvs-name')) === 'Deuteranomaly, 50 %' && (await txt('.cvs-sv')) === '50 %' && (await pix(1, 420, 400)).join() === '180,100,29', 'cvd sim: deuteranomaly at 50 %');
  check((await txt('.cvs-mat')).includes('0.6653'), 'cvd sim: matrix shown');
  await page.fill(R + '.cvs-sev', '100'); await page.dispatchEvent(R + '.cvs-sev', 'input'); await page.waitForTimeout(400);
  await page.click(R + '.cvs-view [data-v=sim]'); await page.waitForTimeout(200);
  check((await page.$$(R + '.cvs-grid canvas')).length === 1, 'cvd sim: simulated only');
  await page.click(R + '.cvs-view [data-v=all]'); await page.waitForTimeout(300);
  { const t = await txt('.cvs-grid'); check((await page.$$(R + '.cvs-grid canvas')).length === 4 && t.includes('Protanopia') && t.includes('Tritanopia') && t.includes('Achromatopsia'), 'cvd sim: all four types'); }
  await page.click(R + '.cvs-view [data-v=side]'); await page.waitForTimeout(200);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.cvs-png')]); const f = OUT + 'cvd.png'; await d.saveAs(f); const b = readFileSync(f); check(d.suggestedFilename() === 'sample-deuteranopia.png' && b[1] === 0x50 && b.readUInt32BE(16) === 900, 'cvd sim: PNG download at full size'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.cvs .dl [data-f=pdf]')]); check(/\.pdf$/.test(d.suggestedFilename()), 'cvd sim: PDF report'); }
  // Open an image: pure red and green halves.
  { const b64 = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 3000; c.height = 1000; const x = c.getContext('2d'); x.fillStyle = '#ff0000'; x.fillRect(0, 0, 1500, 1000); x.fillStyle = '#00ff00'; x.fillRect(1500, 0, 1500, 1000); return c.toDataURL('image/png').split(',')[1]; }); writeFileSync(OUT + 'rg.png', Buffer.from(b64, 'base64')); }
  await page.setInputFiles(R + '.cvs-in', OUT + 'rg.png'); await page.waitForTimeout(800);
  check((await txt('.cvs-size')).includes('Scaled to 2000 × 667') && (await pix(1, 10, 10)).join() === '156,156,0' && (await pix(1, 1990, 10)).join() === '214,214,46', 'cvd sim: opened image scaled, red and green match NumPy');
  await page.setInputFiles(R + '.cvs-in', { name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') }); await page.waitForTimeout(200);
  check((await txt('.cvs-err')).includes('not an image'), 'cvd sim: not an image message');
  await page.setInputFiles(R + '.cvs-in', { name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('not really a png') }); await page.waitForTimeout(300);
  check((await txt('.cvs-err')).includes('could not be opened'), 'cvd sim: broken image message');
  await page.click(R + '.cvs-sample'); await page.waitForTimeout(300);
  check(await page.isHidden(R + '.cvs-err') && (await txt('.cvs-src')).includes('sample'), 'cvd sim: sample again');
};
