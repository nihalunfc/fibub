// #T960 Loudness normaliser
export const path = '/everyday/loudness-normaliser/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/loudness-normaliser/`); await page.waitForTimeout(300);
  const R = '.ln ';
  // 10 s, mono, 48 kHz, 1 kHz sine at -20 dBFS = -23.0 LUFS (BS.1770).
  await page.evaluate(() => {
    const rate = 48000, n = rate * 10, b = new ArrayBuffer(44 + n * 2), v = new DataView(b);
    const s = (o, t) => { for (let i = 0; i < 4; i++) v.setUint8(o + i, t.charCodeAt(i)); };
    s(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); s(8, 'WAVE'); s(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); s(36, 'data'); v.setUint32(40, n * 2, true);
    for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, Math.round(0.1 * Math.sin((2 * Math.PI * 1000 * i) / rate) * 32767), true);
    const dt = new DataTransfer(); dt.items.add(new File([b], 'tone.wav', { type: 'audio/wav' }));
    const inp = document.querySelector('.ln .ln-file'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForSelector(R + '.ln-res:not([hidden])', { timeout: 20000 });
  const I = await page.textContent(R + '.ln-i'), tp = await page.textContent(R + '.ln-tp');
  check(I === '−23.0 LUFS' && tp === '−20.0 dBTP', `loudness-normaliser: -20 dBFS 1 kHz = -23.0 LUFS, -20.0 dBTP (${I}, ${tp})`);
  check((await page.textContent(R + '.ln-plan')).startsWith('Turn up by 7.0 dB → −16.0 LUFS'), `loudness-normaliser: default -16 target (${await page.textContent(R + '.ln-plan')})`);
  await page.fill(R + '.ln-lufs', '-5'); await page.fill(R + '.ln-peak', '-3'); await page.dispatchEvent(R + '.ln-peak', 'input');
  const plan = await page.textContent(R + '.ln-plan');
  check(plan.includes('Turn up by 17.0 dB') && plan.includes('stops') && (await page.inputValue(R + '.ln-target')) === 'custom', `loudness-normaliser: held back by the peak limit (${plan})`);
  await page.selectOption(R + '.ln-target', 'ebu');
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ln-save')]); const f = OUT + 'ln.wav'; await d.saveAs(f); const b = readFileSync(f);
  let peak = 0; for (let i = 44; i < b.length; i += 2) peak = Math.max(peak, Math.abs(b.readInt16LE(i)));
  check(d.suggestedFilename() === 'tone-minus23lufs.wav' && Math.abs(peak / 32767 - 0.1) < 0.002, `loudness-normaliser: at -23 LUFS the level is unchanged (peak ${(peak / 32767).toFixed(4)})`);
};
