// #T964 Audio joiner
export const path = '/everyday/audio-joiner/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/audio-joiner/`); await page.waitForTimeout(300);
  const R = '.aj ';
  // Two WAVs: "a" 1 s mono 8 kHz at +0.5, "b" 2 s stereo 16 kHz at -0.25.
  await page.evaluate(() => {
    const wav = (rate, secs, nc, val) => {
      const n = Math.round(rate * secs), b = new ArrayBuffer(44 + n * nc * 2), v = new DataView(b);
      const s = (o, t) => { for (let i = 0; i < 4; i++) v.setUint8(o + i, t.charCodeAt(i)); };
      s(0, 'RIFF'); v.setUint32(4, 36 + n * nc * 2, true); s(8, 'WAVE'); s(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, nc, true);
      v.setUint32(24, rate, true); v.setUint32(28, rate * nc * 2, true); v.setUint16(32, nc * 2, true); v.setUint16(34, 16, true); s(36, 'data'); v.setUint32(40, n * nc * 2, true);
      for (let i = 0; i < n * nc; i++) v.setInt16(44 + i * 2, Math.round(val * 32767), true);
      return b;
    };
    const dt = new DataTransfer();
    dt.items.add(new File([wav(8000, 1, 1, 0.5)], 'a.wav', { type: 'audio/wav' }));
    dt.items.add(new File([wav(16000, 2, 2, -0.25)], 'b.wav', { type: 'audio/wav' }));
    const inp = document.querySelector('.aj .aj-file'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForFunction(() => document.querySelector('.aj-info').textContent.includes('2 files'), null, { timeout: 15000 });
  check((await page.textContent(R + '.aj-info')).startsWith('2 files → 3.0 s, stereo, 16,000 Hz'), `audio-joiner: straight join (${await page.textContent(R + '.aj-info')})`);
  await page.selectOption(R + '.aj-mode', 'gap'); await page.fill(R + '.aj-sec', '0.5');
  check((await page.textContent(R + '.aj-info')).startsWith('2 files → 3.5 s'), 'audio-joiner: 0.5 s gap');
  await page.click(R + '.aj-list li:nth-child(2) button[aria-label^="Move b.wav up"]');
  check((await page.textContent(R + '.aj-list li:first-child .nm')) === 'b.wav', 'audio-joiner: reorder');
  await page.selectOption(R + '.aj-fmt', 'wav16');
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.aj-save')]); const f = OUT + 'aj.wav'; await d.saveAs(f); const b = readFileSync(f);
  const at = (s, c) => b.readInt16LE(44 + (Math.round(s * 16000) * 2 + c) * 2) / 32767;
  check(d.suggestedFilename() === 'b-joined.wav' && b.readUInt32LE(40) === 3.5 * 16000 * 4 && Math.abs(at(1, 1) + 0.25) < 0.01 && at(2.25, 0) === 0 && Math.abs(at(3, 1) - 0.5) < 0.02, `audio-joiner: b, silence, then a (${b.readUInt32LE(40)} bytes)`);
  await page.selectOption(R + '.aj-mode', 'fade'); await page.fill(R + '.aj-sec', '0.4');
  check((await page.textContent(R + '.aj-info')).startsWith('2 files → 2.6 s'), 'audio-joiner: crossfade shortens by the overlap');
};
