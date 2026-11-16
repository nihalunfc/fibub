// #T963 Audio converter (and the shared AudioConvert component used by #T965 Extract audio)
export const path = '/everyday/audio-converter/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/audio-converter/`); await page.waitForTimeout(300);
  const R = '.acv ';
  // 3 s stereo 44.1 kHz WAV.
  await page.evaluate(() => {
    const rate = 44100, n = rate * 3, nc = 2, b = new ArrayBuffer(44 + n * nc * 2), v = new DataView(b);
    const s = (o, t) => { for (let i = 0; i < 4; i++) v.setUint8(o + i, t.charCodeAt(i)); };
    s(0, 'RIFF'); v.setUint32(4, 36 + n * nc * 2, true); s(8, 'WAVE'); s(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, nc, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * nc * 2, true); v.setUint16(32, nc * 2, true); v.setUint16(34, 16, true); s(36, 'data'); v.setUint32(40, n * nc * 2, true);
    for (let i = 0; i < n; i++) for (let c = 0; c < nc; c++) v.setInt16(44 + (i * nc + c) * 2, Math.round(0.4 * Math.sin((2 * Math.PI * 440 * i) / rate) * 32767), true);
    const dt = new DataTransfer(); dt.items.add(new File([b], 'song.wav', { type: 'audio/wav' }));
    const inp = document.querySelector('.acv .acv-file'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForSelector(R + '.acv-save', { timeout: 15000 });
  const st = await page.textContent(R + '.acv-list .st');
  check(st.includes('3.0 s, stereo, 44,100 Hz → song.mp3') && st.includes('72 KB'), `audio-converter: 3 s stereo -> song.mp3, about 72 KB at 192 kbps (${st})`);
  const save = async (name) => { const [d] = await Promise.all([page.waitForEvent('download', { timeout: 30000 }), page.click(R + '.acv-save')]); const f = OUT + name; await d.saveAs(f); return { b: readFileSync(f), n: d.suggestedFilename() }; };
  const m = await save('acv.mp3');
  check(m.n === 'song.mp3' && m.b[0] === 0xff && (m.b[1] & 0xe0) === 0xe0 && Math.abs(m.b.length - 72000) < 3000, `audio-converter: MP3 frame header, ${m.b.length} bytes`);
  await page.selectOption(R + '.acv-fmt', 'wav24'); await page.selectOption(R + '.acv-ch', 'mono'); await page.selectOption(R + '.acv-rate', '22050');
  const w = await save('acv.wav');
  check(w.n === 'song.wav' && w.b.readUInt16LE(22) === 1 && w.b.readUInt32LE(24) === 22050 && w.b.readUInt16LE(34) === 24 && w.b.readUInt32LE(40) === 22050 * 3 * 3, `audio-converter: 24-bit mono 22,050 Hz WAV (${w.b.readUInt32LE(40)} data bytes)`);
};
