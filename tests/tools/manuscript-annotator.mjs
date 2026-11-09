// #416 Manuscript image annotator
export const path = '/science/manuscript-annotator/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/manuscript-annotator/`); await page.waitForTimeout(500);
  await page.click('.man .mn-ex'); await page.waitForSelector('.man .mn-list li', { timeout: 10000 });
  check((await page.textContent('.man .mn-count')) === '3 regions on this image, 3 in all.' && (await page.$$('.man .mn-svg .rg')).length === 3, 'annotator: example page with 3 regions');
  check((await page.inputValue('.man .mn-list li:first-child .mn-tr')) === 'Accompt of the Mill at Ashford' && (await page.textContent('.man .mn-list li:nth-child(3) b')).startsWith('3. Polygon, 5 points'), 'annotator: example transcriptions and shapes');
  // Draw a rectangle by dragging, then a polygon by taps.
  const svg = page.locator('.man .mn-svg'); await svg.scrollIntoViewIfNeeded();
  let bb = await svg.boundingBox(); const X = (x) => bb.x + (x / 900) * bb.width, Y = (y) => bb.y + (y / 1200) * bb.height;
  await page.mouse.move(X(100), Y(300)); await page.mouse.down(); await page.mouse.move(X(400), Y(340), { steps: 4 }); await page.mouse.up(); await page.waitForTimeout(150);
  check((await page.textContent('.man .mn-count')).startsWith('4 regions') && (await page.textContent('.man .mn-list li:nth-child(4) b')).includes('Rectangle, 300 × 40 px at 100, 300'), 'annotator: drag draws a rectangle');
  await page.fill('.man .mn-list li:nth-child(4) .mn-tr', 'Item rec. of the widow Pratt'); await page.fill('.man .mn-list li:nth-child(4) .mn-note', 'checked "twice", ok');
  await page.click('.man .mn-poly'); await svg.scrollIntoViewIfNeeded(); bb = await svg.boundingBox();
  for (const [x, y] of [[200, 380], [300, 380], [300, 460]]) { await page.mouse.click(X(x), Y(y)); await page.waitForTimeout(50); }
  check((await page.textContent('.man .mn-hint')).startsWith('3 points') && await page.isVisible('.man .mn-finish'), `annotator: polygon points placed (${await page.textContent('.man .mn-hint')} | ${await page.textContent('.man .mn-count')})`);
  await page.click('.man .mn-undo'); await page.waitForTimeout(50);
  check((await page.textContent('.man .mn-hint')).startsWith('2 points'), 'annotator: undo point');
  await svg.scrollIntoViewIfNeeded(); bb = await svg.boundingBox();
  await page.mouse.click(X(250), Y(470)); await page.mouse.click(X(201), Y(381)); await page.waitForTimeout(100);
  check((await page.textContent('.man .mn-count')).startsWith('5 regions') && (await page.textContent('.man .mn-list li:nth-child(5) b')).startsWith('5. Polygon, 3 points'), 'annotator: tapping the first point closes the polygon');
  await svg.scrollIntoViewIfNeeded(); bb = await svg.boundingBox();
  await page.mouse.click(X(500), Y(400)); await page.keyboard.press('Escape'); await page.waitForTimeout(50);
  check((await page.textContent('.man .mn-hint')).startsWith('Tap the image'), 'annotator: Esc cancels a polygon');
  await page.click('.man .mn-list li:nth-child(2) b'); await page.waitForTimeout(50);
  check((await page.$$('.man .mn-svg .rg.on')).length === 1 && await page.$eval('.man .mn-list li:nth-child(2)', (e) => e.classList.contains('on')), 'annotator: tap a region title to highlight it');
  await page.selectOption('.man .mn-zoom', '2'); await page.waitForTimeout(100);
  check(await page.$eval('.man .mn-stage', (e) => e.scrollWidth > e.clientWidth * 1.8), 'annotator: zoom 200 %');
  await page.selectOption('.man .mn-zoom', '1');
  // Export JSON and CSV.
  let json;
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.man .mn-json')]); const f = OUT + 'anno.json'; await d.saveAs(f); json = JSON.parse(readFileSync(f, 'utf8'));
    check(json.type === 'AnnotationPage' && json.items.length === 5 && json.items[3].target.selector.value === 'xywh=100,300,300,40' && json.items[3].body[1].value === 'checked "twice", ok' && json.items[4].target.selector.type === 'SvgSelector', 'annotator: Web Annotation JSON export'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.man .mn-csv')]); const f = OUT + 'anno.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8'); check(t.startsWith('id,image,canvas,shape,x,y,width,height,points,transcription,note\nanno-1,example-page.png,,rect,120,110,660,70,') && t.includes('"checked ""twice"", ok"') && t.trim().split('\n').length === 6, 'annotator: CSV export'); }
  // Delete one, then re-open the export: ids that clash are renamed.
  await page.click('.man .mn-list li:nth-child(5) .mn-del'); await page.waitForTimeout(50);
  check((await page.textContent('.man .mn-count')).startsWith('4 regions'), 'annotator: delete a region');
  await page.setInputFiles('.man .mn-afile', OUT + 'anno.json'); await page.waitForTimeout(200);
  check((await page.textContent('.man .mn-count')).startsWith('9 regions') && (await page.textContent('.man .mn-info')).startsWith('Opened 5 regions from anno.json'), 'annotator: re-open exported annotations');
  writeFileSync(OUT + 'bad.json', '{"type":"AnnotationPage","items":[]}');
  await page.setInputFiles('.man .mn-afile', OUT + 'bad.json'); await page.waitForTimeout(100);
  check((await page.textContent('.man .mn-err')).startsWith('No regions could be read'), 'annotator: empty annotation file message');
  writeFileSync(OUT + 'notjson.json', 'hello');
  await page.setInputFiles('.man .mn-afile', OUT + 'notjson.json'); await page.waitForTimeout(100);
  check((await page.textContent('.man .mn-err')) === 'That file is not valid JSON.', 'annotator: bad JSON message');
  // A second image and a IIIF manifest: matched by file name, coordinates scaled to the canvas.
  const b64 = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 400; c.height = 600; const x = c.getContext('2d'); x.fillStyle = '#ddd'; x.fillRect(0, 0, 400, 600); return c.toDataURL('image/png').split(',')[1]; });
  writeFileSync(OUT + 'f1v.png', Buffer.from(b64, 'base64'));
  await page.setInputFiles('.man .mn-file', OUT + 'f1v.png'); await page.waitForTimeout(400);
  check((await page.textContent('.man .mn-img')).includes('f1v.png (400 × 600)') && (await page.textContent('.man .mn-count')).startsWith('0 regions on this image'), 'annotator: second image opened');
  writeFileSync(OUT + 'manifest.json', JSON.stringify({ '@context': 'http://iiif.io/api/presentation/3/context.json', id: 'https://example.org/m', type: 'Manifest', label: { en: ['Test book'] }, items: [
    { id: 'https://example.org/c1', type: 'Canvas', label: { none: ['f. 1r'] }, width: 1800, height: 2400, items: [{ type: 'AnnotationPage', items: [{ type: 'Annotation', body: { id: 'https://example.org/f1r.jpg' } }] }] },
    { id: 'https://example.org/c2', type: 'Canvas', label: { none: ['f. 1v'] }, width: 800, height: 1200, items: [{ type: 'AnnotationPage', items: [{ type: 'Annotation', body: { id: 'https://example.org/f1v.jpg' } }] }] }] }));
  await page.setInputFiles('.man .mn-mfile', OUT + 'manifest.json'); await page.waitForTimeout(200);
  check((await page.$eval('.man .mn-cv', (s) => s.options[s.selectedIndex].text)) === 'f. 1v (800 × 1200)' && (await page.textContent('.man .mn-info')).includes('Manifest "Test book": 2 canvases'), 'annotator: manifest canvas matched by file name');
  await page.click('.man .mn-rect'); const svg2 = page.locator('.man .mn-svg'); await svg2.scrollIntoViewIfNeeded(); bb = await svg2.boundingBox();
  await page.mouse.move(bb.x + bb.width * 0.25, bb.y + bb.height * 0.25); await page.mouse.down(); await page.mouse.move(bb.x + bb.width * 0.5, bb.y + bb.height * 0.5, { steps: 3 }); await page.mouse.up(); await page.waitForTimeout(100);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.man .mn-json')]); const f = OUT + 'anno2.json'; await d.saveAs(f); const j = JSON.parse(readFileSync(f, 'utf8')); const a = j.items.at(-1);
    check(a.target.source === 'https://example.org/c2' && a.target.selector.value === 'xywh=200,300,200,300', `annotator: canvas target in canvas pixels (${a.target.selector.value})`); }
  writeFileSync(OUT + 'nomanifest.json', '{"hello": 1}');
  await page.setInputFiles('.man .mn-mfile', OUT + 'nomanifest.json'); await page.waitForTimeout(100);
  check((await page.textContent('.man .mn-err')).includes('not a IIIF Presentation manifest'), 'annotator: not a manifest message');
  await page.selectOption('.man .mn-img', '0'); await page.waitForTimeout(100);
  check((await page.textContent('.man .mn-count')).startsWith('9 regions on this image'), 'annotator: switch back to the first image');
};
