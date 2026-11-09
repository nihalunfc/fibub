// #961 PIV lite
export const path = '/science/piv-lite/';
export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.pvl ';
  await page.goto(`${BASE}/science/piv-lite/`); await page.waitForTimeout(1500);
  const big = () => page.textContent(R + '.pv-big'), facts = () => page.textContent(R + '.pv-facts');
  check((await big()) === '266 vectors; mean displacement (0.00709, −0.0124) px', 'piv: made-up vortex example');
  { const t = await facts(); check(t.includes('19 × 14 = 266') && t.includes('1 replaced') && t.includes('2.27 px') && t.includes('median 4.39'), 'piv: example details'); }
  await page.selectOption(R + '.pv-ex', 'shift'); await page.waitForTimeout(1200);
  { const m = (await big()).match(/\(([−\d.]+), ([−\d.]+)\)/); const u = Number(m[1].replace('−', '-')), v = Number(m[2].replace('−', '-')); check(Math.abs(u - 3.3) < 0.08 && Math.abs(v + 1.65) < 0.08, `piv: made-up uniform shift recovered (${u}, ${v})`); }
  await page.fill(R + '.pv-px', '10'); await page.fill(R + '.pv-dt', '1'); await page.waitForTimeout(1200);
  check((await big()).includes('mean speed') && (await facts()).includes('1 px per frame = 0.01 m/s'), `piv: speeds in m/s (${(await facts()).slice(-160)})`);
  for (const [s, v] of [['.pv-n', '16'], ['.pv-n', '64'], ['.pv-ov', '0'], ['.pv-ov', '0.75'], ['.pv-p', '1'], ['.pv-p', '3']]) { await page.selectOption(R + s, v); await page.waitForTimeout(900); }
  check((await facts()).includes('64 px windows every 16 px, 3 passes'), 'piv: window, overlap and passes options');
  await page.selectOption(R + '.pv-n', '32'); await page.selectOption(R + '.pv-ov', '0.5'); await page.selectOption(R + '.pv-p', '2'); await page.uncheck(R + '.pv-med'); await page.waitForTimeout(900);
  check((await facts()).includes('not tested'), 'piv: median test off');
  await page.selectOption(R + '.pv-ex', 'shear'); await page.waitForTimeout(1200);
  check((await big()).startsWith('266 vectors'), 'piv: made-up shear example');
  await page.selectOption(R + '.pv-sc', '2'); await page.selectOption(R + '.pv-sc', '1'); check(await page.isVisible(R + '.pv-fig'), 'piv: arrow scales');
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pv-csv')]); const f = OUT + 'piv.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'x_px,y_px,u_px,v_px,u_m_s,v_m_s,peak_ratio,status' && rows.length === 267, 'piv: vectors CSV'); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl [data-f=png]')]); check(d.suggestedFilename() === 'piv.png', 'piv: image download'); }
  // Own frames: random dots, frame B moved 3 px right and 2 px down.
  const pair = await page.evaluate(() => { const mk = (dx, dy) => { const c = document.createElement('canvas'); c.width = 200; c.height = 160; const x = c.getContext('2d'); x.fillStyle = '#000'; x.fillRect(0, 0, 200, 160); let s = 3; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; x.fillStyle = '#fff'; for (let k = 0; k < 900; k++) { const px = r() * 220 - 10, py = r() * 180 - 10; x.beginPath(); x.arc(px + dx, py + dy, 1.4, 0, 7); x.fill(); } return c.toDataURL('image/png').split(',')[1]; }; const s = document.createElement('canvas'); s.width = 100; s.height = 100; return [mk(0, 0), mk(3, 2), s.toDataURL('image/png').split(',')[1]]; });
  writeFileSync(OUT + 'pa.png', Buffer.from(pair[0], 'base64')); writeFileSync(OUT + 'pb.png', Buffer.from(pair[1], 'base64')); writeFileSync(OUT + 'small.png', Buffer.from(pair[2], 'base64')); writeFileSync(OUT + 'bad.png', 'not an image');
  await page.setInputFiles(R + '.pv-fa', OUT + 'pa.png'); await page.waitForTimeout(800);
  check((await page.textContent(R + '.pv-err')).includes('Open both frames') && (await page.textContent(R + '.pv-files')).includes('pa.png'), 'piv: asks for the second frame');
  await page.setInputFiles(R + '.pv-fb', OUT + 'pb.png'); await page.waitForTimeout(1200);
  { const m = (await big()).match(/\(([−\d.]+), ([−\d.]+)\)/); const u = Number(m[1].replace('−', '-')), v = Number(m[2].replace('−', '-')); check(Math.abs(u - 3) < 0.1 && Math.abs(v - 2) < 0.1 && (await page.textContent(R + '.pv-files')).includes('200 × 160'), `piv: own frames moved (3, 2) px recovered (${u}, ${v})`); }
  await page.setInputFiles(R + '.pv-fb', OUT + 'small.png'); await page.waitForTimeout(800);
  check((await page.textContent(R + '.pv-err')).includes('differ in size') && await page.isHidden(R + '.pv-out'), 'piv: frames of different sizes message');
  await page.setInputFiles(R + '.pv-fb', OUT + 'bad.png'); await page.waitForTimeout(800);
  check((await page.textContent(R + '.pv-err')).includes('could not be read as an image'), 'piv: not an image message');
  await page.setInputFiles(R + '.pv-fb', OUT + 'pb.png'); await page.fill(R + '.pv-dt', '-1'); await page.waitForTimeout(800);
  check((await page.textContent(R + '.pv-err')).includes('time between frames'), 'piv: bad frame interval message');
};
