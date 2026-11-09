// #937 Spectrometer calibration
export const path = '/science/spectrometer-calibration/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.spc ';
  await page.goto(`${BASE}${path}`); await page.waitForTimeout(800);
  const big = () => page.textContent(R + '.sc-big'), facts = () => page.textContent(R + '.sc-facts'), w = () => page.waitForTimeout(300);
  const coef = (t) => { const m = t.match(/λ = ([\d.]+) \+ ([\d.]+) x \+ ([\d.]+) × 10⁻⁵ x²/); return m ? [+m[1], +m[2], +m[3] * 1e-5] : []; };
  { const c = coef(await big()); check(c.length === 3 && Math.abs(c[0] - 380) < 0.2 && Math.abs(c[1] - 0.32) < 0.002 && Math.abs(c[2] - 2e-5) < 1e-6 && (await facts()).includes('0.120 nm'), `spec: example quadratic recovers λ = 380 + 0.32x + 2e-5x² (${await big()})`); }
  check((await page.textContent(R + '.sc-mnote')).startsWith('Matched 8 of 8 peaks') && (await facts()).includes('8 of 8 peaks') && (await facts()).includes('0.337 nm per pixel'), 'spec: all 8 example lines matched automatically');
  check(await page.isVisible(R + '.sc-photo') && await page.isVisible(R + '.sc-fig') && await page.isVisible(R + '.sc-fig2'), 'spec: photo, spectrum and residual charts');
  await page.selectOption(R + '.sc-deg', '1'); await w();
  check((await facts()).includes('straight line fit') && (await big()).includes('x') && !(await big()).includes('x²'), 'spec: straight-line fit');
  await page.selectOption(R + '.sc-deg', '3'); await w();
  check((await big()).includes('x³'), 'spec: cubic fit');
  await page.selectOption(R + '.sc-deg', '2');
  await page.selectOption(R + '.sc-tab tr:nth-child(4) .sc-pick', '-1'); await w();
  check((await facts()).includes('7 of 8 peaks'), 'spec: leave a peak out by hand');
  await page.selectOption(R + '.sc-tab tr:nth-child(4) .sc-pick', '1'); await w();
  check((await page.textContent(R + '.sc-err')).includes('used once') && await page.isHidden(R + '.sc-out'), 'spec: same line twice message');
  await page.click(R + '.sc-auto'); await w();
  check((await facts()).includes('8 of 8 peaks') && await page.isVisible(R + '.sc-out'), 'spec: match automatically again');
  await page.fill(R + '.sc-th', '50'); await w();
  check((await page.$$(R + '.sc-tab tr')).length === 5 && (await facts()).includes('4 of 4 peaks'), 'spec: a 50 % threshold keeps the 4 strongest lines, all matched');
  await page.selectOption(R + '.sc-deg', '3'); await w();
  check((await facts()).includes('needs more lines than coefficients'), 'spec: cubic through 4 lines has no residual estimate');
  await page.selectOption(R + '.sc-deg', '2'); await page.selectOption(R + '.sc-tab tr:nth-child(2) .sc-pick', '-1'); await page.selectOption(R + '.sc-tab tr:nth-child(3) .sc-pick', '-1'); await w();
  check(await page.isVisible(R + '.sc-err') && (await page.textContent(R + '.sc-err')).includes('at least 3 matched lines') && await page.isHidden(R + '.sc-out'), 'spec: too few lines for a quadratic message');
  await page.fill(R + '.sc-th', '10'); await page.selectOption(R + '.sc-deg', '2'); await page.fill(R + '.sc-b0', '70'); await page.fill(R + '.sc-b1', '60'); await w();
  check((await page.textContent(R + '.sc-err')).includes('second larger'), 'spec: bad band message');
  await page.fill(R + '.sc-b0', '40'); await page.fill(R + '.sc-b1', '60'); await page.fill(R + '.sc-sm', '3'); await w();
  check(await page.isVisible(R + '.sc-out'), 'spec: smoothing 3 pixels still calibrates');
  await page.fill(R + '.sc-sm', '1');
  await page.selectOption(R + '.sc-set', 'ne'); await w();
  check((await page.textContent(R + '.sc-tab')).includes('Ne 585.2') || (await page.textContent(R + '.sc-mnote')).includes('pick the lines by hand'), 'spec: another light source changes the line list');
  await page.selectOption(R + '.sc-set', 'cfl'); await w();
  // A photo: the example rotated so the spectrum runs top to bottom, red at the top.
  const b64 = await page.evaluate(() => { const s = document.querySelector('.spc .sc-photo'); const c = document.createElement('canvas'); c.width = s.height; c.height = s.width; const x = c.getContext('2d'); x.translate(c.width / 2, c.height / 2); x.rotate(-Math.PI / 2); x.drawImage(s, -s.width / 2, -s.height / 2); return c.toDataURL('image/png').split(',')[1]; });
  writeFileSync(OUT + 'spec-v.png', Buffer.from(b64, 'base64'));
  await page.selectOption(R + '.sc-dir', 'v'); await page.fill(R + '.sc-b0', '45'); await page.fill(R + '.sc-b1', '55'); await page.setInputFiles(R + '.sc-file', OUT + 'spec-v.png'); await page.waitForTimeout(1200);
  check((await page.textContent(R + '.sc-ph')).includes('spec-v.png: 120 × 1000') && (await facts()).includes('red on the left') && (await facts()).includes('8 of 8 peaks'), `spec: vertical photo with red first (${await facts()})`);
  writeFileSync(OUT + 'not-a-photo.txt', 'hello');
  await page.setInputFiles(R + '.sc-file', OUT + 'not-a-photo.txt'); await w();
  check((await page.textContent(R + '.sc-err')).includes('is not a photo'), 'spec: not a photo message');
  await page.selectOption(R + '.sc-dir', 'h'); await page.click(R + '.sc-ex'); await page.waitForTimeout(600);
  check((await big()).startsWith('λ = 380.0') && await page.isHidden(R + '.sc-err'), 'spec: example again');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.sc-csv')]); const f = OUT + 'spec.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 1001 && rows[0] === 'pixel,wavelength_nm,brightness' && rows[1].startsWith('0,380.0'), `spec: calibrated spectrum CSV (${rows[1]})`); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl [data-f=${fmt}]`)]); check(d.suggestedFilename().endsWith('.' + fmt), `spec: ${fmt} download`); }
};
