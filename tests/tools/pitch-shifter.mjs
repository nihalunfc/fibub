// #T972 Pitch shifter
export const path = '/everyday/pitch-shifter/';
const freq = (b, rate) => { let z = 0, prev = 0; const n = (b.length - 44) / 2; for (let i = 0; i < n; i++) { const v = b.readInt16LE(44 + i * 2); if (prev < 0 && v >= 0) z++; prev = v; } return z / (n / rate); };
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/pitch-shifter/`); await page.waitForTimeout(300);
  const R = '.ash ';
  await page.evaluate(() => {
    const wav = (rate, secs, hz, amp = 0.5) => {
      const n = Math.round(rate * secs), b = new ArrayBuffer(44 + n * 2), v = new DataView(b);
      const s = (o, t) => { for (let i = 0; i < 4; i++) v.setUint8(o + i, t.charCodeAt(i)); };
      s(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); s(8, "WAVE"); s(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
      v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); s(36, "data"); v.setUint32(40, n * 2, true);
      for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, Math.round(amp * 32767 * (hz ? Math.sin(2 * Math.PI * hz * i / rate) : 1)), true);
      return b;
    };
    const dt = new DataTransfer(); dt.items.add(new File([wav(44100, 2, 440)], 'tone.wav', { type: 'audio/wav' }));
    const inp = document.querySelector('.ash .ash-file'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForSelector(R + '.ash-set:not([hidden])', { timeout: 15000 });
  await page.fill(R + '.ash-st', '4'); await page.selectOption(R + '.ash-fmt', 'wav16');
  check((await page.textContent(R + '.ash-plan')).includes('× 1.260'), `pitch-shifter: +4 semitones is × 1.260 (${await page.textContent(R + '.ash-plan')})`);
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.ash-save')]); const f = OUT + 'ps.wav'; await d.saveAs(f); const b = readFileSync(f);
  check(d.suggestedFilename() === 'tone-up4.wav' && b.readUInt32LE(40) === 44100 * 4 && Math.abs(freq(b, 44100) - 554.37) < 3, `pitch-shifter: 440 Hz +4 = 554.4 Hz, same length (${freq(b, 44100).toFixed(1)} Hz)`);
};
