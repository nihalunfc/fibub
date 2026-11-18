// #T1017 Track mastering
export const path = '/everyday/audio-mastering/';
const num = (s) => +s.replace('−', '-').match(/-?[\d.]+/)[0];
export default async ({ page, check, BASE, OUT, readFileSync }) => {
  await page.goto(`${BASE}/everyday/audio-mastering/`); await page.waitForTimeout(300);
  const R = '.am ';
  // 6 s stereo, 48 kHz: a 60 Hz kick every half second plus a quiet 440 Hz tone (left) and 660 Hz tone (right).
  await page.evaluate(() => {
    const rate = 48000, n = rate * 6, b = new ArrayBuffer(44 + n * 4), v = new DataView(b);
    const s = (o, t) => { for (let i = 0; i < 4; i++) v.setUint8(o + i, t.charCodeAt(i)); };
    s(0, 'RIFF'); v.setUint32(4, 36 + n * 4, true); s(8, 'WAVE'); s(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); s(36, 'data'); v.setUint32(40, n * 4, true);
    for (let i = 0; i < n; i++) {
      const t = i / rate, k = 0.6 * Math.exp(-(t % 0.5) * 25) * Math.sin(2 * Math.PI * 60 * t);
      v.setInt16(44 + i * 4, Math.round((k + 0.08 * Math.sin(2 * Math.PI * 440 * t)) * 32767), true);
      v.setInt16(46 + i * 4, Math.round((k + 0.08 * Math.sin(2 * Math.PI * 660 * t)) * 32767), true);
    }
    const dt = new DataTransfer(); dt.items.add(new File([b], 'beat.wav', { type: 'audio/wav' }));
    const inp = document.querySelector('.am .am-file'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.waitForSelector(R + '.am-go:not([disabled])', { timeout: 20000 });
  await page.click(R + '.am-go');
  await page.waitForSelector(R + '.am-res:not([hidden])', { timeout: 60000 });
  let I = num(await page.textContent(R + '.a-i')), tp = num(await page.textContent(R + '.a-tp'));
  check(Math.abs(I + 14) <= 0.1 && tp <= -1, `audio-mastering: streaming preset lands at -14 LUFS, <= -1 dBTP (${I}, ${tp})`);
  const note = await page.textContent(R + '.am-matchnote');
  check(note.includes(`Both play at ${(await page.textContent(R + '.b-i')).replace(' LUFS', '')} LUFS`), `audio-mastering: A/B matched to the quieter original (${note})`);
  // Club preset: louder, still under the ceiling.
  await page.selectOption(R + '.am-preset', 'club');
  check((await page.textContent(R + '.am-out')).includes('Settings changed'), 'audio-mastering: says when settings change');
  await page.click(R + '.am-go');
  await page.waitForFunction(() => document.querySelector('.am .am-out').textContent.startsWith('Done'), null, { timeout: 60000 });
  I = num(await page.textContent(R + '.a-i')); tp = num(await page.textContent(R + '.a-tp'));
  check(Math.abs(I + 9) <= 0.1 && tp <= -1, `audio-mastering: club preset -9 LUFS, <= -1 dBTP (${I}, ${tp})`);
  // Save 16-bit WAV: right header, peak under -1 dBFS.
  const [d] = await Promise.all([page.waitForEvent('download'), page.click(R + '.am-save')]); const f = OUT + 'am.wav'; await d.saveAs(f); const b = readFileSync(f);
  let peak = 0; for (let i = 44; i < b.length; i += 2) peak = Math.max(peak, Math.abs(b.readInt16LE(i)));
  check(d.suggestedFilename() === 'beat-master-minus9lufs.wav' && b.readUInt16LE(34) === 16 && b.readUInt16LE(22) === 2 && peak / 32767 <= Math.pow(10, -1 / 20) + 1e-4, `audio-mastering: 16-bit stereo WAV, sample peak ${(20 * Math.log10(peak / 32767)).toFixed(2)} dBFS`);
};
