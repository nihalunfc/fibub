// #329 Spore size measurer
export const path = '/science/spore-size-measurer/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.spm ';
  const big = () => page.textContent(R + '.sp-big'), err = () => page.textContent(R + '.sp-err');
  const tapPhoto = async (x, y) => {
    const pt = await page.evaluate(([x, y]) => { const c = document.querySelector('.spm .sp-photo'); let r = c.getBoundingClientRect(); window.scrollBy(0, r.top + (y / c.height) * r.height - innerHeight / 2); r = c.getBoundingClientRect(); return [r.left + (x / c.width) * r.width, r.top + (y / c.height) * r.height]; }, [x, y]);
    await page.mouse.click(pt[0], pt[1]); await page.waitForTimeout(60);
  };
  const dl = async (sel, f) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + sel)]); await d.saveAs(OUT + f); return readFileSync(OUT + f, 'utf8').trim().split('\n'); };
  await page.goto(BASE + path); await page.waitForTimeout(900);
  check((await big()) === '(9.0–)9.6–11.3(–11.8) × (5.3–)5.6–6.6(–6.8) µm; mean 10.5 ± 0.9 × 6.1 ± 0.5 µm; Q = (1.42–)1.55–1.91(–2.12), Qm = 1.73 ± 0.18; n = 24', `spores: example summary (${await big()})`);
  check((await page.textContent(R + '.sp-facts')).includes('10 px per µm') && await page.isVisible(R + '.sp-fig'), 'spores: scale and chart');
  await page.selectOption(R + '.sp-mid', 'pct'); await page.waitForTimeout(100);
  check((await big()).startsWith('(9.0–)9.2–11.7(–11.8) × (5.3–)5.4–6.7(–6.8) µm'), 'spores: percentile middle range');
  await page.selectOption(R + '.sp-mid', 'sd');
  const rows = await dl('.sp-csv', 'spores.csv');
  check(rows.length === 25 && rows[0] === 'spore,length_um,width_um,Q,method,centre_x_px,centre_y_px' && rows[1].includes(',fitted,'), 'spores: CSV');
  { const c = rows[1].split(','); await page.click(R + '.sp-kind button[data-k=x]'); await tapPhoto(Number(c[5]), Number(c[6])); }
  check((await big()).endsWith('n = 23'), 'spores: remove a spore');
  await page.click(R + '.sp-undo'); await page.waitForTimeout(60);
  check((await big()).endsWith('n = 24'), 'spores: undo');
  await page.click(R + '.sp-kind button[data-k=m]');
  await page.fill(R + '.sp-lmax', '1'); await page.click(R + '.sp-auto'); await page.waitForTimeout(100);
  check((await err()).includes('longer than the shortest'), 'spores: bad limits message');
  await page.fill(R + '.sp-lmax', '100'); await page.fill(R + '.sp-qmax', '0.5'); await page.click(R + '.sp-auto'); await page.waitForTimeout(100);
  check((await err()).includes('1 or more'), 'spores: bad Q limit message');
  await page.fill(R + '.sp-qmax', '4');
  // A synthetic photo: 200 px scale bar = 20 µm, spores of 12 × 6, 10 × 5 and 8 × 6 µm (10 px per µm).
  const b64 = await page.evaluate(() => { const c = document.createElement('canvas'); c.width = 800; c.height = 600; const x = c.getContext('2d'); x.fillStyle = '#eee'; x.fillRect(0, 0, 800, 600); x.fillStyle = '#333'; x.fillRect(500, 550, 200, 6);
    [[200, 200, 60, 30, 0], [450, 250, 50, 25, 0.7], [300, 420, 40, 30, 1.2]].forEach(([cx, cy, a, b, t]) => { x.beginPath(); x.ellipse(cx, cy, a, b, t, 0, 2 * Math.PI); x.fill(); }); return c.toDataURL('image/png').split(',')[1]; });
  writeFileSync(OUT + 'spores.png', Buffer.from(b64, 'base64'));
  await page.setInputFiles(R + '.sp-file', OUT + 'spores.png'); await page.waitForTimeout(600);
  check((await page.textContent(R + '.sp-step')).includes('scale bar') && (await err()).includes('scale bar'), 'spores: new photo asks for the scale bar');
  await page.fill(R + '.sp-len', '20'); await tapPhoto(500, 553); await tapPhoto(700, 553); await page.waitForTimeout(300);
  check((await err()).includes('Measure a spore'), 'spores: then asks for a spore');
  await tapPhoto(140, 200); await tapPhoto(260, 200); await tapPhoto(200, 170); await tapPhoto(200, 230); await page.waitForTimeout(100);
  { const b = await big(), m = b.match(/mean ([\d.]+) ± [\d.]+ × ([\d.]+)/); check(b.endsWith('n = 1') && Math.abs(Number(m[1]) - 12) <= 0.2 && Math.abs(Number(m[2]) - 6) <= 0.2, `spores: tapped spore 12 × 6 µm (${b})`); }
  await page.click(R + '.sp-auto'); await page.waitForTimeout(200);
  { const r = await dl('.sp-csv', 'spores2.csv'); const fit = r.slice(1).filter((l) => l.includes('fitted')).map((l) => l.split(',').map(Number)).sort((a, b) => b[1] - a[1]);
    const want = [[12, 6], [10, 5], [8, 6]];
    check(r.length === 5 && fit.length === 3 && fit.every((f, i) => Math.abs(f[1] - want[i][0]) < 0.15 && Math.abs(f[2] - want[i][1]) < 0.15), `spores: three spores fitted automatically (${fit.map((f) => f[1] + '×' + f[2]).join(' ')})`); }
  await page.click(R + '.sp-clear'); await page.waitForTimeout(60);
  check((await err()).includes('Measure a spore') && await page.isHidden(R + '.sp-out'), 'spores: clear all');
  await page.fill(R + '.sp-len', '0'); await page.waitForTimeout(400);
  check((await err()).includes('length of the scale bar'), 'spores: bad scale length message');
};
