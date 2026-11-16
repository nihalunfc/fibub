// #T956 WAV to u-law (same component as #T955; check the page, the default and the A-law WAV)
export const path = '/everyday/wav-to-ulaw/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/wav-to-ulaw/`); await page.waitForTimeout(300);
  const R = '.pbx ';
  check((await page.textContent(R + '.pbx-open')).includes('WAV'), 'wav-to-ulaw: asks for WAV files');
  await page.evaluate(() => {
    const rate = 48000, n = rate * 2, b = new ArrayBuffer(44 + n * 4), v = new DataView(b); // 2 s, mono 32-bit float
    const s = (o, t) => { for (let i = 0; i < 4; i++) v.setUint8(o + i, t.charCodeAt(i)); };
    s(0, 'RIFF'); v.setUint32(4, 36 + n * 4, true); s(8, 'WAVE'); s(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 3, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 32, true); s(36, 'data'); v.setUint32(40, n * 4, true);
    for (let i = 0; i < n; i++) v.setFloat32(44 + i * 4, 0.5 * Math.sin((2 * Math.PI * 1000 * i) / rate), true);
    const dt = new DataTransfer(); dt.items.add(new File([b], 'menu.wav', { type: 'audio/wav' }));
    const inp = document.querySelector('.pbx .pbx-file'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForSelector(R + '.pbx-save', { timeout: 15000 });
  await page.selectOption(R + '.pbx-fmt', 'wav-alaw');
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.pbx-save')]); const f = OUT + 'w2u.wav'; await d.saveAs(f); const b = readFileSync(f);
  check(b.length === 16058 && b.readUInt16LE(20) === 6 && b.readUInt32LE(24) === 8000, `wav-to-ulaw: float WAV -> A-law WAV, 2 s = 16,000 samples (${b.length} bytes, format ${b.readUInt16LE(20)})`);
};
