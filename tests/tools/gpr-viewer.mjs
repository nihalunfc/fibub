// #513 GPR radargram viewer
export const path = '/science/gpr-viewer/';

// A small big-endian rev 1 SEG-Y file: 6 traces × 50 samples of IEEE floats, dt field 100 (ps), sx stepping 0.5 m.
function segy() {
  const nt = 6, ns = 50, b = Buffer.alloc(3600 + nt * (240 + ns * 4), 0x40);
  b.fill(0, 3200);
  b.writeUInt16BE(100, 3216); b.writeUInt16BE(ns, 3220); b.writeUInt16BE(5, 3224); b.writeUInt16BE(0x0100, 3500); b.writeUInt16BE(1, 3502);
  for (let i = 0; i < nt; i++) {
    const p = 3600 + i * (240 + ns * 4);
    b.writeInt16BE(-10, p + 70); b.writeInt32BE(5 * i, p + 72); b.writeUInt16BE(ns, p + 114); b.writeUInt16BE(100, p + 116);
    for (let j = 0; j < ns; j++) b.writeFloatBE(j === 10 ? 1000 : j === 30 ? -(i + 1) * 10 : 0, p + 240 + j * 4);
  }
  return b;
}
// A 16-bit, two-channel DZT file: 8 scans × 64 samples, range 32 ns, 20 scans per metre.
function dzt() {
  const ns = 64, nt = 8, h = Buffer.alloc(2048);
  h.writeUInt16LE(0x00ff, 0); h.writeInt16LE(1024, 2); h.writeInt16LE(ns, 4); h.writeInt16LE(16, 6); h.writeUInt16LE(32768, 8);
  h.writeFloatLE(64, 10); h.writeFloatLE(20, 14); h.writeFloatLE(32, 26); h.writeInt16LE(2, 52); h.writeFloatLE(9, 54);
  const d = Buffer.alloc(nt * ns * 2 * 2);
  for (let i = 0; i < nt; i++) for (let c = 0; c < 2; c++) for (let j = 0; j < ns; j++) d.writeUInt16LE(32768 + (c === 0 ? (j === 20 ? 5000 : 0) : (j === 40 ? -7000 : 0)), ((i * 2 + c) * ns + j) * 2);
  return Buffer.concat([h, d]);
}

export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/science/gpr-viewer/`); await page.waitForTimeout(800);
  const t = (c) => page.textContent('.gpr ' + c);
  const tap = async (c) => { await page.locator('.gpr ' + c).scrollIntoViewIfNeeded(); await page.click('.gpr ' + c); await page.waitForTimeout(150); };
  const drawn = () => page.waitForFunction(() => { const c = document.querySelector('.gpr .gp-fig'); if (!c || !c.width) return false; const x = c.getContext('2d').getImageData(c.width / 2, c.height / 2, 1, 1).data; return x[3] > 0; });
  await drawn();
  check((await t('.gp-name')) === 'Made-up example profile' && (await page.inputValue('.gpr .gp-t0')) === '6' && (await page.inputValue('.gpr .gp-dt')) === '0.125' && (await page.inputValue('.gpr .gp-dx')) === '0.05', 'gpr: example loads with time zero 6 ns, 0.125 ns, 0.05 m');
  check(await page.isVisible('.gpr .gp-fig') && await page.isVisible('.gpr .gp-tfig') && (await t('.gp-trx')).includes('6 m'), 'gpr: radargram and middle trace drawn');
  // a pixel inside the plot is not blank background
  { const px = await page.evaluate(() => { const c = document.querySelector('.gpr .gp-fig'), d = c.dataset, s = c.width / Number(d.w); const a = c.getContext('2d').getImageData((Number(d.l) + 10) * s, (Number(d.t) + Number(d.ph) / 2) * s, 1, 1).data; return [a[0], a[1], a[2]]; }); check(px[0] === px[1] && px[1] === px[2] && px[0] > 20 && px[0] < 235, 'gpr: grey radargram pixels'); }
  // pick five points on the pipe hyperbola at 4 m, 0.7 m deep (times after the 6 ns time zero)
  await tap('.gp-pick'); await page.evaluate(() => document.querySelector('.gpr .gp-fig').scrollIntoView({ block: 'start' })); await page.waitForTimeout(100);
  for (const x of [3.3, 3.7, 4, 4.3, 4.7]) {
    const tt = (2 * Math.hypot(x - 4, 0.7)) / 0.1;
    const pos = await page.evaluate(([x, tt]) => { const c = document.querySelector('.gpr .gp-fig'), d = c.dataset, r = c.getBoundingClientRect(), f = r.width / Number(d.w); return { x: r.left + (Number(d.l) + (x / 12) * Number(d.pw)) * f, y: r.top + (Number(d.t) + (tt / (431 * 0.125)) * Number(d.ph)) * f }; }, [x, tt]);
    await page.mouse.click(pos.x, pos.y); await page.waitForTimeout(60);
  }
  { const f = await t('.gp-fit'), v = Number(f.match(/([\d.]+) m\/ns/)[1]), z = Number(f.match(/depth ([\d.]+) m/)[1]);
    check(Math.abs(v - 0.1) < 0.004 && Math.abs(z - 0.7) < 0.05 && f.includes('5 points'), `gpr: hyperbola picks give v ≈ 0.1 m/ns and depth ≈ 0.7 m (${v}, ${z})`); }
  await tap('.gp-use');
  check(/^0\.(09|10)\d+$/.test(await page.inputValue('.gpr .gp-v')), 'gpr: use this speed sets v');
  await tap('.gp-clr'); await tap('.gp-pick');
  check((await t('.gp-fit')) === '' && await page.isDisabled('.gpr .gp-use'), 'gpr: clear points');
  for (const [g, lab] of [['linear', 'Gain slope'], ['agc', 'AGC window'], ['none', 'No setting'], ['exp', 'dB per ns']]) { await page.selectOption('.gpr .gp-gain', g); await page.waitForTimeout(150); check((await t('.gp-gpl')).includes(lab) && (await t('.gp-ghelp')).length > 10, `gpr: gain ${g}`); }
  await page.uncheck('.gpr .gp-dw'); await page.uncheck('.gpr .gp-bg'); await page.selectOption('.gpr .gp-cmap', 'bwr'); await page.waitForTimeout(200);
  { const px = await page.evaluate(() => { const c = document.querySelector('.gpr .gp-fig'), d = c.dataset, s = c.width / Number(d.w); const a = c.getContext('2d').getImageData((Number(d.l) + 10) * s, (Number(d.t) + 3) * s, 1, 1).data; return [a[0], a[1], a[2]]; }); check(!(px[0] === px[1] && px[1] === px[2]), 'gpr: blue-white-red colours, no dewow or background'); }
  await page.selectOption('.gpr .gp-dax', '0'); await page.waitForTimeout(150);
  check(await page.evaluate(() => { const d = document.querySelector('.gpr .gp-fig').dataset; return Number(d.pw) === Number(d.w) - 58 - 16; }), 'gpr: time-only axis widens the plot');
  await page.selectOption('.gpr .gp-dax', '1');
  await page.fill('.gpr .gp-tr', '10'); await page.dispatchEvent('.gpr .gp-tr', 'change'); await page.waitForTimeout(150);
  check((await t('.gp-trx')).includes('0.45 m'), 'gpr: choose trace 10');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.gpr .gp-csv')]); const f = OUT + 'gpr.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'time_ns,amplitude' && rows.length === 433 && rows[2].startsWith('0.125,'), 'gpr: trace CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.gpr .gp-png')]); const f = OUT + 'gpr.png'; await d.saveAs(f); const b = readFileSync(f); check(b.subarray(1, 4).toString() === 'PNG' && [1200, 1800].includes(b.readUInt32BE(16)), 'gpr: radargram PNG at 3×'); }
  await page.fill('.gpr .gp-v', '0.5'); await page.waitForTimeout(150);
  check((await t('.gp-err')).includes('0.3 m/ns') && await page.isHidden('.gpr .gp-out'), 'gpr: bad speed message');
  await page.fill('.gpr .gp-v', '0.1');
  // SEG-Y file
  await page.setInputFiles('.gpr .gp-file', { name: 'line1.sgy', mimeType: 'application/octet-stream', buffer: segy() }); await page.waitForTimeout(400);
  { const i = await t('.gp-info'); check(i.includes('SEG-Y rev 1, 4-byte IEEE float, big-endian') && i.includes('6') && (await page.inputValue('.gpr .gp-dt')) === '0.1' && (await page.inputValue('.gpr .gp-dx')) === '0.5' && (await t('.gp-dtnote')).includes('read as ps') && await page.isVisible('.gpr .gp-out'), 'gpr: SEG-Y file read (format, 0.1 ns from ps, 0.5 m from coordinates)'); }
  await page.uncheck('.gpr .gp-dw'); await page.uncheck('.gpr .gp-bg'); await page.selectOption('.gpr .gp-gain', 'none'); await page.fill('.gpr .gp-tr', '3'); await page.dispatchEvent('.gpr .gp-tr', 'change'); await page.waitForTimeout(200);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.gpr .gp-csv')]); const f = OUT + 'gpr2.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 51 && rows[11] === '1,1000' && rows[31] === '3,-30', 'gpr: SEG-Y samples come through unchanged'); }
  await page.fill('.gpr .gp-t0', '1'); await page.waitForTimeout(200);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.gpr .gp-csv')]); const f = OUT + 'gpr3.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows.length === 41 && rows[1] === '0,1000', 'gpr: time zero cuts 10 samples'); }
  // DZT file, two channels
  await page.setInputFiles('.gpr .gp-file', { name: 'FILE____001.DZT', mimeType: 'application/octet-stream', buffer: dzt() }); await page.waitForTimeout(400);
  check((await t('.gp-info')).includes('GSSI DZT, 16-bit, 2 channels') && (await page.inputValue('.gpr .gp-dt')) === '0.5' && (await page.inputValue('.gpr .gp-dx')) === '0.05' && await page.isVisible('.gpr .gp-chw') && await page.isVisible('.gpr .gp-blkw'), 'gpr: DZT file read (two channels, 0.5 ns, 0.05 m)');
  await page.selectOption('.gpr .gp-ch', '1'); await page.waitForTimeout(300);
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.gpr .gp-csv')]); const f = OUT + 'gpr4.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check((await t('.gp-info')).includes('showing 2') && rows.some((r) => r.endsWith(',-7000')), 'gpr: second DZT channel'); }
  await page.setInputFiles('.gpr .gp-file', { name: 'bad.sgy', mimeType: 'application/octet-stream', buffer: Buffer.alloc(500) }); await page.waitForTimeout(300);
  check((await t('.gp-err')).includes('too short'), 'gpr: bad file message');
  await tap('.gp-ex'); await drawn();
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click('.gpr .gp-out > .dl:last-child [data-f=docx]')]); const f = OUT + 'gpr.docx'; await d.saveAs(f); check(readFileSync(f).subarray(0, 2).toString() === 'PK', 'gpr: Word report'); }
};
