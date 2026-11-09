// #180 gel and western blot densitometry
export const path = '/science/gel-densitometry/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  await page.goto(`${BASE}/science/gel-densitometry/`); await page.waitForTimeout(600);
  check((await page.textContent('.dns .dn-big')) === 'Target ÷ Loading control: 100, 182, 444, 602, 288, 159 % of Untreated', 'densitometry: example blot normalised to the loading control');
  { const t = await page.textContent('.dns .dn-tab'); check(t.includes('64.78') && t.includes('601') && t.includes('Loading control % of ref.'), 'densitometry: example table'); }
  check((await page.textContent('.dns .dn-facts')).includes('Saturatednone') && await page.isVisible('.dns .dn-bars') && await page.isVisible('.dns .dn-prof'), 'densitometry: saturation check and both figures');
  await page.selectOption('.dns .dn-ctl', '-1'); await page.waitForTimeout(100);
  check((await page.textContent('.dns .dn-big')).startsWith('Target: 100, 200, 400, 601, 302, 150 %'), 'densitometry: without a loading control');
  await page.selectOption('.dns .dn-bg', 'rolling'); await page.waitForTimeout(100);
  check((await page.textContent('.dns .dn-facts')).includes('rolling window of 51 px') && !(await page.textContent('.dns .dn-big')).includes('200, 400'), 'densitometry: rolling background');
  await page.selectOption('.dns .dn-bg', 'line'); await page.selectOption('.dns .dn-ref', '3'); await page.waitForTimeout(100);
  check((await page.textContent('.dns .dn-big')).endsWith('% of 4 h') && (await page.textContent('.dns .dn-big')).includes(', 100, '), 'densitometry: another reference lane');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dns .dn-csv')]); const f = OUT + 'dens.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 7 && rows[0].startsWith('lane,Target volume') && rows[1].startsWith('Untreated,'), 'densitometry: amounts CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.dns .dn-pcsv')]); const f = OUT + 'densp.csv'; await d.saveAs(f); check(readFileSync(f, 'utf8').trim().split('\n').length === 301, 'densitometry: lane profile CSV'); }
  await page.fill('.dns .dn-bands', 'Only one, 80, 110'); await page.waitForTimeout(400);
  check((await page.textContent('.dns .dn-big')).startsWith('Only one:'), 'densitometry: typed band row');
  await page.fill('.dns .dn-bands', 'Bad, 80'); await page.waitForTimeout(400);
  check((await page.textContent('.dns .dn-err')).includes('give a top and a bottom') && await page.isHidden('.dns .dn-out'), 'densitometry: bad band row message');
  await page.click('.dns .dn-find'); await page.waitForTimeout(100);
  // A fluorescent-style photo, 1600 px wide (scaled to 1200): four lanes with bands of 50, 100, 150 and 200 grey.
  { const b64 = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 1600; c.height = 600; const x = c.getContext('2d'); x.fillStyle = '#000'; x.fillRect(0, 0, 1600, 600); [50, 100, 150, 200].forEach((g, i) => { x.fillStyle = `rgb(${g},${g},${g})`; x.fillRect(400 * i + 50, 250, 300, 40); }); return c.toDataURL('image/png').split(',')[1]; });
    writeFileSync(OUT + 'fluor.png', Buffer.from(b64, 'base64')); }
  await page.selectOption('.dns .dn-dark', '0'); await page.fill('.dns .dn-names', '');
  await page.setInputFiles('.dns .dn-file', OUT + 'fluor.png'); await page.waitForTimeout(800);
  await page.fill('.dns .dn-n', '4'); await page.waitForTimeout(600);
  { const big = await page.textContent('.dns .dn-big'); const v = big.replace(/^.*?: /, '').split(' %')[0].split(', ').map(Number); check(v.length === 4 && v.every((x, i) => Math.abs(x / (100 * (i + 1)) - 1) < 0.03) && (await page.textContent('.dns .dn-ph')).includes('1200 × 450'), `densitometry: fluorescent photo, light bands on dark, scaled down (${big})`); }
  await page.locator('.dns .dn-photo').scrollIntoViewIfNeeded(); await page.click('.dns .dn-area'); await page.locator('.dns .dn-photo').scrollIntoViewIfNeeded(); { const bb = await page.locator('.dns .dn-photo').boundingBox(); await page.mouse.click(bb.x + 2, bb.y + 2); await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height - 2); }
  await page.fill('.dns .dn-n', '2'); await page.waitForTimeout(600);
  check((await page.textContent('.dns .dn-big')) === 'Band 1: 100, 200 % of Lane 1' && (await page.textContent('.dns .dn-facts')).includes('2 lanes, 1 band row'), 'densitometry: lane area set by two taps');
};
