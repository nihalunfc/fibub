// #338 Canopy gap analyser
export const path = '/science/canopy-gap-analyser/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.cga ';
  const big = () => page.textContent(R + '.cg-big'), facts = () => page.textContent(R + '.cg-facts'), err = () => page.textContent(R + '.cg-err');
  const fill = async (c, v) => { await page.fill(R + c, v); await page.waitForTimeout(500); };
  const tapPhoto = async (x, y) => {
    const pt = await page.evaluate(([x, y]) => { const c = document.querySelector('.cga .cg-photo'); let r = c.getBoundingClientRect(); window.scrollBy(0, r.top + (y / c.height) * r.height - innerHeight / 2); r = c.getBoundingClientRect(); return [r.left + (x / c.width) * r.width, r.top + (y / c.height) * r.height]; }, [x, y]);
    await page.mouse.click(pt[0], pt[1]); await page.waitForTimeout(80);
  };
  await page.goto(BASE + path); await page.waitForTimeout(1000);
  check((await big()) === 'Effective LAI: 2.51', `canopy: example (${await big()})`);
  { const f = await facts(); check(f.includes('10.3 %') && f.includes('9.2 %') && f.includes('blue > 31') && f.includes('5 from 0° to 75°'), `canopy: example facts (${f})`); }
  { const t = await page.textContent(R + '.cg-tab'); check(t.includes('27.50') && t.includes('3.91') && await page.isVisible(R + '.cg-fig') && await page.isHidden(R + '.cg-warn'), 'canopy: ring table and chart'); }
  await page.selectOption(R + '.cg-z', '90'); await page.waitForTimeout(200);
  check((await big()) === 'Effective LAI: 2.31', `canopy: rings to 90° (${await big()})`);
  await page.selectOption(R + '.cg-z', '75');
  await fill('.cg-n', '0'); check((await err()).includes('1 to 18'), 'canopy: bad ring count message');
  await fill('.cg-n', '10'); check((await page.$$eval(R + '.cg-tab tbody tr', (r) => r.length)) === 10, 'canopy: ten rings');
  await fill('.cg-n', '5');
  await fill('.cg-r', '400'); check((await err()).includes('runs off the photo') && await page.isHidden(R + '.cg-out'), 'canopy: circle off the photo message');
  await fill('.cg-r', '296');
  await fill('.cg-t', '252'); check(await page.isVisible(R + '.cg-warn') && (await page.textContent(R + '.cg-warn')).includes('no sky'), 'canopy: no-sky ring warning');
  await fill('.cg-t', '300'); check((await err()).includes('0 to 255'), 'canopy: bad threshold message');
  await fill('.cg-t', '');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.cg-csv')]); await d.saveAs(OUT + 'rings.csv'); const r = readFileSync(OUT + 'rings.csv', 'utf8').trim().split('\n'); check(r.length === 11 && r[0].startsWith('zenith_from_deg') && r[7].startsWith('effective_LAI,2.51'), 'canopy: rings CSV'); }
  // A synthetic photo: sky only within 45° of the zenith (inner half of the radius) → openness 1 − cos 45° = 29.3 %, gap fraction 25 %.
  const b64 = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 500; c.height = 400; const x = c.getContext('2d'); x.fillStyle = '#000'; x.fillRect(0, 0, 500, 400); x.fillStyle = 'rgb(30,60,20)'; x.beginPath(); x.arc(250, 200, 180, 0, 7); x.fill(); x.fillStyle = 'rgb(170,200,250)'; x.beginPath(); x.arc(250, 200, 90, 0, 7); x.fill(); return c.toDataURL('image/png').split(',')[1]; });
  writeFileSync(OUT + 'fish.png', Buffer.from(b64, 'base64'));
  await page.setInputFiles(R + '.cg-file', OUT + 'fish.png'); await page.waitForTimeout(800);
  check((await page.inputValue(R + '.cg-r')) === '200', 'canopy: new photo, circle centred');
  await page.click(R + '.cg-tap'); await tapPhoto(250, 200); await tapPhoto(430, 200); await page.waitForTimeout(400);
  { const r = Number(await page.inputValue(R + '.cg-r')); check(Math.abs(r - 180) < 3, `canopy: circle set by two taps (radius ${r})`); }
  await fill('.cg-cx', '250'); await fill('.cg-cy', '200'); await fill('.cg-r', '180');
  { const f = await facts(), m = f.match(/openness([\d.]+) %.*Gap fraction([\d.]+) %/s); check(Math.abs(Number(m[1]) - 29.3) <= 0.4 && Math.abs(Number(m[2]) - 25) <= 0.4 && await page.isVisible(R + '.cg-warn'), `canopy: synthetic 45° sky disc, openness 29.3 %, gap 25 % (${m[1]}, ${m[2]})`); }
  { const t = await page.textContent(R + '.cg-tab'); check(t.includes('100.00') && t.includes('0.00'), 'canopy: open inner rings, closed outer rings'); }
  await page.uncheck(R + '.cg-tint'); await page.check(R + '.cg-tint');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=docx]')]); check((await d.suggestedFilename()) === 'fish-canopy.docx', 'canopy: Word report'); }
};
