// #861 AFM roughness analyser
import { deflateSync } from 'node:zlib';
export const path = '/science/afm-roughness/';

// A minimal 16-bit greyscale PNG writer (filter 0 rows) for the open-a-file check.
const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc = (b) => { let c = 0xffffffff; for (const x of b) c = crcTable[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (type, data) => { const t = Buffer.from(type, 'ascii'), len = Buffer.alloc(4), cr = Buffer.alloc(4); len.writeUInt32BE(data.length); cr.writeUInt32BE(crc(Buffer.concat([t, data]))); return Buffer.concat([len, t, data, cr]); };
function png16(w, h, f) {
  const raw = Buffer.alloc(h * (1 + 2 * w));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) raw.writeUInt16BE(f(x, y), y * (1 + 2 * w) + 1 + 2 * x);
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 16; ihdr[9] = 0;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

export default async ({ page, check, BASE, OUT, readFileSync, writeFileSync }) => {
  const R = '.afm ';
  await page.goto(`${BASE}/science/afm-roughness/`); await page.waitForTimeout(1000);
  const big = () => page.textContent(R + '.afm-big'), rf = () => page.textContent(R + '.afm-rfacts'), pf = () => page.textContent(R + '.afm-pfacts');
  const wait = () => page.waitForTimeout(250);
  check((await big()) === 'Sa 8.612 nm · Sq 9.308 nm', `afm: example headline matches numpy (${await big()})`);
  { const t = await page.textContent(R + '.afm-facts'); check(t.includes('0.805') && t.includes('1.666') && t.includes('24.22 nm') && t.includes('128 × 128 points') && t.includes('pixel 39.37 × 39.37 nm'), 'afm: areal facts match numpy/scipy'); }
  { const t = await rf(); check(t.includes('20.09 nm') && t.includes('Sq 0.5738 nm') && t.includes('7788 points') && t.includes('3304 points') && t.includes('mean 0 nm'), `afm: step height and region A roughness (${t.slice(0, 80)})`); }
  { const t = await pf(); check(t.includes('4.836 nm, 5.598 nm') && t.includes('128 samples') && t.includes('20.34 nm'), 'afm: middle-row profile parameters'); }
  check(await page.isVisible(R + '.afm-map') && await page.isVisible(R + '.afm-pfig') && await page.isVisible(R + '.afm-hfig'), 'afm: map, profile and histogram drawn');
  // Map pixel colours: afmhot, then grey.
  const px = () => page.evaluate(() => { const c = document.querySelector('.afm .afm-map'); const x = c.getContext('2d').getImageData(Math.round(c.width * 0.3), Math.round(c.height * 0.5), 1, 1).data; return [x[0], x[1], x[2]]; });
  { const [r, g, b] = await px(); check(r > 0 && r > g && g >= b, `afm: AFM-hot colours on the low side (${r},${g},${b})`); }
  await page.selectOption(R + '.afm-cm', 'grey'); await wait();
  { const [r, g, b] = await px(); check(r === g && g === b && r > 0 && r < 100, `afm: grey colours (${r},${g},${b})`); }
  await page.selectOption(R + '.afm-cm', 'hot');
  // Downloads.
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.afm-pcsv')]); const f = OUT + 'afmp.csv'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === 'distance_um,height_nm' && rows.length === 129 && rows[128].startsWith('5,'), `afm: profile CSV (${rows.length} rows)`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.afm-mtxt')]); const f = OUT + 'afml.txt'; await d.saveAs(f); const rows = readFileSync(f, 'utf8').trim().split('\n'); check(rows[0] === '# Width: 5 µm' && rows.length === 131 && rows[3].split(' ').length === 128, `afm: levelled heights TXT (${rows.length} lines)`); }
  { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.dl button[data-f=pdf]')]); check((await d.suggestedFilename()) === 'afm-roughness.pdf', 'afm: PDF report'); }
  // Levelling options.
  await page.selectOption(R + '.afm-fitto', 'all'); await wait();
  check((await rf()).includes('5.749 nm'), 'afm: plane fitted to the whole image tilts with the step (numpy 5.749 nm)');
  await page.selectOption(R + '.afm-ord', '2'); await wait();
  check((await rf()).includes('2.648 nm'), 'afm: 2nd-order surface over the whole image (numpy 2.648 nm)');
  await page.selectOption(R + '.afm-ord', '3'); await page.selectOption(R + '.afm-fitto', 'A'); await wait();
  check((await rf()).includes('24.03 nm'), 'afm: 3rd-order surface fitted to region A (numpy 24.03 nm)');
  await page.selectOption(R + '.afm-ord', '0'); await wait();
  check(!(await rf()).includes('20.09 nm') && (await big()) !== 'Sa 8.612 nm · Sq 9.308 nm', 'afm: no levelling');
  await page.selectOption(R + '.afm-ord', '1'); await page.selectOption(R + '.afm-flat', '0'); await wait();
  check((await rf()).includes('20.09 nm'), 'afm: row offsets keep a step that crosses every row');
  await page.selectOption(R + '.afm-flat', '1'); await wait();
  check(!(await rf()).includes('20.09 nm'), 'afm: line flattening (tilt per row)');
  await page.selectOption(R + '.afm-flat', '-1'); await wait();
  check((await rf()).includes('20.09 nm'), 'afm: back to the plane on region A');
  // Typed positions: a vertical line inside region A gives film roughness only.
  await page.click(R + '.afm-pos summary');
  await page.fill(R + '.afm-lx0', '1'); await page.fill(R + '.afm-ly0', '0'); await page.fill(R + '.afm-lx1', '1'); await page.fill(R + '.afm-ly1', '5'); await wait();
  { const t = await pf(); const ra = Number(t.match(/Ra, Rq([\d.]+) nm/)[1]); check(ra > 0.3 && ra < 0.7, `afm: line inside the film only (Ra ${ra})`); }
  // Drag region B onto part of the film: step close to zero.
  await page.click(R + '.afm-mode button[data-m=B]');
  await page.locator(R + '.afm-map').scrollIntoViewIfNeeded();
  { const bb = await page.locator(R + '.afm-map').boundingBox(); const W = bb.width;
    // The plot area starts 46 px (figure units) from the left; drag over x ≈ 0.2..0.4 of the plot, y 0.2..0.8.
    const s = W / (await page.evaluate(() => document.querySelector('.afm .afm-map').width / Math.min(3, devicePixelRatio || 1)));
    const pl = 46 * s, pw = W - (46 + (W / s < 500 ? 64 : 80)) * s, ph = pw;
    await page.mouse.move(bb.x + pl + 0.2 * pw, bb.y + 10 * s + 0.2 * ph); await page.mouse.down(); await page.mouse.move(bb.x + pl + 0.3 * pw, bb.y + 10 * s + 0.5 * ph, { steps: 4 }); await page.mouse.move(bb.x + pl + 0.4 * pw, bb.y + 10 * s + 0.8 * ph, { steps: 4 }); await page.mouse.up(); }
  await wait();
  { const bx0 = Number(await page.inputValue(R + '.afm-bx0')), bx1 = Number(await page.inputValue(R + '.afm-bx1')); const st = Number((await rf()).match(/B − A\)(-?[\d.e−-]+)/)[1]); check(bx0 > 0.7 && bx0 < 1.4 && bx1 > 1.7 && bx1 < 2.6 && Math.abs(st) < 0.5, `afm: dragged region B (x ${bx0}–${bx1}, step ${st})`); }
  // Drag the profile line.
  await page.click(R + '.afm-mode button[data-m=line]');
  { const bb = await page.locator(R + '.afm-map').boundingBox(); await page.mouse.move(bb.x + bb.width * 0.2, bb.y + bb.height * 0.2); await page.mouse.down(); await page.mouse.move(bb.x + bb.width * 0.7, bb.y + bb.height * 0.6, { steps: 5 }); await page.mouse.up(); }
  await wait();
  check(Number(await page.inputValue(R + '.afm-ly1')) > 2 && (await pf()) !== '', 'afm: dragged profile line');
  // Open a text file with a Gwyddion header in metres and a 10 µm scan: same heights, so same Sa.
  await page.click(R + '.afm-ex'); await wait();
  const rows = (await page.inputValue(R + '.afm-data')).trim().split('\n').filter((l) => !l.startsWith('#'));
  writeFileSync(OUT + 'afm.txt', '# Channel: Height\n# Width: 10.000 µm\n# Height: 10.000 µm\n# Value units: m\n' + rows.map((r) => r.split(' ').map((x) => (Number(x) * 1e-9).toExponential(9)).join('\t')).join('\n'));
  await page.setInputFiles(R + '.afm-in', OUT + 'afm.txt'); await page.waitForTimeout(800);
  check((await big()) === 'Sa 8.612 nm · Sq 9.308 nm' && (await page.textContent(R + '.afm-facts')).includes('10 × 10 µm') && (await page.inputValue(R + '.afm-zu')) === '1e9' && (await page.textContent(R + '.afm-note')).includes('header'), `afm: opened text file with header (${await big()})`);
  // XYZ text.
  const xyz = []; for (let j = 0; j < 6; j++) for (let i = 0; i < 8; i++) xyz.push(`${i * 0.5} ${j * 0.5} ${(i + j) % 2 ? 1 : -1}`);
  await page.selectOption(R + '.afm-zu', '1'); await page.selectOption(R + '.afm-ord', '0'); await page.fill(R + '.afm-data', xyz.join('\n')); await wait();
  check((await big()) === 'Sa 1 nm · Sq 1 nm' && (await page.textContent(R + '.afm-facts')).includes('8 × 6 points') && (await page.textContent(R + '.afm-facts')).includes('3.5 × 2.5 µm') && await page.isHidden(R + '.afm-w'), `afm: XYZ list read as a grid (${await big()})`);
  await page.selectOption(R + '.afm-fmt', 'xyz'); await page.fill(R + '.afm-data', xyz.slice(1).join('\n')); await wait();
  check((await page.textContent(R + '.afm-err')).includes('not a full grid'), 'afm: incomplete XYZ grid message (XYZ chosen)');
  await page.selectOption(R + '.afm-fmt', 'auto'); await page.selectOption(R + '.afm-ord', '1');
  // Bad text.
  await page.fill(R + '.afm-data', '1 2 3\n4 5\n6 7 8\n1 2 3'); await wait();
  check((await page.textContent(R + '.afm-err')).includes('Row 2'), 'afm: ragged matrix message');
  await page.fill(R + '.afm-data', '1 2 3\n4 x 6\n7 8 9'); await wait();
  check((await page.textContent(R + '.afm-err')).includes('Line 2'), 'afm: not-a-number message');
  await page.click(R + '.afm-ex'); await page.fill(R + '.afm-w', '0'); await wait();
  check((await page.textContent(R + '.afm-err')).includes('scan width'), 'afm: zero scan size message');
  await page.fill(R + '.afm-w', '5');
  // 16-bit PNG: flat at 0 on the left, 20 % of full scale (20 nm of 100 nm) from x = 24 of 40.
  writeFileSync(OUT + 'afm.png', png16(40, 30, (x) => (x >= 24 ? 13107 : 0)));
  await page.setInputFiles(R + '.afm-in', OUT + 'afm.png'); await page.waitForTimeout(800);
  check((await page.textContent(R + '.afm-note')).includes('40 × 30 pixels, 16-bit greyscale') && await page.isVisible(R + '.afm-zr') && await page.isHidden(R + '.afm-data'), 'afm: 16-bit PNG opened');
  check((await rf()).includes('20 nm') && (await page.textContent(R + '.afm-facts')).includes('40 × 30 points'), `afm: PNG step height 20 nm (${(await rf()).slice(0, 40)})`);
  await page.fill(R + '.afm-zr', '50'); await wait();
  check((await rf()).includes('10 nm'), 'afm: z-scale halves the step');
  await page.fill(R + '.afm-zr', ''); await wait();
  check((await page.textContent(R + '.afm-err')).includes('full grey scale'), 'afm: missing z-scale message');
  writeFileSync(OUT + 'bad.png', Buffer.from('not a png at all'));
  await page.setInputFiles(R + '.afm-in', OUT + 'bad.png'); await wait();
  check(await page.isVisible(R + '.afm-ferr'), 'afm: unreadable file message');
  await page.click(R + '.afm-ex'); await wait();
  check((await big()) === 'Sa 8.612 nm · Sq 9.308 nm' && await page.isVisible(R + '.afm-data'), 'afm: back to the example');
};
