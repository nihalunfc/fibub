// #482 DICOM viewer: sample phantom, window, slices, reslice, measurements, tags, files (synthetic fixtures).
export const path = '/science/dicom-viewer/';
const FX = new URL('../fixtures/dicom/', import.meta.url).pathname;
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const vp0 = page.viewportSize(); await page.setViewportSize({ width: 1100, height: 900 });
  await page.goto(`${BASE}/science/dicom-viewer/`); await page.waitForTimeout(800);
  const R = '.dv ';
  const txt = (s) => page.textContent(R + s);
  check((await page.textContent('.dv .dv-med')).includes('For study and teaching, not medical advice.'), 'dicom viewer: medical note at the top');
  check((await txt('.dv-sn')) === 'slice 12 of 24' && (await txt('.dv-facts')).includes('128 × 128, 24 slices') && (await txt('.dv-facts')).includes('Slice gap5 mm') && (await txt('.dv-dims')).includes('320 × 320 mm'), 'dicom viewer: sample series opens on slice 12 with facts');
  check(await page.inputValue(R + '.dv-c') === '40' && await page.inputValue(R + '.dv-w') === '400', 'dicom viewer: window from the file');
  // Image coordinates to page coordinates (square pixels, image fitted in the canvas).
  const at = async (ix, iy) => {
    await page.locator(R + '.dv-cv').scrollIntoViewIfNeeded();
    const bb = await page.locator(R + '.dv-cv').boundingBox();
    const { w, h, z } = await page.evaluate(() => ({ w: 128, h: 128, z: 1 }));
    const s = Math.min(bb.width / w, bb.height / h) * z, ox = (bb.width - w * s) / 2, oy = (bb.height - h * s) / 2;
    return [bb.x + ox + ix * s, bb.y + oy + iy * s];
  };
  const drag = async (a, b) => { const p = await at(...a), q = await at(...b); await page.mouse.move(...p); await page.mouse.down(); await page.mouse.move((p[0] + q[0]) / 2, (p[1] + q[1]) / 2); await page.mouse.move(...q); await page.mouse.up(); await page.waitForTimeout(100); };
  // Pixel readout over the spine (650 HU plus noise).
  { const p = await at(64.5, 87.5); await page.mouse.move(...p); await page.waitForTimeout(100);
    const t = await txt('.dv-px'); const v = parseFloat(t.split(': ')[1]); check(t.startsWith('Column 65, row 88:') && v > 620 && v < 680 && t.endsWith('HU'), `dicom viewer: pixel readout on bone (${t})`); }
  // Window presets.
  const opts = await page.$$eval(R + '.dv-pre option', (o) => o.map((x) => x.textContent));
  check(opts[0].includes('soft tissue') && opts[1].includes('lung') && opts.includes('Auto (fits the data)') && opts.some((o) => o.startsWith('Bone, approx.')), 'dicom viewer: window list from file, auto and approximate presets');
  await page.selectOption(R + '.dv-pre', 'p:Lung'); await page.waitForTimeout(100);
  check(await page.inputValue(R + '.dv-c') === '-600' && await page.inputValue(R + '.dv-w') === '1500', 'dicom viewer: lung preset');
  await page.selectOption(R + '.dv-pre', 'auto'); await page.waitForTimeout(100);
  { const w = +(await page.inputValue(R + '.dv-w')); check(w > 1500 && w < 1800, `dicom viewer: auto window spans the data (width ${w})`); }
  await page.fill(R + '.dv-c', '100'); await page.fill(R + '.dv-w', '50'); await page.waitForTimeout(100);
  check(await page.inputValue(R + '.dv-pre') === 'custom', 'dicom viewer: typed window is custom');
  // Drag to window: right widens.
  await drag([30, 64], [70, 64]);
  check(+(await page.inputValue(R + '.dv-w')) > 50 && await page.inputValue(R + '.dv-c') === '100', 'dicom viewer: dragging right widens the window');
  await page.selectOption(R + '.dv-pre', 'f0');
  // Distance across the body at the centre row: 0.86 × 160 mm each side = 275 mm.
  await page.click(R + '.dv-tool [data-t=dist]');
  await drag([9, 64], [119, 64]);
  { const c = await page.$$eval(R + '.dv-mt tbody tr:first-child td', (t) => t.map((x) => x.textContent)); const d = parseFloat(c[3]); check(c[1] === 'Distance' && c[2] === 'slice 12' && c[3].endsWith(' mm') && Math.abs(d - 275) < 2, `dicom viewer: distance across the body ≈ 275 mm (${c})`); }
  // Angle: three taps making a right angle.
  await page.click(R + '.dv-tool [data-t=angle]');
  for (const p of [[20, 20], [20, 60], [60, 60]]) { await page.mouse.click(...(await at(...p))); await page.waitForTimeout(50); }
  check((await txt('.dv-mt')).includes('90.0°'), 'dicom viewer: angle 90°');
  // ROI oval in soft tissue (40 HU with noise SD 8).
  await page.click(R + '.dv-tool [data-t=ell]');
  await drag([52, 30], [76, 38]);
  { const t = await txt('.dv-mt'); const m = /mean (-?[\d.]+) HU, SD ([\d.]+)/.exec(t); check(m && Math.abs(+m[1] - 40) < 2 && Math.abs(+m[2] - 8) < 1.5 && /\d+ px, [\d.]+ mm²/.test(t), `dicom viewer: ROI oval in soft tissue (${m && m.slice(1)})`); }
  await page.click(R + '.dv-tool [data-t=rect]');
  await drag([60, 80], [69, 95]);
  { const t = await txt('.dv-mt'); check(/ROI box.*mean (\d+)/.test(t) && +/ROI box.*?mean (\d+)/.exec(t)[1] > 300, 'dicom viewer: ROI box over the spine'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dv-mcsv')]); const f = OUT + 'dv-meas.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 5 && rows[0].includes('number,kind,where,result') && rows[1].includes('Distance'), 'dicom viewer: measurements CSV'); }
  await page.click(R + '.dv-mt tbody tr:first-child button'); await page.waitForTimeout(50);
  check((await page.$$(R + '.dv-mt tbody tr')).length === 3, 'dicom viewer: delete one measurement');
  // Slices: slider and keyboard; measurements stay with their slice.
  await page.fill(R + '.dv-slice', '2'); await page.dispatchEvent(R + '.dv-slice', 'input'); await page.waitForTimeout(100);
  check((await txt('.dv-sn')) === 'slice 3 of 24', 'dicom viewer: slice slider');
  await page.focus(R + '.dv-cv'); await page.keyboard.press('ArrowDown'); await page.waitForTimeout(100);
  check((await txt('.dv-sn')) === 'slice 4 of 24', 'dicom viewer: arrow key moves a slice');
  // Reslice.
  check(await page.isVisible(R + '.dv-planes') && (await txt('.dv-plane')).includes('Coronal (reslice)') && (await txt('.dv-plane')).includes('Sagittal (reslice)'), 'dicom viewer: reslice choices for a regular stack');
  await page.click(R + '.dv-plane [data-p=row]'); await page.waitForTimeout(150);
  check((await txt('.dv-sn')) === 'row 64 of 128' && (await txt('.dv-dims')).startsWith('128 × 24 pixels, 320 × 120 mm'), 'dicom viewer: coronal reslice, true proportions');
  await page.click(R + '.dv-plane [data-p=col]'); await page.waitForTimeout(150);
  check((await txt('.dv-sn')) === 'column 64 of 128', 'dicom viewer: sagittal reslice');
  await page.click(R + '.dv-plane [data-p=orig]');
  // Zoom, pan, fit, invert do not break anything.
  await page.click(R + '.dv-zin'); await page.click(R + '.dv-tool [data-t=pan]'); await drag([40, 40], [60, 60]); await page.click(R + '.dv-zout'); await page.click(R + '.dv-fit'); await page.check(R + '.dv-inv');
  check(await page.isVisible(R + '.dv-cv'), 'dicom viewer: zoom, pan, fit and invert');
  // Tags.
  await page.fill(R + '.dv-filter', 'patient'); await page.waitForTimeout(100);
  { const t = await txt('.dv-tags'); check(t.includes('Patient Name') && t.includes('Sample^Phantom') && !t.includes('Pixel Spacing'), 'dicom viewer: tag search'); }
  await page.fill(R + '.dv-filter', '0028,0030'); await page.waitForTimeout(100);
  check((await txt('.dv-tags')).includes('2.5\\2.5'), 'dicom viewer: search by tag number');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dv-tcsv')]); const f = OUT + 'dv-tags.csv'; await d.saveAs(f); check(readFileSync(f, 'utf8').includes('0,"(0028,0030)",DS,Pixel Spacing,2.5\\2.5'), 'dicom viewer: tags CSV'); }
  // Report download.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dv .dl [data-f=png]')]); check(/\.png$/.test(d.suggestedFilename()), 'dicom viewer: PNG report'); }
  // Files: CT with intercept, HU readout and spacing.
  await page.setInputFiles(R + '.dv-in', FX + 'ct-explicit.dcm'); await page.waitForTimeout(400);
  check((await txt('.dv-name')) === 'ct-explicit.dcm' && (await txt('.dv-facts')).includes('0.75 × 0.5 mm') && (await txt('.dv-facts')).includes('value × 1 + -1024 = HU') && await page.isHidden(R + '.dv-slicebox') && await page.isHidden(R + '.dv-planes'), 'dicom viewer: one CT file');
  { const p = await at(0, 0); await page.mouse.move(p[0] + 1, p[1] + 1); }
  await page.fill(R + '.dv-filter', 'secret'); await page.waitForTimeout(100);
  check((await page.$$(R + '.dv-tags tr.priv')).length === 1, 'dicom viewer: private tag shown grey');
  // Multi-frame MONOCHROME1, big endian, RGB.
  await page.setInputFiles(R + '.dv-in', FX + 'dx-mono1-2frames.dcm'); await page.waitForTimeout(300);
  check((await txt('.dv-sn')) === 'frame 1 of 2' && (await txt('.dv-facts')).includes('at the detector'), 'dicom viewer: multi-frame X-ray with imager spacing');
  await page.setInputFiles(R + '.dv-in', FX + 'rgb-planar-2frames.dcm'); await page.waitForTimeout(300);
  check((await txt('.dv-facts')).includes('RGB') && (await txt('.dv-sn')) === 'frame 1 of 2', 'dicom viewer: colour multi-frame');
  await page.setInputFiles(R + '.dv-in', FX + 'ct-bigendian.dcm'); await page.waitForTimeout(300);
  check((await txt('.dv-facts')).includes('Explicit VR big endian'), 'dicom viewer: big endian file');
  // A shuffled stack of 6 files.
  await page.setInputFiles(R + '.dv-in', [3, 0, 5, 1, 4, 2].map((k) => FX + `stack-${k}.dcm`)); await page.waitForTimeout(400);
  check((await txt('.dv-name')) === '6 files' && (await txt('.dv-sn')) === 'slice 3 of 6' && await page.isVisible(R + '.dv-planes'), 'dicom viewer: stack of files sorted and resliceable');
  // Compressed and bad files.
  await page.setInputFiles(R + '.dv-in', FX + 'ct-rle.dcm'); await page.waitForTimeout(300);
  check((await txt('.dv-err')).includes('compressed (RLE lossless)') && await page.isHidden(R + '.dv-view') && await page.isVisible(R + '.dv-tagcard'), 'dicom viewer: compressed file says so, tags still shown');
  await page.setInputFiles(R + '.dv-in', { name: 'notes.dcm', mimeType: 'application/octet-stream', buffer: Buffer.from('this is plainly not a DICOM file, just text') });
  await page.waitForTimeout(300);
  check((await txt('.dv-err')).includes('notes.dcm') && (await txt('.dv-err')).includes('DICOM'), 'dicom viewer: not DICOM message');
  await page.setInputFiles(R + '.dv-in', [FX + 'ct-explicit.dcm', FX + 'stack-0.dcm']); await page.waitForTimeout(300);
  check((await txt('.dv-warn')).includes('2 series'), 'dicom viewer: mixed series noted');
  await page.click(R + '.dv-sample'); await page.waitForTimeout(300);
  check((await txt('.dv-sn')) === 'slice 12 of 24', 'dicom viewer: sample again');
  await page.setViewportSize(vp0);
};
