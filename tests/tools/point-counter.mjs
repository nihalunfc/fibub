// #873 point counter
export const path = '/science/point-counter/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/point-counter/`); await page.waitForTimeout(800);
  const t = (c) => page.textContent('.pcn ' + c);
  const accept = (d) => d.accept(); page.on('dialog', accept);
  check((await t('.pc-prog')) === 'Tally: 0 counted' && (await t('.pc-big')) === 'Nothing counted yet', 'point counter: starts as a tally counter');
  await page.click('.pcn .pc-countcard h2');
  for (const k of ['1', '1', '1', '2']) await page.keyboard.press(k);
  await page.waitForTimeout(150);
  { const tab = await t('.pc-tab'); check((await t('.pc-big')) === '4 points counted' && tab.includes('Quartz1375.021.6543.30') && tab.includes('Feldspar2125.0'), 'point counter: keys tally, %, SE and 2σ'); }
  await page.keyboard.press('Backspace'); await page.waitForTimeout(100);
  check((await t('.pc-big')) === '3 points counted' && (await t('.pc-tab')).includes('Quartz13100.0'), 'point counter: Backspace undoes');
  await page.click('.pcn .pc-cb[data-i="2"]'); await page.keyboard.press('Control+z'); await page.click('.pcn .pc-cb[data-i="3"]'); await page.waitForTimeout(100);
  check((await t('.pc-tab')).includes('Matrix41') && (await t('.pc-tab')).includes('Lithic fragments30') && (await t('.pc-cb[data-i="0"] b')) === '3', 'point counter: buttons, Ctrl+Z and live counts on buttons');
  // Made-up thin section with a 15 × 20 grid.
  await page.click('.pcn .pc-demo'); await page.waitForFunction(() => document.querySelector('.pcn .pc-cv')?.dataset.drawn === '300', null, { timeout: 15000 });
  check((await t('.pc-prog')) === 'Point 1 of 300 · 0 counted' && (await t('.pc-placed')) === '300 points placed' && (await t('.pc-tab')).includes('True area %'), 'point counter: made-up section, grid placed, true areas shown');
  await page.click('.pcn .pc-countcard h2');
  for (const k of ['1', '1', '2', '3', '6', '1', '4', '1', '2', '1']) await page.keyboard.press(k);
  await page.waitForTimeout(200);
  check((await t('.pc-prog')) === 'Point 11 of 300 · 10 counted' && (await t('.pc-big')) === '10 points counted' && (await t('.pc-tab')).includes('Quartz1550.0'), 'point counter: counting points on the image');
  { const px = await page.$eval('.pcn .pc-cv', (c) => [...c.getContext('2d').getImageData(Math.round(c.width / 40), Math.round(c.height / 30), 1, 1).data]);
    check(px[3] === 255 && !(px[0] === 0 && px[1] === 0 && px[2] === 0), 'point counter: image and points drawn'); }
  await page.$eval('.pcn .pc-cv', (c) => { const r = c.getBoundingClientRect(); window.scrollTo(0, window.scrollY + r.top + r.height * 0.052 - window.innerHeight / 2); });
  await page.waitForTimeout(200);
  { const b = await page.$eval('.pcn .pc-cv', (c) => { const r = c.getBoundingClientRect(); return { x: r.left + r.width * (0.02 + (0.96 * 2.5) / 20), y: r.top + r.height * (0.02 + (0.96 * 0.5) / 15) }; });
    await page.mouse.click(b.x, b.y); await page.waitForTimeout(150);
    check((await t('.pc-prog')) === 'Point 3 of 300 · 10 counted', 'point counter: tap a point to go back to it'); }
  await page.click('.pcn .pc-countcard h2'); await page.keyboard.press('3'); await page.waitForTimeout(150);
  check((await t('.pc-prog')) === 'Point 11 of 300 · 10 counted' && (await t('.pc-tab')).includes('Feldspar2110.0') && (await t('.pc-tab')).includes('Lithic fragments3220.0'), 'point counter: recount a point, then on to the next uncounted');
  await page.keyboard.press('Backspace'); await page.waitForTimeout(100);
  check((await t('.pc-prog')) === 'Point 3 of 300 · 10 counted' && (await t('.pc-tab')).includes('Feldspar2220.0'), 'point counter: undo restores the old class');
  await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await page.waitForTimeout(100);
  check((await t('.pc-prog')) === 'Point 5 of 300 · 10 counted', 'point counter: arrow keys move');
  await page.fill('.pcn .pc-target', '5'); await page.waitForTimeout(150);
  check((await t('.pc-tab')).includes('Points for target') && (await t('.pc-tab')).includes('Quartz1550.0') && (await t('.pc-tab')).includes('400'), 'point counter: points for a target 2σ');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pcn .pc-csv')]); const f = OUT + 'pc.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n');
    check(r.length === 7 && r[0].startsWith('class,key,count,N,percent,se_percent,two_sigma_percent,exact95_low_percent') && r[0].endsWith('true_area_percent') && r[1].startsWith('Quartz,1,5,10,50,15.8114,31.6228,18.7086,81.2914,') && r[1].includes(',400,'), 'point counter: results CSV (exact range matches scipy)'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pcn .pc-pcsv')]); const f = OUT + 'pcp.csv'; await d.saveAs(f); const r = readFileSync(f, 'utf8').trim().split('\n');
    check(r.length === 301 && r[0] === 'point,x_fraction,y_fraction,x_px,y_px,key,class' && r[1] === '1,0.044,0.052,39.6,31.2,1,Quartz' && r[300].endsWith(',,'), 'point counter: every point CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.pcn .pc-out > .dl:last-child [data-f=docx]')]); const f = OUT + 'pc.docx'; await d.saveAs(f); check(readFileSync(f).subarray(0, 2).toString() === 'PK', 'point counter: Word report'); }
  // Random points (placing new points asks first; the test accepts).
  await page.selectOption('.pcn .pc-mode', 'random'); await page.fill('.pcn .pc-n', '50'); await page.fill('.pcn .pc-seed', '3'); await page.click('.pcn .pc-place'); await page.waitForTimeout(300);
  check((await t('.pc-placed')) === '50 points placed' && (await t('.pc-prog')) === 'Point 1 of 50 · 0 counted', 'point counter: random points replace the grid');
  await page.fill('.pcn .pc-n', '0'); await page.click('.pcn .pc-place'); await page.waitForTimeout(150);
  check((await t('.pc-perr')).includes('from 1 to 10,000'), 'point counter: bad number of points');
  await page.fill('.pcn .pc-n', '50'); await page.selectOption('.pcn .pc-mode', 'grid');
  // Your own image (a small PNG made here).
  const b64 = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 120; c.height = 80; const x = c.getContext('2d'); x.fillStyle = '#c33'; x.fillRect(0, 0, 60, 80); x.fillStyle = '#33c'; x.fillRect(60, 0, 60, 80); return c.toDataURL('image/png').split(',')[1]; });
  await page.setInputFiles('.pcn .pc-file', { name: 'slide.png', mimeType: 'image/png', buffer: Buffer.from(b64, 'base64') }); await page.waitForTimeout(500);
  check((await t('.pc-imginfo')).startsWith('slide.png: 120 × 80 pixels') && (await t('.pc-placed')) === '300 points placed' && !(await t('.pc-tab')).includes('True area'), 'point counter: open your own image');
  await page.setInputFiles('.pcn .pc-file', { name: 'bad.png', mimeType: 'image/png', buffer: Buffer.from('not an image') }); await page.waitForTimeout(400);
  check((await t('.pc-perr')).includes('could not be opened'), 'point counter: bad image message');
  await page.click('.pcn .pc-noimg'); await page.waitForTimeout(150);
  check((await t('.pc-prog')) === 'Tally: 0 counted' && await page.isHidden('.pcn .pc-wrap'), 'point counter: back to tally only');
  await page.fill('.pcn .pc-cls', '1 A\n1 B'); await page.waitForTimeout(150);
  check((await t('.pc-cerr')).includes('The key "1" is used twice'), 'point counter: duplicate key message');
  await page.fill('.pcn .pc-cls', 'q Quartz\nf Feldspar'); await page.waitForTimeout(150);
  await page.click('.pcn .pc-countcard h2'); await page.keyboard.press('Q'); await page.keyboard.press('f'); await page.waitForTimeout(100);
  check((await t('.pc-big')) === '2 points counted' && (await page.$$('.pcn .pc-cb')).length === 2, 'point counter: letter keys, any case');
  page.off('dialog', accept);
};
