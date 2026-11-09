// #855 phase fraction and porosity
export const path = '/science/phase-fraction/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.phf ', big = () => page.textContent(R + '.pf-big'), facts = () => page.textContent(R + '.pf-facts'), tab = () => page.textContent(R + '.pf-tab');
  const wait = (ms = 450) => page.waitForTimeout(ms);
  await page.goto(`${BASE}${path}`); await wait(900);
  check((await big()) === 'Porosity 2.50 %' && (await page.textContent(R + '.pf-thelp')).includes('Automatic (Otsu, multi-level): 65, 147'), `phase: example porosity and Otsu thresholds (${await big()})`);
  { const t = await tab(); check(t.includes('Dark phase26.1 %3819') && t.includes('Light phase71.4 %10446') && t.includes('7.14 %3.08 %') && t.includes('26.1 % ± 6.92 %'), 'phase: example table (fractions, areas, point count, fields)'); }
  check((await facts()).includes('14630 µm²') && (await facts()).includes('10 × 7 grid') && (await facts()).includes('4 × 3 tiles'), 'phase: area analysed, grid and fields');
  await page.selectOption(R + '.pf-pore', '-1'); await wait(150);
  check((await big()) === 'Pores 2.50 %, Dark phase 26.1 %, Light phase 71.4 %', 'phase: no pores lists every phase');
  await page.selectOption(R + '.pf-pore', '0'); await wait(150);
  await page.fill(R + '.pf-t', '40, 150'); await wait();
  check((await big()) !== 'Porosity 2.50 %' && (await facts()).includes('grey 40, 150'), `phase: typed thresholds (${await big()})`);
  await page.fill(R + '.pf-t', '60'); await wait();
  check((await page.textContent(R + '.mg-err')).includes('Type 2 thresholds from 0 to 255 for 3 phases') && await page.isHidden(R + '.pf-out'), 'phase: wrong number of thresholds message');
  await page.fill(R + '.pf-t', ''); await wait();
  await page.selectOption(R + '.pf-k', '2'); await wait(200);
  check((await page.locator(R + '.pf-tab tbody tr').count()) === 2 && (await page.textContent(R + '.pf-thelp')).includes('Automatic (Otsu): '), 'phase: two phases with Otsu');
  await page.selectOption(R + '.pf-k', '4'); await wait(400);
  check((await page.locator(R + '.pf-tab tbody tr').count()) === 4 && (await page.textContent(R + '.pf-tab')).includes('Phase 4'), 'phase: four phases with multi-level Otsu');
  await page.selectOption(R + '.pf-k', '3'); await wait(200);
  check((await big()) === 'Porosity 2.50 %', 'phase: back to three phases');
  await page.selectOption(R + '.pf-conf', '0.99'); await wait(150);
  check((await tab()).includes('Field mean ± 99 % CI'), 'phase: 99 % field interval');
  await page.fill(R + '.pf-nx', '1'); await wait();
  check((await page.textContent(R + '.mg-err')).includes('2 to 100 points across'), 'phase: bad point grid message');
  await page.fill(R + '.pf-nx', '20'); await page.fill(R + '.pf-fx', '0'); await wait();
  check((await page.textContent(R + '.mg-err')).includes('1 to 20 tiles across'), 'phase: bad fields message');
  await page.fill(R + '.pf-fx', '6'); await wait();
  check((await facts()).includes('20 × 14 grid') && (await facts()).includes('280 points') && (await facts()).includes('6 × 4 tiles'), 'phase: bigger grid and more fields');
  // Overlay and grid change the picture.
  const sum = () => page.evaluate(() => { const c = document.querySelector('.phf .mg-canvas'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let s = 0; for (let i = 0; i < d.length; i += 97) s += d[i] * (i % 7) + d[i + 2]; return s; });
  const s0 = await sum(); await page.uncheck(R + '.pf-ov'); const s1 = await sum(); await page.check(R + '.pf-grid'); const s2 = await sum();
  check(s0 !== s1 && s1 !== s2, 'phase: overlay off and point grid on redraw the image');
  await page.check(R + '.pf-ov'); await page.uncheck(R + '.pf-grid');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pf-csv')]); const f = OUT + 'phase.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n');
    check(t[0].startsWith('phase,pixels,area_fraction,area_um2') && t[1].startsWith('Pores,9147,0.0250082021,365.88,') && t.some((r) => r.startsWith('split,grey thresholds 65 147')), 'phase: fractions CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pf-png')]); const f = OUT + 'phase.png'; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', 'phase: overlay PNG'); }
  await page.fill(R + '.mg-blen', ''); await wait();
  check((await tab()).includes('Area (px²)') && (await facts()).includes('calibrate for areas'), 'phase: no scale gives pixels');
  // Area by two taps.
  { const cv = page.locator(R + '.mg-canvas'); await page.click(R + '.mg-area'); await cv.scrollIntoViewIfNeeded(); const bb = await cv.boundingBox();
    await page.mouse.click(bb.x + bb.width * 0.5, bb.y + bb.height * 0.4); await page.mouse.click(bb.x + bb.width * 0.99, bb.y + bb.height * 0.9); await wait(200);
    check(/35\d × 2\d\d px/.test(await facts()) && (await big()) !== 'Porosity 2.50 %', `phase: area by two taps (${(await facts()).slice(0, 80)})`); }
  // A colour image: red, blue and green thirds and a white strip (10 % of the area).
  { const b64 = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 300; c.height = 200; const x = c.getContext('2d'); x.fillStyle = 'rgb(200,30,30)'; x.fillRect(0, 0, 100, 200); x.fillStyle = 'rgb(30,30,200)'; x.fillRect(100, 0, 100, 200); x.fillStyle = 'rgb(20,180,40)'; x.fillRect(200, 0, 100, 200); x.fillStyle = '#fff'; x.fillRect(0, 180, 300, 20); return c.toDataURL('image/png').split(',')[1]; });
    writeFileSync(OUT + 'colours.png', Buffer.from(b64, 'base64')); }
  await page.setInputFiles(R + '.mg-file', OUT + 'colours.png'); await wait(600);
  await page.selectOption(R + '.pf-method', 'colour'); await page.fill(R + '.pf-names', 'Red, Blue, Green'); await page.selectOption(R + '.pf-pore', '-1'); await wait();
  check(await page.isHidden(R + '.pf-out') && (await page.textContent(R + '.pf-thelp')).includes('Pick a colour for each of the 3 phases'), 'phase: colour mode asks for picks');
  for (const [k, x] of [[0, 50], [1, 150], [2, 250]]) {
    await page.locator(R + '.pf-pick').nth(k).click();
    const cv = page.locator(R + '.mg-canvas'); await cv.scrollIntoViewIfNeeded(); const bb = await cv.boundingBox();
    await page.mouse.click(bb.x + (x / 300) * bb.width, bb.y + (90 / 200) * bb.height); await wait(150);
  }
  check((await big()) === 'Red 30.0 %, Blue 30.0 %, Green 40.0 %', `phase: picked colours, the white strip goes to the nearest (green) (${await big()})`);
  await page.fill(R + '.pf-tol', '20'); await wait();
  check((await big()) === 'Red 33.3 %, Blue 33.3 %, Green 33.3 %' && (await facts()).includes('Unassigned10.0 %'), 'phase: tolerance leaves the white strip unassigned');
  await page.fill(R + '.pf-tol', '-3'); await wait();
  check((await page.textContent(R + '.mg-err')).includes('tolerance is a ΔE above 0'), 'phase: bad tolerance message');
  await page.fill(R + '.pf-tol', ''); await page.selectOption(R + '.pf-method', 'grey'); await wait();
  check(!(await page.isHidden(R + '.pf-out')) && (await facts()).includes('grey '), 'phase: back to grey levels on the colour image');
  await page.click(R + '.pf-ex'); await wait(600);
  check((await big()) === 'Porosity 2.50 %', 'phase: example again');
};
