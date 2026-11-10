// #T923 Audio trimmer
export const path = '/everyday/audio-trimmer/';
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/audio-trimmer/`); await page.waitForTimeout(300);
  const R = '.atr ';
  check(await page.isHidden(R + '.atr-stage'), 'audio-trimmer: waits for a file');
  // A 2 s mono 16-bit WAV at 44,100 Hz: a 440 Hz cosine at half volume (so the sample at 0.5 s is +0.5).
  await page.evaluate(() => {
    const rate = 44100, n = rate * 2, b = new ArrayBuffer(44 + n * 2), v = new DataView(b);
    const s = (o, t) => { for (let i = 0; i < 4; i++) v.setUint8(o + i, t.charCodeAt(i)); };
    s(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); s(8, 'WAVE'); s(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); s(36, 'data'); v.setUint32(40, n * 2, true);
    for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, Math.round(0.5 * Math.cos((2 * Math.PI * 440 * i) / rate) * 32767), true);
    const dt = new DataTransfer(); dt.items.add(new File([b], 'tone.wav', { type: 'audio/wav' }));
    const inp = document.querySelector('.atr .atr-file'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForSelector(R + '.atr-stage:not([hidden])', { timeout: 8000 }); await page.waitForTimeout(200);
  const info = () => page.textContent(R + '.atr-info');
  check((await page.inputValue(R + '.atr-e')) === '2.00', 'audio-trimmer: end starts at the full 2.00 s');
  await page.fill(R + '.atr-s', '0.5'); await page.fill(R + '.atr-e', '0.4');
  check((await info()).includes('end must be after') && await page.isDisabled(R + '.atr-save'), 'audio-trimmer: end before start is refused');
  await page.fill(R + '.atr-e', '1.5');
  check((await info()).includes('1.00 s of 2.00 s') && (await info()).includes('mono, 44,100 Hz'), `audio-trimmer: keeps 1.00 s at 44,100 Hz (${await info()})`);
  const save = async (name) => { const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.atr-save')]); const f = OUT + name; await d.saveAs(f); return readFileSync(f); };
  const a = await save('atr-plain.wav');
  const hdr = (w) => w.toString('latin1', 0, 4) === 'RIFF' && w.toString('latin1', 8, 12) === 'WAVE' && w.toString('latin1', 36, 40) === 'data';
  check(hdr(a) && a.readUInt32LE(24) === 44100 && a.readUInt32LE(40) === 88200 && a.length === 88244, `audio-trimmer: RIFF/WAVE with 1.0 s of samples (${a.readUInt32LE(40)} bytes)`);
  check(Math.abs(a.readInt16LE(44) - 16384) < 20, `audio-trimmer: first kept sample is the one at 0.5 s (${a.readInt16LE(44)})`);
  await page.fill(R + '.atr-fi', '0.1'); await page.check(R + '.atr-norm');
  const b = await save('atr-fade.wav');
  let peak = 0; for (let i = 44; i < b.length; i += 2) peak = Math.max(peak, Math.abs(b.readInt16LE(i)));
  check(hdr(b) && b.readInt16LE(44) === 0 && b.readInt16LE(44 + 4410 * 2) > 25000, `audio-trimmer: fade in makes the first sample 0 (${b.readInt16LE(44)})`);
  check(Math.abs(peak - 29204) < 40, `audio-trimmer: normalise to -1 dB peak (${peak})`);
};
