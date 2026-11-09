// #328 Leaf disease severity
export const path = '/science/leaf-disease-severity/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.lds ';
  const big = () => page.textContent(R + '.ld-big');
  const err = () => page.textContent(R + '.ld-err');
  const fill = async (c, v) => { await page.fill(R + c, v); await page.waitForTimeout(400); };
  await page.goto(BASE + path); await page.waitForTimeout(900);
  check((await big()) === 'Severity: 6.8 % of the leaf, class 2 (over 5 up to 10 %)', `disease: example (${await big()})`);
  { const f = await page.textContent(R + '.ld-facts'); check(f.includes('150,781 px') && f.includes('10,246 px') && f.includes('Spots6') && f.includes('(Otsu)'), 'disease: example facts'); }
  check((await page.textContent(R + '.ld-ctab')).includes('◀ this leaf'), 'disease: class table marks the leaf');
  await fill('.ld-scale', '0, 2, 4, 8, 16, 100');
  check((await big()).endsWith('class 3 (over 4 up to 8 %)'), 'disease: own scale');
  await fill('.ld-scale', '0, 10, 5, 100');
  check((await err()).includes('go up') && await page.isHidden(R + '.ld-out'), 'disease: bad scale message');
  await fill('.ld-scale', '0, 5, 10, 25, 50, 100');
  await fill('.ld-h0', '25');
  { const v = parseFloat((await big()).split(': ')[1]); check(v < 6.8, `disease: wider healthy hue counts brown as healthy (${v})`); }
  await fill('.ld-h0', '200');
  check((await err()).includes('hue range'), 'disease: bad hue range message');
  await fill('.ld-h0', '65'); await fill('.ld-s', '150');
  check((await err()).includes('0 to 100'), 'disease: bad colour strength message');
  await fill('.ld-s', '15'); await fill('.ld-spot', '5000');
  check((await page.textContent(R + '.ld-facts')).includes('Spots0') && (await big()).startsWith('Severity: 6.8 %'), 'disease: spot size limit only changes the count');
  await fill('.ld-spot', '20'); await fill('.ld-t', '300');
  check((await err()).includes('0 to 255'), 'disease: bad leaf threshold message');
  await fill('.ld-t', '');
  await page.uncheck(R + '.ld-tint'); await page.check(R + '.ld-tint');
  await page.click(R + '.ld-add'); await page.click(R + '.ld-add');
  check((await page.textContent(R + '.ld-mean')) === 'Mean of 2 leaves: 6.8 ± 0 (SD) %; mean class 2', `disease: list mean (${await page.textContent(R + '.ld-mean')})`);
  // A synthetic photo on black: a green 300 × 200 leaf with a brown 60 × 50 lesion = 5.0 %.
  const b64 = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 500; c.height = 400; const x = c.getContext('2d'); x.fillStyle = '#000'; x.fillRect(0, 0, 500, 400); x.fillStyle = 'rgb(60,140,50)'; x.fillRect(100, 100, 300, 200); x.fillStyle = 'rgb(140,90,40)'; x.fillRect(150, 150, 60, 50); return c.toDataURL('image/png').split(',')[1]; });
  writeFileSync(OUT + 'leafdark.png', Buffer.from(b64, 'base64'));
  await page.selectOption(R + '.ld-bg', 'dark');
  await page.setInputFiles(R + '.ld-file', OUT + 'leafdark.png'); await page.waitForTimeout(600);
  check((await big()) === 'Severity: 5.0 % of the leaf, class 1 (over 0 up to 5 %)' && (await page.textContent(R + '.ld-facts')).includes('60,000 px'), `disease: dark-background photo (${await big()})`);
  await page.click(R + '.ld-add');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ld-csv')]); const f = OUT + 'sev.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 4 && rows[0].startsWith('leaf,photo,severity_percent') && rows[3].startsWith('3,leafdark,5.0000,1,60000,3000,1'), 'disease: CSV of the list'); }
  await page.click(R + '.ld-reset'); check(await page.isHidden(R + '.ld-list'), 'disease: empty the list');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'leafdark-severity.pdf', 'disease: PDF report'); }
};
