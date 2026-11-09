// #829 Calibration frames (bias, dark, flat)
export const path = '/science/calibration-frames/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.calf ';
  const txt = (s) => page.textContent(R + s);
  const big = () => txt('.cf-big');
  const settle = async () => { await page.waitForTimeout(500); await page.waitForFunction(() => !document.querySelector('.calf .cf-status').textContent); await page.waitForTimeout(200); };
  const hash = () => page.evaluate(() => { const c = document.querySelector('.calf .cf-img'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let h = 0, n = 0; for (let i = 0; i < d.length; i += 4) { h = (h * 31 + d[i]) % 1e9; if (d[i] > 20) n++; } return [h, n]; });
  await page.goto(`${BASE}${path}`); await page.waitForFunction(() => document.querySelector('.calf .cf-big').textContent.length > 10, null, { timeout: 15000 }); await settle();
  const EX = 'Centre / corner brightness 1.483 before the flat, 1.005 after; background 1268.61 → 260.48 ADU';
  check((await big()) === EX, `calf: demo headline (${await big()})`);
  { const t = await txt('.cf-tab'); check(t.includes('9 frames, 19140 values clipped') && t.includes('7 frames, 18157 values clipped') && t.includes('Light after270.88260.48'), 'calf: statistics table'); }
  check((await txt('.cf-n[data-k=darks]')).includes('7 made-up frames'), 'calf: demo frame counts');
  const h0 = await hash(); check(h0[1] > 1000, `calf: calibrated light drawn (${h0[1]})`);
  for (const v of ['before', 'bias', 'dark', 'flat']) { await page.selectOption(R + '.cf-view', v); await page.waitForTimeout(300); const h = await hash(); check(h[0] !== h0[0] && h[1] > 100, `calf: ${v} view drawn`); }
  check((await txt('.cf-imgnote')).includes('divided by its mean'), 'calf: flat view note');
  await page.selectOption(R + '.cf-st', 'linear'); await page.waitForTimeout(300); check((await hash())[0] !== h0[0], 'calf: linear stretch');
  await page.selectOption(R + '.cf-view', 'after'); await page.selectOption(R + '.cf-st', 'asinh');
  check(await page.isVisible(R + '.cf-hist'), 'calf: histogram shown');
  // Combine methods.
  await page.selectOption(R + '.cf-m', 'mean'); await settle();
  { const t = await txt('.cf-tab'); check(!t.includes('values clipped') && (await page.isHidden(R + '.cf-k')) && (await big()).includes('1.004 after'), `calf: mean combine (${await big()})`); }
  await page.selectOption(R + '.cf-m', 'median'); await settle();
  check((await big()).startsWith('Centre / corner brightness 1.48'), 'calf: median combine');
  await page.selectOption(R + '.cf-m', 'sigma'); await page.selectOption(R + '.cf-dev', 'std'); await settle();
  check(!(await txt('.cf-tab')).includes('19140 values'), 'calf: std clipping differs');
  await page.selectOption(R + '.cf-dev', 'mad'); await page.fill(R + '.cf-it', '1'); await settle();
  check(!(await txt('.cf-tab')).includes('19140 values') && (await txt('.cf-tab')).includes('values clipped'), 'calf: one clipping pass');
  await page.fill(R + '.cf-it', '5'); await settle();
  check((await big()) === EX, 'calf: back to the example');
  await page.fill(R + '.cf-k', '0'); await settle();
  check((await txt('.cf-err')).includes('κ is a positive'), 'calf: bad κ');
  await page.fill(R + '.cf-k', '3'); await settle();
  // Flat normalisation and dark scaling.
  await page.selectOption(R + '.cf-fn', 'median'); await settle();
  check((await big()) !== EX && (await big()).includes('after'), `calf: median flat normalisation (${await big()})`);
  await page.selectOption(R + '.cf-fn', 'mean'); await settle();
  await page.selectOption(R + '.cf-ds', 'scale'); await settle();
  check((await big()) === EX && (await page.isVisible(R + '.cf-tl')), 'calf: scaling with equal exposures changes nothing');
  await page.fill(R + '.cf-td', '240'); await settle();
  check(!(await big()).endsWith('260.48 ADU'), `calf: dark scaled by 120/240 (${await big()})`);
  await page.fill(R + '.cf-td', '0'); await settle();
  check((await txt('.cf-err')).includes('both exposure times'), 'calf: missing exposure');
  await page.fill(R + '.cf-td', '120'); await page.selectOption(R + '.cf-ds', 'match'); await settle();
  // Second light frame.
  await page.selectOption(R + '.cf-li', '1'); await settle();
  check((await txt('.cf-tab')).includes('demo-light-2') && (await big()).includes(' after;'), `calf: second light frame (${await big()})`);
  await page.selectOption(R + '.cf-li', '0'); await settle();
  // Downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.cf-fits')]); const f = OUT + 'cf.fits'; await d.saveAs(f); const b = readFileSync(f); const head = b.subarray(0, 2880).toString('latin1'); check(d.suggestedFilename() === 'demo-light-1-calibrated.fits' && head.startsWith('SIMPLE  =') && head.includes('BITPIX  =                  -32') && head.includes('NAXIS1  =                  240') && b.length === 2880 + Math.ceil(240 * 160 * 4 / 2880) * 2880, 'calf: calibrated FITS'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.cf-mfits[data-k=flat]')]); check(d.suggestedFilename() === 'master-flat.fits', 'calf: master flat FITS'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.cf-csv')]); const f = OUT + 'cf.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 6 && rows[0].startsWith('frame,mean,median,std,mad_sigma') && rows[5].startsWith('Light after,270.8') , 'calf: statistics CSV'); }
  // A FITS file of our own as a light, with no calibration frames: error, then with a bias.
  { const fits = readFileSync(OUT + 'cf.fits');
    await page.setInputFiles(R + '.cf-in[data-k=lights]', { name: 'mine.fits', mimeType: 'application/fits', buffer: fits }); await settle();
    check((await txt('.cf-n[data-k=lights]')).startsWith('1 frame, 240 × 160') && (await txt('.cf-n[data-k=bias]')) === 'none', 'calf: opening a file clears the demo set');
    await page.click(R + '.cf-go'); await settle();
    check((await txt('.cf-err')).includes('Open some bias, dark or flat'), 'calf: needs calibration frames');
    await page.setInputFiles(R + '.cf-in[data-k=bias]', [{ name: 'b1.fits', mimeType: 'application/fits', buffer: fits }, { name: 'b2.fits', mimeType: 'application/fits', buffer: fits }]); await settle();
    await page.click(R + '.cf-go'); await settle();
    check((await big()).startsWith('Background') && (await big()).includes('→ 0.0000 ADU (no flat given)'), `calf: own FITS light minus identical bias (${await big()})`); }
  await page.setInputFiles(R + '.cf-in[data-k=bias]', { name: 'tiny.png', mimeType: 'image/png', buffer: Buffer.from(await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 4; c.height = 3; const x = c.getContext('2d'); x.fillStyle = '#808080'; x.fillRect(0, 0, 4, 3); return c.toDataURL('image/png').split(',')[1]; }), 'base64') }); await settle();
  await page.click(R + '.cf-go'); await settle();
  check((await txt('.cf-err')).includes('must match'), `calf: size mismatch (${await txt('.cf-err')})`);
  await page.click(R + '.cf-demo'); await settle();
  check((await big()) === EX, 'calf: demo reloads');
  { const vp = page.viewportSize(); await page.setViewportSize({ width: 375, height: 800 }); await page.waitForTimeout(500); await page.locator(R + '.cf-out').screenshot({ path: OUT + 'cf-375-out.png' }); await page.setViewportSize(vp); }
};
