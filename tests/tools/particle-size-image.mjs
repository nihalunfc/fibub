// #854 particle size from an image
export const path = '/science/particle-size-image/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.psi ', big = () => page.textContent(R + '.ps-big'), facts = () => page.textContent(R + '.ps-facts');
  const wait = (ms = 500) => page.waitForTimeout(ms);
  await page.goto(`${BASE}${path}`); await wait(1000);
  check((await big()) === 'D50 = 3.26 µm (n = 75)', `particles: example D50 and count (${await big()})`);
  { const f = await facts(); check(f.includes('90 found, 15 cut by the edge left out') && f.includes('2.17 µm / 3.26 µm / 4.59 µm') && f.includes('0.948') && f.includes('1.01'), 'particles: example D10/D50/D90, circularity, aspect ratio (made-up truth 2.17 / 3.25 / 4.58 µm)'); }
  check((await page.textContent(R + '.ps-thelp')).includes('Automatic: 89') && (await page.locator(R + '.ps-tab tbody tr').count()) === 75, 'particles: automatic threshold and one row per particle');
  await page.uncheck(R + '.ps-edge'); await wait(200);
  check((await big()).endsWith('(n = 90)'), 'particles: edge particles kept when unticked');
  await page.check(R + '.ps-edge'); await page.selectOption(R + '.ps-wt', 'a'); await wait(200);
  { const b = await big(), v = Number(b.match(/= ([\d.]+)/)[1]); check((await facts()).includes('(by area)') && v > 3.26, `particles: D values by area are larger (${b})`); }
  await page.selectOption(R + '.ps-wt', 'n');
  await page.uncheck(R + '.ps-split'); await wait(600);
  const found = async () => Number((await page.textContent(R + '.ps-facts div:first-child small')).match(/^(\d+) found/)[1]);
  { const n = await found(); check(n < 90 && n > 60, `particles: without the split, touching particles are clumps (${n} found)`); }
  await page.check(R + '.ps-split'); await wait(600);
  check((await big()) === 'D50 = 3.26 µm (n = 75)', 'particles: split again');
  await page.fill(R + '.ps-h', '0'); await wait();
  check((await page.textContent(R + '.mg-err')).includes('split strength is 0.5 to 50'), 'particles: bad split strength message');
  await page.fill(R + '.ps-h', '2'); await page.fill(R + '.ps-t', '300'); await wait();
  check((await page.textContent(R + '.mg-err')).includes('grey level from 0 to 255'), 'particles: bad threshold message');
  await page.fill(R + '.ps-t', '254'); await wait();
  check((await page.textContent(R + '.mg-err')).includes('No particles found') && await page.isHidden(R + '.ps-out'), 'particles: threshold too high finds nothing');
  await page.fill(R + '.ps-t', ''); await page.fill(R + '.ps-min', '2000'); await wait();
  { const n = await found(); check(n > 0 && n < 30, `particles: ignoring specks under 2000 pixels keeps only big particles (${n})`); }
  await page.fill(R + '.ps-min', '10'); await wait();
  // Tap particle 40 to leave it out, then again to put it back.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ps-csv')]); const f = OUT + 'parts.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n');
    check(rows.length === 91 && rows[0].startsWith('number,x_px,y_px,area_um2,diameter_um,feret_max_um') && rows.filter((r) => r.endsWith('no (edge)')).length === 15, 'particles: CSV with every particle and why it was left out');
    const p = rows.slice(1).map((r) => r.split(',')).find((c) => c[14] === 'yes' && Number(c[4]) > 3 && Number(c[2]) > 150 && Number(c[2]) < 400);
    const cv = page.locator(R + '.mg-canvas'); await cv.evaluate((e) => e.scrollIntoView({ block: 'center' })); await wait(100); const bb = await cv.boundingBox(), at = [bb.x + (Number(p[1]) / 720) * bb.width, bb.y + (Number(p[2]) / 540) * bb.height];
    await page.mouse.click(...at); await wait(200);
    check((await big()).endsWith('(n = 74)') && (await facts()).includes('1 left out by tapping') && (await page.textContent(R + '.ps-tapnote')).includes(`Particle ${p[0]} left out`), 'particles: tap leaves a particle out');
    await cv.evaluate((e) => e.scrollIntoView({ block: 'center' })); await wait(100); const b2 = await cv.boundingBox(); await page.mouse.click(b2.x + (Number(p[1]) / 720) * b2.width, b2.y + (Number(p[2]) / 540) * b2.height); await wait(200);
    check((await big()).endsWith('(n = 75)') && (await page.textContent(R + '.ps-tapnote')).includes('put back'), 'particles: tap again puts it back'); }
  await page.fill(R + '.mg-blen', ''); await wait();
  check((await big()) === 'D50 = 32.6 px (n = 75)' && (await page.textContent(R + '.ps-tab')).includes('Area (px²)'), 'particles: no scale gives pixels');
  // Dark rings on a light background: outer diameter 41 px, hole 17 px; 0.5 nm per pixel.
  { const b64 = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 300; c.height = 120; const x = c.getContext('2d'); x.fillStyle = '#e8e8e8'; x.fillRect(0, 0, 300, 120); const d = x.getImageData(0, 0, 300, 120);
      for (const cx of [50, 150, 250]) for (let y = 0; y < 120; y++) for (let i = 0; i < 300; i++) { const r = Math.hypot(i - cx, y - 60); if (r <= 20 && r > 8) { const p = 4 * (y * 300 + i); d.data[p] = d.data[p + 1] = d.data[p + 2] = 30; } }
      x.putImageData(d, 0, 0); return c.toDataURL('image/png').split(',')[1]; });
    writeFileSync(OUT + 'rings.png', Buffer.from(b64, 'base64')); }
  await page.setInputFiles(R + '.mg-file', OUT + 'rings.png'); await wait(700);
  await page.selectOption(R + '.ps-pol', 'dark'); await page.fill(R + '.mg-pix', '0.5'); await page.selectOption(R + '.mg-unit', 'nm'); await wait(700);
  { const b = await big(), d = Number(b.match(/= ([\d.]+) nm/)?.[1]); check(Math.abs(d - 20.4) < 0.4 && b.endsWith('(n = 3)'), `particles: dark rings, holes filled: 3 particles about 20.4 nm across (${b})`); }
  { const t = await page.textContent(R + '.ps-tab tbody tr:first-child'); check(t.includes('1.00'), 'particles: rings are round (aspect ratio 1.00)'); }
  await page.uncheck(R + '.ps-fill'); await wait(600);
  check((await big()).endsWith('(n = 12)'), 'particles: rings with holes kept are cut in 4 by the split (as scikit-image h_maxima + watershed)');
  await page.uncheck(R + '.ps-split'); await wait(600);
  { const b = await big(), d = Number(b.match(/= ([\d.]+) nm/)?.[1]); check(b.endsWith('(n = 3)') && Math.abs(d - Math.sqrt(20 * 20 - 8 * 8) * 2 * 0.5) < 0.6, `particles: holes kept and no split: the ring area gives a smaller diameter (${b})`); }
  await page.check(R + '.ps-split'); await page.check(R + '.ps-fill');
  await page.click(R + '.ps-ex'); await wait(800);
  check((await big()) === 'D50 = 3.26 µm (n = 75)', 'particles: example again');
};
