// #T1036 LUFS meter
export const path = '/everyday/live-lufs-meter/';
const num = (s) => +s.replace('−', '-').match(/-?[\d.]+/)[0];
export default async ({ page, check, BASE }) => {
  await page.goto(`${BASE}/everyday/live-lufs-meter/`); await page.waitForTimeout(300);
  const R = '.lm ';
  check(await page.isVisible(R + '.lm-tab'), 'live-lufs-meter: Chromium offers the shared-tab source');
  await page.click(R + '.lm-reset'); // a real press, so the page may play sound
  // 5 s mono 48 kHz, 1 kHz sine at -20 dBFS: -23.0 LUFS, -20.0 dBTP (BS.1770).
  await page.evaluate(() => {
    const rate = 48000, n = rate * 5, b = new ArrayBuffer(44 + n * 2), v = new DataView(b);
    const s = (o, t) => { for (let i = 0; i < 4; i++) v.setUint8(o + i, t.charCodeAt(i)); };
    s(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); s(8, 'WAVE'); s(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); s(36, 'data'); v.setUint32(40, n * 2, true);
    for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, Math.round(0.1 * Math.sin((2 * Math.PI * 1000 * i) / rate) * 32767), true);
    const dt = new DataTransfer(); dt.items.add(new File([b], 'tone.wav', { type: 'audio/wav' }));
    const inp = document.querySelector('.lm .lm-file'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForFunction(() => document.querySelector('.lm .lm-status').textContent.includes('finished'), null, { timeout: 20000 });
  const I = num(await page.textContent(R + '.lm-i')), S = num(await page.textContent(R + '.lm-s')), tp = num(await page.textContent(R + '.lm-tp'));
  check(Math.abs(I + 23) <= 0.1 && Math.abs(S + 23) <= 0.1, `live-lufs-meter: -20 dBFS 1 kHz plays at -23.0 LUFS integrated and short-term (${I}, ${S})`);
  check(Math.abs(tp + 20) <= 0.1, `live-lufs-meter: true peak -20.0 dBTP (${tp})`);
  check(Math.abs(num(await page.textContent(R + '.lm-lra'))) <= 0.1, 'live-lufs-meter: a steady tone has 0 LU range');
  await page.click(R + '.lm-reset');
  check((await page.textContent(R + '.lm-i')) === '— LUFS', 'live-lufs-meter: Reset clears the integrated value');
};
