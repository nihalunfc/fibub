// #857 lattice FFT and d-spacing
export const path = '/science/lattice-fft/';
const tiff16 = (w, h, f) => {
  const n = 9, ifd = 8, data = ifd + 2 + n * 12 + 4, b = Buffer.alloc(data + w * h * 2);
  b.write('II', 0); b.writeUInt16LE(42, 2); b.writeUInt32LE(ifd, 4); b.writeUInt16LE(n, ifd);
  [[256, 3, w], [257, 3, h], [258, 3, 16], [259, 3, 1], [262, 3, 1], [273, 4, data], [277, 3, 1], [278, 3, h], [279, 4, w * h * 2]].forEach(([t, ty, v], i) => {
    const e = ifd + 2 + i * 12; b.writeUInt16LE(t, e); b.writeUInt16LE(ty, e + 2); b.writeUInt32LE(1, e + 4); if (ty === 3) b.writeUInt16LE(v, e + 8); else b.writeUInt32LE(v, e + 8);
  });
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) b.writeUInt16LE(f(x, y), data + 2 * (y * w + x));
  return b;
};
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.lfft ', big = () => page.textContent(R + '.lf-big'), facts = () => page.textContent(R + '.lf-facts'), tab = () => page.textContent(R + '.lf-tab');
  const wait = (ms = 500) => page.waitForTimeout(ms);
  await page.goto(`${BASE}${path}`); await wait(1200);
  check((await big()) === 'd = 0.2501 nm at 140.0°', `lattice: example strongest spot (${await big()})`);
  { const t = await tab(); check(t.includes('0.24984') && t.includes('0.24999') && t.includes('80.00') && t.includes('19.99') && t.includes('60.05') && t.includes('59.95'), 'lattice: example spots: 0.25 nm at 140°, 80°, 20°, 60° apart'); }
  check((await facts()).includes('512 × 512') && (await facts()).includes('0.0977 nm⁻¹') && (await facts()).includes('top-left at 172, 136'), 'lattice: transform size, spectrum step and region');
  const ticks = () => page.$$eval(R + '.lf-use', (e) => e.map((x) => x.checked).join());
  check((await ticks()) === 'true,true,true,false,false,false' && (await page.textContent(R + '.lf-fnote')).startsWith('Spots 1, 2, 3 and'), 'lattice: weak peaks start out of the filter');
  { const px = await page.evaluate(() => { const c = document.querySelector('.lfft .lf-filt'); return [c.width, c.height]; }); check(px[0] === 256 && px[1] === 256, 'lattice: filtered image is the region size'); }
  await page.locator(R + '.lf-use').first().uncheck(); await wait(200);
  check((await page.textContent(R + '.lf-fnote')).startsWith('Spots 2, 3 and'), 'lattice: untick a spot');
  await page.fill(R + '.lf-r', '0'); await wait();
  check((await page.textContent(R + '.mg-err')).includes('filter radius is 1 to 100'), 'lattice: bad filter radius message');
  await page.fill(R + '.lf-r', '4'); await wait();
  await page.selectOption(R + '.lf-win', 'none'); await wait(400);
  { const t = await tab(); check(/0\.24\d|0\.25\d/.test(t) && (await facts()).includes('no window'), 'lattice: no window still finds 0.25 nm'); }
  await page.selectOption(R + '.lf-win', 'hann'); await page.selectOption(R + '.lf-pad', '1'); await wait(400);
  check((await facts()).includes('Transform256 × 256') && /^d = 0\.2(49|50)/.test(await big()), `lattice: no padding: 256 × 256 transform (${await big()})`);
  await page.selectOption(R + '.lf-pad', '2'); await page.selectOption(R + '.lf-size', '512'); await wait(600);
  check((await facts()).includes('512 × 512 px') && (await facts()).includes('1024 × 1024') && (await big()).startsWith('d = 0.25'), 'lattice: 512 px region');
  await page.selectOption(R + '.lf-size', '1024'); await wait(300);
  check((await page.textContent(R + '.mg-err')).includes('too small for a 1024 px region'), 'lattice: region bigger than the image message');
  await page.selectOption(R + '.lf-size', '128'); await wait(300);
  // Tap the image left of the middle: the 128 px region moves there (centre about 180, 252 → top-left 116, 188).
  { const cv = page.locator(R + '.mg-canvas'); await cv.evaluate((e) => e.scrollIntoView({ block: 'center' })); await wait(100); const bb = await cv.boundingBox();
    await page.mouse.click(bb.x + bb.width * 0.3, bb.y + bb.height * 0.45); await wait(400);
    const m = (await facts()).match(/top-left at (\d+), (\d+)/); check(m && Math.abs(Number(m[1]) - 116) <= 3 && Math.abs(Number(m[2]) - 188) <= 3, `lattice: tap moves the region (${m && m[0]})`); }
  await page.selectOption(R + '.lf-size', '256'); await wait(400);
  // Tap the mirror of spot 2 on the spectrum: a tapped spot with the same d appears; tap it again to remove it.
  await page.fill(R + '.lf-n', '1'); await wait(500);
  check((await page.locator(R + '.lf-tab tbody tr').count()) === 1, 'lattice: find one spot');
  { const N = await page.evaluate(() => document.querySelector('.lfft .lf-spec').width);
    // The 80° spot of a 12.5 px lattice in an N transform sits at u = N/2 + N cos80°/12.5, v = N/2 − N sin80°/12.5; tap its mirror.
    const u = N / 2 - (N * Math.cos((80 * Math.PI) / 180)) / 12.5, v = N / 2 + (N * Math.sin((80 * Math.PI) / 180)) / 12.5;
    const sc = page.locator(R + '.lf-spec'); await sc.evaluate((e) => e.scrollIntoView({ block: 'center' })); await wait(100); const bb = await sc.boundingBox();
    // The spectrum shows the middle half (2 × zoom): screen fraction = (u − N/4) / (N/2).
    const sx = (uu) => (uu - N / 4) / (N / 2);
    await page.mouse.click(bb.x + sx(u + 1.5) * bb.width, bb.y + sx(v - 1) * bb.height); await wait(300);
    const t = await tab(); check((await page.locator(R + '.lf-tab tbody tr').count()) === 2 && t.includes('tapped') && /0\.249\d|0\.250\d/.test(t.split('tapped')[0].slice(-60)) && t.includes('80.0'), `lattice: tapping a mirror spot measures its pair (${t.slice(-80)})`);
    await sc.evaluate((e) => e.scrollIntoView({ block: 'center' })); await wait(100); const b2 = await sc.boundingBox();
    await page.mouse.click(b2.x + sx(u) * b2.width, b2.y + sx(v) * b2.height); await wait(300);
    check((await page.locator(R + '.lf-tab tbody tr').count()) === 1, 'lattice: tapping it again removes it'); }
  await page.selectOption(R + '.lf-zoom', '1'); await wait(200);
  { const N = await page.evaluate(() => document.querySelector('.lfft .lf-spec').width), u = N / 2 + (N * Math.cos((20 * Math.PI) / 180)) / 12.5, v = N / 2 - (N * Math.sin((20 * Math.PI) / 180)) / 12.5;
    const sc = page.locator(R + '.lf-spec'); await sc.evaluate((e) => e.scrollIntoView({ block: 'center' })); await wait(100); const bb = await sc.boundingBox();
    await page.mouse.click(bb.x + (u / N) * bb.width, bb.y + (v / N) * bb.height); await wait(300);
    check((await page.locator(R + '.lf-tab tbody tr').count()) === 2 && /(19\.9|20\.0)\d%?/.test((await tab()).split('Strength')[1]), 'lattice: tapping the whole (unzoomed) spectrum measures the 20° spot'); }
  await page.selectOption(R + '.lf-zoom', '2');
  await page.fill(R + '.lf-n', '0'); await wait();
  check((await big()) === 'No spots yet: tap one on the spectrum' && await page.isHidden(R + '.lf-filt'), 'lattice: no spots asked for');
  await page.fill(R + '.lf-n', '30'); await wait();
  check((await page.textContent(R + '.mg-err')).includes('Spots to find: 0 to 20'), 'lattice: bad spot count message');
  await page.fill(R + '.lf-n', '6'); await wait();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.lf-csv')]); const f = OUT + 'fft.csv'; await d.saveAs(f); const t = readFileSync(f, 'utf8').trim().split('\n');
    check(t.length === 7 && t[0].startsWith('spot,how,u_spectrum_px') && t[1].includes(',found,') && /,0\.2(49|50)\d*,/.test(t[1]) && t[1].endsWith(',yes') && t[6].endsWith(',no'), 'lattice: spots CSV'); }
  for (const [btn, nm] of [['.lf-fpng', 'filt.png'], ['.lf-spng', 'spec.png']]) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + btn)]); const f = OUT + nm; await d.saveAs(f); check(readFileSync(f).subarray(1, 4).toString() === 'PNG', `lattice: ${nm} download`); }
  await page.fill(R + '.mg-blen', ''); await wait();
  check((await big()).startsWith('d = 12.5') && (await big()).includes(' px at '), `lattice: no scale gives pixels (${await big()})`);
  // A 128 × 128 16-bit TIFF of vertical fringes 8 px apart at 0.1 nm per pixel: d = 0.8 nm at 0°; the region drops to 128.
  writeFileSync(OUT + 'fringes.tif', tiff16(128, 128, (x) => Math.round(30000 + 20000 * Math.cos((2 * Math.PI * x) / 8))));
  await page.setInputFiles(R + '.mg-file', OUT + 'fringes.tif'); await wait(600);
  await page.fill(R + '.mg-pix', '0.1'); await page.selectOption(R + '.mg-unit', 'nm'); await wait(600);
  check((await big()) === 'd = 0.8000 nm at 0.0°' && (await page.inputValue(R + '.lf-size')) === '128', `lattice: 16-bit TIFF fringes (${await big()})`);
  await page.click(R + '.lf-ex'); await wait(800);
  check((await big()) === 'd = 0.2501 nm at 140.0°', 'lattice: example again');
};
