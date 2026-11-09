// #191 fluorescence image analyser
export const path = '/science/fluorescence-image-analyser/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.fia ';
  const big = () => page.textContent(R + '.fi-big'), facts = () => page.textContent(R + '.fi-facts');
  const wait = (ms = 450) => page.waitForTimeout(ms);
  await page.goto(`${BASE}${path}`); await wait(800);
  check((await big()) === '30 objects in the blue channel', 'fluorescence: the example counts 30 nuclei');
  { const f = await facts(); check(f.includes('above 67') && f.includes('rolling ball, 50 px') && f.includes('281.8 px') && f.includes('7.04 %') && f.includes('3 objects'), `fluorescence: example facts (${f.slice(0, 160)})`); }
  { const t = await page.textContent(R + '.fi-tab'); check(t.includes('Area (px)') && t.includes('254') && t.includes('90.6') && t.includes('23019'), 'fluorescence: object table'); }
  check(await page.isVisible(R + '.fi-view') && await page.isVisible(R + '.fi-hist'), 'fluorescence: overlay and histogram shown');
  { const n = await page.evaluate(() => { const c = document.querySelector('.fia .fi-view'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let k = 0; for (let i = 0; i < d.length; i += 4) if (d[i] === 255 && d[i + 1] === 212 && d[i + 2] === 0) k++; return k; }); check(n > 1000, `fluorescence: yellow outlines drawn (${n} px)`); }

  await page.uncheck(R + '.fi-split'); await wait();
  check((await big()) === '27 objects in the blue channel', 'fluorescence: without splitting, touching pairs count once');
  await page.check(R + '.fi-split'); await wait();
  await page.selectOption(R + '.fi-th', 'triangle'); await wait();
  check((await big()).startsWith('30 objects') && (await facts()).includes('above 14') && (await facts()).includes('411.1 px'), 'fluorescence: triangle threshold');
  await page.selectOption(R + '.fi-th', 'manual'); await page.fill(R + '.fi-m', '40'); await wait();
  check((await facts()).includes('above 40') && (await big()).startsWith('30 objects'), 'fluorescence: typed threshold');
  await page.fill(R + '.fi-m', '300'); await wait();
  check((await page.textContent(R + '.fi-err')).includes('between 0 and 254') && await page.isHidden(R + '.fi-out'), 'fluorescence: bad threshold message');
  await page.selectOption(R + '.fi-th', 'otsu'); await wait();
  check((await big()).startsWith('30 objects'), 'fluorescence: back to Otsu');

  await page.selectOption(R + '.fi-ch', 'g'); await wait();
  check((await big()) === '8 objects in the green channel', 'fluorescence: green channel');
  await page.selectOption(R + '.fi-ch', 'r'); await wait();
  check((await big()) === '0 objects in the red channel' && (await page.textContent(R + '.fi-err')).includes('No objects found') && await page.isHidden(R + '.fi-tw'), 'fluorescence: empty red channel message');
  await page.selectOption(R + '.fi-ch', 'b'); await wait();

  await page.selectOption(R + '.fi-bg', 'constant'); await wait();
  check(await page.isVisible(R + '.fi-c') && await page.isHidden(R + '.fi-r') && (await facts()).includes('constant, 38') && (await facts()).includes('above 70'), 'fluorescence: automatic constant background');
  await page.fill(R + '.fi-c', '30'); await wait();
  check((await facts()).includes('constant, 30') && (await big()).startsWith('30 objects'), 'fluorescence: typed constant background');
  await page.fill(R + '.fi-c', '400'); await wait();
  check((await page.textContent(R + '.fi-err')).includes('between 0 and 255'), 'fluorescence: bad background level');
  await page.selectOption(R + '.fi-bg', 'none'); await wait();
  check((await facts()).includes('above 107') && (await big()).startsWith('30 objects'), 'fluorescence: no background');
  await page.selectOption(R + '.fi-bg', 'ball'); await page.fill(R + '.fi-r', '0'); await wait();
  check((await page.textContent(R + '.fi-err')).includes('ball radius'), 'fluorescence: bad ball radius');
  await page.fill(R + '.fi-r', '50'); await wait();

  await page.fill(R + '.fi-min', '0'); await wait();
  check((await big()).startsWith('33 objects'), 'fluorescence: no smallest size counts the dust');
  await page.fill(R + '.fi-min', '50'); await page.fill(R + '.fi-max', '300'); await wait();
  { const n = Number((await big()).split(' ')[0]); check(n > 0 && n < 30, `fluorescence: largest size leaves out big nuclei (${n})`); }
  await page.fill(R + '.fi-max', '20'); await wait();
  check((await page.textContent(R + '.fi-err')).includes('smaller than the smallest'), 'fluorescence: size limits the wrong way round');
  await page.fill(R + '.fi-max', ''); await wait();
  await page.uncheck(R + '.fi-fill'); await wait();
  check((await facts()).includes('280.7 px'), 'fluorescence: without filling holes the nucleolus is left out');
  await page.check(R + '.fi-fill'); await page.check(R + '.fi-edge'); await wait();
  check((await big()).startsWith('30 objects') && (await facts()).includes('touching the edge'), 'fluorescence: leave out edge objects (none in the example)');
  await page.uncheck(R + '.fi-edge');
  await page.fill(R + '.fi-px', '0.5'); await wait();
  check((await facts()).includes('70.44 µm²') && (await page.textContent(R + '.fi-tab')).includes('Area (µm²)'), 'fluorescence: areas in µm² from the pixel size');
  await page.fill(R + '.fi-px', '-1'); await wait();
  check((await page.textContent(R + '.fi-err')).includes('pixel size'), 'fluorescence: bad pixel size');
  await page.fill(R + '.fi-px', ''); await wait();

  await page.selectOption(R + '.fi-show', 'mask'); await wait(150);
  { const g = await page.evaluate(() => { const c = document.querySelector('.fia .fi-view'); const d = c.getContext('2d').getImageData(5, 5, 1, 1).data; return [d[0], d[1], d[2]]; }); check(g.join() === '0,0,0', 'fluorescence: mask view'); }
  await page.selectOption(R + '.fi-show', 'chan'); await page.uncheck(R + '.fi-lines'); await wait(150);
  { const n = await page.evaluate(() => { const c = document.querySelector('.fia .fi-view'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let k = 0, col = 0; for (let i = 0; i < d.length; i += 4) { if (d[i] === 255 && d[i + 1] === 212 && d[i + 2] === 0) k++; if (d[i] !== d[i + 2]) col++; } return [k, col]; }); check(n[0] === 0 && n[1] === 0, 'fluorescence: grey channel view without outlines'); }
  await page.selectOption(R + '.fi-show', 'rgb'); await page.check(R + '.fi-lines');

  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fi-csv')]); const f = OUT + 'fia.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 31 && rows[0].startsWith('object,x_px,y_px,area_px,mean_intensity') && rows[1].startsWith('1,20.29,22.55,254,'), `fluorescence: objects CSV (${rows[1]})`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.fi-png')]); const f = OUT + 'fia.png'; await d.saveAs(f); const b = readFileSync(f); check(b.length > 5000 && b.readUInt32BE(16) === 400 && b.readUInt32BE(20) === 300, 'fluorescence: overlay PNG 400 × 300'); }
  { await page.locator(R + '.dl').scrollIntoViewIfNeeded(); const btn = page.locator(R + '.dl button').first(); const [d] = await Promise.all([page.waitForEvent('download'), btn.click()]); check(!!(await d.suggestedFilename()).startsWith('example-nuclei-objects'), `fluorescence: report download (${await d.suggestedFilename()})`); }

  // Your own image: a dark-on-light picture, 1500 px wide (scaled to 1000), with 6 dark discs, two of them touching.
  { const b64 = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 1500; c.height = 900; const x = c.getContext('2d'); x.fillStyle = '#f0f0f0'; x.fillRect(0, 0, 1500, 900); x.fillStyle = '#303030'; [[200, 200], [600, 200], [1000, 200], [200, 600], [600, 600], [690, 600]].forEach(([a, b]) => { x.beginPath(); x.arc(a, b, 60, 0, 2 * Math.PI); x.fill(); }); return c.toDataURL('image/png').split(',')[1]; });
    writeFileSync(OUT + 'fia-own.png', Buffer.from(b64, 'base64')); }
  await page.selectOption(R + '.fi-ch', 'grey'); await page.selectOption(R + '.fi-inv', '1'); await page.selectOption(R + '.fi-bg', 'none');
  await page.setInputFiles(R + '.fi-file', OUT + 'fia-own.png'); await wait(900);
  check((await big()) === '6 objects in the grey channel' && (await page.textContent(R + '.fi-ph')).includes('1000 × 600'), `fluorescence: own image, dark on light, scaled down (${await big()})`);
  await page.uncheck(R + '.fi-split'); await wait();
  check((await big()) === '5 objects in the grey channel', 'fluorescence: own image without splitting');
  await page.setInputFiles(R + '.fi-file', { name: 'bad.png', mimeType: 'image/png', buffer: Buffer.from('not an image') }); await wait(600);
  check((await page.textContent(R + '.fi-err')).includes('could not be opened'), 'fluorescence: unreadable file message');
  await page.click(R + '.fi-ex'); await wait(600);
  check((await big()) === '30 objects in the blue channel' && await page.isChecked(R + '.fi-split'), 'fluorescence: example again resets the settings');
};
