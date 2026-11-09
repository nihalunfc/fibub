// #728 Eye-tracking heat map: the made-up recording, both methods, fixation input, picture, AOIs by typing and
// dragging, downloads and bad input messages.
export const path = '/science/eye-tracking-heatmap/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(BASE + path);
  await page.waitForSelector('.et-out:not([hidden])');
  const big = () => page.innerText('.et-big');
  const settle = () => page.waitForTimeout(450);
  check((await big()) === '7 fixations, mean 279 ms', `eye-tracking: example finds 7 fixations, mean 279 ms (${await big()})`);
  const aoi = async () => page.$$eval('.et-at tbody tr', (rs) => rs.map((r) => [...r.cells].map((c) => c.textContent)));
  let a = await aoi();
  check(a[0].join('|') === 'Logo|2|567|29.1 %|350|2|2|283', `eye-tracking: Logo row (${a[0].join('|')})`);
  check(a[1].join('|') === 'Photo|1|450|23.1 %|1150|4|1|450', `eye-tracking: Photo row (${a[1].join('|')})`);
  check((await page.$$('.et-ft tbody tr')).length === 7, 'eye-tracking: fixation table has 7 rows');
  check(/60(\.\d)? Hz/.test(await page.innerText('.et-facts')), 'eye-tracking: sampling rate about 60 Hz shown');

  // I-DT.
  await page.selectOption('.et-meth', 'idt'); await settle();
  check(await page.isVisible('.et-d') && !(await page.isVisible('.et-v')), 'eye-tracking: I-DT shows the dispersion limit only');
  await page.fill('.et-min', '100'); await settle();
  check((await big()).startsWith('7 fixations, mean 305 ms'), `eye-tracking: I-DT 40 px, 100 ms gives 7 fixations, mean 305 ms (${await big()})`);
  await page.fill('.et-d', '0'); await settle();
  check((await page.innerText('.et-err')).includes('dispersion limit'), 'eye-tracking: zero dispersion limit is refused');
  await page.fill('.et-d', '40'); await page.selectOption('.et-meth', 'ivt'); await page.fill('.et-min', '60');
  await page.fill('.et-v', '-5'); await settle();
  check((await page.innerText('.et-err')).includes('speed limit'), 'eye-tracking: negative speed limit is refused');
  await page.fill('.et-v', '200'); await settle();
  check(/^\d+ fixations?|^No fixations/.test(await big()) && (await big()) !== '7 fixations, mean 279 ms', `eye-tracking: a strict speed limit changes the result (${await big()})`);
  await page.fill('.et-v', '1000'); await settle();

  // Heat weight, layers and blur.
  await page.selectOption('.et-wt', 'n'); await page.uncheck('.et-show-p'); await settle();
  check(await page.isVisible('.et-fig'), 'eye-tracking: count weighting and hidden scanpath still draw');
  await page.check('.et-show-p'); await page.selectOption('.et-wt', 'dur');
  await page.fill('.et-s', '0'); await settle();
  check((await page.innerText('.et-err')).includes('blur'), 'eye-tracking: zero blur is refused');
  await page.fill('.et-s', '40'); await settle();

  // Drag an area of interest on the picture.
  const cv = await page.$('.et-fig'); await cv.scrollIntoViewIfNeeded();
  const bb = await cv.boundingBox();
  await page.mouse.move(bb.x + bb.width * 0.45, bb.y + bb.height * 0.45); await page.mouse.down();
  await page.mouse.move(bb.x + bb.width * 0.55, bb.y + bb.height * 0.56, { steps: 4 }); await page.mouse.up(); await settle();
  const aoiText = await page.inputValue('.et-aoi');
  check(/Area 3, 3\d\d, 2\d\d, 4\d\d, 3\d\d$/.test(aoiText), `eye-tracking: dragging adds an area (${aoiText.split('\n').pop()})`);
  a = await aoi();
  check(a.length === 3 && a[2][1] === '2', `eye-tracking: the dragged centre area holds the 2 centre fixations (${a[2]?.join('|')})`);
  await page.fill('.et-aoi', 'Logo, 100, 80, 220, 180\nBad, 1, 2'); await settle();
  check((await page.innerText('.et-err')).includes('Area row 2'), 'eye-tracking: a short area row is refused');
  await page.fill('.et-aoi', 'Logo, 100, 80, 220, 180\nPhoto, 560, 380, 720, 520'); await settle();

  // Downloads.
  const dl = async (sel) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(sel)]); const p = OUT + d.suggestedFilename(); await d.saveAs(p); return { name: d.suggestedFilename(), p }; };
  const f1 = await dl('.et-csv'), c1 = readFileSync(f1.p, 'utf8').trim().split('\n');
  check(f1.name === 'fixations.csv' && c1.length === 8 && c1[0].startsWith('fixation,x_px,y_px,start_ms') && c1[2].endsWith(',Logo'), `eye-tracking: fixations CSV (${c1[2]})`);
  const f2 = await dl('.et-acsv'), c2 = readFileSync(f2.p, 'utf8').trim().split('\n');
  check(c2.length === 3 && c2[1] === 'Logo,2,566.7,0.2906,350,2,2,283.4', `eye-tracking: areas CSV (${c2[1]})`);
  const f3 = await dl('.et-png'), png = readFileSync(f3.p);
  check(f3.name === 'gaze-heat-map.png' && png.readUInt32BE(16) === 800 && png.readUInt32BE(20) === 600, `eye-tracking: heat map PNG at 800 × 600 (${png.readUInt32BE(16)} × ${png.readUInt32BE(20)})`);
  const f4 = await dl('.dl button[data-f="pdf"]');
  check(f4.name === 'eye-tracking-heat-map.pdf' && readFileSync(f4.p).subarray(0, 4).toString() === '%PDF', 'eye-tracking: PDF report');
  const f5 = await dl('.dl button[data-f="docx"]');
  check(f5.name === 'eye-tracking-heat-map.docx' && readFileSync(f5.p).subarray(0, 2).toString() === 'PK', 'eye-tracking: Word report');

  // A stimulus picture sets the size.
  const b64 = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 400; c.height = 300; const x = c.getContext('2d'); x.fillStyle = '#ddd'; x.fillRect(0, 0, 400, 300); return c.toDataURL('image/png').split(',')[1]; });
  await page.setInputFiles('.et-img', { name: 'stimulus.png', mimeType: 'image/png', buffer: Buffer.from(b64, 'base64') });
  await page.waitForFunction(() => document.querySelector('.et-w').value === '400');
  check(await page.isDisabled('.et-w') && (await page.innerText('.et-img-n')).includes('400 × 300'), 'eye-tracking: the picture sets the size and is named');
  check((await page.innerText('.et-facts')).includes('Off the picture'), 'eye-tracking: fixations beyond a smaller picture are flagged');
  await page.click('.et-img-x'); await settle();
  check(!(await page.isDisabled('.et-w')) && !(await page.isVisible('.et-img-x')), 'eye-tracking: the picture can be removed');
  await page.fill('.et-w', '800'); await page.fill('.et-h', '600'); await settle();

  // Fixations given directly, normalised coordinates and seconds.
  await page.selectOption('.et-kind', 'fix');
  await page.selectOption('.et-tu', '1000'); await page.selectOption('.et-cu', 'norm');
  await page.fill('.et-data', 'x,y,start,duration\n0.5,0.5,0,0.3\n0.2,0.2,0.4,0.25\n0.8,0.8,0.7,0.5'); await settle();
  check(!(await page.isVisible('.et-det')) && (await big()) === '3 fixations, mean 350 ms', `eye-tracking: fixation rows in seconds and 0-1 coordinates (${await big()})`);
  check((await page.$$eval('.et-ft tbody tr', (rs) => rs[1].cells[1].textContent + ',' + rs[1].cells[2].textContent)) === '160.0,120.0', 'eye-tracking: 0-1 coordinates scale to the screen');
  await page.fill('.et-data', 'x,y,start\n0.5,0.5,0\n0.2,0.2,0.4'); await settle();
  check((await page.innerText('.et-err')).includes('duration column'), 'eye-tracking: fixations without duration are refused');
  await page.selectOption('.et-kind', 'raw'); await page.selectOption('.et-tu', '1'); await page.selectOption('.et-cu', 'px');
  await page.fill('.et-data', 'time,x,y\n0,1,1\n20,2,2\n10,3,3'); await settle();
  check((await page.innerText('.et-err')).includes('Time goes backwards'), 'eye-tracking: unsorted time is refused');
  await page.fill('.et-data', 'foo,bar,baz\n0,1,1\n20,2,2'); await settle();
  check((await page.innerText('.et-err')).includes('Could not find the time, x and y'), 'eye-tracking: unknown header is refused');

  // Open the gaze file with the file button.
  await page.setInputFiles('.dfb-in', new URL('../fixtures/eye-tracking-heatmap.csv', import.meta.url).pathname); await settle();
  check((await big()) === '7 fixations, mean 279 ms', `eye-tracking: opening the CSV file gives the same result (${await big()})`);
};
