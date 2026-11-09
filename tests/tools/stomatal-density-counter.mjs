// #327 Stomatal density counter
export const path = '/science/stomatal-density-counter/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.sdc ';
  const big = () => page.textContent(R + '.sd-big'), facts = () => page.textContent(R + '.sd-facts');
  const tapPhoto = async (x, y) => {
    const pt = await page.evaluate(([x, y]) => { const c = document.querySelector('.sdc .sd-photo'); let r = c.getBoundingClientRect(); window.scrollBy(0, r.top + (y / c.height) * r.height - innerHeight / 2); r = c.getBoundingClientRect(); return [r.left + (x / c.width) * r.width, r.top + (y / c.height) * r.height]; }, [x, y]);
    await page.mouse.click(pt[0], pt[1]); await page.waitForTimeout(80);
  };
  const dl = async (sel, f) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + sel)]); await d.saveAs(OUT + f); return readFileSync(OUT + f, 'utf8').trim().split('\n'); };
  await page.goto(BASE + path); await page.waitForTimeout(900);
  check((await big()) === 'Stomatal density: 599 per mm²', `stomata: example density (${await big()})`);
  { const f = await facts(); check(f.includes('Stomata23') && f.includes('0.0384 mm²') && f.includes('Epidermal cells37') && f.includes('38.3 %'), `stomata: example facts (${f})`); }
  // Tap a new stoma, remove it, undo.
  await tapPhoto(5, 5);
  check((await big()) === 'Stomatal density: 625 per mm²' && (await page.textContent(R + '.sd-ns')) === '24', 'stomata: a tap adds a stoma');
  await page.click(R + '.sd-kind button[data-k=x]'); await tapPhoto(7, 6);
  check((await page.textContent(R + '.sd-ns')) === '23', 'stomata: remove the nearest mark');
  await page.click(R + '.sd-undo'); await page.waitForTimeout(80);
  check((await page.textContent(R + '.sd-ns')) === '24', 'stomata: undo');
  await page.click(R + '.sd-undo'); await page.click(R + '.sd-undo'); await page.waitForTimeout(80);
  check((await page.textContent(R + '.sd-ns')) === '23', 'stomata: undo again');
  await page.click(R + '.sd-kind button[data-k=e]'); await tapPhoto(5, 5);
  check((await page.textContent(R + '.sd-ne')) === '38' && (await facts()).includes('37.7 %'), 'stomata: a tap adds an epidermal cell and the index moves');
  await page.click(R + '.sd-undo');
  { const rows = await dl('.sd-mcsv', 'marks.csv'); check(rows.length === 61 && rows[0] === 'type,x_px,y_px' && rows.filter((r) => r.startsWith('stoma,')).length === 23, 'stomata: marks CSV'); }
  // Round field from the field number.
  await page.selectOption(R + '.sd-fov', 'fn'); await page.waitForTimeout(150);
  check((await big()) === 'Stomatal density: 96.8 per mm²' && (await facts()).includes('550 µm across'), `stomata: field number 22, 40× objective (${await big()})`);
  await page.fill(R + '.sd-obj', '0'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.sd-err')).includes('field number') && await page.isHidden(R + '.sd-out'), 'stomata: bad objective message');
  await page.fill(R + '.sd-obj', '40');
  await page.selectOption(R + '.sd-fov', 'typed'); await page.fill(R + '.sd-area', '0.1'); await page.waitForTimeout(400);
  check((await big()) === 'Stomatal density: 230 per mm²', 'stomata: typed area');
  await page.click(R + '.sd-add'); await page.fill(R + '.sd-area', '0.2'); await page.waitForTimeout(400); await page.click(R + '.sd-add');
  check((await page.textContent(R + '.sd-mean')).startsWith('Mean of 2 fields: 173 ± 81.3 (SD) per mm²; stomatal index 38.3'), `stomata: field list mean (${await page.textContent(R + '.sd-mean')})`);
  { const rows = await dl('.sd-csv', 'fields.csv'); check(rows.length === 3 && rows[0].startsWith('field,photo,stomata') && rows[1].startsWith('1,example-epidermis,23,37,0.1,230'), 'stomata: fields CSV'); }
  await page.click(R + '.sd-reset'); check(await page.isHidden(R + '.sd-list'), 'stomata: empty the list');
  await page.fill(R + '.sd-area', '0'); await page.waitForTimeout(400);
  check((await page.textContent(R + '.sd-err')).includes('above 0'), 'stomata: bad area message');
  // A synthetic photo: 10 dark ellipses (about 750 px each) on grey; scale line of 300 px = 150 µm.
  const b64 = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 600; c.height = 400; const x = c.getContext('2d'); x.fillStyle = '#c8c8c8'; x.fillRect(0, 0, 600, 400); x.fillStyle = '#404040'; for (let i = 0; i < 10; i++) { x.beginPath(); x.ellipse(60 + (i % 5) * 120, 100 + Math.floor(i / 5) * 160, 20, 12, 0.3 * i, 0, 2 * Math.PI); x.fill(); } return c.toDataURL('image/png').split(',')[1]; });
  writeFileSync(OUT + 'stomata.png', Buffer.from(b64, 'base64'));
  await page.setInputFiles(R + '.sd-file', OUT + 'stomata.png'); await page.waitForTimeout(600);
  await page.selectOption(R + '.sd-fov', 'photo'); await page.fill(R + '.sd-len', '150');
  await page.click(R + '.sd-line'); await tapPhoto(100, 380); await tapPhoto(400, 380); await page.waitForTimeout(400);
  check((await page.textContent(R + '.sd-ns')) === '0' && (await big()) === 'Stomatal density: 0 per mm²', 'stomata: new photo starts with no marks');
  await page.fill(R + '.sd-amin', '5000'); await page.fill(R + '.sd-amax', '6000'); await page.click(R + '.sd-auto'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.sd-err')).includes('Nothing of that size'), 'stomata: nothing found message');
  await page.fill(R + '.sd-amin', '900'); await page.fill(R + '.sd-amax', '100'); await page.click(R + '.sd-auto'); await page.waitForTimeout(150);
  check((await page.textContent(R + '.sd-err')).includes('at least the smallest'), 'stomata: bad size limits message');
  await page.fill(R + '.sd-amin', '300'); await page.fill(R + '.sd-amax', '2000'); await page.click(R + '.sd-auto'); await page.waitForTimeout(200);
  { const b = await big(), v = Number(b.replace(/[^0-9.]/g, '')); check((await page.textContent(R + '.sd-ns')) === '10' && Math.abs(v / 166.67 - 1) < 0.03, `stomata: synthetic photo, 10 found, 0.06 mm² (${b})`); }
  await page.selectOption(R + '.sd-dark', '0'); await page.click(R + '.sd-auto'); await page.waitForTimeout(200);
  check((await page.textContent(R + '.sd-ns')) === '0', 'stomata: lighter-than option finds no light patches of that size');
};
