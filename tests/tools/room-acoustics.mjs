// #938 room acoustics
export const path = '/science/room-acoustics/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  const R = '.rma ';
  const big = () => page.textContent(R + '.rm-big');
  const set = async (sel, v) => { await page.fill(R + sel, v); await page.waitForTimeout(350); };
  await page.goto(`${BASE}/science/room-acoustics/`); await page.waitForTimeout(600);
  check((await big()) === 'Reverberation time 0.45 s (Eyring), 0.50 s (Sabine) at 500 Hz to 1 kHz', 'room: example RT60 (NumPy 0.451 / 0.499 s)');
  { const f = await page.textContent(R + '.rm-facts'); check(f.includes('50 m³, 85 m²') && f.includes('190 Hz') && f.includes('0.63 m') && f.includes('34.32 Hz') && f.includes('0.19'), 'room: example facts (Schroeder 190 Hz, critical distance 0.63 m, lowest mode)'); }
  { const t = await page.textContent(R + '.rm-btab'); check(t.includes('8.9') && t.includes('0.90') && t.includes('0.85') && t.includes('4.7'), 'room: band table (125 Hz A 8.9 m², Sabine 0.90 s, Eyring 0.85 s, air 4.7 dB/km at 1 kHz)'); }
  { const s = await page.textContent(R + '.rm-msum'); check(s.startsWith('65 modes up to 200 Hz: 11 axial, 32 tangential, 22 oblique') && s.includes('within 0.5 %'), 'room: 65 modes, coincident pair flagged'); }
  check((await page.$$eval(R + '.rm-mtab tbody tr', (r) => r.length)) === 65 && (await page.textContent(R + '.rm-mtab tbody tr:nth-child(5)')).includes('68.64'), 'room: mode table');
  check(await page.isVisible(R + '.rm-rt') && await page.isVisible(R + '.rm-mfig'), 'room: both charts');
  // Height 2.7 m separates the 68.64 Hz pair.
  await set('.rm-H', '2.7');
  check((await page.textContent(R + '.rm-mtab tbody tr:nth-child(4)')).includes('63.560, 0, 1'), 'room: 2.7 m height moves the vertical mode to 63.56 Hz');
  await set('.rm-H', '2.5');
  // Material preset fills the field; typing own values switches to "My own values".
  await page.selectOption(R + '.rm-m-floor', 'carpet'); await page.waitForTimeout(350);
  check((await page.inputValue(R + '.rm-a-floor')) === '0.05, 0.08, 0.2, 0.35, 0.5, 0.6' && (await big()) !== 'Reverberation time 0.45 s (Eyring), 0.50 s (Sabine) at 500 Hz to 1 kHz', 'room: carpet preset shortens RT');
  await set('.rm-a-floor', '0.02, 0.03, 0.04, 0.05, 0.05, 0.07');
  check((await page.inputValue(R + '.rm-m-floor')) === 'own', 'room: typed values switch the list to My own values');
  await set('.rm-a-floor', '0.02, 0.03, 0.04, 0.05, 0.05, 0.05');
  check((await page.inputValue(R + '.rm-m-floor')) === 'hard' && (await big()).includes('0.45 s'), 'room: typed preset values are recognised');
  // Air absorption off: longer at 4 kHz.
  const t4 = async () => Number((await page.textContent(R + '.rm-btab tbody tr:nth-child(6) td:nth-child(5)')));
  const with4 = await t4();
  await page.uncheck(R + '.rm-air'); await page.waitForTimeout(350);
  check((await t4()) > with4 && (await page.textContent(R + '.rm-btab')).includes('off'), `room: air absorption off lengthens 4 kHz (${with4} → ${await t4()})`);
  await page.check(R + '.rm-air'); await page.waitForTimeout(350);
  // Modes limit
  await set('.rm-fmax', '500');
  { const s = await page.textContent(R + '.rm-msum'); const n = Number(s.split(' ')[0]); check(n > 600 && (await page.$$eval(R + '.rm-mtab tbody tr', (r) => r.length)) === 80 && (await page.textContent(R + '.rm-mnote')).includes('lowest 80'), `room: modes to 500 Hz (${n}), table shows 80`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.rm-mcsv')]); const f = OUT + 'modes.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'frequency_hz,n_length,n_width,n_height,type' && rows[1] === '34.321,1,0,0,axial' && rows.length > 600, 'room: modes CSV has all modes'); }
  await set('.rm-fmax', '200');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.rm-csv')]); const f = OUT + 'rt.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 7 && rows[0].startsWith('band_hz,absorption_m2') && rows[3].startsWith('500,14.5,'), `room: bands CSV ${rows[3]}`); }
  for (const fmt of ['png', 'pdf', 'docx']) { const [d] = await Promise.all([page.waitForEvent('download'), page.click(`${R}.dl button[data-f=${fmt}]`)]); check(d.suggestedFilename() === `room-acoustics.${fmt}`, `room: ${fmt} download`); }
  // Bad input
  await set('.rm-L', '0');
  check((await page.textContent(R + '.rm-err')).includes('length, width and height') && await page.isHidden(R + '.rm-out'), 'room: bad size message');
  await set('.rm-L', '5'); await set('.rm-a-ceil', '0.2, 0.3');
  check((await page.textContent(R + '.rm-err')).startsWith('Ceiling: give six absorption coefficients'), 'room: wrong count of coefficients');
  await set('.rm-a-ceil', '1, 1, 1, 1, 1, 1'); await set('.rm-a-floor', '1, 1, 1, 1, 1, 1'); await set('.rm-a-ends', '1, 1, 1, 1, 1, 1'); await set('.rm-a-sides', '1, 1, 1, 1, 1, 1');
  check((await page.textContent(R + '.rm-err')).includes('absorbs as much as or more than'), 'room: total absorption message');
  await set('.rm-a-ceil', '0.15, 0.25, 0.4, 0.55, 0.6, 0.6'); await set('.rm-a-floor', '0.02, 0.03, 0.04, 0.05, 0.05, 0.05'); await set('.rm-a-ends', '0.1, 0.08, 0.06, 0.05, 0.05, 0.05'); await set('.rm-a-sides', '0.1, 0.08, 0.06, 0.05, 0.05, 0.05');
  await set('.rm-x', '1, 2');
  check((await page.textContent(R + '.rm-err')).startsWith('Extra absorption'), 'room: bad extra absorption message');
  await set('.rm-x', '1, 2, 3, 3.5, 4, 4'); await set('.rm-rh', '120');
  check((await page.textContent(R + '.rm-err')).includes('relative humidity'), 'room: bad humidity message');
  await set('.rm-rh', '50');
  check((await big()).includes('0.45 s') && await page.isHidden(R + '.rm-err'), 'room: back to the example');
};
