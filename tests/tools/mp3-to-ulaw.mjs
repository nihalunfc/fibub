// #T955 MP3 to u-law (and the shared PhoneConvert component used by #T956)
export const path = '/everyday/mp3-to-ulaw/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/mp3-to-ulaw/`); await page.waitForTimeout(300);
  const R = '.pbx ';
  check(await page.isHidden(R + '.pbx-out'), 'mp3-to-ulaw: waits for files');
  // Two files: a 30 s stereo 44.1 kHz WAV tone (quiet) and a broken file. (MP3 goes through the same browser decoder.)
  await page.evaluate(() => {
    const wav = (rate, secs, nc, amp) => {
      const n = Math.round(rate * secs), b = new ArrayBuffer(44 + n * nc * 2), v = new DataView(b);
      const s = (o, t) => { for (let i = 0; i < 4; i++) v.setUint8(o + i, t.charCodeAt(i)); };
      s(0, 'RIFF'); v.setUint32(4, 36 + n * nc * 2, true); s(8, 'WAVE'); s(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, nc, true);
      v.setUint32(24, rate, true); v.setUint32(28, rate * nc * 2, true); v.setUint16(32, nc * 2, true); v.setUint16(34, 16, true); s(36, 'data'); v.setUint32(40, n * nc * 2, true);
      for (let i = 0; i < n; i++) for (let c = 0; c < nc; c++) v.setInt16(44 + (i * nc + c) * 2, Math.round(amp * Math.sin((2 * Math.PI * 440 * i) / rate) * 32767), true);
      return b;
    };
    const dt = new DataTransfer();
    dt.items.add(new File([wav(44100, 30, 2, 0.1)], 'greeting.wav', { type: 'audio/wav' }));
    dt.items.add(new File([new Uint8Array([1, 2, 3, 4, 5])], 'broken.mp3', { type: 'audio/mpeg' }));
    const inp = document.querySelector('.pbx .pbx-file'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForFunction(() => [...document.querySelectorAll('.pbx-list .st')].every((s) => !s.textContent.includes('Reading')), null, { timeout: 15000 });
  const st = await page.$$eval(R + '.pbx-list .st', (a) => a.map((s) => s.textContent));
  check(st[0].includes('30.0 s') && st[0].includes('greeting.ulaw') && st[0].includes('240 KB'), `mp3-to-ulaw: 30 s -> greeting.ulaw, 240 KB (${st[0]})`);
  check(st[1].includes('cannot read'), `mp3-to-ulaw: a broken file says so (${st[1]})`);
  check(await page.isHidden(R + '.pbx-all'), 'mp3-to-ulaw: no ZIP button for one good file');
  const save = async (name) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pbx-save')]); const f = OUT + name; await d.saveAs(f); return { b: readFileSync(f), n: d.suggestedFilename() }; };
  const u = await save('pbx.ulaw');
  let peak = 0; for (const x of u.b) { const y = ~x & 0xff; const t = (((y & 0x0f) << 3) + 0x84) << ((y & 0x70) >> 4); peak = Math.max(peak, Math.abs(y & 0x80 ? 0x84 - t : t - 0x84)); }
  check(u.n === 'greeting.ulaw' && u.b.length === 240000, `mp3-to-ulaw: raw u-law is 240,000 bytes (${u.b.length})`);
  check(Math.abs(peak / 32768 - 0.708) < 0.03, `mp3-to-ulaw: volume evened out to -3 dB (peak ${(peak / 32768).toFixed(3)})`);
  await page.selectOption(R + '.pbx-fmt', 'wav-ulaw');
  const w = await save('pbx.wav');
  check(w.n === 'greeting.wav' && w.b.length === 240058 && w.b.readUInt16LE(20) === 7 && w.b.readUInt32LE(24) === 8000 && w.b.readUInt16LE(22) === 1 && w.b.toString('latin1', 38, 42) === 'fact', `mp3-to-ulaw: u-law WAV, format 7, 8 kHz mono, 240,058 bytes (${w.b.length})`);
  await page.selectOption(R + '.pbx-fmt', 'sln'); await page.uncheck(R + '.pbx-norm');
  const s = await save('pbx.sln');
  let p2 = 0; for (let i = 0; i < s.b.length; i += 2) p2 = Math.max(p2, Math.abs(s.b.readInt16LE(i)));
  check(s.b.length === 480000 && Math.abs(p2 / 32767 - 0.1) < 0.01, `mp3-to-ulaw: .sln 16-bit, original level kept when unticked (${(p2 / 32767).toFixed(3)})`);
};
