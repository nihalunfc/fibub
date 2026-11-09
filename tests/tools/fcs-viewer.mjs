// #192 flow cytometry FCS viewer
export const path = '/science/fcs-viewer/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/fcs-viewer/`); await page.waitForTimeout(800);
  const R = '.fcs ';
  const text = (s) => page.textContent(R + s);
  const rows = async () => (await page.$$eval(R + '.fc-gt tbody tr', (trs) => trs.map((tr) => [...tr.cells].map((c) => (c.querySelector('input') ? c.querySelector('input').value : c.textContent.trim())))));
  const row = async (name) => (await rows()).find((r) => r[0] === name);
  // Tap the plot at plot-scale values (tx, ty), using the plot area the page publishes on the canvas.
  const tap = async (tx, ty) => {
    const cv = page.locator(R + '.fc-plot'); await cv.scrollIntoViewIfNeeded();
    const d = await cv.evaluate((c) => ({ ...c.dataset })), bb = await cv.boundingBox();
    const [L, T, pw, ph] = d.area.split(',').map(Number), [x0, x1] = d.xr.split(',').map(Number), [y0, y1] = d.yr.split(',').map(Number), k = bb.width / Number(d.fw);
    const fx = L + ((tx - x0) / (x1 - x0)) * pw, fy = T + ph - ((ty - y0) / (y1 - y0)) * ph;
    await page.mouse.click(bb.x + fx * k, bb.y + fy * k); await page.waitForTimeout(150);
  };
  const as = (v) => Math.asinh(v / 150);

  check((await text('.fc-big')) === 'Cells: 17,540 events, 87.70 % of All events', 'fcs: example opens on Cells');
  check((await text('.fc-facts')).includes('20,000') && (await text('.fc-facts')).includes('2 × 2 ($SPILLOVER)') && (await text('.fc-facts')).includes('32-bit floats'), 'fcs: file facts');
  check((await page.$$eval(R + '.fc-kw tbody tr', (t) => t.length)) > 20 && (await text('.fc-ch')).includes('Marker B'), 'fcs: channels and keyword tables');
  { const a = await row('Marker A+'), b = await row('Marker A+ B+'); check(a[3] === '6,144' && a[4] === '35.03' && b[3] === '1,754' && b[4] === '28.55' && b[5] === '8.77', 'fcs: example gates, compensated (6,144 / 35.03 %, 1,754 / 28.55 %)'); }
  await page.click(R + '.fc-comp'); await page.waitForTimeout(200);
  { const b = await row('Marker A+ B+'); check(b[3] === '4,979' && b[4] === '81.04', 'fcs: without compensation, A+ B+ is 4,979 (81.04 %)'); }
  await page.click(R + '.fc-comp'); await page.waitForTimeout(200);

  // Quadrants on Cells at FITC 1,500 / PE 1,000.
  await page.click(R + '.fc-g[data-m="quad"]'); await tap(as(1500), as(1000));
  { const q = await Promise.all(['Marker A− Marker B+', 'Marker A+ Marker B+', 'Marker A+ Marker B−', 'Marker A− Marker B−'].map(row)); const n = q.map((r) => r && Number(r[3].replace(/,/g, '')));
    const want = [2649, 1754, 4390, 8747]; check(n.every((v, i) => Math.abs(v - want[i]) < want[i] * 0.03) && n.reduce((a, b) => a + b, 0) >= 17540 && q.every((r) => r[1] === 'Cells'), `fcs: quadrants tapped on the plot (${n.join(', ')})`); }
  { const sum = (await rows()).filter((r) => r[0].startsWith('Marker A') && r[0].includes(' Marker B')).reduce((a, r) => a + Number(r[4]), 0); check(Math.abs(sum - 100) < 0.2, 'fcs: quadrant percentages add up to 100'); }

  // A rectangle on FSC/SSC for all events, then a polygon inside it.
  await page.selectOption(R + '.fc-show', ''); await page.selectOption(R + '.fc-x', '0'); await page.selectOption(R + '.fc-y', '1'); await page.waitForTimeout(200);
  check((await text('.fc-key')).startsWith('20,000 events from All events'), 'fcs: all events shown on FSC/SSC');
  await page.click(R + '.fc-g[data-m="rect"]'); await tap(55000, 15000); await tap(130000, 70000);
  { const g = await row('Gate 1'); const n = Number(g[3].replace(/,/g, '')); check(g[1] === 'All events' && n > 15500 && n < 17540, `fcs: rectangle gate (${g[3]} events, ${g[4]} %)`); }
  await page.fill(R + '.fc-gt input[data-id="g8"]', 'Big cells'); await page.press(R + '.fc-gt input[data-id="g8"]', 'Enter'); await page.waitForTimeout(150);
  check(!!(await row('Big cells')), 'fcs: gate renamed');
  await page.selectOption(R + '.fc-show', 'g8'); await page.waitForTimeout(150);
  await page.click(R + '.fc-g[data-m="poly"]'); await tap(80000, 30000); await tap(110000, 30000); await tap(110000, 60000);
  check(await page.isVisible(R + '.fc-done') && (await text('.fc-hint')).includes('3 corners'), 'fcs: polygon in progress');
  await page.click(R + '.fc-done'); await page.waitForTimeout(150);
  { const g = await row('Gate 2'); check(g && g[1] === 'Big cells' && g[2].includes('(polygon)') && Number(g[3].replace(/,/g, '')) > 1000, 'fcs: polygon gate nested in the rectangle'); }
  check((await text('.fc-show')).includes('– – Gate 2'), 'fcs: nested gate listed in Show events in');
  await page.click(R + '.fc-g[data-m="rect"]'); await tap(60000, 20000); await tap(60500, 20200);
  check((await text('.fc-err')).includes('too small') && !(await row('Gate 3')), 'fcs: tiny gate refused');

  // Histogram with a range gate, and the scales.
  await page.click(R + '.fc-type button[data-v="hist"]'); await page.selectOption(R + '.fc-x', '2'); await page.waitForTimeout(200);
  check(await page.isHidden(R + '.fc-y') && await page.isVisible(R + '.fc-histg') && (await text('.fc-key')).includes('200 bins'), 'fcs: histogram view');
  await page.click(R + '.fc-histg'); await tap(as(1500), 0); await tap(as(20000), 0);
  { const g = await row('Gate 3'); check(g && g[2] === 'Marker A range' && g[1] === 'Big cells', `fcs: range gate on the histogram (${g && g[4]} %)`); }
  await page.selectOption(R + '.fc-sx', 'log'); await page.waitForTimeout(200);
  check((await page.locator(R + '.fc-plot').getAttribute('aria-label')).includes('Histogram') && (await text('.fc-key')).length > 0 && (await page.isDisabled(R + '.fc-cx')), 'fcs: log scale (cofactor off)');
  await page.selectOption(R + '.fc-sx', 'asinh'); await page.fill(R + '.fc-cx', '0'); await page.waitForTimeout(500);
  check((await text('.fc-err')).includes('cofactor'), 'fcs: bad cofactor message');
  await page.fill(R + '.fc-cx', '500'); await page.waitForTimeout(500);
  check((await page.locator(R + '.fc-plot').getAttribute('data-xr')).split(',').map(Number)[1] < as(262144) && await page.isHidden(R + '.fc-err'), 'fcs: cofactor 500 rescales the axis');

  // Downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fc-csv')]); const f = OUT + 'fcs-gates.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n');
    check(t[0].startsWith('gate,parent,kind,x channel') && t[0].includes('PE-A median') && t.length === 1 + 1 + 3 + 4 + 3 && t.some((l) => l.startsWith('Marker A+ B+,Marker A+,rect,FITC-A,"arcsinh, cofactor 150",PE-A') && l.includes(',1754,')), 'fcs: gate stats CSV'); }
  { const n = Number((await row('Big cells'))[3].replace(/,/g, '')); const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fc-ecsv')]); const f = OUT + 'fcs-events.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n');
    check(t[0] === 'FSC-A,SSC-A,FITC-A,PE-A' && t.length === n + 1, `fcs: events CSV for the shown gate (${t.length - 1} rows)`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f="pdf"]')]); check((await d.suggestedFilename()).endsWith('.pdf'), 'fcs: PDF report'); }

  // Delete removes the gates inside; then the example file is downloaded and opened again.
  await page.locator(R + '.fc-del[data-id="g8"]').click(); await page.waitForTimeout(150);
  check(!(await row('Big cells')) && !(await row('Gate 2')) && !(await row('Gate 3')) && !!(await row('Cells')), 'fcs: delete removes a gate and the gates inside');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fc-exdl')]); const f = OUT + 'example.fcs'; await d.saveAs(f); const b = readFileSync(f);
    check(b.subarray(0, 6).toString() === 'FCS3.1' && b.length > 320000, 'fcs: example FCS file download');
    await page.setInputFiles(R + '.fc-file', f); await page.waitForTimeout(800); }
  check((await text('.fc-big')).startsWith('All events: 20,000') && (await rows()).length === 1 && (await page.inputValue(R + '.fc-x')) === '0' && (await page.inputValue(R + '.fc-y')) === '1', 'fcs: opened file starts on FSC-A × SSC-A with no gates');
  writeFileSync(OUT + 'bad.fcs', 'hello, this is not a flow file at all, just text to fill sixty bytes or so.');
  await page.setInputFiles(R + '.fc-file', OUT + 'bad.fcs'); await page.waitForTimeout(300);
  check((await text('.fc-err')).startsWith('This is not an FCS file'), 'fcs: bad file message');
};
