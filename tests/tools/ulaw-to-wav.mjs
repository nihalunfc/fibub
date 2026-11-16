// #T957 U-law to WAV
export const path = '/everyday/ulaw-to-wav/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/ulaw-to-wav/`); await page.waitForTimeout(300);
  const R = '.u2w ';
  // 1 s raw u-law of a 1 kHz tone, the same bytes as "voice.dat" (unknown name), and a 0.5 s .sln16.
  await page.evaluate(() => {
    const enc = (x) => { let s = x >> 2, m = 0xff; if (s < 0) { s = -s; m = 0x7f; } if (s > 8159) s = 8159; s += 0x21; const E = [0x3f, 0x7f, 0xff, 0x1ff, 0x3ff, 0x7ff, 0xfff, 0x1fff]; let g = 0; while (g < 8 && s > E[g]) g++; return ((g << 4) | ((s >> (g + 1)) & 15)) ^ m; };
    const u = new Uint8Array(8000).map((_, i) => enc(Math.round(16000 * Math.sin((2 * Math.PI * 1000 * i) / 8000))));
    const sl = new Uint8Array(16000); const v = new DataView(sl.buffer); for (let i = 0; i < 8000; i++) v.setInt16(i * 2, 1000, true);
    const dt = new DataTransfer();
    dt.items.add(new File([u], 'msg0001.ulaw')); dt.items.add(new File([u], 'voice.dat')); dt.items.add(new File([sl], 'prompt.sln16'));
    const inp = document.querySelector('.u2w .u2w-file'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForFunction(() => [...document.querySelectorAll('.u2w-list .st')].every((s) => !s.textContent.includes('Reading')), null, { timeout: 15000 });
  const st = await page.$$eval(R + '.u2w-list .st', (a) => a.map((s) => s.textContent));
  check(st[0].includes('raw u-law, 8,000 Hz') && st[0].includes('1.0 s'), `ulaw-to-wav: .ulaw read as 1 s of u-law (${st[0]})`);
  check(st[1].includes('Unknown kind'), `ulaw-to-wav: an unknown raw file asks for the format (${st[1]})`);
  check(st[2].includes('16-bit linear, 16,000 Hz') && st[2].includes('0.5 s'), `ulaw-to-wav: .sln16 is 16 kHz (${st[2]})`);
  check(await page.isVisible(R + '.u2w-all'), 'ulaw-to-wav: ZIP button for several files');
  await page.selectOption(R + '.u2w-kind', 'ulaw');
  await page.waitForFunction(() => document.querySelectorAll('.u2w-save').length === 3, null, { timeout: 5000 });
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.u2w-save')]); const f = OUT + 'u2w.wav'; await d.saveAs(f); const b = readFileSync(f);
  let peak = 0; for (let i = 44; i < b.length; i += 2) peak = Math.max(peak, Math.abs(b.readInt16LE(i)));
  check(d.suggestedFilename() === 'msg0001.wav' && b.length === 16044 && b.readUInt16LE(20) === 1 && b.readUInt32LE(24) === 8000 && Math.abs(peak - 16000) < 600, `ulaw-to-wav: 16-bit WAV, 8 kHz, level kept (${b.length} bytes, peak ${peak})`);
};
